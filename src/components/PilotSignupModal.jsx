import { useState } from 'react'
import { X } from 'lucide-react'

export default function PilotSignupModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Prototype: no backend; could log or show thank-you
    onClose()
    setName('')
    setPhone('')
    setEmail('')
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
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-6 shadow-lg sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-ui p-1 text-[#1B2F1F]/70 transition-colors hover:bg-[#E5E5E1]/50 hover:text-[#1B2F1F]"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 id="pilot-signup-title" className="font-display text-xl font-bold text-[#1B2F1F] pr-8">
          Sign up for the Summer ’26 Pilot
        </h2>
        <p className="mt-2 text-sm text-[#1B2F1F]/80">
          Youth Flag Football & Basketball in Brooklyn. We’ll be in touch.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
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
          <div>
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
          <div>
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
          <button
            type="submit"
            className="w-full rounded-ui border border-[#1B2F1F] bg-[#1B2F1F] px-4 py-3 font-display text-sm font-medium text-[#FDFCF8] transition-colors hover:bg-[#1B2F1F]/90"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
