import { useEffect, useRef } from 'react'
import { certifications, education, profile, projects } from '../content'
import { CountUp } from './CountUp'
import type { RichText } from '../content'
import { cssVars } from '../utils/style'
import { Reveal } from './Reveal'
import { Section } from './Section'

/** Words brighten as the paragraph scrolls through the viewport. One CSS variable per frame, only while visible. */
function LitText({ text, className }: { text: RichText; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  const words: Array<{ w: string; em: boolean; space: boolean }> = []
  text.forEach((part) => {
    const em = typeof part !== 'string'
    const str = em ? part.em : part
    const toks = str.split(/\s+/).filter(Boolean)
    // Punctuation that directly follows the previous segment stays attached to it.
    if (words.length && !em && /^[.,:;!?)”’]/.test(str)) words[words.length - 1].space = false
    toks.forEach((w) => words.push({ w, em, space: true }))
  })

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('is-live')
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.25)
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
      } else {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <p ref={ref} className={`lit ${className ?? ''}`.trim()}>
      {words.map((x, i) => (
        <span key={i} className={x.em ? 'lit__w accent' : 'lit__w'} style={cssVars({ '--n': (i / words.length).toFixed(3) })}>
          {x.w}
          {x.space ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

export function About() {
  return (
    <Section id="about">
      <div className="about">
        <LitText className="about__lede" text={profile.about.lede} />
        <div className="about__side">
          {profile.about.body.map((p, i) => (
            <Reveal as="p" key={i} className="prose" delay={i * 90}>
              {p}
            </Reveal>
          ))}
          <Reveal as="div" delay={180}>
            <h3 className="label">Focus areas</h3>
            <ol className="focus">
              {profile.focusAreas.map((f, i) => (
                <li key={f}>
                  <span className="focus__n">{String(i + 1).padStart(2, '0')}</span>
                  {f}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>

      <Reveal as="ul" className="stats" delay={80}>
        {[
          { v: projects.length, l: 'Flagship AI projects' },
          { v: certifications.length, l: 'Courses and certifications' },
          { v: education.university.coursework.length, l: 'Core CS and AI subjects' },
          { v: 2027, l: 'Graduating' },
        ].map((s) => (
          <li key={s.l}>
            <span className="stats__v">
              <CountUp value={s.v} />
            </span>
            <span className="stats__l">{s.l}</span>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}
