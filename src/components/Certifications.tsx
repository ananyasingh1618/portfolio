import { certifications } from '../content'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Certifications() {
  return (
    <Section id="certifications">
      <ul className="certs">
        {certifications.map((c, i) => (
          <Reveal as="li" key={`${c.title}-${c.issued}`} className="certs__item" delay={i * 40}>
            <h3 className="certs__title">{c.title}</h3>
            <p className="certs__issuer">{c.issuer}</p>
            <p className="certs__date">{c.issued}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
