import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Plus, Trash2 } from 'lucide-react'

import { getMetaClickIds, trackEvent, trackMetaLead } from '../lib/analytics'

const ROLE_OPTIONS = [
  { label: 'Parent', emoji: '👨‍👩‍👧' },
  { label: 'Player', emoji: '🏃' },
  { label: 'Coach', emoji: '📣' },
  { label: 'Community Partner', emoji: '🤝' },
]

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/Gmn6Xc8sGSN7bGmTozezlY'
const INSTAGRAM_URL = 'https://www.instagram.com/brooklyngamebreakers'

const MAX_CHILDREN = 5

const CONTACT_EMAIL = 'info@brooklyngamebreakers.com'

const GENERIC_FAILURE = `Sorry, we couldn't complete your signup. Please email ${CONTACT_EMAIL} and we'll get you on the list.`

// Error copy from the API points people at the inbox, so make the address
// tappable rather than leaving it as text a parent has to retype on a phone.
function ErrorText({ message }) {
  if (!message.includes(CONTACT_EMAIL)) return message

  const [before, after] = message.split(CONTACT_EMAIL)

  return (
    <>
      {before}
      <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-2">
        {CONTACT_EMAIL}
      </a>
      {after}
    </>
  )
}

const inputClass =
  'mt-1 w-full rounded-ui border border-border bg-white px-3 py-2.5 text-ink placeholder-muted/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'

function emptyChild() {
  return { name: '', age: '' }
}

function validateChildren(children) {
  if (children.length < 1) {
    return 'Please add at least one child.'
  }

  if (children.length > MAX_CHILDREN) {
    return `You can add up to ${MAX_CHILDREN} children per signup.`
  }

  for (const child of children) {
    const parsed = Number(child.age)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
      return 'Please enter a valid age for each child.'
    }
  }

  return null
}

function validatePlayerAge(ageValue) {
  const parsed = Number(ageValue)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
    return 'Please enter a valid age for the player.'
  }
  return null
}

export default function InterestSignupModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Parent')
  const [age, setAge] = useState('')
  const [children, setChildren] = useState([emptyChild()])
  const [zip, setZip] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [registeredCount, setRegisteredCount] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactError, setContactError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedEmail) {
      setContactError('Please enter an email address so we can keep you posted.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setContactError('Please enter a valid email address.')
      return
    }

    if (role === 'Parent') {
      const childError = validateChildren(children)
      if (childError) {
        setContactError(childError)
        return
      }
    }

    if (role === 'Player') {
      const ageError = validatePlayerAge(age.trim())
      if (ageError) {
        setContactError(ageError)
        return
      }
    }

    setContactError('')
    setIsSubmitting(true)

    try {
      const payload = {
        name: name.trim(),
        email: trimmedEmail,
        phone: trimmedPhone,
        role,
        zip: zip.trim(),
        ...getMetaClickIds(),
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      }

      if (role === 'Parent') {
        payload.children = children.map((child) => ({
          name: child.name.trim(),
          age: child.age.trim(),
        }))
      } else if (role === 'Player') {
        payload.age = age.trim()
      }

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let data = {}
      const contentType = res.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        data = await res.json()
      } else {
        const text = await res.text()
        console.error('Non-JSON subscribe response:', res.status, text.slice(0, 200))
      }

      if (!res.ok) {
        setContactError(
          data.error ||
            (res.status === 404
              ? 'Signup is unavailable in local preview. Restart the dev server or test on brooklyngamebreakers.com.'
              : GENERIC_FAILURE),
        )
        return
      }

      setRegisteredCount(data.registeredCount || (role === 'Parent' ? payload.children.length : 1))
      setSubmitted(true)

      trackEvent('generate_lead', {
        method: 'interest_list_modal',
        role,
        child_count: role === 'Parent' ? payload.children.length : 0,
      })

      if (data.metaEventId) {
        trackMetaLead(data.metaEventId)
      }
    } catch {
      setContactError(GENERIC_FAILURE)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setIsSubmitting(false)
    setAge('')
    setChildren([emptyChild()])
    setRegisteredCount(1)
    setContactError('')
    onClose()
  }

  const handleRoleChange = (option) => {
    setRole(option)
    setContactError('')
    if (option === 'Parent') {
      setChildren((current) => (current.length > 0 ? current : [emptyChild()]))
      setAge('')
    } else if (option === 'Player') {
      setChildren([emptyChild()])
    } else {
      setAge('')
      setChildren([emptyChild()])
    }
  }

  const addChild = () => {
    if (children.length >= MAX_CHILDREN) return
    setChildren((current) => [...current, emptyChild()])
  }

  const removeChild = (index) => {
    if (children.length <= 1) return
    setChildren((current) => current.filter((_, i) => i !== index))
  }

  const updateChild = (index, field, value) => {
    setChildren((current) =>
      current.map((child, i) => (i === index ? { ...child, [field]: value } : child)),
    )
    setContactError('')
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interest-signup-title"
    >
      <div
        className="absolute inset-0 bg-accent/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-ui border border-border bg-white p-6 shadow-lg sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-ui p-1 text-muted transition-colors hover:bg-border/50 hover:text-ink"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <h2
              id="interest-signup-title"
              className="pr-10 font-display text-[clamp(1.15rem,3.6vw,1.85rem)] font-bold uppercase leading-none tracking-[0.04em] text-ink whitespace-nowrap"
            >
              All Fall Clinic spots have been filled
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              We&apos;re sorry! Spots filled up quick so make sure not to miss your chance to join
              our next clinic.
              <br />
              <br />
              Fill out the form below to stay tuned for more events coming soon. You can also follow
              us on{' '}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest hover:text-green-deep"
              >
                Instagram
              </a>{' '}
              and join our{' '}
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest hover:text-green-deep"
              >
                WhatsApp group
              </a>{' '}
              to become part of the Gamebreaker community.
            </p>

            <p className="mt-3 text-sm text-muted">
              Curious what a Gamebreakers clinic feels like?{' '}
              <Link
                to="/summer-clinic-2026"
                onClick={handleClose}
                className="font-semibold text-forest underline decoration-forest/30 underline-offset-2 transition-colors hover:text-green-deep hover:decoration-green-deep"
              >
                Check out the recap from our Summer Clinic
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  I am a... <span aria-hidden>👋</span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map(({ label, emoji }) => (
                    <label
                      key={label}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 font-util text-xs font-bold transition-colors ${
                        role === label
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-white text-ink hover:border-forest/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="interest-role"
                        value={label}
                        checked={role === label}
                        onChange={() => handleRoleChange(label)}
                        className="sr-only"
                      />
                      <span aria-hidden>{emoji} </span>
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="interest-name" className="block text-sm font-semibold text-ink">
                    Name
                  </label>
                  <input
                    id="interest-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="interest-email" className="block text-sm font-semibold text-ink">
                    Email
                  </label>
                  <input
                    id="interest-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setContactError('')
                    }}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="interest-phone" className="block text-sm font-semibold text-ink">
                    Phone <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="interest-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setContactError('')
                    }}
                    className={inputClass}
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="interest-zip" className="block text-sm font-semibold text-ink">
                    Zip Code <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="interest-zip"
                    type="text"
                    inputMode="numeric"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className={`${inputClass} max-w-[8rem]`}
                    placeholder="11201"
                  />
                </div>
              </div>

              {role === 'Parent' && (
                <div>
                  <div className="space-y-4">
                    {children.map((child, index) => (
                      <div key={index} className="flex items-end gap-3">
                        <div className="min-w-0 flex-[2]">
                          <label
                            htmlFor={`interest-child-name-${index}`}
                            className="block text-sm font-semibold text-ink"
                          >
                            Player Name{' '}
                            <span className="font-normal text-muted">(optional)</span>
                          </label>
                          <input
                            id={`interest-child-name-${index}`}
                            type="text"
                            value={child.name}
                            onChange={(e) => updateChild(index, 'name', e.target.value)}
                            className={inputClass}
                            placeholder="Their name"
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <label
                            htmlFor={`interest-child-age-${index}`}
                            className="block text-sm font-semibold text-ink"
                          >
                            Age
                          </label>
                          <input
                            id={`interest-child-age-${index}`}
                            type="number"
                            min={1}
                            max={99}
                            value={child.age}
                            onChange={(e) => updateChild(index, 'age', e.target.value)}
                            required
                            className={inputClass}
                            placeholder="12"
                          />
                        </div>

                        {children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="mb-1 rounded-ui p-2 text-muted transition-colors hover:bg-border/50 hover:text-ink"
                            aria-label={`Remove player ${index + 1}`}
                          >
                            <Trash2 size={16} aria-hidden />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {children.length < MAX_CHILDREN && (
                    <button
                      type="button"
                      onClick={addChild}
                      className="mt-3 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-util text-xs font-bold text-forest transition-colors hover:border-forest/50 hover:bg-seafoam"
                    >
                      <Plus size={14} aria-hidden />
                      Add another child
                    </button>
                  )}

                  <p className="mt-2 text-xs text-muted">
                    Names and ages help us plan future programs. Add up to {MAX_CHILDREN} children.
                  </p>
                </div>
              )}

              {role === 'Player' && (
                <div>
                  <label htmlFor="interest-age" className="block text-sm font-semibold text-ink">
                    Age <span aria-hidden>🎂</span>
                  </label>
                  <input
                    id="interest-age"
                    type="number"
                    min={1}
                    max={99}
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value)
                      setContactError('')
                    }}
                    required
                    className={`${inputClass} max-w-[8rem]`}
                    placeholder="12"
                  />
                </div>
              )}

              {contactError && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  <ErrorText message={contactError} />
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-full bg-amber px-4 py-3 font-util text-sm font-bold tracking-[0.06em] text-ink transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Signing up…' : 'Keep Me Posted'}
              </button>
            </form>
          </>
        ) : (
          <div className="pr-8">
            <h2 id="interest-signup-title" className="heading-display text-xl sm:text-2xl">
              You&apos;re on the list! <span aria-hidden>🎉</span>
            </h2>
            {role === 'Parent' && registeredCount > 1 && (
              <p className="mt-3 text-sm font-semibold text-ink">
                {registeredCount} players noted for future events.
              </p>
            )}
            {role === 'Parent' && registeredCount === 1 && (
              <p className="mt-3 text-sm font-semibold text-ink">
                1 player noted for future events.
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Thanks for your interest — we&apos;ll email you when the next free community event
              opens up.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Want updates even faster? Join our{' '}
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest hover:text-green-deep"
              >
                WhatsApp group
              </a>{' '}
              and follow{' '}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest hover:text-green-deep"
              >
                @brooklyngamebreakers
              </a>{' '}
              on Instagram.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Want to know more about what to expect?{' '}
              <Link
                to="/summer-clinic-2026"
                onClick={handleClose}
                className="font-semibold text-forest underline decoration-forest/30 underline-offset-2 transition-colors hover:text-green-deep hover:decoration-green-deep"
              >
                Check out the recap from our Summer Clinic
              </Link>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Questions? Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-forest hover:text-green-deep"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full bg-accent px-4 py-2.5 font-util text-sm font-bold tracking-[0.06em] text-white transition-colors hover:bg-accent/90"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
