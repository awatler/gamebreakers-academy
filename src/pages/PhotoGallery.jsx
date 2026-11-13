import { useEffect, useMemo, useRef, useState } from 'react'

import PhotoLightbox from '../components/PhotoLightbox'
import { galleryPhotos } from '../data/photoGallery'
import { trackEvent } from '../lib/analytics'

const PAGE_SIZE = 48

const EVENT_FILTERS = [
  { id: 'all', label: 'All clinics' },
  { id: 'fall', label: 'Fall 2026' },
  { id: 'summer', label: 'Summer 2026' },
]

const KIND_FILTERS = [
  { id: 'all', label: 'All photos' },
  { id: 'action', label: 'Action' },
  { id: 'portrait', label: 'Portraits' },
]

const chipBase =
  'rounded-full px-3.5 py-1.5 font-util text-xs font-bold tracking-[0.06em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2'
const chipActive = `${chipBase} bg-forest text-white`
const chipIdle = `${chipBase} bg-white text-muted ring-1 ring-border hover:text-ink`

export default function PhotoGallery() {
  const [eventFilter, setEventFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const triggerRefs = useRef([])
  const loadMoreRef = useRef(null)

  const filtered = useMemo(() => {
    return galleryPhotos.filter((photo) => {
      if (eventFilter !== 'all' && photo.event !== eventFilter) return false
      if (kindFilter !== 'all' && photo.kind !== kindFilter) return false
      return true
    })
  }, [eventFilter, kindFilter])

  // Reset pagination when filters change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    triggerRefs.current = []
  }, [eventFilter, kindFilter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // Infinite scroll via IntersectionObserver on the sentinel.
  useEffect(() => {
    if (!hasMore) return
    const node = loadMoreRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, filtered.length, visibleCount])

  const openLightbox = (index) => {
    setLightboxIndex(index)
    trackEvent('select_content', {
      content_type: 'gallery_photo',
      item_id: filtered[index].id,
    })
  }

  const closeLightbox = () => {
    const lastIndex = lightboxIndex
    setLightboxIndex(null)
    triggerRefs.current[lastIndex]?.focus()
  }

  return (
    <div>
      <header className="mx-auto max-w-3xl text-center">
        <p className="kicker kicker-centered justify-center">Archive</p>
        <h1 className="heading-display mt-3 text-3xl sm:text-4xl md:text-5xl">Photo Gallery</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Every shot from our free flag football clinics — browse by event or jump straight into the
          action.
        </p>
      </header>

      <div className="sticky top-[4.25rem] z-30 -mx-4 mt-8 border-y border-border bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by clinic">
            {EVENT_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={eventFilter === filter.id ? chipActive : chipIdle}
                aria-pressed={eventFilter === filter.id}
                onClick={() => setEventFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by photo type">
            {KIND_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={kindFilter === filter.id ? chipActive : chipIdle}
                aria-pressed={kindFilter === filter.id}
                onClick={() => setKindFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-2 max-w-6xl font-util text-[11px] font-bold tracking-[0.08em] text-muted">
          Showing {visible.length} of {filtered.length}
          {filtered.length !== galleryPhotos.length ? ` · ${galleryPhotos.length} total` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted">No photos match these filters.</p>
      ) : (
        <>
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
            {visible.map((photo, index) => (
              <li key={photo.id}>
                <button
                  type="button"
                  ref={(node) => {
                    triggerRefs.current[index] = node
                  }}
                  onClick={() => openLightbox(index)}
                  className="group block w-full overflow-hidden rounded-ui border border-border bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
                  aria-label={`View larger: ${photo.alt}`}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.alt}
                    width={photo.thumbWidth}
                    height={photo.thumbHeight}
                    loading={index < 12 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </button>
              </li>
            ))}
          </ul>

          {hasMore ? (
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))}
                className="rounded-full border border-border bg-white px-6 py-2.5 font-util text-xs font-bold tracking-[0.08em] text-ink transition-colors hover:border-forest hover:text-forest"
              >
                Load more
              </button>
            </div>
          ) : (
            <p className="mt-10 text-center font-util text-[11px] font-bold tracking-[0.08em] text-muted">
              End of gallery
            </p>
          )}
        </>
      )}

      <PhotoLightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </div>
  )
}
