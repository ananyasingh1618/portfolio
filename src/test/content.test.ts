import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { certifications, emailAddress, experience, profile, projects, skills } from '../content'

const root = join(__dirname, '..', '..')

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const textFiles = (dir: string) =>
  walk(dir).filter((f) => /\.(ts|tsx|css|html|json|txt|svg|md|js)$/.test(f) && !f.endsWith('package-lock.json'))

// Any run of 10+ digits (optionally spaced/dashed/+prefixed) looks like a phone number.
const phoneLike = /(\+?\d[\s-]?){10,}/

describe('privacy', () => {
  const dirs = ['src', 'public', 'dist'].map((d) => join(root, d)).filter(existsSync)
  // Bundled JS contains React internals with long numeric constants, so it is skipped here;
  // all first-party content lives in src/, which is scanned.
  const files = [...dirs.flatMap((d) => textFiles(d)), join(root, 'index.html')].filter(
    (f) => !f.endsWith('content.test.ts') && !/dist[\\/]assets[\\/].*\.js$/.test(f),
  )

  it('scans a meaningful set of files', () => expect(files.length).toBeGreaterThan(10))

  it.each(files.map((f) => [f.replace(root, '')]))('%s contains no phone-like number', (rel) => {
    // SVG path data (d="...") is just coordinates, so it is ignored.
    const text = readFileSync(join(root, rel), 'utf8').replace(/\bd="[^"]*"/g, '')
    expect(text).not.toMatch(phoneLike)
    expect(text.toLowerCase()).not.toContain('tel:')
  })
})

describe('degree and institute wording', () => {
  const src = [...walk(join(root, 'src')), join(root, 'index.html')]
    .filter((f) => /\.(ts|tsx|html)$/.test(f) && !f.endsWith('content.test.ts'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')
  it('never says B.Tech', () => expect(src).not.toMatch(/b\.?\s?tech/i))
  it('uses the full institute name with "and"', () => {
    expect(src).not.toContain('Engineering & Technology')
    expect(src).toContain('Thapar Institute of Engineering and Technology')
  })
})

describe('content integrity', () => {
  it('uses the exact contact links', () => {
    expect(profile.links.email.href).toBe('mailto:ananyasingh1852004@gmail.com')
    expect(emailAddress).toBe('ananyasingh1852004@gmail.com')
    expect(profile.links.linkedin.href).toBe('https://www.linkedin.com/in/ananya-singh-659170296/')
    expect(profile.links.github.href).toBe('https://github.com/ananyasingh1618')
  })


  it('has one experience entry with the expected dates', () => {
    expect(experience).toHaveLength(1)
    expect(experience[0].period).toBe('June 2025 – July 2025')
  })

  it('lists six certifications with exact issue dates', () => {
    expect(certifications.map((c) => c.issued)).toEqual([
      'September 2026', 'September 2026', 'September 2026', 'September 2026', 'July 2025', 'June 2025',
    ])
  })

  it('has no duplicate skills within a category', () => {
    for (const g of skills) expect(new Set(g.items).size).toBe(g.items.length)
  })
})

describe('projects', () => {
  const [vox, dev] = projects
  const pub = (rel: string) => join(root, 'public', rel.replace(/^\//, ''))

  it('lists VoxMind then DevForge with the exact GitHub links', () => {
    expect(projects.map((p) => p.name)).toEqual(['VoxMind', 'DevForge'])
    expect(vox.links.github).toBe('https://github.com/ananyasingh1618/VoxMind')
    expect(dev.links.github).toBe('https://github.com/ananyasingh1618/DevForge')
  })

  it('has exactly Watch Demo, GitHub and Case Study, and no Live Demo link', () => {
    for (const p of projects) expect(Object.keys(p.links).sort()).toEqual(['caseStudy', 'github'])
  })

  it('never links a temporary tunnel URL', () => {
    const all = JSON.stringify(projects) + readFileSync(join(root, 'src/components/Projects.tsx'), 'utf8')
    expect(all.toLowerCase()).not.toMatch(/trycloudflare|quick-tunnel-url/)
  })

  it('points at media and case-study files that exist', () => {
    for (const p of projects) {
      for (const src of [p.video.src, p.poster.src, p.links.caseStudy]) {
        expect(existsSync(pub(src)), src).toBe(true)
      }
    }
  })

  it('shows only verified VoxMind metrics (the DevForge retrieval figures are not VoxMind numbers)', () => {
    const values = vox.technical.metrics.map((m) => m.value)
    for (const notVox of [93.2, 95.8, 92.5, 95.3, 90.3]) expect(values).not.toContain(notVox)
    expect(values).toEqual(expect.arrayContaining([358, 100, 52, 48, 14]))
  })

  it('shows the verified DevForge evaluation figures', () => {
    const byLabel = Object.fromEntries(dev.technical.metrics.map((m) => [m.label, m.value]))
    expect(byLabel['Golden cases matched']).toBe(106)
    expect(byLabel['Retrieval Recall@5']).toBe(95.8)
    expect(byLabel['Retrieval MRR']).toBe(95.3)
    expect(byLabel['Invalid citations']).toBe(0)
  })

  it('only surfaces glance metrics that exist', () => {
    for (const p of projects) for (const l of p.glance) expect(p.technical.metrics.map((m) => m.label)).toContain(l)
  })

  it('gives each project a three-part overview', () => {
    for (const p of projects) {
      expect(Object.keys(p.overview)).toEqual(['about', 'features', 'challenges'])
      expect(p.overview.challenges.length).toBeGreaterThanOrEqual(3)
      expect(p.overview.challenges.length).toBeLessThanOrEqual(6)
    }
  })
})
