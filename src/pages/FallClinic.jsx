import { useRef, useState } from 'react'
import { CalendarDays, MapPin, Users } from 'lucide-react'

import PhotoLightbox from '../components/PhotoLightbox'
import { galleryPhotos, heroPhoto } from '../data/fallClinicGallery'
import { useSignupModal } from '../context/SignupModalContext'
import { trackEvent } from '../lib/analytics'

const facts = [
  { icon: CalendarDays, label: 'Saturday, October 24, 2026' },
  { icon: MapPin, label: 'Prospect Park · Field #5' },
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
          On a clear October Saturday we took over Field #5 at Prospect Park Parade Grounds for three
          hours of free flag football. Players worked warmups and footwork, then moved into throws,
          catches, and live scrimmages while coaches stayed on every rep.
        </p>
        <p>
          What stuck with us wasn&apos;t just the leap for a ball or the open-field runs — it was the
          high-fives after a tough drill, the huddles that got loud, and kids who showed up as
          strangers and left as a team. Here&apos;s how the afternoon looked.
        </p>
      </div>

      <section className="mt-12" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="heading-display text-xl sm:text-2xl">
          From the Field
        </h2>
        <p className="mt-2 text-sm text-muted">
          More photos from the day. Select any photo to view it larger.
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
