import { useState, type ReactNode } from 'react'
import { emailAddress, profile } from '../content'
import type { ExternalLink } from '../content'
import { ArrowIcon, CodeIcon, LinkedInIcon, MailIcon } from './Icons'
import { Reveal } from './Reveal'
import { Rich } from './Rich'
import { Section } from './Section'

function Row({ link, icon, external }: { link: ExternalLink; icon: ReactNode; external?: boolean }) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <li>
      <a className="crow" href={link.href} {...ext}>
        <span className="crow__icon">{icon}</span>
        <span className="crow__text">
          <span className="crow__title">{link.label}</span>
          <span className="crow__detail">{link.detail}</span>
        </span>
        <ArrowIcon />
        {external && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    </li>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const { linkedin, github, email } = profile.links

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  }

  return (
    <Section id="contact" hideHead>
      <svg className="contact__rings" viewBox="0 0 800 800" aria-hidden="true" focusable="false">
        <circle cx="400" cy="400" r="392" className="ring ring--a" />
        <circle cx="400" cy="400" r="300" className="ring ring--b" />
        <circle cx="400" cy="400" r="208" className="ring ring--c" />
        <circle cx="400" cy="8" r="4" className="ring__dot" />
      </svg>
      <Reveal className="contact">
        <p className="contact__title">
          <Rich text={profile.contact.title} />
        </p>
        <p className="prose contact__body">{profile.contact.body}</p>
        <ul className="contact__list">
          <Row link={email} icon={<MailIcon />} />
          <Row link={linkedin} icon={<LinkedInIcon />} external />
          <Row link={github} icon={<CodeIcon />} external />
        </ul>
        <a className="contact__mail" href={email.href} data-cursor="Write">
          {emailAddress}
        </a>
        <div className="contact__row">
          <button type="button" className="btn" data-magnetic onClick={copy}>
            Copy email address
          </button>
          <output className="contact__status" aria-live="polite">
            {copied ? 'Copied to clipboard' : ''}
          </output>
        </div>
      </Reveal>
    </Section>
  )
}
