import crypto from 'crypto'

const CLINIC_TAG = 'Flag Football Clinic - July 2026'

function getEnv(name) {
  return process.env[name]
}

function splitName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) return { FNAME: '', LNAME: '' }
  const spaceIndex = trimmed.indexOf(' ')
  if (spaceIndex === -1) return { FNAME: trimmed, LNAME: '' }
  return {
    FNAME: trimmed.slice(0, spaceIndex),
    LNAME: trimmed.slice(spaceIndex + 1).trim(),
  }
}

function getSubscriberHash(email) {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
}

export async function POST(request) {
  const apiKey = getEnv('MAILCHIMP_API_KEY')
  const serverPrefix = getEnv('MAILCHIMP_SERVER_PREFIX')
  const audienceId = getEnv('MAILCHIMP_AUDIENCE_ID')

  if (!apiKey || !serverPrefix || !audienceId) {
    return Response.json({ error: 'Mailchimp is not configured.' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, phone, role, age, zip } = body || {}

  const trimmedEmail = (email || '').trim()
  if (!trimmedEmail) {
    return Response.json({ error: 'Email is required to sign up.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const { FNAME, LNAME } = splitName(name)
  const mergeFields = {
    FNAME,
    LNAME,
    PHONE: (phone || '').trim(),
    ROLE: (role || '').trim(),
  }

  if (age) mergeFields.AGE = String(age).trim()
  if (zip) mergeFields.ZIP = String(zip).trim()

  const subscriberHash = getSubscriberHash(trimmedEmail)
  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`
  const memberUrl = `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`
  const authHeader = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`

  const memberPayload = {
    email_address: trimmedEmail,
    status_if_new: 'subscribed',
    status: 'subscribed',
    merge_fields: mergeFields,
  }

  try {
    const memberRes = await fetch(memberUrl, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberPayload),
    })

    if (!memberRes.ok) {
      const errBody = await memberRes.json().catch(() => ({}))
      console.error('Mailchimp member error:', memberRes.status, errBody)
      const detail = errBody.detail || errBody.title || 'Could not add you to the list.'
      return Response.json(
        { error: detail },
        { status: memberRes.status >= 500 ? 502 : 400 },
      )
    }

    await fetch(`${memberUrl}/tags`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: [{ name: CLINIC_TAG, status: 'active' }],
      }),
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
