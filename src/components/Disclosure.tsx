import { useId, useState, type ReactNode } from 'react'

interface DisclosureProps {
  label: ReactNode
  hint?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  variant?: 'row' | 'block'
  onToggle?: (open: boolean) => void
}

/** Accessible expand/collapse with a smooth height transition (grid 0fr to 1fr). */
export function Disclosure({ label, hint, children, defaultOpen = false, className = '', variant = 'row', onToggle }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={`dc dc--${variant} ${className}`.trim()} data-open={open}>
      <button
        type="button"
        className="dc__btn"
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => {
          setOpen(!open)
          onToggle?.(!open)
        }}
      >
        <span className="dc__label">{label}</span>
        {hint && <span className="dc__hint">{hint}</span>}
        <span className="dc__icon" aria-hidden="true" />
      </button>
      <section id={`${id}-panel`} aria-labelledby={`${id}-btn`} className="dc__panel" inert={!open}>
        <div className="dc__inner">{children}</div>
      </section>
    </div>
  )
}
