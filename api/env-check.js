function getEnv(name) {
  return process.env[name]
}

export async function GET() {
  const keys = Object.keys(process.env).filter((key) => key.startsWith('MAILCHIMP'))

  return Response.json({
    mailchimpKeysPresent: keys,
    configured: {
      MAILCHIMP_API_KEY: Boolean(getEnv('MAILCHIMP_API_KEY')),
      MAILCHIMP_SERVER_PREFIX: Boolean(getEnv('MAILCHIMP_SERVER_PREFIX')),
      MAILCHIMP_AUDIENCE_ID: Boolean(getEnv('MAILCHIMP_AUDIENCE_ID')),
    },
    lengths: {
      MAILCHIMP_API_KEY: getEnv('MAILCHIMP_API_KEY')?.length ?? 0,
      MAILCHIMP_SERVER_PREFIX: getEnv('MAILCHIMP_SERVER_PREFIX')?.length ?? 0,
      MAILCHIMP_AUDIENCE_ID: getEnv('MAILCHIMP_AUDIENCE_ID')?.length ?? 0,
    },
    vercel: Boolean(getEnv('VERCEL')),
    vercelEnv: getEnv('VERCEL_ENV') || null,
  })
}
