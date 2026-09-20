import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  decimals?: number
  suffix?: string
  duration?: number
}

const format = (v: number, d: number) => v.toFixed(d)

/** Counts from 0 to `value` once, the first time it is visible. Announces only the final figure. */
export function CountUp({ value, decimals = 0, suffix = '', duration = 1500 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(reduce ? value : 0)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce || typeof IntersectionObserver === 'undefined') {
      setShown(value)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setShown(value * (1 - Math.pow(1 - t, 3)))
          if (t < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration, reduce])

  return (
    <span ref={ref} className="count">
      <span className="visually-hidden">
        {format(value, decimals)}
        {suffix}
      </span>
      <span aria-hidden="true">
        {format(shown, decimals)}
        <span className="count__suffix">{suffix}</span>
      </span>
    </span>
  )
}
