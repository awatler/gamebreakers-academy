import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import BrandLogo from './BrandLogo'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/summer-clinic-2026', label: 'Summer Clinic 2026' },
  { to: '/team', label: 'Meet the Team' },
  {
    href: 'https://venmo.com/u/BrooklynGamebreakers',
    label: 'Donate',
    external: true,
  },
]

function NavItem({ to, href, label, external, className, onClick }) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {label}
      </a>
    )
  }

  return (
    <Link to={to} onClick={onClick} className={className}>
      {label}
    </Link>
  )
}

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = (to, external) =>
    `font-util text-sm font-bold transition-colors duration-200 ease-in-out hover:text-forest ${
      !external && location.pathname === to ? 'text-forest' : 'text-muted'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink transition-colors duration-200 ease-in-out hover:text-green-deep"
        >
          <BrandLogo size={32} className="shrink-0" />
          <span>Brooklyn Gamebreakers</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavItem
                {...link}
                className={linkClass(link.to, link.external)}
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-ui border border-border p-2 text-ink transition-colors duration-200 ease-in-out hover:bg-border/50 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-cream px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavItem
                  {...link}
                  onClick={() => setMobileOpen(false)}
                  className={`block ${linkClass(link.to, link.external)}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
