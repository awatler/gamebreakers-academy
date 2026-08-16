import { useCallback, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const controlClass =
  'rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber'

export default function PhotoLightbox({ photos, index, onClose, onIndexChange }) {
  const dialogRef = useRef(null)
  const isOpen = index !== null

  const goTo = useCallback(
    (next) => onIndexChange((next + photos.length) % photos.length),
    [onIndexChange, photos.length],
  )

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') goTo(index + 1)
      else if (event.key === 'ArrowLeft') goTo(index - 1)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, index, goTo, onClose])

  // Keep the page behind the overlay from scrolling.
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) dialogRef.current?.focus()
  }, [isOpen])

  // Warm the neighbouring frames so arrow navigation lands instantly.
  useEffect(() => {
    if (!isOpen) return

    for (const offset of [1, -1]) {
      const neighbour = photos[(index + offset + photos.length) % photos.length]
      const preload = new Image()
      preload.src = neighbour.full
    }
  }, [isOpen, index, photos])

  if (!isOpen) return null

  const photo = photos[index]

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}. ${photo.alt}`}
      className="fixed inset-0 z-[60] flex flex-col bg-black focus:outline-none"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="font-util text-xs font-bold tracking-[0.14em] text-white/70">
          {index + 1} / {photos.length}
        </p>
        <button type="button" onClick={onClose} className={controlClass} aria-label="Close photo viewer">
          <X size={20} aria-hidden />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <img
          key={photo.full}
          src={photo.full}
          alt={photo.alt}
          className="max-h-full max-w-full rounded-ui object-contain"
        />

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className={`absolute left-2 top-1/2 -translate-y-1/2 sm:left-6 ${controlClass}`}
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 sm:right-6 ${controlClass}`}
          aria-label="Next photo"
        >
          <ChevronRight size={24} aria-hidden />
        </button>
      </div>

      <p className="mx-auto max-w-2xl px-4 py-5 text-center text-sm leading-relaxed text-white/75">
        {photo.alt}
      </p>
    </div>
  )
}
