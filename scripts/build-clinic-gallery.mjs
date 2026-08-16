import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC_ROOT = 'Clinic Pics'
const OUT = 'public/images/clinic-2026'

// Selected frames in narrative order: arrival, drills, action, celebration, team.
const SELECTION = [
  ['DSC00708.jpg', 'hero-huddle'],
  ['DSC09772.jpg', 'check-in-table'],
  ['DSC09532.jpg', 'football-in-hand'],
  ['DSC00111.jpg', 'agility-ladder'],
  ['DSC09506.jpg', 'learning-the-throw'],
  ['DSC00407.jpg', 'sideline-coaching'],
  ['DSC09371.jpg', 'calling-the-play'],
  ['DSC00328.jpg', 'flag-belt-fitting'],
  ['DSC09666.jpg', 'quarterback-windup'],
  ['DSC09680.jpg', 'throwing-downfield'],
  ['DSC09414.jpg', 'pass-release'],
  ['DSC00639.jpg', 'diving-catch'],
  ['DSC00651.jpg', 'leaping-catch'],
  ['DSC09813.jpg', 'open-field-run'],
  ['DSC00235.jpg', 'flag-pull-chase'],
  ['DSC09990.jpg', 'ready-stance'],
  ['DSC09880.jpg', 'ball-in-flight'],
  ['DSC09512.jpg', 'coach-high-five'],
  ['DSC00191.jpg', 'sideline-high-five'],
  ['DSC09939.jpg', 'high-five-line'],
  ['DSC09935.jpg', 'team-cheer'],
  ['DSC00531.jpg', 'coaches-celebrate'],
  ['DSC00584.jpg', 'touchdown-celebration'],
  ['DSC09925.jpg', 'team-lineup'],
  ['DSC00448.jpg', 'huddle-up'],
  ['DSC09831.jpg', 'hauling-the-footballs'],
  ['DSC00719.jpg', 'coaching-staff'],
  ['DSC00704.jpg', 'clinic-group-photo'],
]

const index = new Map()
for (const dir of readdirSync(SRC_ROOT).sort()) {
  const dirPath = join(SRC_ROOT, dir)
  if (!statSync(dirPath).isDirectory()) continue
  for (const file of readdirSync(dirPath)) {
    if (!index.has(file)) index.set(file, join(dirPath, file))
  }
}

mkdirSync(join(OUT, 'full'), { recursive: true })
mkdirSync(join(OUT, 'thumb'), { recursive: true })

const missing = []
for (const [file, slug] of SELECTION) {
  const src = index.get(file)
  if (!src) {
    missing.push(file)
    continue
  }
  // Originals are already 1024px wide; copy as the lightbox size and downscale for the grid.
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', src, '--out', join(OUT, 'full', `${slug}.jpg`)])
  execFileSync('sips', ['-Z', '700', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', src, '--out', join(OUT, 'thumb', `${slug}.jpg`)])
}

for (const [file, slug] of SELECTION) {
  if (missing.includes(file)) continue
  const dims = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', join(OUT, 'full', `${slug}.jpg`)]).toString()
  const w = dims.match(/pixelWidth: (\d+)/)[1]
  const h = dims.match(/pixelHeight: (\d+)/)[1]
  console.log(`${slug}\t${w}x${h}`)
}

if (missing.length) console.error('MISSING:', missing)
