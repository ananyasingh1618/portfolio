import { experience } from '../content'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience">
      <ol className="timeline">
        {experience.map((item) => (
          <Reveal as="li" key={`${item.organization}-${item.period}`} className="timeline__item">
            <article className="card exp">
              <header className="exp__head">
                <div>
                  <h3 className="exp__role">{item.role}</h3>
                  <p className="exp__org">
                    {item.organization} <span className="dim">· {item.location}</span>
                  </p>
                </div>
                <p className="exp__period">{item.period}</p>
              </header>

              <p className="exp__project">
                <span className="label">Project</span>
                {item.project}
              </p>

              <ul className="exp__list">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <ul className="chips chips--quiet" aria-label="Models used">
                {item.methods.map((m) => (
                  <li key={m} className="chip">
                    {m}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
