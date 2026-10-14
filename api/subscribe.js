import crypto from 'crypto'

import { sendMetaLead } from './meta-capi.js'

const CLINIC_TAG = 'Flag Football Clinic - Fall 2026'
const MAX_CHILDREN = 5
const FALLBACK_DOMAIN = 'brooklyngamebreakers.com'
const CONTACT_EMAIL = 'info@brooklyngamebreakers.com'

// Mailchimp's own error text ("in a compliance state due to unsubscribe, bounce,
// or compliance review") is meaningless to a parent and reads like a fault of
// theirs. Send them somewhere useful instead; the raw detail goes to the alert
// email, where it is actually actionable.
const GENERIC_FAILURE = `Sorry, we couldn't complete your signup. Please email ${CONTACT_EMAIL} and we'll get you registered.`
const EMAIL_REJECTED_FAILURE = `That email address was rejected. Please double-check it, or email ${CONTACT_EMAIL} and we'll sign you up.`

function userFacingError(detail) {
  // Narrow on purpose: only redirect to the address field when Mailchimp is
  // clearly complaining about the address itself.
  if (String(detail || '').toLowerCase().includes('valid email')) {
    return EMAIL_REJECTED_FAILURE
  }

  return GENERIC_FAILURE
}

// Mailchimp merge tags must be <= 10 characters.
const MERGE = {
  PARENT_EMAIL: 'PEMAIL',
  PARENT_NAME: 'PNAME',
  CHILD_INDEX: 'CHINDEX',
  CHILD_COUNT: 'CHCOUNT',
  CHILD_AGES: 'CHLDAGES',
  SIGNUP_ID: 'SIGNUPID',
}

function getEnv(name) {
  return (process.env[name] || '').trim() || undefined
}

// Most signup failures are handled responses, not crashes — Mailchimp rejects the
// address, the parent reads an error message, and we never hear about it. Email the
// team on every failed exit so a blocked signup can be finished by hand.
// Alerting must never be able to break a signup, so this swallows its own errors.
async function notifyFailure({ reason, status, detail, signupId, submission }) {
  const apiKey = getEnv('RESEND_API_KEY')
  const to = getEnv('ALERT_EMAIL_TO')

  if (!apiKey || !to) return

  const lines = [
    `Reason:    ${reason}`,
    `Status:    ${status}`,
    `When:      ${new Date().toISOString()}`,
    `Env:       ${getEnv('VERCEL_ENV') || 'local'}`,
  ]

  if (detail) lines.push(`Detail:    ${detail}`)
  if (signupId) lines.push(`Signup ID: ${signupId}`)

  if (submission) {
    lines.push('', 'Submission — follow up with this person directly:')
    lines.push(`  Role:     ${submission.role || '(none)'}`)
    lines.push(`  Name:     ${submission.name || '(none)'}`)
    lines.push(`  Email:    ${submission.email || '(none)'}`)
    lines.push(`  Phone:    ${submission.phone || '(none)'}`)
    lines.push(`  Zip:      ${submission.zip || '(none)'}`)

    if (submission.children?.length) {
      const children = submission.children
        .map((child) => `${child.name || '(no name)'} (age ${child.age})`)
        .join(', ')
      lines.push(`  Children: ${children}`)
    }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getEnv('ALERT_EMAIL_FROM') || 'Gamebreakers Alerts <onboarding@resend.dev>',
        to: to.split(',').map((address) => address.trim()).filter(Boolean),
        subject: `[BGA signup alert] ${reason}`,
        text: lines.join('\n'),
      }),
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.error('Alert email failed:', res.status, await res.text().catch(() => ''))
    }
  } catch (alertErr) {
    console.error('Alert email request failed:', alertErr)
  }
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

// The `clinic-` prefix is retained so returning parents keep their existing child
// rows and so campaign segments that exclude `clinic-` addresses keep working.
function buildChildEmail(parentEmail, childIndex) {
  const normalized = parentEmail.trim().toLowerCase()
  const shortHash = getSubscriberHash(normalized).slice(0, 8)
  return `clinic-${shortHash}-${childIndex}@${FALLBACK_DOMAIN}`
}

function parseChildren(children) {
  if (!Array.isArray(children) || children.length === 0) return []

  return children.map((child) => ({
    name: String(child?.name || '').trim(),
    age: Number(child?.age),
  }))
}

function validateChildren(parsedChildren) {
  if (parsedChildren.length < 1) {
    return 'Please add at least one child.'
  }

  if (parsedChildren.length > MAX_CHILDREN) {
    return `You can add up to ${MAX_CHILDREN} children per signup.`
  }

  for (const child of parsedChildren) {
    if (!Number.isInteger(child.age) || child.age < 1 || child.age > 99) {
      return 'Please enter a valid age for each child.'
    }
  }

  return null
}

function validatePlayerAge(age) {
  const parsed = Number(age)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
    return 'Please enter a valid age for the player.'
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

function isComplianceBlock(detail = '') {
  const text = String(detail).toLowerCase()
  return (
    text.includes('compliance state') ||
    text.includes('cannot be subscribed') ||
    text.includes('permanently deleted') ||
    text.includes('cleaned')
  )
}

async function getMemberStatus(memberUrl, authHeader) {
  try {
    const res = await fetch(memberUrl, {
      method: 'GET',
      headers: { Authorization: authHeader },
    })
    if (!res.ok) return null
    const body = await res.json().catch(() => ({}))
    return body.status || null
  } catch {
    return null
  }
}

// Child aliases are fake emails. Mailchimp often marks them cleaned/bounced after any
// send attempt, which blocks PUT with status:"subscribed". New aliases still use
// status_if_new; existing ones keep their current status and only get field/tag updates.
async function upsertChildAlias({ memberUrl, authHeader, email, mergeFields }) {
  const basePayload = {
    email_address: email,
    status_if_new: 'subscribed',
    merge_fields: mergeFields,
  }

  const firstTry = await upsertMember({
    memberUrl,
    authHeader,
    payload: basePayload,
  })

  if (firstTry.ok) return firstTry

  if (!isComplianceBlock(firstTry.detail)) return firstTry

  const existingStatus = await getMemberStatus(memberUrl, authHeader)
  if (!existingStatus || existingStatus === 'subscribed') {
    return firstTry
  }

  console.warn(
    'Retrying clinic alias upsert with existing status:',
    email,
    existingStatus,
    firstTry.detail,
  )

  return upsertMember({
    memberUrl,
    authHeader,
    payload: {
      ...basePayload,
      status: existingStatus,
    },
  })
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
      return false
    }

    return true
  } catch (tagErr) {
    console.error('Mailchimp tag request failed:', tagErr)
    return false
  }
}

export async function POST(request) {
  const apiKey = getEnv('MAILCHIMP_API_KEY')
  const serverPrefix = getEnv('MAILCHIMP_SERVER_PREFIX')
  const audienceId = getEnv('MAILCHIMP_AUDIENCE_ID')

  if (!apiKey || !serverPrefix || !audienceId) {
    await notifyFailure({ reason: 'Mailchimp env vars are missing', status: 500 })
    return Response.json({ error: GENERIC_FAILURE }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, phone, role, age, zip, children, fbp, fbc, eventSourceUrl } = body || {}
  const trimmedRole = (role || '').trim()
  const trimmedEmail = (email || '').trim()
  const trimmedName = (name || '').trim()
  const trimmedPhone = (phone || '').trim()
  const trimmedZip = (zip || '').trim()
  const metaEventId = crypto.randomUUID()

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
  const submission = {
    role: trimmedRole,
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    zip: trimmedZip,
  }

  const sendLead = () =>
    sendMetaLead({
      request,
      eventId: metaEventId,
      email: trimmedEmail,
      phone: trimmedPhone,
      firstName: FNAME,
      lastName: LNAME,
      zip: trimmedZip,
      fbp,
      fbc,
      eventSourceUrl,
    })

  try {
    if (trimmedRole === 'Parent') {
      const parsedChildren = parseChildren(children)
      const childError = validateChildren(parsedChildren)
      if (childError) {
        return Response.json({ error: childError }, { status: 400 })
      }

      const childCount = parsedChildren.length
      const childAges = parsedChildren.map((child) => child.age)
      const failures = []
      // Raw Mailchimp text for the alert email — `failures` goes back to the browser.
      const childErrors = []
      const untaggedChildren = []

      submission.children = parsedChildren

      const parentHash = getSubscriberHash(trimmedEmail)
      const parentUrl = `${baseUrl}/lists/${audienceId}/members/${parentHash}`

      const parentMergeFields = {
        FNAME,
        LNAME,
        PHONE: trimmedPhone,
        ROLE: 'Parent',
        [MERGE.CHILD_COUNT]: childCount,
        [MERGE.CHILD_AGES]: childAges.join(', '),
        [MERGE.SIGNUP_ID]: signupId,
      }

      if (trimmedZip) parentMergeFields.ZIP = trimmedZip

      const parentResult = await upsertMember({
        memberUrl: parentUrl,
        authHeader,
        payload: {
          email_address: trimmedEmail,
          status_if_new: 'subscribed',
          status: 'subscribed',
          merge_fields: parentMergeFields,
        },
      })

      if (!parentResult.ok) {
        console.error('Mailchimp parent error:', parentResult.status, parentResult.errBody)
        await notifyFailure({
          reason: 'Mailchimp rejected the parent record',
          status: parentResult.status,
          detail: parentResult.detail,
          signupId,
          submission,
        })
        return Response.json(
          { error: userFacingError(parentResult.detail) },
          { status: parentResult.status >= 500 ? 502 : 400 },
        )
      }

      const parentTagged = await applyClinicTag(parentUrl, authHeader)

      for (let index = 0; index < parsedChildren.length; index += 1) {
        const child = parsedChildren[index]
        const childIndex = index + 1
        const childEmail = buildChildEmail(trimmedEmail, childIndex)
        const subscriberHash = getSubscriberHash(childEmail)
        const memberUrl = `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`
        const childName = splitName(child.name)

        const mergeFields = {
          PHONE: trimmedPhone,
          ROLE: 'Player',
          AGE: String(child.age),
          [MERGE.PARENT_EMAIL]: trimmedEmail,
          [MERGE.PARENT_NAME]: trimmedName,
          [MERGE.CHILD_INDEX]: childIndex,
          [MERGE.CHILD_COUNT]: childCount,
          [MERGE.SIGNUP_ID]: signupId,
        }

        // Player Name is optional — only write FNAME/LNAME when provided so a
        // re-signup without a name does not wipe a previously captured name.
        if (child.name) {
          mergeFields.FNAME = childName.FNAME
          mergeFields.LNAME = childName.LNAME
        }

        if (trimmedZip) mergeFields.ZIP = trimmedZip

        const result = await upsertChildAlias({
          memberUrl,
          authHeader,
          email: childEmail,
          mergeFields,
        })

        if (!result.ok) {
          console.error('Mailchimp member error:', result.status, result.errBody)
          childErrors.push(`child ${childIndex}: ${result.status} ${result.detail}`)
          failures.push({
            childIndex,
            detail: `We could not save this player. Please email ${CONTACT_EMAIL} and we'll finish your signup.`,
          })
          continue
        }

        const childTagged = await applyClinicTag(memberUrl, authHeader)
        if (!childTagged) untaggedChildren.push(childIndex)
      }

      const registeredCount = childCount - failures.length

      if (registeredCount === 0) {
        await notifyFailure({
          reason: `All ${childCount} player records failed`,
          status: 400,
          detail: childErrors.join(' | '),
          signupId,
          submission,
        })
        return Response.json({ error: GENERIC_FAILURE }, { status: 400 })
      }

      if (failures.length > 0) {
        console.error('Partial signup failures:', failures)
        await notifyFailure({
          reason: `${failures.length} of ${childCount} player records failed`,
          status: 502,
          detail: childErrors.join(' | '),
          signupId,
          submission,
        })
        return Response.json(
          {
            error: `We registered ${registeredCount} of ${childCount} children. Please email ${CONTACT_EMAIL} and we'll add the rest.`,
            registeredCount,
            childCount,
            failures,
          },
          { status: 502 },
        )
      }

      // Untagged rows save fine but never show up in the clinic segment, so the
      // family silently goes missing from the roster.
      if (!parentTagged || untaggedChildren.length > 0) {
        await notifyFailure({
          reason: 'Signup saved but the clinic tag failed',
          status: 200,
          detail: `parent tagged: ${parentTagged}; untagged children: ${
            untaggedChildren.join(', ') || 'none'
          }`,
          signupId,
          submission,
        })
      }

      await sendLead()
      return Response.json({ success: true, registeredCount, childCount, metaEventId })
    }

    const mergeFields = {
      FNAME,
      LNAME,
      PHONE: trimmedPhone,
      ROLE: trimmedRole,
    }

    if (trimmedZip) mergeFields.ZIP = trimmedZip

    if (trimmedRole === 'Player') {
      const ageError = validatePlayerAge(age)
      if (ageError) {
        return Response.json({ error: ageError }, { status: 400 })
      }
      mergeFields.AGE = String(Number(age))
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
      await notifyFailure({
        reason: `Mailchimp rejected the ${trimmedRole || 'member'} record`,
        status: result.status,
        detail: result.detail,
        signupId,
        submission,
      })
      return Response.json(
        { error: userFacingError(result.detail) },
        { status: result.status >= 500 ? 502 : 400 },
      )
    }

    const tagged = await applyClinicTag(memberUrl, authHeader)

    if (!tagged) {
      await notifyFailure({
        reason: 'Signup saved but the clinic tag failed',
        status: 200,
        signupId,
        submission,
      })
    }

    await sendLead()
    return Response.json({ success: true, registeredCount: 1, childCount: 1, metaEventId })
  } catch (err) {
    console.error('Subscribe error:', err)
    await notifyFailure({
      reason: 'Unhandled error during signup',
      status: 500,
      detail: err?.stack || err?.message || String(err),
      signupId,
      submission,
    })
    return Response.json({ error: GENERIC_FAILURE }, { status: 500 })
  }
}
