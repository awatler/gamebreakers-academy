import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'public/images/fall-clinic-2026'
const ACTION = 'Fall Clinic Pics/action'
const PORTRAITS = 'Fall Clinic Pics/portraits'

// Narrative order: arrival → coaching → drills → highlights → scrimmage.
// Action folder is the primary source; portraits used only for the group hero.
const SELECTION = [
  [`${PORTRAITS}/20261024-Gamebreakers Event-1.jpg`, 'hero-group-photo'],
  [`${ACTION}/20261024-Gamebreakers Event Action-1.jpg`, 'check-in-table'],
  [`${ACTION}/20261024-Gamebreakers Event Action-5.jpg`, 'pinning-on-vest'],
  [`${ACTION}/20261024-Gamebreakers Event Action-15.jpg`, 'warmup-stretch'],
  [`${ACTION}/20261024-Gamebreakers Event Action-30.jpg`, 'coach-huddle-talk'],
  [`${ACTION}/20261024-Gamebreakers Event Action-36.jpg`, 'coach-calling-play'],
  [`${ACTION}/20261024-Gamebreakers Event Action-42.jpg`, 'coach-with-clipboard'],
  [`${ACTION}/20261024-Gamebreakers Event Action-20.jpg`, 'ready-to-run'],
  [`${ACTION}/20261024-Gamebreakers Event Action-50.jpg`, 'line-drill'],
  [`${ACTION}/20261024-Gamebreakers Event Action-55.jpg`, 'running-the-drill'],
  [`${ACTION}/20261024-Gamebreakers Event Action-63.jpg`, 'throwing-form'],
  [`${ACTION}/20261024-Gamebreakers Event Action-64.jpg`, 'catching-rep'],
  [`${ACTION}/20261024-Gamebreakers Event Action-70.jpg`, 'cut-and-move'],
  [`${ACTION}/20261024-Gamebreakers Event Action-78.jpg`, 'hurdles-with-coach'],
  [`${ACTION}/20261024-Gamebreakers Event Action-91.jpg`, 'hurdle-jump'],
  [`${ACTION}/20261024-Gamebreakers Event Action-86.jpg`, 'coach-signaling'],
  [`${ACTION}/20261024-Gamebreakers Event Action-93.jpg`, 'coach-high-five'],
  [`${ACTION}/20261024-Gamebreakers Event Action-98.jpg`, 'celebration-flip'],
  [`${ACTION}/20261024-Gamebreakers Event Action-100.jpg`, 'ball-carrier-smile'],
  [`${ACTION}/20261024-Gamebreakers Event Action-108.jpg`, 'touchdown-arms'],
  [`${ACTION}/20261024-Gamebreakers Event Action-115.jpg`, 'pass-drill-cones'],
  [`${ACTION}/20261024-Gamebreakers Event Action-124.jpg`, 'reaching-for-catch'],
  [`${ACTION}/20261024-Gamebreakers Event Action-130.jpg`, 'eyes-on-the-ball'],
  [`${ACTION}/20261024-Gamebreakers Event Action-134.jpg`, 'ready-to-throw'],
  [`${ACTION}/20261024-Gamebreakers Event Action-145.jpg`, 'open-field-run'],
  [`${ACTION}/20261024-Gamebreakers Event Action-148.jpg`, 'leap-for-ball'],
  [`${ACTION}/20261024-Gamebreakers Event Action-152.jpg`, 'flag-pull-chase'],
  [`${ACTION}/20261024-Gamebreakers Event Action-155.jpg`, 'three-player-chase'],
]

mkdirSync(join(OUT, 'full'), { recursive: true })
mkdirSync(join(OUT, 'thumb'), { recursive: true })

const missing = []
for (const [src, slug] of SELECTION) {
  try {
    // Full: max edge 1600 for sharper lightbox on large originals; thumb 700.
    execFileSync('sips', [
      '-Z',
      '1600',
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      '82',
      src,
      '--out',
      join(OUT, 'full', `${slug}.jpg`),
    ])
    execFileSync('sips', [
      '-Z',
      '700',
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      '72',
      src,
      '--out',
      join(OUT, 'thumb', `${slug}.jpg`),
    ])
  } catch (err) {
    missing.push(src)
    console.error('Failed:', src, err.message)
  }
}

for (const [, slug] of SELECTION) {
  if (missing.some((m) => m.includes(slug))) continue
  const dims = execFileSync('sips', [
    '-g',
    'pixelWidth',
    '-g',
    'pixelHeight',
    join(OUT, 'full', `${slug}.jpg`),
  ]).toString()
  const w = dims.match(/pixelWidth: (\d+)/)[1]
  const h = dims.match(/pixelHeight: (\d+)/)[1]
  console.log(`${slug}\t${w}x${h}`)
}

if (missing.length) {
  console.error('MISSING:', missing)
  process.exit(1)
}

console.log(`Wrote ${SELECTION.length} images to ${OUT}`)
