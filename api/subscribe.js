import crypto from 'crypto'

const CLINIC_TAG = 'Flag Football Clinic - July 2026'
const MAX_CHILDREN = 5
const FALLBACK_DOMAIN = 'brooklyngamebreakers.com'

// Mailchimp merge tags must be <= 10 characters.
const MERGE = {
  PARENT_EMAIL: 'PEMAIL',
  PARENT_NAME: 'PNAME',
  CHILD_INDEX: 'CHINDEX',
  CHILD_COUNT: 'CHCOUNT',
  SIGNUP_ID: 'SIGNUPID',
}

const PLUS_ADDRESS_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
])

const HYPHEN_ADDRESS_DOMAINS = new Set(['yahoo.com', 'ymail.com', 'rocketmail.com', 'aol.com'])

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

function supportsSubaddressing(domain) {
  return PLUS_ADDRESS_DOMAINS.has(domain) || HYPHEN_ADDRESS_DOMAINS.has(domain)
}

function buildChildEmail(parentEmail, childIndex) {
  const normalized = parentEmail.trim().toLowerCase()
  const atIndex = normalized.lastIndexOf('@')
  if (atIndex === -1) return normalized

  const local = normalized.slice(0, atIndex)
  const domain = normalized.slice(atIndex + 1)
  const suffix = `bgaclinic${childIndex}`

  if (supportsSubaddressing(domain)) {
    if (childIndex === 1) return normalized

    if (PLUS_ADDRESS_DOMAINS.has(domain)) {
      return `${local}+${suffix}@${domain}`
    }

    return `${local}-${suffix}@${domain}`
  }

  const shortHash = getSubscriberHash(normalized).slice(0, 8)
  return `clinic-${shortHash}-${childIndex}@${FALLBACK_DOMAIN}`
}

function parseChildAges(children, age) {
  if (Array.isArray(children) && children.length > 0) {
    return children.map((child) => Number(child?.age))
  }

  if (age !== undefined && age !== null && String(age).trim() !== '') {
    return [Number(age)]
  }

  return []
}

function validateChildAges(ages) {
  if (ages.length < 1) {
    return 'Please add at least one child age.'
  }

  if (ages.length > MAX_CHILDREN) {
    return `You can register up to ${MAX_CHILDREN} children per signup.`
  }

  for (const childAge of ages) {
    if (!Number.isInteger(childAge) || childAge < 1 || childAge > 99) {
      return 'Please enter a valid age for each child.'
    }
  }

  return null
}

async function upsertMember({ memberUrl, authHeader, payload }) {
  const memberRes = await fetch(memberUrl, {
    method: 'PUT',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!memberRes.ok) {
    const errBody = await memberRes.json().catch(() => ({}))
    const detail = errBody.detail || errBody.title || 'Could not add you to the list.'
    return { ok: false, detail, status: memberRes.status, errBody }
  }

  return { ok: true }
}

async function applyClinicTag(memberUrl, authHeader) {
  try {
    const tagRes = await fetch(`${memberUrl}/tags`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: [{ name: CLINIC_TAG, status: 'active' }],
      }),
    })

    if (!tagRes.ok) {
      const tagBody = await tagRes.json().catch(() => ({}))
      console.error('Mailchimp tag error:', tagRes.status, tagBody)
    }
  } catch (tagErr) {
    console.error('Mailchimp tag request failed:', tagErr)
  }
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

  const { name, email, phone, role, age, zip, children } = body || {}
  const trimmedRole = (role || '').trim()
  const trimmedEmail = (email || '').trim()
  const trimmedName = (name || '').trim()
  const trimmedPhone = (phone || '').trim()
  const trimmedZip = (zip || '').trim()

  if (!trimmedEmail) {
    return Response.json({ error: 'Email is required to sign up.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const { FNAME, LNAME } = splitName(trimmedName)
  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`
  const authHeader = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
  const signupId = crypto.randomUUID()

  try {
    if (trimmedRole === 'Parent') {
      const childAges = parseChildAges(children, age)
      const ageError = validateChildAges(childAges)
      if (ageError) {
        return Response.json({ error: ageError }, { status: 400 })
      }

      const childCount = childAges.length
      const failures = []

      for (let index = 0; index < childAges.length; index += 1) {
        const childIndex = index + 1
        const childEmail = buildChildEmail(trimmedEmail, childIndex)
        const subscriberHash = getSubscriberHash(childEmail)
        const memberUrl = `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`

        const mergeFields = {
          FNAME,
          LNAME,
          PHONE: trimmedPhone,
          ROLE: 'Player',
          AGE: String(childAges[index]),
          [MERGE.PARENT_EMAIL]: trimmedEmail,
          [MERGE.PARENT_NAME]: trimmedName,
          [MERGE.CHILD_INDEX]: String(childIndex),
          [MERGE.CHILD_COUNT]: String(childCount),
          [MERGE.SIGNUP_ID]: signupId,
        }

        if (trimmedZip) mergeFields.ZIP = trimmedZip

        const result = await upsertMember({
          memberUrl,
          authHeader,
          payload: {
            email_address: childEmail,
            status_if_new: 'subscribed',
            status: 'subscribed',
            merge_fields: mergeFields,
          },
        })

        if (!result.ok) {
          console.error('Mailchimp member error:', result.status, result.errBody)
          failures.push({ childIndex, detail: result.detail })
          continue
        }

        await applyClinicTag(memberUrl, authHeader)
      }

      const registeredCount = childCount - failures.length

      if (registeredCount === 0) {
        return Response.json(
          { error: failures[0]?.detail || 'Could not complete signup. Please try again.' },
          { status: 400 },
        )
      }

      if (failures.length > 0) {
        return Response.json(
          {
            error: `${registeredCount} of ${childCount} children registered. Please contact info@brooklyngamebreakers.com to finish signing up.`,
            registeredCount,
            childCount,
          },
          { status: 502 },
        )
      }

      return Response.json({ success: true, registeredCount, childCount })
    }

    const mergeFields = {
      FNAME,
      LNAME,
      PHONE: trimmedPhone,
      ROLE: trimmedRole,
    }

    if (trimmedZip) mergeFields.ZIP = trimmedZip

    if (trimmedRole === 'Player') {
      const childAges = parseChildAges(children, age)
      const ageError = validateChildAges(childAges)
      if (ageError) {
        return Response.json({ error: ageError }, { status: 400 })
      }
      mergeFields.AGE = String(childAges[0])
    }

    const subscriberHash = getSubscriberHash(trimmedEmail)
    const memberUrl = `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`

    const result = await upsertMember({
      memberUrl,
      authHeader,
      payload: {
        email_address: trimmedEmail,
        status_if_new: 'subscribed',
        status: 'subscribed',
        merge_fields: mergeFields,
      },
    })

    if (!result.ok) {
      console.error('Mailchimp member error:', result.status, result.errBody)
      return Response.json(
        { error: result.detail },
        { status: result.status >= 500 ? 502 : 400 },
      )
    }

    await applyClinicTag(memberUrl, authHeader)

    return Response.json({ success: true, registeredCount: 1, childCount: 1 })
  } catch (err) {
    console.error('Subscribe error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
