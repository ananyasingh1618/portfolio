import type { Metric } from '../content'
import { CountUp } from './CountUp'

export function Metrics({ metrics, note }: { metrics: Metric[]; note: string }) {
  return (
    <div>
      <ul className="metrics">
        {metrics.map((m) => (
          <li key={m.label} className="metric">
            <p className="metric__label">{m.label}</p>
            <p className="metric__value">
              <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
            </p>
            <p className="metric__result">{m.result}</p>
            <p className="metric__demo">
              <span>Shows</span> {m.demonstrates}
            </p>
          </li>
        ))}
      </ul>
      <p className="tech__note">{note}</p>
    </div>
  )
}
