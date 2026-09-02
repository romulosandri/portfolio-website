/**
 * Structured career data.
 *
 * This is the layer recruitment agents and LLMs read when asked "is this person
 * a fit?". The site previously had no skills list, no dated work history, and no
 * education anywhere -- career facts only existed implicitly inside case study
 * prose. Everything here is emitted into JSON-LD, /resume.json (JSON Resume
 * schema), and /resume.md.
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
  /**
   * Slugs of the case studies in portfolio.ts produced during this role.
   * Several entries cover more than one: Cinépolis was client work done at
   * WANDR, and Gemhaus and Stream Stakes were both freelance clients.
   */
  caseStudies?: string[]
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

/**
 * Employment history, reverse-chronological. This is the timeline, not the
 * project list: client work sits under the employer it was delivered through,
 * so Cinépolis appears under WANDR and Gemhaus and Stream Stakes under
 * Freelance. The case studies themselves live in portfolio.ts.
 */
export const experience: ExperienceEntry[] = [
  {
    company: 'Bunnyhop',
    position: 'Founder',
    startDate: '2026',
    endDate: null,
    location: 'Remote',
    summary:
      'Building Bunnyhop, an in-progress web design system with thousands of components, 300 colour palettes, hundreds of motion-ready sections, and an MCP server for designers.',
    highlights: [
      'Designing and implementing a large web design system in Figma and React',
      'Library of 300 colour palettes and hundreds of motion-ready website sections',
      'MCP server and CMS back-end in progress',
    ],
    caseStudies: ['bunnyhop'],
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
    caseStudies: ['ai-workshops'],
  },
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
    caseStudies: ['pacelane'],
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
    caseStudies: ['fotospin'],
  },
  {
    company: 'Meltwater',
    position: 'Senior Product Designer',
    startDate: '2024',
    endDate: '2025',
    location: 'Remote',
    summary:
      'Senior Product Designer on the team reshaping Meltwater’s media intelligence platform, serving 20,000+ enterprise clients at close to $1B ARR. Held as a long-term contract through Andela, not as a separate concurrent role.',
    highlights: [
      'Designed universal filters now used across all 19 Meltwater products',
      'Added AI insights to Insight Reports',
      'Improved the Explore, analytics, reporting, and dashboard products',
      'Worked daily with data scientists, engineers, and product managers on data-heavy products',
    ],
    caseStudies: ['meltwater'],
  },
  {
    company: 'Spiiine',
    position: 'Founder',
    startDate: '2024',
    endDate: '2024',
    location: 'Remote',
    summary:
      'Founded and shipped Spiiine to the App Store, an iOS app that aggregates brand collaboration opportunities for UGC creators into a single feed.',
    highlights: [
      'Shipped to the App Store as a solo founder',
      'Built brand, product, Flutter iOS app, and a Supabase back-end',
      'Designed the marketing site in Framer',
    ],
    caseStudies: ['spiiine'],
  },
  {
    company: 'Andela',
    position: 'Senior Product Designer (Freelance)',
    startDate: '2023',
    endDate: '2025',
    location: 'Remote',
    summary:
      'Senior Product Designer through Andela’s global talent network. The long-running engagement was Meltwater, where he worked as a contractor from 2024 to 2025.',
    highlights: ['Placed with Meltwater as a long-term contractor'],
  },
  {
    company: 'Freelance',
    position: 'Product Designer and Front-End Developer',
    startDate: '2023',
    endDate: null,
    location: 'Remote',
    summary:
      'Ongoing freelance product design, UX, and front-end engagements, each taken from research through to shippable interface. Clients include Gemhaus and Stream Stakes.',
    highlights: [
      'Shipped production pages in React and Flutter across multiple clients',
      'Designed Gemhaus, a fractional real-estate investment product, from zero to one across mobile and web',
      'Designed Stream Stakes, a mobile music-prediction game built on a direct Universal Music catalogue contract',
    ],
    caseStudies: ['gemhaus', 'stream-stakes', 'random-selection'],
  },
  {
    company: 'WANDR',
    position: 'Product Designer',
    startDate: '2022',
    endDate: '2023',
    location: 'Remote — Los Angeles, United States',
    summary:
      'Product Designer at WANDR, a Los Angeles based UX agency, running several client projects at the same time.',
    highlights: [
      'Led the Cinépolis mobile app redesign for the third-largest cinema chain in the world',
      'Created the programme used to train junior designers joining the company',
    ],
    caseStudies: ['cinepolis'],
  },
  {
    company: 'Chefie',
    position: 'UI/UX Designer',
    startDate: '2021',
    endDate: '2022',
    location: 'Brazil',
    summary: 'UI and UX design at Chefie.',
    highlights: [],
  },
  {
    company: 'Justos',
    position: 'Visual Designer',
    startDate: '2021',
    endDate: '2022',
    location: 'Brazil',
    summary: 'Visual design at Justos.',
    highlights: [],
  },
  {
    company: 'Oly',
    position: 'Founder',
    startDate: '2020',
    endDate: '2022',
    location: 'Brazil',
    summary: 'Founded Oly, an early-stage startup.',
    highlights: [],
  },
  {
    company: 'Traktor',
    position: 'Web Designer and Graphic Designer',
    startDate: '2020',
    endDate: '2021',
    location: 'Brazil',
    summary: 'Web and graphic design at Traktor.',
    highlights: [],
  },
  {
    company: 'Marvem Supermercado',
    position: 'Visual Designer',
    startDate: '2018',
    endDate: '2020',
    location: 'Brazil',
    summary: 'Visual design at Marvem Supermercado.',
    highlights: [],
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

/** Confirmed 2 Sep 2026. Spanish not listed. Ships in `/resume.json` and JSON-LD `knowsLanguage`. */
export const languages: LanguageEntry[] = [
  { language: 'Portuguese', fluency: 'Native speaker' },
  { language: 'English', fluency: 'Fluent' },
]

/**
 * Availability, stated plainly. This is the single most common question a
 * recruitment agent needs answered and the hardest thing to infer from a portfolio.
 * Confirmed 2 Sep 2026. Ships in `/resume.json` under `meta.availability`.
 */
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
