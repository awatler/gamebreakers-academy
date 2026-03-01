import { Link } from 'react-router-dom'
import { Instagram, Linkedin } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/leagues', label: 'Leagues' },
  { to: '/team', label: 'Team' },
  { to: '/privacy', label: 'Privacy Policy' },
]

// TikTok isn't in lucide-react; use a simple SVG or placeholder
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#2a2a2a] bg-[#000000] text-[#FDFCF8]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Logo & tagline */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-[#FDFCF8] transition-opacity hover:opacity-90">
              <Logo className="h-7 w-7 shrink-0 text-[#FDFCF8]" />
              <span>Gamebreakers Academy</span>
            </Link>
            <p className="mt-2 text-sm text-[#FDFCF8]/80 leading-relaxed">
              Rebuilding the social fabric of our city through the power of sports. By athletes, for athletes.
            </p>
          </div>

          {/* Center: Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6 sm:gap-8">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm font-medium text-[#FDFCF8]/90 transition-colors hover:text-[#FDFCF8]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Social + badge */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FDFCF8]/80 transition-colors hover:text-[#FDFCF8]"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FDFCF8]/80 transition-colors hover:text-[#FDFCF8]"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FDFCF8]/80 transition-colors hover:text-[#FDFCF8]"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <span className="inline-block rounded-ui border border-[#FDFCF8]/40 px-3 py-1.5 text-xs font-medium text-[#FDFCF8]">
              Built for Brooklyn
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
