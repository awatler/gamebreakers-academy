import { useState } from 'react'
import { Trophy, Users, ShieldCheck } from 'lucide-react'
import PilotSignupModal from '../components/PilotSignupModal'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      {/* Hero: basketball banner — cover, dark overlay, portrait-friendly position */}
      <section
        className="hero-banner relative min-h-[600px] min-h-screen overflow-hidden rounded-ui border border-[#E5E5E1] transition-opacity duration-300"
        aria-label="Hero"
      >
        <div className="hero-banner-bg absolute inset-0" style={{ backgroundImage: "url('/images/basketball-banner.jpg')" }} aria-hidden />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="relative z-10 flex min-h-[600px] min-h-screen flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
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

      {/* Brand values / standard */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-2 text-center">
          <h2 className="font-display text-2xl font-bold text-[#1B2F1F] sm:text-3xl">
            The Gamebreakers Standard
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#1B2F1F]/80 sm:text-base">
            Our leagues blend professional-grade structure with a deeply local, community-first ethos.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 px-2 sm:grid-cols-3">
          <article className="rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-6 text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E5E1] bg-[#1B2F1F] text-[#FDFCF8]">
              <Trophy size={28} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-[#1B2F1F]">
              Elite Standards
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#1B2F1F]/80">
              We bring professional-grade coaching and organization to the local community level.
            </p>
          </article>

          <article className="rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-6 text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E5E1] bg-[#1B2F1F] text-[#FDFCF8]">
              <Users size={28} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-[#1B2F1F]">
              Community First
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#1B2F1F]/80">
              Building more than just athletes; we’re fostering a network of leaders in Brooklyn.
            </p>
          </article>

          <article className="rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-6 text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E5E1] bg-[#1B2F1F] text-[#FDFCF8]">
              <ShieldCheck size={28} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-[#1B2F1F]">
              Character &amp; Discipline
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#1B2F1F]/80">
              Our programs emphasize integrity and grit, both on and off the court.
            </p>
          </article>
        </div>
      </section>

      <PilotSignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
