import { Link } from 'react-router-dom'

import { Instagram } from 'lucide-react'

import BrandLogo from './BrandLogo'



const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/team', label: 'Team' },
  {
    href: 'https://venmo.com/u/BrooklynGamebreakers',
    label: 'Donate',
    external: true,
  },
  { to: '/privacy', label: 'Privacy' },
]



export default function Footer() {

  return (

    <footer className="mt-auto border-t border-white/10 bg-accent text-white">

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">

          <div className="max-w-xs">

            <Link

              to="/"

              className="flex flex-col items-start gap-3 font-display text-lg font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"

            >

              <BrandLogo size={40} variant="dark" className="shrink-0" />

              <span>

                Brooklyn <span className="text-forest">Gamebreakers</span>

              </span>

            </Link>

            <p className="mt-2 text-sm leading-relaxed text-white/70">

              Helping the next generation of Brooklyn&apos;s athletes to break through.

            </p>

          </div>



          <nav aria-label="Footer navigation">

            <ul className="flex flex-wrap gap-6 sm:gap-8">

              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-util text-sm font-bold text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="font-util text-sm font-bold text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}

            </ul>

          </nav>



          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">

            <div className="flex items-center gap-4">

              <a

                href="https://www.instagram.com/brooklyngamebreakers"

                target="_blank"

                rel="noopener noreferrer"

                className="text-white/70 transition-colors hover:text-forest"

                aria-label="Instagram"

              >

                <Instagram size={20} />

              </a>

            </div>

            <span className="inline-block rounded-full border border-forest/40 px-3 py-1.5 font-util text-xs font-bold tracking-[0.04em] text-forest">

              Built for Brooklyn

            </span>

          </div>

        </div>

      </div>

    </footer>

  )

}

