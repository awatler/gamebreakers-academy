import { Link, useLocation } from 'react-router-dom'

import { Menu, X } from 'lucide-react'

import { useState } from 'react'

import BrandLogo from './BrandLogo'



const navLinks = [

  { to: '/', label: 'Home' },

  { to: '/team', label: 'Meet the Team' },

]



export default function Navbar() {

  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)



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

          {navLinks.map(({ to, label }) => (

            <li key={to}>

              <Link

                to={to}

                className={`font-util text-sm font-bold transition-colors duration-200 ease-in-out hover:text-forest ${

                  location.pathname === to ? 'text-forest' : 'text-muted'

                }`}

              >

                {label}

              </Link>

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

            {navLinks.map(({ to, label }) => (

              <li key={to}>

                <Link

                  to={to}

                  onClick={() => setMobileOpen(false)}

                  className={`block font-util text-sm font-bold transition-colors duration-200 ease-in-out hover:text-forest ${

                    location.pathname === to ? 'text-forest' : 'text-muted'

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

