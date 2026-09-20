import { skills } from '../content'
import { useInView } from '../hooks/useInView'
import { Reveal } from './Reveal'
import { Section } from './Section'

const unique = Array.from(new Set(skills.flatMap((g) => g.items)))

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const [ref, live] = useInView<HTMLDivElement>('0px')
  return (
    <div ref={ref} className={`marquee${reverse ? ' marquee--rev' : ''}${live ? ' is-live' : ''}`} aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <ul key={k} className="marquee__set">
            {items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const half = Math.ceil(unique.length / 2)
  return (
    <Section id="skills">
      <ol className="skills">
        {skills.map((group, i) => (
          <Reveal as="li" key={group.category} className="skills__row" delay={i * 40}>
            <span className="skills__n" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="skills__cat">{group.category}</h3>
            <ul className="skills__items">
              {group.items.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
      <div className="marquees">
        <Marquee items={unique.slice(0, half)} />
        <Marquee items={unique.slice(half)} reverse />
      </div>
    </Section>
  )
}
