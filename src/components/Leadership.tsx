import { leadership } from '../content'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Leadership() {
  return (
    <Section id="leadership">
      <Reveal as="article" className="card lead">
        <h3 className="lead__role">
          {leadership.role}
          <span className="lead__org">, {leadership.organization}</span>
        </h3>
        <p className="dim">{leadership.institution}</p>
        <p className="prose lead__text">{leadership.description}</p>
      </Reveal>
    </Section>
  )
}
