import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile, sections } from '../content'
import { useActiveSection } from '../hooks/useActiveSection'
import { cssVars } from '../utils/style'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sections.map((s) => s.id))
  const listRef = useRef<HTMLUListElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sliding indicator under the active link.
  useLayoutEffect(() => {
    const ul = listRef.current
    if (!ul) return
    const place = () => {
      const a = ul.querySelector<HTMLElement>('a[aria-current="true"]')
      if (!a) {
        ul.style.setProperty('--ind-o', '0')
        return
      }
      ul.style.setProperty('--ind-x', `${a.offsetLeft}px`)
      ul.style.setProperty('--ind-w', `${a.offsetWidth}px`)
      ul.style.setProperty('--ind-o', '1')
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  // Mobile menu: Escape closes, scroll locked, focus moves in and returns.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav${scrolled || open ? ' nav--solid' : ''}${open ? ' nav--open' : ''}`}>
      <div className="container nav__bar">
        <a className="nav__brand" href="#top" onClick={close} aria-label={`${profile.name}, back to top`}>
          {profile.firstName}
          <span className="nav__dot" aria-hidden="true" />
        </a>

        <nav className="nav__desktop" aria-label="Primary">
          <ul ref={listRef}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
            <li className="nav__indicator" aria-hidden="true" />
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-text">{open ? 'Close' : 'Menu'}</span>
          <span className="nav__toggle-lines" aria-hidden="true" />
        </button>
      </div>

      <nav ref={menuRef} id="mobile-menu" className="nav__mobile" aria-label="Primary mobile" aria-hidden={!open} inert={!open}>
        <ul className="container">
          {sections.map((s, i) => (
            <li key={s.id} style={cssVars({ '--i': i })}>
              <a href={`#${s.id}`} onClick={close} aria-current={active === s.id ? 'true' : undefined}>
                <span className="nav__num">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
