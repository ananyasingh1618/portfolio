import type { RichText } from '../content'

/** Renders text where `{ em }` segments become italic serif accent words. */
export function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, i) =>
        typeof part === 'string' ? <span key={i}>{part}</span> : <em key={i} className="accent">{part.em}</em>,
      )}
    </>
  )
}
