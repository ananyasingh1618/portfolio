import { useEffect, useRef, useState } from 'react'
import type { Project } from '../content'
import { Architecture } from './Architecture'
import { Metrics } from './Metrics'

const tabs = [
  { id: 'implementation', label: 'Implementation' },
  { id: 'technology', label: 'Technology' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'metrics', label: 'Metrics' },
] as const

export function TechOverview({ project }: { project: Project }) {
  const t = project.technical
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(tabs[0].id)

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id.replace(`${project.id}-`, ''))
      },
      { rootMargin: '-25% 0px -60% 0px' },
    )
    tabs.forEach((tab) => {
      const s = document.getElementById(`${project.id}-${tab.id}`)
      if (s) io.observe(s)
    })
    return () => io.disconnect()
  }, [project.id])

  return (
    <div ref={root} className="tech">
      <nav className="tech__nav" aria-label={`${project.name} technical sections`}>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id}>
              <a
                href={`#${project.id}-${tab.id}`}
                aria-current={active === tab.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`${project.id}-${tab.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActive(tab.id)
                }}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id={`${project.id}-implementation`} className="tech__block" aria-labelledby={`${project.id}-implementation-h`}>
        <h4 id={`${project.id}-implementation-h`} className="tech__h">Implementation</h4>
        <ol className="impl">
          {t.implementation.map((it, i) => (
            <li key={it.title}>
              <span className="impl__n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h5>{it.title}</h5>
                <p>{it.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id={`${project.id}-technology`} className="tech__block" aria-labelledby={`${project.id}-technology-h`}>
        <h4 id={`${project.id}-technology-h`} className="tech__h">Technology choices</h4>
        <dl className="choices">
          {t.choices.map((g) => (
            <div key={g.group} className="choices__group">
              <dt>{g.group}</dt>
              <dd>
                <ul>
                  {g.items.map((it) => (
                    <li key={it.name}>
                      <strong>{it.name}</strong>
                      {it.why && <span>{it.why}</span>}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id={`${project.id}-architecture`} className="tech__block" aria-labelledby={`${project.id}-architecture-h`}>
        <h4 id={`${project.id}-architecture-h`} className="tech__h">Architecture</h4>
        <Architecture data={t.architecture} name={project.name} />
      </section>

      <section id={`${project.id}-metrics`} className="tech__block" aria-labelledby={`${project.id}-metrics-h`}>
        <h4 id={`${project.id}-metrics-h`} className="tech__h">Metrics</h4>
        <Metrics metrics={t.metrics} note={t.metricsNote} />
      </section>
    </div>
  )
}
