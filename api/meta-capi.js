import crypto from 'crypto'

function getEnv(name) {
  return (process.env[name] || '').trim() || undefined
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

// Meta expects digits only, ideally with country code. US 10-digit → prepend 1.
function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 10) return `1${digits}`
  return digits
}

function normalizeNamePart(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function getHeader(request, name) {
  try {
    return request.headers.get(name) || ''
  } catch {
    return ''
  }
}

function getClientIp(request) {
  const forwarded = getHeader(request, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return getHeader(request, 'x-real-ip') || undefined
}

/**
 * Fire-and-forget Meta Conversions API Lead. Never throws to the caller —
 * signup success must not depend on Meta.
 */
export async function sendMetaLead({
  request,
  eventId,
  email,
  phone,
  firstName,
  lastName,
  zip,
  fbp,
  fbc,
  eventSourceUrl,
}) {
  const pixelId = getEnv('META_PIXEL_ID')
  const accessToken = getEnv('META_CAPI_ACCESS_TOKEN')

  if (!pixelId || !accessToken) {
    console.warn('Meta CAPI skipped: META_PIXEL_ID or META_CAPI_ACCESS_TOKEN missing')
    return { sent: false, reason: 'not_configured' }
  }

  const userData = {}
  const normalizedEmail = normalizeEmail(email)
  if (normalizedEmail) userData.em = [sha256(normalizedEmail)]

  const normalizedPhone = normalizePhone(phone)
  if (normalizedPhone) userData.ph = [sha256(normalizedPhone)]

  const fn = normalizeNamePart(firstName)
  if (fn) userData.fn = [sha256(fn)]

  const ln = normalizeNamePart(lastName)
  if (ln) userData.ln = [sha256(ln)]

  const zp = String(zip || '')
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
  if (zp) userData.zp = [sha256(zp)]

  const clientIp = getClientIp(request)
  if (clientIp) userData.client_ip_address = clientIp

  const userAgent = getHeader(request, 'user-agent')
  if (userAgent) userData.client_user_agent = userAgent

  const trimmedFbp = String(fbp || '').trim()
  if (trimmedFbp) userData.fbp = trimmedFbp

  const trimmedFbc = String(fbc || '').trim()
  if (trimmedFbc) userData.fbc = trimmedFbc

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl || 'https://brooklyngamebreakers.com/',
        action_source: 'website',
        user_data: userData,
        custom_data: {
          content_name: 'clinic_signup',
          content_category: 'flag_football_clinic',
        },
      },
    ],
  }

  const testCode = getEnv('META_TEST_EVENT_CODE')
  if (testCode) payload.test_event_code = testCode

  try {
    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('Meta CAPI error:', res.status, errText.slice(0, 300))
      return { sent: false, reason: 'api_error', status: res.status }
    }

    return { sent: true }
  } catch (err) {
    console.error('Meta CAPI request failed:', err)
    return { sent: false, reason: 'request_failed' }
  }
}
