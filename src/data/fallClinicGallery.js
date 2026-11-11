/**
 * Fall Clinic 2026 gallery — October 24, 2026 flag football clinic.
 *
 * Source frames live in `Fall Clinic Pics/` (not shipped); web versions were
 * generated into `public/images/fall-clinic-2026/` at two sizes: `thumb` (700px,
 * grid) and `full` (1600px, lightbox).
 *
 * Alt text intentionally never names a child. Families consented to photos being
 * published, not to their kids being identified by name on a public page.
 */

const BASE = '/images/fall-clinic-2026'

/** `tall` frames are closer to 5:4 / portrait — used to set intrinsic height. */
const photos = [
  { slug: 'check-in-table', alt: 'Coaches setting up the check-in table with clipboards and pinnies on a sunny Prospect Park field.' },
  { slug: 'pinning-on-vest', alt: 'A young player pulling on a neon scrimmage vest at the check-in table.', tall: true },
  { slug: 'warmup-stretch', alt: 'Coaches leading players through a stretch before drills begin.' },
  { slug: 'coach-huddle-talk', alt: 'A coach talking a group of players through the next drill.' },
  { slug: 'coach-calling-play', alt: 'A coach with arms raised, calling the next repetition on the field.' },
  { slug: 'coach-with-clipboard', alt: 'A coach with a whistle and clipboard addressing players on the grass.', tall: true },
  { slug: 'ready-to-run', alt: 'A player in an orange pinny and flag belt set to run a drill.' },
  { slug: 'line-drill', alt: 'Players lined up for a drill as a football sails through the air.' },
  { slug: 'running-the-drill', alt: 'A player sprinting forward during a flag football drill while a coach watches.' },
  { slug: 'throwing-form', alt: 'A young quarterback winding up to throw during a passing rep.', tall: true },
  { slug: 'catching-rep', alt: 'A player reaching out with both hands to haul in a pass.', tall: true },
  { slug: 'cut-and-move', alt: 'A player cutting across the field while a coach holds a football nearby.' },
  { slug: 'hurdles-with-coach', alt: 'A coach working a player through an agility-hurdle station.' },
  { slug: 'hurdle-jump', alt: 'A player leaping over a line of low orange hurdles.' },
  { slug: 'coach-signaling', alt: 'A coach raising two fingers high to signal the next play.' },
  { slug: 'coach-high-five', alt: 'A coach high-fiving a player after a good repetition.' },
  { slug: 'celebration-flip', alt: 'A player flipping onto the grass in celebration between reps.' },
  { slug: 'ball-carrier-smile', alt: 'A smiling player running toward the camera with the football tucked away.' },
  { slug: 'touchdown-arms', alt: 'A player with arms stretched wide after a successful play.' },
  { slug: 'pass-drill-cones', alt: 'A coach and player working a passing drill among agility cones.' },
  { slug: 'reaching-for-catch', alt: 'A player looking up and reaching for a football in flight.' },
  { slug: 'eyes-on-the-ball', alt: 'A player in a ready stance tracking an incoming pass.' },
  { slug: 'ready-to-throw', alt: 'A player holding the football overhead, set to throw.' },
  { slug: 'open-field-run', alt: 'A ball carrier breaking into open field as a defender reaches for the flag.' },
  { slug: 'leap-for-ball', alt: 'Players converging as one leaps for a ball in a live scrimmage.' },
  { slug: 'flag-pull-chase', alt: 'A ball carrier racing ahead while a defender lunges for the flag.' },
  { slug: 'three-player-chase', alt: 'Three players in a close chase during a live flag football play.' },
]

export const heroPhoto = {
  src: `${BASE}/full/hero-group-photo.jpg`,
  alt: 'Players and coaches gathered for a group photo at the end of the Fall Clinic.',
}

export const galleryPhotos = photos.map((photo) => ({
  ...photo,
  thumb: `${BASE}/thumb/${photo.slug}.jpg`,
  full: `${BASE}/full/${photo.slug}.jpg`,
  thumbWidth: 700,
  thumbHeight: photo.tall ? 560 : 467,
}))
