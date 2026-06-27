import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PilotSignupModal from './PilotSignupModal'
import { SignupModalContext } from '../context/SignupModalContext'

const SESSION_KEY = 'clinic-signup-dismissed'

export default function Layout({ children }) {
  const [modalOpen, setModalOpen] = useState(() => {
    if (typeof window === 'undefined') return false
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
        <PilotSignupModal isOpen={modalOpen} onClose={handleCloseModal} />
      </div>
    </SignupModalContext.Provider>
  )
}
