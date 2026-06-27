import { Trophy, Users, ShieldCheck } from 'lucide-react'

import { useSignupModal } from '../context/SignupModalContext'



export default function Home() {

  const { openSignupModal } = useSignupModal()



  return (

    <div className="transition-opacity duration-300 ease-in-out">

      <section

        className="hero-banner relative min-h-[600px] min-h-screen overflow-hidden rounded-ui border border-border transition-opacity duration-300"

        aria-label="Hero"

      >

        <div className="hero-banner-bg absolute inset-0" style={{ backgroundImage: "url('/images/flag-football-field.png')" }} aria-hidden />

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85" aria-hidden />

        <div className="relative z-10 flex min-h-[600px] min-h-screen flex-col items-center justify-center px-6 py-16 text-center sm:px-8">

          <p className="font-display text-xl font-bold uppercase tracking-wide text-forest sm:text-2xl md:text-3xl">

            We Break Through

          </p>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">

            Brooklyn Gamebreakers

          </h1>

          <div className="mt-6 space-y-1">
            <p className="font-display text-2xl font-bold uppercase tracking-wide text-amber sm:text-3xl">
              Flag Football Clinic
            </p>
            <p className="font-util text-base font-bold tracking-[0.12em] text-white/90 sm:text-lg">
              Saturday, July 25th
            </p>
            <p className="font-util text-base font-bold tracking-[0.12em] text-white/90 sm:text-lg">
              1PM-4:30PM
            </p>
            <p className="font-util text-base font-bold tracking-[0.08em] text-white/90 sm:text-lg">
              Parade Grounds at Prospect Park, Field #9
            </p>
          </div>

          <button

            type="button"

            onClick={openSignupModal}

            className="mt-10 rounded-full bg-amber px-8 py-4 font-util text-base font-bold tracking-[0.06em] text-ink transition-all duration-200 ease-in-out hover:bg-amber/90"

          >

            Sign Up

          </button>

        </div>

      </section>



      <section className="py-24">

        <div className="mx-auto max-w-5xl px-2 text-center">

          <p className="kicker justify-center">The standard</p>

          <h2 className="heading-display mt-3 text-2xl sm:text-3xl md:text-4xl">

            The Gamebreakers Standard

          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted sm:text-base">

            Our leagues blend professional-grade structure with a deeply local, community-first ethos.

          </p>

        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 px-2 sm:grid-cols-3">

          <article className="rounded-ui border border-border bg-white p-6 text-left">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">

              <Trophy size={28} />

            </div>

            <h3 className="heading-display mt-4 text-lg">

              Elite Standards

            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">

              We bring professional-grade coaching and organization to the local community level.

            </p>

          </article>



          <article className="rounded-ui border border-border bg-white p-6 text-left">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">

              <Users size={28} />

            </div>

            <h3 className="heading-display mt-4 text-lg">

              Community First

            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">

              Building more than just athletes; we’re fostering a network of leaders in Brooklyn.

            </p>

          </article>



          <article className="rounded-ui border border-border bg-white p-6 text-left">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">

              <ShieldCheck size={28} />

            </div>

            <h3 className="heading-display mt-4 text-lg">

              Character &amp; Discipline

            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">

              Our programs emphasize integrity and grit, both on and off the court.

            </p>

          </article>

        </div>

      </section>

    </div>

  )

}

