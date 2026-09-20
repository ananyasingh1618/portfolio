import { useRef, useState } from 'react'
import { projects } from '../content'
import type { Project } from '../content'
import { cssVars } from '../utils/style'
import { CountUp } from './CountUp'
import { Disclosure } from './Disclosure'
import { ArrowIcon } from './Icons'
import { Reveal } from './Reveal'
import { Rich } from './Rich'
import { Section } from './Section'
import { Split } from './Split'
import { TechOverview } from './TechOverview'
import { VideoLightbox } from './VideoLightbox'

const PlayIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
)

export function Projects() {
  return (
    <Section id="projects">
      <div className="cases">
        {projects.map((p) => (
          <ProjectCase key={p.id} project={p} />
        ))}
      </div>
    </Section>
  )
}

function ProjectCase({ project: p }: { project: Project }) {
  const [playing, setPlaying] = useState(false)
  const openBtn = useRef<HTMLButtonElement>(null)
  const { about, features, challenges } = p.overview

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height - 0.5) * -4).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2)}deg`)
  }
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <article id={p.id} className="case" style={cssVars({ '--pa': p.accent })} aria-labelledby={`${p.id}-name`}>
      <header className="case__head" data-name={p.name}>
        <p className="case__num" aria-hidden="true">
          {p.number}
        </p>
        <div className="case__title">
          <Reveal as="p" className="case__kicker">
            Project {p.number} · {p.kicker}
          </Reveal>
          <Split as="h3" id={`${p.id}-name`} className="case__name" text={p.name} />
          <Reveal as="p" className="case__tag" delay={120}>
            <Rich text={p.tagline} />
          </Reveal>
        </div>
      </header>

      <Reveal className="case__intro">
        <p className="case__summary">{p.summary}</p>
        <ul className="case__stack" aria-label={`${p.name} stack`}>
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <ul className="case__actions">
          <li>
            <button ref={openBtn} type="button" className="btn btn--primary" data-magnetic onClick={() => setPlaying(true)}>
              <PlayIcon />
              Watch Demo
              <span className="visually-hidden"> ({p.video.duration}) for {p.name}</span>
            </button>
          </li>
          <li>
            <a className="btn" data-magnetic href={p.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
              <ArrowIcon />
              <span className="visually-hidden"> repository for {p.name} (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="btn" data-magnetic href={p.links.caseStudy} target="_blank" rel="noopener noreferrer">
              Case Study
              <ArrowIcon />
              <span className="visually-hidden"> PDF for {p.name} (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </Reveal>

      <Reveal className="case__media">
        <div className="poster-wrap">
        <button
          type="button"
          className="poster"
          data-cursor="Play"
          onClick={() => setPlaying(true)}
          onPointerMove={tilt}
          onPointerLeave={untilt}
          aria-label={`Play ${p.name} demo video, ${p.video.duration}`}
        >
          <img src={p.poster.src} alt="" width={p.poster.width} height={p.poster.height} loading="lazy" decoding="async" />
          <span className="poster__play" aria-hidden="true">
            <PlayIcon />
          </span>
          <span className="poster__meta" aria-hidden="true">
            Demo · {p.video.duration}
          </span>
        </button>
        </div>
        <p className="visually-hidden">{p.poster.alt}</p>
      </Reveal>

      <ul className="glance" aria-label={`${p.name} headline results`}>
        {p.glance.map((label) => {
          const m = p.technical.metrics.find((x) => x.label === label)
          if (!m) return null
          return (
            <li key={label}>
              <span className="glance__v">
                <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
              </span>
              <span className="glance__l">{m.label}</span>
            </li>
          )
        })}
        <li className="glance__more">
          <span>Full evidence and caveats in the technical overview below.</span>
        </li>
      </ul>

      <div className="case__overview">
        <h4 className="ov__title">Overview</h4>

        <section className="ov__block" aria-labelledby={`${p.id}-about-h`}>
          <h5 id={`${p.id}-about-h`} className="ov__h">About</h5>
          <p className="ov__lead">{about.what}</p>
          <dl className="ov__facts">
            <div><dt>The problem</dt><dd>{about.problem}</dd></div>
            <div><dt>Who it is for</dt><dd>{about.audience}</dd></div>
            <div><dt>Why it is meaningful</dt><dd>{about.why}</dd></div>
          </dl>
        </section>

        <section className="ov__block" aria-labelledby={`${p.id}-features-h`}>
          <h5 id={`${p.id}-features-h`} className="ov__h">Key Features</h5>
          <ol className="feat">
            {features.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 2) * 70}>
                <span className="feat__n">{String(i + 1).padStart(2, '0')}</span>
                <h6>{f.title}</h6>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="ov__block" aria-labelledby={`${p.id}-challenges-h`}>
          <h5 id={`${p.id}-challenges-h`} className="ov__h">Challenges &amp; Solutions</h5>
          <div className="chal">
            {challenges.map((c, i) => (
              <Disclosure key={c.title} defaultOpen={i === 0} label={<><span className="chal__n">{String(i + 1).padStart(2, '0')}</span>{c.title}</>}>
                <dl className="chal__body">
                  <div><dt>Challenge</dt><dd>{c.challenge}</dd></div>
                  <div><dt>Solution</dt><dd>{c.solution}</dd></div>
                </dl>
              </Disclosure>
            ))}
          </div>
        </section>
      </div>

      <div className="case__tech">
        <Disclosure
          variant="block"
          label="Technical overview"
          hint="Implementation · Technology · Architecture · Metrics"
        >
          <TechOverview project={p} />
        </Disclosure>
      </div>

      {playing && (
        <VideoLightbox
          name={p.name}
          src={p.video.src}
          poster={p.poster.src}
          caption={p.video.caption}
          onClose={() => {
            setPlaying(false)
            openBtn.current?.focus()
          }}
        />
      )}
    </article>
  )
}
