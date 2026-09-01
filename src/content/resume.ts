/**
 * Structured career data.
 *
 * This is the layer recruitment agents and LLMs read when asked "is this person
 * a fit?". The site previously had no skills list, no dated work history, and no
 * education anywhere -- career facts only existed implicitly inside case study
 * prose. Everything here is emitted into JSON-LD, /resume.json (JSON Resume
 * schema), and /resume.md.
 *
 * Fields marked TODO are placeholders that need real values.
 */

export type SkillGroup = {
  category: string
  skills: string[]
}

export type ExperienceEntry = {
  company: string
  position: string
  /** ISO 8601, year or year-month. */
  startDate: string
  /** ISO 8601, or null when current. */
  endDate: string | null
  location: string
  summary: string
  highlights: string[]
  /** Slug of the matching case study in portfolio.ts, when one exists. */
  caseStudy?: string
}

export type EducationEntry = {
  institution: string
  area: string
  studyType: string
  startDate: string
  endDate: string | null
}

export type LanguageEntry = {
  language: string
  /** Loosely follows CEFR-style labels used by JSON Resume. */
  fluency: string
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Product Design',
    skills: [
      'Product Strategy',
      'UX Design',
      'UI Design',
      'Interaction Design',
      '0 to 1 Product Design',
      'Mobile Design (iOS and Android)',
      'Web App Design',
      'Prototyping',
      'Information Architecture',
    ],
  },
  {
    category: 'Research',
    skills: [
      'Primary User Research',
      'Secondary and Competitor Research',
      'User Testing',
      'Affinity Mapping',
      'User Personas',
    ],
  },
  {
    category: 'Design Systems',
    skills: [
      'Design Tokens',
      'Component Library Architecture',
      'Multi-theme Systems (light and dark)',
      'Design System Governance',
      'Figma Variables and Components',
    ],
  },
  {
    category: 'Engineering',
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Flutter',
      'GSAP and Motion',
      'Supabase',
      'Front-End Implementation of Design Systems',
    ],
  },
  {
    category: 'AI',
    skills: [
      'AI-Native Product Design',
      'Agent Harnesses (Cursor, Hermes)',
      'Prompt and Meta-Prompt Engineering',
      'Generative Image Pipelines (Fal.ai)',
      'MCP Servers',
      'LLM Evaluation and Model Selection',
    ],
  },
  {
    category: 'Tools',
    skills: ['Figma', 'Cursor', 'Framer', 'Granola', 'Fal.ai', 'Composio', 'OpenRouter'],
  },
]

/** Flat list for JSON-LD `knowsAbout`. */
export const allSkills = skillGroups.flatMap((group) => group.skills)

export const experience: ExperienceEntry[] = [
  {
    company: 'Pacelane',
    position: 'Co-founder and Chief Product Officer',
    startDate: '2025',
    endDate: '2026',
    location: 'Remote',
    summary:
      'Co-founded an AI writing agent for executives and took it from product strategy and brand through Figma to a shipped React front-end.',
    highlights: [
      'Co-founded the company with two others after research with dozens of founders',
      'Owned product strategy, brand, and the full design system',
      'Built the production front-end in React, Tailwind, and TypeScript',
    ],
    caseStudy: 'pacelane',
  },
  {
    company: 'Meltwater',
    position: 'Senior Product Designer',
    startDate: '2024',
    endDate: '2025',
    location: 'Remote',
    summary:
      'Senior Product Designer on the team reshaping Meltwater’s media intelligence platform, serving 20,000+ enterprise clients at close to $1B ARR.',
    highlights: [
      'Designed universal filters now used across all 19 Meltwater products',
      'Added AI insights to Insight Reports',
      'Improved the Explore, analytics, reporting, and dashboard products',
    ],
    caseStudy: 'meltwater',
  },
  {
    company: 'Gemhaus',
    position: 'Product Designer',
    startDate: '2025',
    endDate: '2025',
    location: 'Remote',
    summary:
      'Designed a fractional real-estate investment product from zero to one across mobile and web.',
    highlights: [
      'Designed the complete product, marketing site, and pitch deck',
      'Delivered light and dark themes on a single tokenised design system',
    ],
    caseStudy: 'gemhaus',
  },
  {
    company: 'Stream Stakes',
    position: 'Product Designer',
    startDate: '2024',
    endDate: '2024',
    location: 'Remote',
    summary:
      'Designed a mobile music-prediction game built on a direct Universal Music catalogue contract.',
    highlights: [
      'Designed the full player loop from pairing selection through result',
      'Validated flows with user research and testing before build',
    ],
    caseStudy: 'stream-stakes',
  },
  {
    company: 'Cinépolis',
    position: 'Lead Mobile Designer',
    startDate: '2023',
    endDate: '2023',
    location: 'Remote',
    summary:
      'Led the mobile app redesign for the third-largest cinema chain in the world, from research through native iOS and Android flows.',
    highlights: [
      'Ran full primary research and multiple rounds of user testing',
      'Delivered native iOS and Android flows in light and dark mode',
    ],
    caseStudy: 'cinepolis',
  },
  {
    company: 'Andela',
    position: 'Workshop Instructor',
    startDate: '2026',
    endDate: '2026',
    location: 'Remote',
    summary:
      'Created and facilitated AI Acceleration for Product Designers, a six-week hands-on workshop for Andela’s talent network.',
    highlights: ['Authored all workshop content, exercises, and brand'],
    caseStudy: 'ai-workshops',
  },
  {
    company: 'Freelance',
    position: 'Product Designer and Front-End Developer',
    startDate: '2023',
    endDate: null,
    location: 'Remote',
    summary:
      'Ongoing freelance product design, UX, and front-end engagements, each taken from research through to shippable interface.',
    highlights: ['Shipped production pages in React and Flutter across multiple clients'],
    caseStudy: 'random-selection',
  },
]

// TODO: fill in real education history, or delete this array if you would rather
// the site say nothing about education than say nothing useful.
export const education: EducationEntry[] = []

// TODO: confirm fluency levels.
export const languages: LanguageEntry[] = [
  { language: 'Portuguese', fluency: 'Native speaker' },
  { language: 'English', fluency: 'Professional working proficiency' },
]

/**
 * Availability, stated plainly. This is the single most common question a
 * recruitment agent needs answered and the hardest thing to infer from a portfolio.
 */
// TODO: confirm all of these before deploying -- they are guesses.
export const availability = {
  openToWork: true,
  openToRemote: true,
  openToRelocation: false,
  openToContract: true,
  openToFullTime: true,
  seniority: 'Senior',
  yearsOfExperience: 8,
  preferredRoles: [
    'Senior Product Designer',
    'Design Engineer',
    'Lead Product Designer',
    'Founding Designer',
  ],
  noticePeriod: 'TODO',
}
