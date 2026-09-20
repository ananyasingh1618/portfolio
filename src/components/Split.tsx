import type { ElementType } from 'react'
import type { RichText } from '../content'
import { useReveal } from '../hooks/useReveal'
import { cssVars } from '../utils/style'

interface SplitProps {
  text: RichText | string
  as?: ElementType
  className?: string
  id?: string
  /** Delay before the first word, in ms. */
  base?: number
}

/**
 * Masked word-by-word reveal. Each word rises out of its own clipping mask
 * when the heading scrolls into view. Words stay real text for assistive tech.
 */
export function Split({ text, as: Tag = 'span', className = '', id, base = 0 }: SplitProps) {
  const ref = useReveal<HTMLElement>()
  const parts: RichText = typeof text === 'string' ? [text] : text
  let n = 0
  const nodes = parts.flatMap((part, pi) => {
    const isEm = typeof part !== 'string'
    const str = isEm ? part.em : part
    return str.split(/(\s+)/).map((tok, ti) => {
      if (tok === '') return null
      if (/^\s+$/.test(tok)) return ' '
      const i = n++
      return (
        <span key={`${pi}-${ti}`} className="w">
          <span className={isEm ? 'w__i accent' : 'w__i'} style={cssVars({ '--i': i })}>
            {tok}
          </span>
        </span>
      )
    })
  })
  return (
    <Tag ref={ref} id={id} className={`split ${className}`.trim()} style={cssVars({ '--base': `${base}ms` })}>
      {nodes}
    </Tag>
  )
}
