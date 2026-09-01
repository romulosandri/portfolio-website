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
  /** ISO 8601, year or year-month. Omit when unpublished. */
  startDate?: string
  /** ISO 8601, or null when current. Omit when the completed year is unpublished. */
  endDate?: string | null
}

export type CertificateEntry = {
  name: string
  issuer: string
  /** ISO 8601. Omit when unpublished. */
  date?: string
  url?: string
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
      'Native iOS and Android Design',
      'Web App Design',
      'Responsive Web Design',
      'Consumer App Design',
      'Enterprise SaaS Design',
      'Prototyping',
      'Wireframing',
      'User Flows',
      'Information Architecture',
      'Journey Mapping',
      'Visual Design',
      'Brand Design',
      'Marketing Site and Landing Page Design',
      'Pitch Deck Design',
      'Data Visualization',
      'Design QA',
    ],
  },
  {
    category: 'Motion Design',
    skills: [
      'Motion Design for Websites',
      'Motion Design for Mobile',
      'Micro-interactions',
      'Scroll-driven Animation',
      'Page Transitions',
      'Interaction Animation',
      'GSAP Animation',
    ],
  },
  {
    category: 'Research',
    skills: [
      'Primary User Research',
      'Secondary and Competitor Research',
      'User Testing',
      'Usability Testing',
      'Affinity Mapping',
      'User Personas',
      'Research Synthesis',
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
      'Front-End Implementation of Design Systems',
    ],
  },
  {
    category: 'Engineering',
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'GSAP',
      'Lenis',
      'Motion',
      'Flutter',
      'Supabase',
      'Netlify',
      'HTML and CSS',
      'Phaser',
    ],
  },
  {
    category: 'AI',
    skills: [
      'AI-Native Product Design',
      'AI Product Features',
      'Agent Harnesses (Cursor, Hermes, Manus)',
      'Prompt and Meta-Prompt Engineering',
      'Generative Image, Video, and 3D Pipelines (Fal.ai)',
      'MCP Servers and Integrations',
      'Figma MCP',
      'LLM Evaluation and Model Selection',
      'Model Routing (OpenRouter)',
      'AI-Assisted User Research',
      'Web Data Extraction (Firecrawl)',
      'AI Search and Research (Tavily)',
      'Automated Content Pipelines',
    ],
  },
  {
    category: 'Leadership and Teaching',
    skills: [
      'Managing Junior Designers',
      'Mentoring Designers',
      'Workshop Instruction',
      'Workshop Facilitation',
      'Curriculum Design',
      'Teaching AI for Product Design',
      'Public Speaking',
      'Design Critiques',
    ],
  },
  {
    category: 'Tools',
    skills: [
      'Figma',
      'Cursor',
      'Hermes Agent',
      'Framer',
      'Granola',
      'Fal.ai',
      'Composio',
      'OpenRouter',
      'ChatGPT',
      'Firecrawl',
      'Tavily',
      'Agent Mail',
      'Zernio',
      'Manus',
      'Claude',
    ],
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
    company: 'Fotospin',
    position: 'Founder',
    startDate: '2025',
    endDate: null,
    location: 'Remote',
    summary:
      'Founded an AI headshot app that turns a selfie into professional photos, reaching 7,000 downloads and $2,000 in revenue in 6 months.',
    highlights: [
      'Reached 7,000 downloads and $2,000 in revenue in 6 months',
      'Shipped as a solo founder: brand, Flutter on iOS and Android, Supabase and Fal.ai',
    ],
    caseStudy: 'fotospin',
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

export const education: EducationEntry[] = [
  {
    institution: 'University of California San Diego',
    area: 'Interaction Design',
    studyType: 'Professional Certificate',
    endDate: null,
  },
]

export const certificates: CertificateEntry[] = [
  {
    name: 'Google UX Design Professional Certificate',
    issuer: 'Google',
  },
  {
    name: 'Multiple course certificates',
    issuer: 'Interaction Design Foundation',
  },
]

export const languages: LanguageEntry[] = [
  { language: 'Portuguese', fluency: 'Native speaker' },
  { language: 'English', fluency: 'Fluent' },
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
    'Product Designer',
    'Design Engineer',
    'Lead Product Designer',
    'Founding Designer',
  ],
  noticePeriod: 'Immediate — can start right away',
}
