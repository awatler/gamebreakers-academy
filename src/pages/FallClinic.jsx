import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users } from 'lucide-react'

import PhotoLightbox from '../components/PhotoLightbox'
import { galleryPhotos, heroPhoto } from '../data/fallClinicGallery'
import { useSignupModal } from '../context/SignupModalContext'
import { trackEvent } from '../lib/analytics'

const facts = [
  { icon: CalendarDays, label: 'Saturday, October 24, 2026' },
  { icon: MapPin, label: 'Brooklyn, NY' },
  { icon: Users, label: 'Ages 7–17' },
]

export default function FallClinic() {
  const { openSignupModal } = useSignupModal()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const triggerRefs = useRef([])

  const openLightbox = (index) => {
    setLightboxIndex(index)
    trackEvent('select_content', {
      content_type: 'clinic_photo',
      item_id: galleryPhotos[index].slug,
    })
  }

  const closeLightbox = () => {
    const lastIndex = lightboxIndex
    setLightboxIndex(null)
    // Send focus back to the thumbnail the viewer was opened from.
    triggerRefs.current[lastIndex]?.focus()
  }

  return (
    <div>
      <header className="mx-auto max-w-3xl text-center">
        <p className="kicker kicker-centered justify-center">Recap</p>
        <h1 className="heading-display mt-3 text-3xl sm:text-4xl md:text-5xl">Fall Clinic 2026</h1>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {facts.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 font-util text-xs font-bold text-muted">
              <Icon size={15} className="text-forest" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </header>

      <figure className="mt-8 overflow-hidden rounded-ui border border-border shadow-lg">
        <img
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          width={1600}
          height={1066}
          className="block max-h-[30rem] w-full object-cover object-center"
        />
      </figure>

      <div className="mx-auto mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-muted">
        <p>
          Our second free flag football clinic brought roughly twice as many players as July — and a
          wider age range, from 7 all the way to 17. Returning coaches and first-time families filled
          Prospect Park Parade Grounds Field #5 for an afternoon of warmups, skill stations, and
          live scrimmages that still felt personal even at the bigger scale.
        </p>
        <p>
          What we wanted to prove was simple: growth doesn&apos;t have to dilute the standard. The
          same sharp coaching, the same energy in the huddles, and the same kids leaving better than
          they arrived — just with a lot more of them on the field. Here&apos;s Fall Clinic.
        </p>
      </div>

      <section className="mt-12" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="heading-display text-xl sm:text-2xl">
          From the Field
        </h2>
        <p className="mt-2 text-sm text-muted">
          Highlights from the day. Select any photo to view it larger, or{' '}
          <Link to="/gallery" className="font-semibold text-forest underline-offset-2 hover:underline">
            browse the full photo gallery
          </Link>
          .
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryPhotos.map((photo, index) => (
            <li key={photo.slug}>
              <button
                type="button"
                ref={(node) => {
                  triggerRefs.current[index] = node
                }}
                onClick={() => openLightbox(index)}
                className="group block w-full overflow-hidden rounded-ui border border-border bg-white shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
                aria-label={`View larger: ${photo.alt}`}
              >
                <img
                  src={photo.thumb}
                  alt={photo.alt}
                  width={photo.thumbWidth}
                  height={photo.thumbHeight}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="block aspect-[3/2] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-ui border border-border bg-seafoam px-6 py-10 text-center">
        <h2 className="heading-display text-xl sm:text-2xl">More free events coming</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Fall Clinic is a wrap. Join the list to hear about the next free community event from
          Brooklyn Gamebreakers.
        </p>
        <button
          type="button"
          onClick={openSignupModal}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber px-8 py-3 font-util text-base font-bold tracking-[0.08em] text-ink shadow-md transition-all duration-200 ease-in-out hover:scale-[1.03] hover:bg-amber/90"
        >
          Stay Tuned
        </button>
      </section>

      <PhotoLightbox
        photos={galleryPhotos}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </div>
  )
}
