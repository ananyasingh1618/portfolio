import type { Profile } from './types'

export const profile: Profile = {
  name: 'Ananya Singh',
  firstName: 'Ananya',
  roleLine: 'AI / ML • Generative AI • Software Engineering',
  headline: [
    'I turn ideas into ',
    { em: 'intelligent solutions' },
    ', working at the intersection of ',
    { em: 'AI' },
    ', ',
    { em: 'language' },
    ', and software.',
  ],
  availability: 'Open to opportunities',
  facts: [
    { icon: 'cap', text: ['B.E. Computer Science student at ', { em: 'Thapar Institute of Engineering and Technology' }, ', Class of 2027'] },
    { icon: 'status', text: ['Open to opportunities'] },
  ],
  photoAlt: 'Ananya Singh smiling, resting her chin on her hand.',
  about: {
    lede: [
      'I’m a Computer Science undergraduate at Thapar Institute, drawn to the part of AI that deals with ',
      { em: 'language' },
      ': how models read it, generate it, and carry a ',
      { em: 'conversation' },
      '.',
    ],
    body: [
      'My footing is in machine learning and deep learning. On top of that I’ve worked hands-on with NLP, conversational AI and LLM-based applications, alongside a steady software-development practice.',
      'What keeps me interested is the practical side: taking that foundation and shaping it into intelligent systems that work from model to full-stack product.',
    ],
  },
  focusAreas: [
    'Machine Learning',
    'Natural Language Processing',
    'Conversational AI',
    'LLM applications',
    'Full-stack development',
  ],
  contact: {
    title: [{ em: 'Let’s talk' }, ' about building something useful.'],
    body: 'Whether it’s an internship, a role, or a conversation about AI and software, I’d be glad to hear from you.',
  },
  links: {
    email: { label: 'Email', href: 'mailto:ananyasingh1852004@gmail.com', detail: 'ananyasingh1852004@gmail.com' },
    linkedin: {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/ananya-singh-659170296/',
      detail: 'Background, experience and updates',
    },
    github: { label: 'GitHub', href: 'https://github.com/ananyasingh1618', detail: '@ananyasingh1618 · code and work in progress' },
  },
}

export const emailAddress = profile.links.email.href.replace('mailto:', '')
