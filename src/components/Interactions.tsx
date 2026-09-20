import { useEffect, useRef } from 'react'

const fine = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/**
 * Pointer refinements, active only for mouse/trackpad users who have not asked
 * for reduced motion: a soft trailing ring that grows over interactive
 * elements (and can carry a label), and magnetic pull on [data-magnetic].
 * Everything is transform-only and idle when the pointer is still.
 */
export function Interactions() {
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el || !window.matchMedia(fine).matches) return
    document.documentElement.classList.add('has-cursor')
    let tx = -100, ty = -100, x = -100, y = -100, raf = 0
    let magnet: HTMLElement | null = null

    const tick = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const setState = (target: Element | null) => {
      const cursorEl = target?.closest<HTMLElement>('[data-cursor]')
      const interactive = target?.closest('a, button, summary, [role="button"], input, [data-cursor]')
      el.classList.toggle('is-active', Boolean(interactive))
      el.classList.toggle('has-label', Boolean(cursorEl?.dataset.cursor))
      if (label.current) label.current.textContent = cursorEl?.dataset.cursor ?? ''
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX
      ty = e.clientY
      el.classList.add('is-on')
      if (!raf) raf = requestAnimationFrame(tick)
      const target = e.target as Element | null
      setState(target)

      const m = target?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (magnet && magnet !== m) magnet.style.translate = ''
      magnet = m
      if (m) {
        const r = m.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.28
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28
        m.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`
      }
    }
    const onLeave = () => {
      el.classList.remove('is-on')
      if (magnet) magnet.style.translate = ''
      magnet = null
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label" />
    </div>
  )
}
