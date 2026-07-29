import { Trophy, Users, HeartHandshake } from 'lucide-react'

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

          <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">

            Brooklyn Gamebreakers

          </h1>

          <div className="mt-6 space-y-1">
            <p className="font-display text-2xl font-bold uppercase tracking-wide text-amber sm:text-3xl">
              Thank You, Brooklyn
            </p>
            <p className="font-util text-base font-bold tracking-[0.12em] text-white/90 sm:text-lg">
              Our July flag football clinic was one for the books.
            </p>
            <p className="font-util text-base font-bold tracking-[0.08em] text-white/90 sm:text-lg">
              More programming is on the way — be the first to know.
            </p>
          </div>

          <button

            type="button"

            onClick={openSignupModal}

            className="mt-10 inline-flex h-[3.75rem] min-w-[10.5rem] items-center justify-center rounded-full bg-amber px-10 font-util text-[1.625rem] font-bold leading-none tracking-[0.08em] text-ink shadow-lg shadow-black/25 transition-all duration-200 ease-in-out hover:scale-[1.03] hover:bg-amber/90 hover:shadow-xl sm:min-w-[11.5rem] sm:px-12 sm:text-[1.8rem]"

          >

            Keep Me Posted

          </button>

          <p className="mt-10 font-display text-4xl font-bold uppercase tracking-wide text-forest sm:text-5xl md:text-6xl">

            We Break Through

          </p>

        </div>

      </section>



      <section className="py-24">

        <div className="mx-auto max-w-5xl px-2 text-center">

          <p className="kicker-lg">The mission</p>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">

            Redefining youth athletics through innovative, accessible, and high-impact programming. By blending elite sports training with creative disciplines like tech and design, Brooklyn Gamebreakers provides a platform for Brooklyn&apos;s youth to discover their potential and find their spark.

          </p>

        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 px-2 sm:grid-cols-3">

          <article className="rounded-ui border border-border bg-white p-6 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">

              <Users size={28} />

            </div>

            <h3 className="heading-display mt-4 text-lg">

              Everybody Eats

            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">

              Opportunity is shared — nobody gets overlooked.

            </p>

          </article>



          <article className="rounded-ui border border-border bg-white p-6 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">

              <HeartHandshake size={28} />

            </div>

            <h3 className="heading-display mt-4 text-lg">

              Find Your People

            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">

              Teammates become friends and even family.

            </p>

          </article>



          <article className="rounded-ui border border-border bg-white p-6 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">

              <Trophy size={28} />

            </div>

            <h3 className="heading-display mt-4 text-lg">

              We Break Through

            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">

              We push past limits, together.

            </p>

          </article>

        </div>

      </section>

    </div>

  )

}

