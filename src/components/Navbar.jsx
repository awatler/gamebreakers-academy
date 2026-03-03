import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import BrandLogo from './BrandLogo'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/leagues', label: 'Leagues' },
  { to: '/team', label: 'Meet the Team' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCF8] border-b border-[#E5E5E1]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-[#1B2F1F] transition-colors duration-200 ease-in-out hover:text-[#000000]"
        >
          <BrandLogo size={32} className="shrink-0" />
          <span>Gamebreakers Academy</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`font-display text-sm font-medium transition-colors duration-200 ease-in-out hover:text-[#000000] ${
                  location.pathname === to ? 'text-[#1B2F1F]' : 'text-[#1B2F1F]/80'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-ui border border-[#E5E5E1] p-2 text-[#1B2F1F] transition-colors duration-200 ease-in-out hover:bg-[#E5E5E1]/50 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-[#E5E5E1] bg-[#FDFCF8] px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-display text-sm font-medium transition-colors duration-200 ease-in-out hover:text-[#000000] ${
                    location.pathname === to ? 'text-[#1B2F1F]' : 'text-[#1B2F1F]/80'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
