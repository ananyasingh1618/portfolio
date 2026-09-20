import type { RichText } from './types'

export interface SectionMeta {
  id: string
  /** Short name used in navigation and as the small label above each heading. */
  label: string
  heading: RichText
}

/** Order here drives both the navigation and (via App.tsx) the page. */
export const sections: SectionMeta[] = [
  { id: 'about', label: 'About', heading: ['Curious about how machines ', { em: 'use language' }, '.'] },
  { id: 'skills', label: 'Skills', heading: ['What I ', { em: 'work with' }, '.'] },
  { id: 'projects', label: 'Projects', heading: ['Selected ', { em: 'work' }, '.'] },
  { id: 'experience', label: 'Experience', heading: ['Hands-on, in a ', { em: 'research' }, ' setting.'] },
  { id: 'education', label: 'Education', heading: ['Where I’m ', { em: 'learning' }, '.'] },
  { id: 'certifications', label: 'Certificates', heading: ['Courses I’ve ', { em: 'completed' }, '.'] },
  { id: 'leadership', label: 'Leadership', heading: ['Beyond the ', { em: 'classroom' }, '.'] },
  { id: 'contact', label: 'Contact', heading: ['Get in touch.'] },
]

export const sectionById = (id: string): SectionMeta => {
  const found = sections.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown section: ${id}`)
  return found
}
