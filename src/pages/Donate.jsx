const VENMO_URL = 'https://venmo.com/u/BrooklynGamebreakers'
const CASH_APP_URL = 'https://cash.app/$Brooklyngamebreakers'

export default function Donate() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="kicker kicker-centered justify-center">Support the work</p>
      <h1 className="heading-display mt-3 text-3xl sm:text-4xl md:text-5xl">Donate</h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        Your gift helps Brooklyn Gamebreakers run free and low-cost youth programming — clinics,
        coaching, and creative experiences that keep kids on the field and finding their spark.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a
          href={VENMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 min-w-[11rem] items-center justify-center rounded-full bg-amber px-8 font-util text-base font-bold tracking-[0.06em] text-ink shadow-md transition-all duration-200 ease-in-out hover:scale-[1.03] hover:bg-amber/90"
        >
          Give with Venmo
        </a>
        <a
          href={CASH_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 min-w-[11rem] items-center justify-center rounded-full bg-forest px-8 font-util text-base font-bold tracking-[0.06em] text-white shadow-md transition-all duration-200 ease-in-out hover:scale-[1.03] hover:bg-forest/90"
        >
          Give with Cash App
        </a>
      </div>

      <p className="mx-auto mt-10 max-w-lg text-sm leading-relaxed text-muted">
        Brooklyn Gamebreakers is a 501(c)(3) nonprofit organization. Contributions are
        tax-deductible to the extent allowed by law.
      </p>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Questions about giving? Email{' '}
        <a
          href="mailto:info@brooklyngamebreakers.com"
          className="font-semibold text-forest transition-colors hover:text-green-deep"
        >
          info@brooklyngamebreakers.com
        </a>
        .
      </p>
    </div>
  )
}
