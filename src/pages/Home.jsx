import { useState } from 'react'
import { assets } from '../data/images'
import PilotSignupModal from '../components/PilotSignupModal'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      {/* Hero: local basketball park image, object-cover, 40–50% overlay */}
      <section className="relative min-h-[70vh] overflow-hidden rounded-ui border border-[#E5E5E1] sm:min-h-[75vh] transition-opacity duration-300">
        <img
          src={assets.brooklynBasketballPark}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#1B2F1F]/50" aria-hidden />
        <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[75vh] sm:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-[#FDFCF8]/80">
            By Athletes, For Athletes
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[#FDFCF8] sm:text-5xl md:text-6xl">
            Gamebreakers Leagues.
          </h1>
          <p className="mt-4 font-display text-2xl font-medium text-[#FDFCF8]/95 sm:text-3xl">
            Built for Brooklyn.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base text-[#FDFCF8]/85">
            We rebuild the social fabric of our city through the power of sports—youth development and adult social leagues that put connection first.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-10 rounded-ui border border-[#FDFCF8] bg-[#FDFCF8] px-8 py-4 font-display text-base font-semibold text-[#1B2F1F] transition-all duration-200 ease-in-out hover:bg-[#FDFCF8]/90 hover:border-[#E5E5E1]"
          >
            Sign Up for the Summer ’26 Pilot
          </button>
        </div>
      </section>

      <PilotSignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
