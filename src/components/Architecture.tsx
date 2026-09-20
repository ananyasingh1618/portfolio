import { useId, useState } from 'react'
import type { Architecture as Arch } from '../content'
import { useInView } from '../hooks/useInView'
import { cssVars } from '../utils/style'

/**
 * System diagram: layered components joined by animated dashed connectors,
 * plus a data-flow strip whose steps light up in sequence. The animation only
 * runs while the diagram is on screen. Node detail appears on hover or focus.
 */
export function Architecture({ data, name }: { data: Arch; name: string }) {
  const [ref, live] = useInView<HTMLDivElement>('0px')
  const [detail, setDetail] = useState<{ label: string; text: string } | null>(null)
  const steps = data.flow.length
  const detailId = useId()

  return (
    <div ref={ref} className={`arch${live ? ' is-live' : ''}`}>
      <figure className="arch__layers" aria-label={`${name} system architecture`}>
        {data.layers.map((layer, li) => (
          <div key={layer.name} className="arch__layer" style={cssVars({ '--li': li })}>
            <p className="arch__name">{layer.name}</p>
            <div className="arch__body">
              <ul className="arch__nodes">
                {layer.nodes.map((n) => (
                  <li key={n.label}>
                    <button
                      type="button"
                      className="arch__node"
                      aria-describedby={detailId}
                      onMouseEnter={() => setDetail({ label: n.label, text: n.detail })}
                      onFocus={() => setDetail({ label: n.label, text: n.detail })}
                      onClick={() => setDetail({ label: n.label, text: n.detail })}
                    >
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
              {li < data.layers.length - 1 && <span className="arch__wire" aria-hidden="true" />}
            </div>
          </div>
        ))}
      </figure>

      <p id={detailId} className="arch__detail" aria-live="polite">
        {detail ? (
          <>
            <strong>{detail.label}.</strong> {detail.text}
          </>
        ) : (
          data.note
        )}
      </p>

      <h5 className="arch__flow-title">{data.flowTitle}</h5>
      <ol className="flow" style={cssVars({ '--n': steps })}>
        {data.flow.map((s, i) => (
          <li key={s.label} className="flow__step" style={cssVars({ '--i': i })}>
            <span className="flow__dot" aria-hidden="true" />
            <span className="flow__label">{s.label}</span>
            <span className="flow__detail">{s.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
