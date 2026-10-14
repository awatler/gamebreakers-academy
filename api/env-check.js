import crypto from 'crypto'

// Debug endpoint for confirming which env vars reached production without a
// redeploy. It reports presence only, never values. Locked by default: without
// ENV_CHECK_TOKEN set in Vercel it 404s, so it cannot be left open by accident.
// Deliberately loose stems so a misspelled var (MAILCHMIP_API_KEY) still shows up.
const WATCHED_PREFIXES = ['MAIL', 'CHIMP', 'META', 'RESEND', 'ALERT']

const REPORTED_VARS = [
  'MAILCHIMP_API_KEY',
  'MAILCHIMP_SERVER_PREFIX',
  'MAILCHIMP_AUDIENCE_ID',
  'RESEND_API_KEY',
  'ALERT_EMAIL_TO',
  'ALERT_EMAIL_FROM',
  'META_PIXEL_ID',
  'META_CAPI_ACCESS_TOKEN',
  'META_TEST_EVENT_CODE',
]

function getEnv(name) {
  return (process.env[name] || '').trim() || undefined
}

function tokenMatches(provided, expected) {
  if (!provided || !expected) return false

  const a = Buffer.from(provided)
  const b = Buffer.from(expected)

  if (a.length !== b.length) return false

  return crypto.timingSafeEqual(a, b)
}

export async function GET(request) {
  const expected = getEnv('ENV_CHECK_TOKEN')
  const provided = new URL(request.url).searchParams.get('token')

  // 404 rather than 401 so the endpoint does not advertise itself.
  if (!tokenMatches(provided, expected)) {
    return new Response('Not Found', { status: 404 })
  }

  const configured = {}
  for (const name of REPORTED_VARS) {
    configured[name] = Boolean(getEnv(name))
  }

  // Surfaces misspelled variable names, which `configured` alone reports as absent.
  const namesPresent = Object.keys(process.env)
    .filter((key) => WATCHED_PREFIXES.some((prefix) => key.startsWith(prefix)))
    .sort()

  return Response.json({
    configured,
    namesPresent,
    vercelEnv: getEnv('VERCEL_ENV') || null,
  })
}
