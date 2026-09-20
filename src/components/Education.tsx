import { education } from '../content'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Education() {
  const { university, school } = education
  return (
    <Section id="education">
      <Reveal as="article" className="card edu">
        <header className="edu__head">
          <div>
            <h3 className="edu__school">{university.institution}</h3>
            <p className="edu__cred">{university.credential}</p>
            <p className="dim">{university.location}</p>
          </div>
          <p className="edu__grad">
            Graduation
            <strong>{university.graduation}</strong>
          </p>
        </header>

        <h4 className="label edu__label">Relevant coursework</h4>
        <ul className="chips" aria-label="Relevant coursework">
          {university.coursework.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="ul" className="schools" delay={100}>
        {school.map((s) => (
          <li key={s.credential} className="schools__item">
            <div>
              <h3 className="schools__cred">{s.credential}</h3>
              <p className="dim">
                {s.institution}, {s.location}
              </p>
            </div>
            <p className="schools__score">{s.score}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}
