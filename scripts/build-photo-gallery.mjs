/**
 * Build the full Photo Gallery archive from local originals.
 *
 * Sources (gitignored):
 *   Fall Clinic Pics/action/     → fall + action
 *   Fall Clinic Pics/portraits/  → fall + portrait (flat; player folder names ignored)
 *   Clinic Pics/                 → summer
 *
 * Dedupes by full-file MD5. Prefer action > portrait-root > nested when
 * the same bytes appear in multiple places.
 *
 * Outputs:
 *   public/images/gallery/{thumb,full}/<id>.jpg
 *   src/data/photoGallery.js
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createReadStream, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const OUT = 'public/images/gallery'
const DATA_OUT = 'src/data/photoGallery.js'
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.JPG', '.JPEG'])

const SOURCES = [
  { root: 'Fall Clinic Pics/action', event: 'fall', kind: 'action', priority: 3 },
  { root: 'Fall Clinic Pics/portraits', event: 'fall', kind: 'portrait', priority: 2 },
  { root: 'Clinic Pics', event: 'summer', kind: 'action', priority: 1 },
]

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walk(path)))
    } else if (IMAGE_EXT.has(extname(entry.name))) {
      out.push(path)
    }
  }
  return out
}

function fileMd5(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5')
    const stream = createReadStream(path)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
  })
}

function sortKey(path) {
  // Prefer natural numeric order from Gamebreakers filenames when present.
  const m = path.match(/(\d+)(?=\.[^.]+$)/)
  const n = m ? Number(m[1]) : 0
  return [n, path]
}

function altFor({ event, kind }) {
  if (event === 'summer') {
    return 'Photo from Brooklyn Gamebreakers Summer Clinic 2026.'
  }
  if (kind === 'portrait') {
    return 'Portrait from Brooklyn Gamebreakers Fall Clinic 2026.'
  }
  return 'Action photo from Brooklyn Gamebreakers Fall Clinic 2026.'
}

const unique = new Map() // md5 → candidate

for (const source of SOURCES) {
  if (!existsSync(source.root)) {
    console.warn('Missing source:', source.root)
    continue
  }
  const files = await walk(source.root)
  console.log(`Scanning ${source.root}: ${files.length} images`)
  for (const path of files) {
    const md5 = await fileMd5(path)
    const size = (await stat(path)).size
    const existing = unique.get(md5)
    const candidate = {
      path,
      md5,
      size,
      event: source.event,
      kind: source.kind,
      priority: source.priority,
      // Root-level portrait files stay portrait; nested player-folder copies of
      // action shots inherit action if we already saw the action original.
    }
    // If this file lives at portraits root (not in a player subfolder), keep portrait.
    // If nested under a named folder but identical to an action file, action wins via priority.
    const rel = path.slice(source.root.length + 1)
    const nested = rel.includes('/') || rel.includes('\\')
    if (source.event === 'fall' && source.kind === 'portrait' && !nested) {
      candidate.priority = 2.5 // above nested portraits, below action
    }
    if (!existing || candidate.priority > existing.priority) {
      unique.set(md5, candidate)
    }
  }
}

const photos = [...unique.values()].sort((a, b) => {
  if (a.event !== b.event) return a.event === 'fall' ? -1 : 1
  if (a.kind !== b.kind) return a.kind === 'action' ? -1 : 1
  const [an, ap] = sortKey(a.path)
  const [bn, bp] = sortKey(b.path)
  return an - bn || ap.localeCompare(bp)
})

console.log(`Unique photos after dedupe: ${photos.length}`)
console.log(
  '  fall action',
  photos.filter((p) => p.event === 'fall' && p.kind === 'action').length,
)
console.log(
  '  fall portrait',
  photos.filter((p) => p.event === 'fall' && p.kind === 'portrait').length,
)
console.log(
  '  summer',
  photos.filter((p) => p.event === 'summer').length,
)

mkdirSync(join(OUT, 'full'), { recursive: true })
mkdirSync(join(OUT, 'thumb'), { recursive: true })

const manifest = []
const counters = { fall: 0, summer: 0 }
let done = 0
for (const photo of photos) {
  counters[photo.event] += 1
  const id = `${photo.event}-${String(counters[photo.event]).padStart(3, '0')}`
  const fullOut = join(OUT, 'full', `${id}.jpg`)
  const thumbOut = join(OUT, 'thumb', `${id}.jpg`)

  execFileSync(
    'sips',
    ['-Z', '1280', '-s', 'format', 'jpeg', '-s', 'formatOptions', '76', photo.path, '--out', fullOut],
    { stdio: 'pipe' },
  )
  execFileSync(
    'sips',
    ['-Z', '480', '-s', 'format', 'jpeg', '-s', 'formatOptions', '68', photo.path, '--out', thumbOut],
    { stdio: 'pipe' },
  )

  let width = 1280
  let height = 853
  try {
    const dims = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', fullOut], {
      encoding: 'utf8',
    })
    width = Number(dims.match(/pixelWidth: (\d+)/)?.[1] || width)
    height = Number(dims.match(/pixelHeight: (\d+)/)?.[1] || height)
  } catch {
    // keep defaults
  }

  manifest.push({
    id,
    event: photo.event,
    kind: photo.kind,
    alt: altFor(photo),
    width,
    height,
  })

  done += 1
  if (done % 25 === 0 || done === photos.length) {
    console.log(`Encoded ${done}/${photos.length}`)
  }
}

const js = `/**
 * Full Photo Gallery archive — Fall + Summer Clinic 2026.
 * Generated by scripts/build-photo-gallery.mjs. Do not edit by hand.
 *
 * Alt text is generic on purpose and never names a child.
 */

const BASE = '/images/gallery'

export const galleryPhotos = ${JSON.stringify(manifest, null, 2)}.map((photo) => ({
  ...photo,
  slug: photo.id,
  thumb: \`\${BASE}/thumb/\${photo.id}.jpg\`,
  full: \`\${BASE}/full/\${photo.id}.jpg\`,
  thumbWidth: 480,
  thumbHeight: Math.round(480 * (photo.height / photo.width)),
}))
`

writeFileSync(DATA_OUT, js)
console.log(`Wrote ${manifest.length} entries → ${DATA_OUT}`)
console.log(`Assets → ${OUT}`)
