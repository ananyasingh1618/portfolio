export interface ExternalLink {
  label: string
  href: string
  /** Short supporting line shown in the contact list. */
  detail?: string
}

/** Text with emphasised (italic accent) words: plain strings and `{ em }` segments. */
export type RichText = Array<string | { em: string }>

export type FactIcon = 'cap' | 'status'

export interface Fact {
  icon: FactIcon
  text: RichText
}

export interface Profile {
  name: string
  firstName: string
  roleLine: string
  headline: RichText
  facts: Fact[]
  availability: string
  photoAlt: string
  about: { lede: RichText; body: string[] }
  focusAreas: string[]
  contact: { title: RichText; body: string }
  links: {
    email: ExternalLink
    linkedin: ExternalLink
    github: ExternalLink
  }
}

export interface Experience {
  role: string
  organization: string
  location: string
  period: string
  project: string
  highlights: string[]
  methods: string[]
}

export interface Institution {
  institution: string
  location: string
  credential: string
}

export interface Education {
  university: Institution & { graduation: string; coursework: string[] }
  school: Array<Institution & { score: string }>
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Certification {
  title: string
  issuer: string
  issued: string
}

export interface Leadership {
  role: string
  organization: string
  institution: string
  description: string
}

export interface Metric {
  /** Numeric part animated on scroll. */
  value: number
  decimals?: number
  /** Text after the number, e.g. "%" or "/109". */
  suffix?: string
  label: string
  /** What the number is (the result, in words). */
  result: string
  /** What it demonstrates, including honest scope. */
  demonstrates: string
}

export interface ArchLayer {
  name: string
  nodes: Array<{ label: string; detail: string }>
}

export interface Architecture {
  layers: ArchLayer[]
  flowTitle: string
  flow: Array<{ label: string; detail: string }>
  note: string
}

export interface TechGroup {
  group: string
  items: Array<{ name: string; why?: string }>
}

export interface Project {
  id: string
  number: string
  name: string
  kicker: string
  tagline: RichText
  summary: string
  /** Pastel accent for this project (kept subtle). */
  accent: string
  poster: { src: string; alt: string; width: number; height: number }
  video: { src: string; duration: string; caption: string }
  links: { github: string; caseStudy: string }
  stack: string[]
  /** Labels of the metrics surfaced above the fold. */
  glance: string[]
  overview: {
    about: { what: string; problem: string; audience: string; why: string }
    features: Array<{ title: string; text: string }>
    challenges: Array<{ title: string; challenge: string; solution: string }>
  }
  technical: {
    implementation: Array<{ title: string; text: string }>
    choices: TechGroup[]
    architecture: Architecture
    metrics: Metric[]
    metricsNote: string
  }
}
