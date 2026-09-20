import type { ReactNode } from 'react'
import { sectionById, sections } from '../content'
import { Split } from './Split'

interface SectionProps {
  id: string
  hideHead?: boolean
  children: ReactNode
}

export function Section({ id, hideHead, children }: SectionProps) {
  const meta = sectionById(id)
  const num = String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0')
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        {hideHead ? (
          <h2 id={`${id}-title`} className="visually-hidden">
            {meta.label}
          </h2>
        ) : (
          <header className="section__head">
            <span className="section__ghost" aria-hidden="true">
              {num}
            </span>
            <p className="section__label">
              <span className="section__num">{num}</span>
              {meta.label}
            </p>
            <Split as="h2" id={`${id}-title`} className="section__title" text={meta.heading} />
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
