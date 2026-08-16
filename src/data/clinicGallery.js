/**
 * Summer Clinic 2026 gallery — July 25, 2026 flag football clinic.
 *
 * Source frames live in `Clinic Pics/` (not shipped); web versions were generated
 * into `public/images/clinic-2026/` at two sizes: `thumb` (700px, grid) and
 * `full` (1024px, lightbox).
 *
 * Alt text intentionally never names a child. Families consented to photos being
 * published, not to their kids being identified by name on a public page.
 */

const BASE = '/images/clinic-2026'

/** `tall` frames are 5:4 instead of 3:2 — used to set intrinsic height. */
const photos = [
  { slug: 'check-in-table', alt: 'Coaches welcoming families at the Brooklyn Gamebreakers check-in table under a shade tent.' },
  { slug: 'football-in-hand', alt: 'A young player gripping a football, waiting for the next drill to start.' },
  { slug: 'agility-ladder', alt: 'A player high-stepping through an agility ladder during warmups.' },
  { slug: 'learning-the-throw', alt: 'A coach guiding a young player through a throwing motion.' },
  { slug: 'sideline-coaching', alt: 'A coach talking a player through an assignment on the sideline.' },
  { slug: 'calling-the-play', alt: 'A coach pointing downfield to set up the next repetition.' },
  { slug: 'flag-belt-fitting', alt: 'A coach fastening a flag belt for a player before a scrimmage.' },
  { slug: 'quarterback-windup', alt: 'A young quarterback winding up to throw.' },
  { slug: 'throwing-downfield', alt: 'A player releasing a pass downfield.', tall: true },
  { slug: 'pass-release', alt: 'A player launching a pass against a clear blue sky.' },
  { slug: 'diving-catch', alt: 'A player stretching out for a diving catch.' },
  { slug: 'leaping-catch', alt: 'A player leaping to pull in a high pass.' },
  { slug: 'open-field-run', alt: 'A player breaking into open field with the ball tucked away.' },
  { slug: 'flag-pull-chase', alt: 'Two players at full speed as a defender reaches for the flag.' },
  { slug: 'ready-stance', alt: 'A player set in a ready stance before the snap.', tall: true },
  { slug: 'ball-in-flight', alt: 'A football in flight high above the turf.', tall: true },
  { slug: 'coach-high-five', alt: 'A coach high-fiving a young player after a good repetition.' },
  { slug: 'sideline-high-five', alt: 'A player and a coach trading a high five between drills.' },
  { slug: 'high-five-line', alt: 'Players running a high-five line past the coaching staff.' },
  { slug: 'team-cheer', alt: 'Players throwing their hands up in the middle of a team cheer.' },
  { slug: 'coaches-celebrate', alt: 'Two coaches celebrating with their arms raised.' },
  { slug: 'touchdown-celebration', alt: 'A player celebrating with a fist pump after a score.' },
  { slug: 'team-lineup', alt: 'Players lined up shoulder to shoulder with their coaches.' },
  { slug: 'huddle-up', alt: 'Players and coaches packed into a huddle on the field.' },
  { slug: 'hauling-the-footballs', alt: 'A player carrying an armload of footballs across the field.', tall: true },
  { slug: 'coaching-staff', alt: 'The Brooklyn Gamebreakers coaching staff together on the field.' },
  { slug: 'clinic-group-photo', alt: 'Players and coaches gathered for a group photo at the end of the clinic.' },
]

export const heroPhoto = {
  src: `${BASE}/full/hero-huddle.jpg`,
  alt: 'Players and coaches with their fists and hands raised in a huddle at the end of the clinic.',
}

export const galleryPhotos = photos.map((photo) => ({
  ...photo,
  thumb: `${BASE}/thumb/${photo.slug}.jpg`,
  full: `${BASE}/full/${photo.slug}.jpg`,
  thumbWidth: 700,
  thumbHeight: photo.tall ? 560 : 467,
}))
