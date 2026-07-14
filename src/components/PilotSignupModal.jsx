import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const ROLE_OPTIONS = [
  { label: 'Parent', emoji: '👨‍👩‍👧' },
  { label: 'Player', emoji: '🏃' },
  { label: 'Coach', emoji: '📣' },
  { label: 'Community Partner', emoji: '🤝' },
]

const CLINIC_DETAILS = [
  { emoji: '📅', label: 'Date', value: 'Saturday, July 25th · 1PM–4:30PM' },
  { emoji: '📍', label: 'Location', value: 'Parade Grounds at Prospect Park' },
  { emoji: '🆓', label: 'Price', value: 'Free! (but donations are welcome)' },
  { emoji: '🏆', label: 'Ages', value: '7-14' },
]

const MAX_CHILDREN = 5

const inputClass =
  'mt-1 w-full rounded-ui border border-border bg-white px-3 py-2.5 text-ink placeholder-muted/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest'

function validateChildAges(ages) {
  if (ages.length < 1) {
    return 'Please add at least one child age.'
  }

  if (ages.length > MAX_CHILDREN) {
    return `You can register up to ${MAX_CHILDREN} children per signup.`
  }

  for (const childAge of ages) {
    const parsed = Number(childAge)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
      return 'Please enter a valid age for each child.'
    }
  }

  return null
}

export default function PilotSignupModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Parent')
  const [age, setAge] = useState('')
  const [children, setChildren] = useState([''])
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
      setContactError('Please enter an email address so we can confirm your spot.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setContactError('Please enter a valid email address.')
      return
    }

    if (role === 'Parent') {
      const childAges = children.map((childAge) => childAge.trim()).filter(Boolean)
      const ageError = validateChildAges(childAges)
      if (ageError) {
        setContactError(ageError)
        return
      }
    }

    if (role === 'Player') {
      const ageError = validateChildAges([age.trim()])
      if (ageError) {
        setContactError(ageError.replace('child', 'player'))
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
      }

      if (role === 'Parent') {
        payload.children = children
          .map((childAge) => childAge.trim())
          .filter(Boolean)
          .map((childAge) => ({ age: childAge }))
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
              : 'Something went wrong. Please try again.'),
        )
        return
      }

      setRegisteredCount(data.registeredCount || (role === 'Parent' ? payload.children.length : 1))
      setSubmitted(true)
    } catch {
      setContactError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setIsSubmitting(false)
    setAge('')
    setChildren([''])
    setRegisteredCount(1)
    setContactError('')
    onClose()
  }

  const handleRoleChange = (option) => {
    setRole(option)
    setContactError('')
    if (option === 'Parent') {
      setChildren((current) => (current.length > 0 ? current : ['']))
      setAge('')
    } else if (option === 'Player') {
      setChildren([''])
    } else {
      setAge('')
      setChildren([''])
    }
  }

  const addChild = () => {
    if (children.length >= MAX_CHILDREN) return
    setChildren((current) => [...current, ''])
  }

  const removeChild = (index) => {
    if (children.length <= 1) return
    setChildren((current) => current.filter((_, i) => i !== index))
  }

  const updateChildAge = (index, value) => {
    setChildren((current) => current.map((childAge, i) => (i === index ? value : childAge)))
    setContactError('')
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clinic-signup-title"
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
            <div className="flex items-start gap-2 pr-10">
              <span className="shrink-0 pt-0.5 text-xl" aria-hidden>
                🏈
              </span>
              <h2
                id="clinic-signup-title"
                className="heading-display min-w-0 flex-1 text-sm leading-snug sm:text-base md:text-lg lg:whitespace-nowrap"
              >
                Join the Brooklyn Gamebreakers Flag Football Clinic
              </h2>
            </div>

            <p className="mt-3 text-sm text-muted">
              Come down to learn flag football, make friends, and have a ton of fun!{' '}
              <span aria-hidden>✨</span> Sign up to reserve your spot and receive more information.
            </p>

            <div className="mt-4 space-y-2 rounded-ui border border-border bg-seafoam px-4 py-3">
              {CLINIC_DETAILS.map(({ emoji, label, value }) => (
                <div key={label} className="flex gap-2 text-sm text-ink">
                  <span className="mt-0.5 shrink-0 text-base" aria-hidden>
                    {emoji}
                  </span>
                  <p>
                    <span className="font-util font-bold text-green-deep">{label}:</span> {value}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="clinic-name" className="block text-sm font-semibold text-ink">
                    Name
                  </label>
                  <input
                    id="clinic-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="clinic-email" className="block text-sm font-semibold text-ink">
                    Email
                  </label>
                  <input
                    id="clinic-email"
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
                  <label htmlFor="clinic-phone" className="block text-sm font-semibold text-ink">
                    Phone <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="clinic-phone"
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
                  <label htmlFor="clinic-zip" className="block text-sm font-semibold text-ink">
                    Zip Code <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="clinic-zip"
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
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">
                      Children attending <span aria-hidden>🎂</span>
                    </p>
                    {children.length < MAX_CHILDREN && (
                      <button
                        type="button"
                        onClick={addChild}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-util text-xs font-bold text-forest transition-colors hover:border-forest/50 hover:bg-seafoam"
                      >
                        <Plus size={14} aria-hidden />
                        Add another child
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-3">
                    {children.map((childAge, index) => (
                      <div key={index} className="flex items-end gap-3">
                        <div className="min-w-0 flex-1">
                          <label
                            htmlFor={`clinic-child-age-${index}`}
                            className="block text-sm font-semibold text-ink"
                          >
                            Child {index + 1} age
                          </label>
                          <input
                            id={`clinic-child-age-${index}`}
                            type="number"
                            min={1}
                            max={99}
                            value={childAge}
                            onChange={(e) => updateChildAge(index, e.target.value)}
                            required
                            className={`${inputClass} max-w-[8rem]`}
                            placeholder="12"
                          />
                        </div>

                        {children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="mb-1 rounded-ui p-2 text-muted transition-colors hover:bg-border/50 hover:text-ink"
                            aria-label={`Remove child ${index + 1}`}
                          >
                            <Trash2 size={16} aria-hidden />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-muted">
                    Register up to {MAX_CHILDREN} children per signup.
                  </p>
                </div>
              )}

              {role === 'Player' && (
                <div>
                  <label htmlFor="clinic-age" className="block text-sm font-semibold text-ink">
                    Age <span aria-hidden>🎂</span>
                  </label>
                  <input
                    id="clinic-age"
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

              <fieldset className="mt-2">
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
                        name="clinic-role"
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

              {contactError && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {contactError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-full bg-amber px-4 py-3 font-util text-sm font-bold tracking-[0.06em] text-ink transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Signing up…' : "Let's Go!"}
              </button>
            </form>
          </>
        ) : (
          <div className="pr-8">
            <h2 id="clinic-signup-title" className="heading-display text-xl sm:text-2xl">
              You&apos;re in! <span aria-hidden>🎉</span>
            </h2>
            {role === 'Parent' && registeredCount > 1 && (
              <p className="mt-3 text-sm font-semibold text-ink">
                {registeredCount} children registered.
              </p>
            )}
            {role === 'Parent' && registeredCount === 1 && (
              <p className="mt-3 text-sm font-semibold text-ink">1 child registered.</p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We&apos;re excited to see you on July 25th!{' '}
              <span aria-hidden>🏈</span> If you have cleats and gloves those are welcome but not
              required.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Please contact{' '}
              <a
                href="mailto:info@brooklyngamebreakers.com"
                className="font-semibold text-forest hover:text-green-deep"
              >
                info@brooklyngamebreakers.com
              </a>{' '}
              with any questions and make sure to follow{' '}
              <a
                href="https://www.instagram.com/brooklyngamebreakers"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest hover:text-green-deep"
              >
                @brooklyngamebreakers
              </a>{' '}
              on social media for more information.
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
