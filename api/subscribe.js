import crypto from 'crypto'

const CLINIC_TAG = 'Flag Football Clinic - July 2026'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !serverPrefix || !audienceId) {
    return res.status(500).json({ error: 'Mailchimp is not configured.' })
  }

  const { name, email, phone, role, age, zip } = req.body || {}

  const trimmedEmail = (email || '').trim()
  if (!trimmedEmail) {
    return res.status(400).json({ error: 'Email is required to sign up.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
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
      return res.status(memberRes.status >= 500 ? 502 : 400).json({ error: detail })
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

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
