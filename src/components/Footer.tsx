import { profile } from '../content'

export function Footer() {
  const { linkedin, github, email } = profile.links
  return (
    <footer className="footer">
      <p className="footer__mark" aria-hidden="true">
        Ananya Singh
      </p>
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul>
          <li>
            <a href={linkedin.href} target="_blank" rel="noopener noreferrer">
              {linkedin.label}
            </a>
          </li>
          <li>
            <a href={github.href} target="_blank" rel="noopener noreferrer">
              {github.label}
            </a>
          </li>
          <li>
            <a href={email.href}>{email.label}</a>
          </li>
        </ul>
        <a className="footer__top" href="#top">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
