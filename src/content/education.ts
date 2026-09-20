import type { Education } from './types'

export const education: Education = {
  university: {
    institution: 'Thapar Institute of Engineering and Technology',
    location: 'Patiala',
    credential: 'Bachelor of Engineering (B.E.), Computer Science Engineering',
    graduation: '2027',
    coursework: [
      'Data Structures and Algorithms',
      'Design and Analysis of Algorithms',
      'Object Oriented Programming',
      'Database Management Systems',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
      'Machine Learning',
      'Artificial Intelligence',
      'Natural Language Processing',
      'Speech Processing',
      'Generative AI',
      'Compiler Construction',
    ],
  },
  school: [
    {
      institution: 'St. Luke’s Sen. Sec. School',
      location: 'Solan, Himachal Pradesh',
      credential: 'Class 12 · CBSE Board',
      score: '90.8%',
    },
    {
      institution: 'St. Luke’s Sen. Sec. School',
      location: 'Solan, Himachal Pradesh',
      credential: 'Class 10 · CBSE Board',
      score: '96.33%',
    },
  ],
}
