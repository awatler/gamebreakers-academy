function getEnv(name) {
  return (process.env[name] || '').trim() || undefined
}

export async function GET() {
  const keys = Object.keys(process.env).filter((key) => key.startsWith('MAILCHIMP'))

  return Response.json({
    mailchimpKeysPresent: keys,
    configured: {
      MAILCHIMP_API_KEY: Boolean(getEnv('MAILCHIMP_API_KEY')),
      MAILCHIMP_SERVER_PREFIX: Boolean(getEnv('MAILCHIMP_SERVER_PREFIX')),
      MAILCHIMP_AUDIENCE_ID: Boolean(getEnv('MAILCHIMP_AUDIENCE_ID')),
      META_PIXEL_ID: Boolean(getEnv('META_PIXEL_ID')),
      META_CAPI_ACCESS_TOKEN: Boolean(getEnv('META_CAPI_ACCESS_TOKEN')),
      META_TEST_EVENT_CODE: Boolean(getEnv('META_TEST_EVENT_CODE')),
    },
    lengths: {
      MAILCHIMP_API_KEY: getEnv('MAILCHIMP_API_KEY')?.length ?? 0,
      MAILCHIMP_SERVER_PREFIX: getEnv('MAILCHIMP_SERVER_PREFIX')?.length ?? 0,
      MAILCHIMP_AUDIENCE_ID: getEnv('MAILCHIMP_AUDIENCE_ID')?.length ?? 0,
      META_PIXEL_ID: getEnv('META_PIXEL_ID')?.length ?? 0,
      META_CAPI_ACCESS_TOKEN: getEnv('META_CAPI_ACCESS_TOKEN')?.length ?? 0,
    },
    vercel: Boolean(getEnv('VERCEL')),
    vercelEnv: getEnv('VERCEL_ENV') || null,
  })
}
