import { useEffect, useRef } from 'react'
import cutout from '../assets/ananya-cutout.webp'
import { profile } from '../content'
import { cssVars } from '../utils/style'
import { ArrowIcon, CapIcon } from './Icons'
import { Rich } from './Rich'

const factIcons = {
  cap: CapIcon,
  status: () => <span className="hero__pulse" aria-hidden="true" />,
}

const callouts = [
  { text: 'Conversational AI', side: 'l', x: '15%', y: '55%', i: 0 },
  { text: 'Natural Language Processing', side: 'l', x: '10%', y: '67%', i: 1 },
  { text: 'RAG & Embeddings', side: 'r', x: '75%', y: '55%', i: 2 },
  { text: 'Full-stack development', side: 'r', x: '72%', y: '67%', i: 3 },
] as const

const tickerWords = ['Machine Learning', 'Generative AI', 'NLP', 'Conversational AI', 'RAG', 'LLM applications', 'Full-stack development', 'Software engineering']

/** Letters rise out of individual masks. Decorative: the real name is in the h1's hidden text. */
function Chars({ text, from }: { text: string; from: number }) {
  return (
    <>
      {[...text].map((c, i) => (
        <span key={i} className="ch">
          <span className="ch__i" style={cssVars({ '--i': from + i })}>
            {c}
          </span>
        </span>
      ))}
    </>
  )
}

export function Hero() {
  const { linkedin, github, email } = profile.links
  const ref = useRef<HTMLElement>(null)
  useHeroPointer(ref)
  const [first, last] = profile.name.toUpperCase().split(' ')

  return (
    <section ref={ref} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__stage">
        <svg className="hero__rings" viewBox="0 0 800 800" aria-hidden="true" focusable="false">
          <circle cx="400" cy="400" r="392" className="ring ring--a" />
          <circle cx="400" cy="400" r="318" className="ring ring--b" />
          <circle cx="400" cy="400" r="244" className="ring ring--c" />
          <circle cx="400" cy="8" r="4" className="ring__dot" />
        </svg>
        <p className="hero__meta hero__meta--l" aria-hidden="true">
          Portfolio<span>2026</span>
        </p>
        <p className="hero__meta hero__meta--r" aria-hidden="true">
          Class of<span>2027</span>
        </p>
        <ul className="hero__tags" aria-hidden="true">
          {callouts.map((c) => (
            <li key={c.text} className={`tag tag--${c.side}`} style={cssVars({ '--x': c.x, '--y': c.y, '--i': c.i })}>
              {c.text}
            </li>
          ))}
        </ul>
        <div className="hero__badge" aria-hidden="true">
          <svg viewBox="0 0 120 120" focusable="false">
            <defs>
              <path id="badge-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
            </defs>
            <text>
              <textPath href="#badge-path" textLength="284" lengthAdjust="spacing">AI / ML • GENERATIVE AI • SOFTWARE ENGINEERING •</textPath>
            </text>
          </svg>
          <span className="hero__badge-mark">A</span>
        </div>
        <h1 id="hero-title" className="hero__name">
          <span className="visually-hidden">{profile.name}</span>
          <span className="hero__word hero__word--l" aria-hidden="true">
            <Chars text={first} from={0} />
          </span>
          <span className="hero__word hero__word--r" aria-hidden="true">
            <Chars text={last} from={first.length} />
          </span>
        </h1>
        <div className="hero__figure">
          <img src={cutout} width={900} height={784} alt={profile.photoAlt} fetchPriority="high" decoding="async" />
        </div>
      </div>

      <div className="container hero__bar">
        <p className="hero__role hero-in" style={cssVars({ '--i': 0 })}>
          {profile.roleLine}
        </p>
        <p className="hero__lede hero-in" style={cssVars({ '--i': 1 })}>
          <Rich text={profile.headline} />
        </p>
        <div className="hero__side hero-in" style={cssVars({ '--i': 2 })}>
          <ul className="facts">
            {profile.facts.map((f) => {
              const FactIcon = factIcons[f.icon]
              return (
                <li key={f.icon}>
                  <FactIcon />
                  <span>
                    <Rich text={f.text} />
                  </span>
                </li>
              )
            })}
          </ul>
          <ul className="hero__actions">
            <li>
              <a className="btn btn--primary" data-magnetic href={linkedin.href} target="_blank" rel="noopener noreferrer">
                {linkedin.label}
                <ArrowIcon />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className="btn" data-magnetic href={github.href} target="_blank" rel="noopener noreferrer">
                {github.label}
                <ArrowIcon />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className="btn" data-magnetic href={email.href}>
                {email.label}
                <ArrowIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((k) => (
            <ul key={k} className="ticker__set">
              {tickerWords.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Pointer-reactive glow and slight portrait depth. Idle when the pointer rests; off for touch and reduced motion. */
function useHeroPointer(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
    const tick = () => {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      el.style.setProperty('--px', cx.toFixed(3))
      el.style.setProperty('--py', cy.toFixed(3))
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(tick)
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [ref])
}
