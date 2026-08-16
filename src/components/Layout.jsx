import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import InterestSignupModal from './InterestSignupModal'
import { SignupModalContext } from '../context/SignupModalContext'

const SESSION_KEY = 'interest-signup-dismissed'

// Pages that make their own signup pitch. Popping the modal over them just
// buries the content a visitor arrived for.
const NO_AUTO_OPEN_PATHS = ['/summer-clinic-2026']

export default function Layout({ children }) {
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    if (NO_AUTO_OPEN_PATHS.includes(location.pathname)) return false
    return !sessionStorage.getItem(SESSION_KEY)
  })

  const handleCloseModal = () => {
    sessionStorage.setItem(SESSION_KEY, '1')
    setModalOpen(false)
  }

  return (
    <SignupModalContext.Provider value={{ openSignupModal: () => setModalOpen(true) }}>
      <div className="flex min-h-screen flex-col bg-cream">
        <div className="grain-overlay" aria-hidden="true" />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <InterestSignupModal isOpen={modalOpen} onClose={handleCloseModal} />
      </div>
    </SignupModalContext.Provider>
  )
}
