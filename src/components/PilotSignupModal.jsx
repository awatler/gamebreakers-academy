import { useState } from 'react'
import { X, Circle, Flag, Users } from 'lucide-react'

const ROLE_OPTIONS = ['Parent', 'Player', 'Coach', 'Community Partner']

export default function PilotSignupModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Parent')
  const [sports, setSports] = useState({
    youthBasketball: false,
    youthFlagFootball: false,
    adultIntramurals: false,
  })
  const [zip, setZip] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleToggleSport = (key) => {
    setSports((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Prototype: capture values in state only; no backend.
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pilot-signup-title"
    >
      <div
        className="absolute inset-0 bg-[#1B2F1F]/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-6 shadow-lg sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-ui p-1 text-[#1B2F1F]/70 transition-colors hover:bg-[#E5E5E1]/50 hover:text-[#1B2F1F]"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <h2
              id="pilot-signup-title"
              className="font-display text-xl font-bold text-[#1B2F1F] pr-8 sm:text-2xl"
            >
              Join the Summer ’26 Pilot Waitlist
            </h2>
            <p className="mt-2 text-sm text-[#1B2F1F]/80">
              Gamebreakers Academy youth programs in Brooklyn. Tell us who you are and what you&apos;re
              excited about so we can prioritize the right neighborhoods first.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="pilot-name" className="block text-sm font-medium text-[#1B2F1F]">
                    Name
                  </label>
                  <input
                    id="pilot-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2.5 text-[#1B2F1F] placeholder-[#1B2F1F]/50 focus:border-[#1B2F1F] focus:outline-none focus:ring-1 focus:ring-[#1B2F1F]"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <label htmlFor="pilot-email" className="block text-sm font-medium text-[#1B2F1F]">
                    Email
                  </label>
                  <input
                    id="pilot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2.5 text-[#1B2F1F] placeholder-[#1B2F1F]/50 focus:border-[#1B2F1F] focus:outline-none focus:ring-1 focus:ring-[#1B2F1F]"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                  <label htmlFor="pilot-phone" className="block text-sm font-medium text-[#1B2F1F]">
                    Phone
                  </label>
                  <input
                    id="pilot-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 w-full rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2.5 text-[#1B2F1F] placeholder-[#1B2F1F]/50 focus:border-[#1B2F1F] focus:outline-none focus:ring-1 focus:ring-[#1B2F1F]"
                    placeholder="(555) 000-0000"
                  />
                </div>

                {/* Zip Code */}
                <div className="sm:col-span-1">
                  <label htmlFor="pilot-zip" className="block text-sm font-medium text-[#1B2F1F]">
                    Zip Code
                  </label>
                  <input
                    id="pilot-zip"
                    type="text"
                    inputMode="numeric"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                    className="mt-1 w-full max-w-[8rem] rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2.5 text-[#1B2F1F] placeholder-[#1B2F1F]/50 focus:border-[#1B2F1F] focus:outline-none focus:ring-1 focus:ring-[#1B2F1F]"
                    placeholder="11201"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <fieldset className="mt-2">
                <legend className="text-sm font-medium text-[#1B2F1F]">I am a...</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={`cursor-pointer rounded-ui border px-3 py-1.5 text-xs font-medium transition-colors ${
                        role === option
                          ? 'border-[#1B2F1F] bg-[#1B2F1F] text-[#FDFCF8]'
                          : 'border-[#E5E5E1] bg-[#FDFCF8] text-[#1B2F1F] hover:border-[#1B2F1F]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pilot-role"
                        value={option}
                        checked={role === option}
                        onChange={() => setRole(option)}
                        className="sr-only"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Sports interest */}
              <fieldset className="mt-2">
                <legend className="text-sm font-medium text-[#1B2F1F]">
                  Interested in...
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2 text-sm text-[#1B2F1F] transition-colors hover:border-[#1B2F1F]/50">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-[#E5E5E1] text-[#1B2F1F] focus:ring-[#1B2F1F]"
                      checked={sports.youthBasketball}
                      onChange={() => handleToggleSport('youthBasketball')}
                    />
                    <Circle size={16} className="text-[#1B2F1F]" />
                    <span className="text-xs sm:text-sm">Youth Basketball</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2 text-sm text-[#1B2F1F] transition-colors hover:border-[#1B2F1F]/50">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-[#E5E5E1] text-[#1B2F1F] focus:ring-[#1B2F1F]"
                      checked={sports.youthFlagFootball}
                      onChange={() => handleToggleSport('youthFlagFootball')}
                    />
                    <Flag size={16} className="text-[#1B2F1F]" />
                    <span className="text-xs sm:text-sm">Youth Flag Football</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] px-3 py-2 text-sm text-[#1B2F1F] transition-colors hover:border-[#1B2F1F]/50 sm:col-span-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-[#E5E5E1] text-[#1B2F1F] focus:ring-[#1B2F1F]"
                      checked={sports.adultIntramurals}
                      onChange={() => handleToggleSport('adultIntramurals')}
                    />
                    <Users size={16} className="text-[#1B2F1F]" />
                    <span className="text-xs sm:text-sm">Adult Intramural Leagues</span>
                  </label>
                </div>
              </fieldset>

              <button
                type="submit"
                className="mt-4 w-full rounded-ui border border-[#1B2F1F] bg-[#1B2F1F] px-4 py-3 font-display text-sm font-semibold text-[#FDFCF8] transition-colors hover:bg-[#1B2F1F]/90"
              >
                Join Waitlist
              </button>
            </form>
          </>
        ) : (
          <div className="pr-8">
            <h2
              id="pilot-signup-title"
              className="font-display text-xl font-bold text-[#1B2F1F] sm:text-2xl"
            >
              You&apos;re on the list.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#1B2F1F]/85">
              You&apos;re on the list! We&apos;ll reach out soon with pilot program details for your
              area.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-ui border border-[#1B2F1F] bg-[#1B2F1F] px-4 py-2.5 font-display text-sm font-semibold text-[#FDFCF8] transition-colors hover:bg-[#1B2F1F]/90"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

