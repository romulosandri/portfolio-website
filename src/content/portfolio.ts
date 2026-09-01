import type { AppLogoName } from '../design-system/AppLogo'

export type WorkItem = {
  slug: string
  title: string
  year: string
  cover: string
  images: string[]
  href: string
  client: string
  role: string
  duration: string
  description: string
  delivered: string[]
}

function workImages(slug: string, count: number) {
  const cover = `/images/work/${slug}/avif/${slug}-cover.avif`
  const rest = Array.from({ length: count }, (_, i) => `/images/work/${slug}/avif/${slug}-${i + 1}.avif`)
  return [cover, ...rest]
}

export const workItems: WorkItem[] = [
  {
    slug: 'pacelane',
    title: 'Pacelane.ai',
    year: '2025-2026',
    cover: '/images/work/pacelane/avif/pacelane-cover.avif',
    images: workImages('pacelane', 40),
    href: '/work/pacelane',
    client: 'Pacelane',
    role: 'Co-founder (CPO), Product and Brand Designer',
    duration: '12 Months',
    description:
      'Pacelane is an AI writing agent for executives who need LinkedIn to sound like them, not like a model. You point it at a meeting, a PDF, a URL, or the week’s news, and it drafts a post they can actually publish. I co-founded the company with two others after research with dozens of founders about content creation, then took the product from strategy and brand through Figma and the React front-end.',
    delivered: [
      'Product strategy',
      'Primary research',
      'Secondary research',
      'User testing',
      'High-fidelity screens in Figma for the full user flow',
      'Full design system in Figma and in the front-end',
      'Full front-end in React, Tailwind, and TypeScript',
    ],
  },
  {
    slug: 'gemhaus',
    title: 'Gemhaus',
    year: '2025',
    cover: '/images/work/gemhaus/avif/gemhaus-cover.avif',
    images: workImages('gemhaus', 35),
    href: '/work/gemhaus',
    client: 'Gemhaus',
    role: 'Product Designer',
    duration: '3 Months',
    description:
      'Gemhaus wants to make investing in real estate as easy and straightforward as investing in stocks. With their app, users can buy parts of a home and receive a proportional share of the rent each month based on their investment. They can track portfolio performance, expenses, and earnings. I designed the whole product from 0 to 1, from buying a slice of a home through to seeing rent land in the portfolio.',
    delivered: [
      'Secondary research and competitor research',
      'High-fidelity screens for mobile and web in light and dark mode',
      'Website and waitlist landing page',
      'Full design system with tokens and components',
      'Marketing material and pitch deck',
      'Figma prototypes of the full product',
    ],
  },
  {
    slug: 'meltwater',
    title: 'Meltwater',
    year: '2024-2025',
    cover: '/images/work/meltwater/avif/meltwater-cover.avif',
    images: workImages('meltwater', 42),
    href: '/work/meltwater',
    client: 'Meltwater',
    role: 'Senior Product Designer',
    duration: '13 Months',
    description:
      'Meltwater is how PR teams at Microsoft, Pepsi, Tesla, and Rivian watch what the world is saying about them. Close to $1B ARR, more than 20,000 clients: they search coverage, filter the noise, build dashboards, and turn it into reports. I was a Senior Product Designer on the team that reshaped those products, adding AI insights to an existing platform, and designing the universal filters now used across all 19 of their products.',
    delivered: [
      'Improvements to the Explore product',
      'Improvements to analytics and reporting',
      'Improvements to dashboard creation',
      'AI insights inside Insight Reports',
      'Universal filters used across all 19 of their products',
      'Multiple smaller improvements across other products',
    ],
  },
  {
    slug: 'cinepolis',
    title: 'Cinepolis',
    year: '2023',
    cover: '/images/work/cinepolis/avif/cinepolis-cover.avif',
    images: workImages('cinepolis', 24),
    href: '/work/cinepolis',
    client: 'Cinepolis',
    role: 'Lead Mobile Designer',
    duration: '9 Months',
    description:
      'Cinépolis is the third-largest cinema chain in the world. The mobile app is how you plan the night: what’s playing, which theater, IMAX or 4DX, a seat, a combo, then the tickets before you leave the house. I led that redesign from research and user tests through native iOS and Android flows in light and dark.',
    delivered: [
      'Full primary user research',
      'Secondary research across the full problem space',
      'Multiple user tests',
      'High-fidelity mobile flows in light and dark mode, using Android and iOS native components',
      'Full design system with tokens and components',
      'Figma prototypes of the full mobile experience',
    ],
  },
  {
    slug: 'stream-stakes',
    title: 'Stream Stakes',
    year: '2024',
    cover: '/images/work/stream-stakes/avif/stream-stakes-cover.avif',
    images: workImages('stream-stakes', 20),
    href: '/work/stream-stakes',
    client: 'Stream Stakes',
    role: 'Product Designer',
    duration: '5 Months',
    description:
      'Stream Stakes is a mobile game where players bet on which song will come out more popular in a pairing, timed to real music launches. The company had a direct contract with Universal Music, so the product sat on actual catalog and release moments, not hypothetical tracks. I designed the full app flows: how a player picks a pairing, places a stake, follows the result, and comes back for the next launch.',
    delivered: [
      'User research on how people pick, stake, and follow song pairings',
      'User testing to validate flows and design decisions',
      'Figma prototype of the full app',
      'High-fidelity mobile designs',
      'Full design system with tokens and components',
    ],
  },
  {
    slug: 'random-selection',
    title: 'Random Selection',
    year: '2023-2026',
    cover: '/images/work/random-selection/avif/random-selection-cover.avif',
    images: workImages('random-selection', 49),
    href: '/work/random-selection',
    client: 'Freelance',
    role: 'Product Designer, UX Designer, Front-End Developer',
    duration: 'Multiple engagements',
    description:
      'A random selection of freelance work from 2023 to 2026, smaller products and one-off engagements that never needed a named case study of their own. Across them I moved between product design, UX, and front-end, taking each brief from research through to an interface a team could actually ship.',
    delivered: [
      'Desktop research on competitors, users, and the problem space',
      'User testing to validate flows and design decisions',
      'High-fidelity Figma prototypes',
      'Full design systems with components and tokens',
      'Production pages in React and Flutter',
    ],
  },
]

export type ProjectItem = WorkItem

function projectImages(slug: string, count: number) {
  const cover = `/images/projects/${slug}/avif/${slug}-cover.avif`
  const rest = Array.from({ length: count }, (_, i) => `/images/projects/${slug}/avif/${slug}-${i + 1}.avif`)
  return [cover, ...rest]
}

export const projectItems: ProjectItem[] = [
  {
    slug: 'fotospin',
    title: 'Fotospin.ai',
    year: '2025-now',
    cover: '/images/projects/fotospin/avif/fotospin-cover.avif',
    images: projectImages('fotospin', 8),
    href: '/projects/fotospin',
    client: 'Fotospin',
    role: 'Founder, Developer, Product and Brand Designer',
    duration: '1.5 Years',
    description:
      'Fotospin turns a simple selfie into professional photos. You pick a look, lawyer, doctor, or a prompt of your own, and the app generates headshots you can actually use. I founded it to learn how to ship with AI, and took it from brand and product design through a Flutter app on iOS and Android, plus the website.',
    delivered: [
      'Mobile app design',
      'Full design system in Figma and in the front-end',
      'Full front-end in Flutter',
      'Full back-end with Supabase and Fal.ai',
      'Website in Framer',
    ],
  },
  {
    slug: 'spiiine',
    title: 'Spiiine',
    year: '2024',
    cover: '/images/projects/spiiine/avif/spiiine-cover.avif',
    images: projectImages('spiiine', 6),
    href: '/projects/spiiine',
    client: 'Spiiine',
    role: 'Founder, Mobile Developer, Product and Brand Designer',
    duration: '1 Year',
    description:
      'Spiiine is a mobile app that aggregates opportunities for UGC content creators. Instead of hunting across platforms, they open one iOS app and the next collaboration is already there. I built it as a side project, brand, product, and the full Flutter app, and shipped it to the App Store.',
    delivered: [
      'Website in Framer',
      'Full design system in Figma and in Flutter',
      'Full mobile app in Flutter',
      'Full back-end with Supabase',
    ],
  },
  {
    slug: 'bunnyhop',
    title: 'Bunnyhop',
    year: '2026-now',
    cover: '/images/projects/bunnyhop/avif/bunnyhop-cover.avif',
    images: projectImages('bunnyhop', 10),
    href: '/projects/bunnyhop',
    client: 'Bunnyhop',
    role: 'Product Designer, Motion, Front-End',
    duration: 'Now',
    description:
      'Bunnyhop is an attempt to build the largest web design system out there, still a work in progress. It could turn into a productized AI agency, or I sell the system and an MCP server straight to designers. That part is still open.',
    delivered: [
      'Large web design system with thousands of components',
      'Library of 300 color palettes',
      'Hundreds of website sections with motion and front-end',
      'MCP server (WIP)',
      'Back-end with CMS and a single inbox with AI (WIP)',
    ],
  },
  {
    slug: 'ai-workshops',
    title: 'AI Workshops',
    year: '2026',
    cover: '/images/projects/ai-workshops/avif/ai-workshops-cover.avif',
    images: projectImages('ai-workshops', 11),
    href: '/projects/ai-workshops',
    client: 'Andela',
    role: 'Instructor',
    duration: '6 Weeks',
    description:
      'Andela hired me to create a workshop for their talent network. That became AI Acceleration for Product Designers, a six-week, hands-on workshop on using the latest AI tools in the product design process. I went into the details, honestly, about where AI is right now and how to use it in practice.',
    delivered: [
      'Created and facilitated a 6-week workshop on AI for designers',
      'Full brand design',
      'All content and exercises',
    ],
  },
]

export const valueCards = [
  {
    title: 'Love for the craft',
    body: 'No detail is too small. How a product feels is the sum of tiny decisions: a label, a delay, an edge case. I treat each one as a chance to delight, not something to ship later.',
  },
  {
    title: 'Ship, then refine',
    body: 'I aim for a first cut we can use, not a perfect one we can present. Once it’s live, I go back into the product, motion, labels, the last 10%, until the whole journey feels simple.',
  },
  {
    title: 'Clarity over complexity',
    body: 'Hard problems don’t get solved by adding another screen. I sit with the problem until the path is obvious, then I take the weight off the user so they can just do the thing they came to do.',
  },
]

export type ToolCard = {
  name: AppLogoName
  title: string
  body: string
}

export const toolCards: ToolCard[] = [
  {
    name: 'hermes',
    title: 'Hermes Agent',
    body: 'My go-to agent harness when away from my computer. I have a content pipeline setup for the creation of my Instagram carousels that runs everyday at 7 a.m.  I also use it a lot for deep research on competitors, getting news, and fixing things on my repositories.',
  },
  {
    name: 'cursor',
    title: 'Cursor',
    body: 'My go-to agent harness when I am on my computer. Use it for everything, from editing things on Figma using the Figma MCP, to personal things like seraching for tickets to a concert, and specially for coding.',
  },
  {
    name: 'granola',
    title: 'Granola',
    body: 'I use it to take notes from meetings. It is a great tool for user research. I can use it to summarize research into topics, and create affinity maps that I can use later to create user personas or other artifacts for UX.',
  },
  {
    name: 'fal',
    title: 'Fal.ai',
    body: 'Fal is a tool that connects hundreds of image, and video generation models in one place. So, every pipeline for image generation, creation of 3D assets, videos, vectors, etc, I use Fal.',
  },
  {
    name: 'composio',
    title: 'Composio',
    body: 'Composio is a tool that integrates hundreds of MCPs and APIs in one place. I use to connect personal accounts, like my Google apps and other things, so my agents have access to my tools from a single source. It handles authentication pretty well, so it keeps my accounts connected.',
  },
  {
    name: 'openai',
    title: 'ChatGPT',
    body: 'ChatGPT is still the best tool for Meta-prompting. I use it when creating detailed prompts for image generation, for example. ',
  },
  {
    name: 'firecrawl',
    title: 'Firecrawl',
    body: 'Firecrawl is the tool I use for data extraction. I connect it to my Composio, and my agent harnesses have access to the best algorithm to get information from the internet.',
  },
  {
    name: 'tavily',
    title: 'Tavily',
    body: 'Tavily is the best SERPER for AI Agents out there. I connect it via Composio, so my agents have access to the internet and do research with more accuracy.',
  },
  {
    name: 'agent-mail',
    title: 'Agent Mail',
    body: 'Agent Mail creates simple to use email inboxes so my AI Agents can use them when signing up to new tools, and contacting other people.',
  },
  {
    name: 'zernio',
    title: 'Zernio',
    body: 'I use Zernio to connect all my social accounts. It has a great MCP, so my agents can post things to Instagram, for example. It has other features such as answering messages, etc.',
  },
  {
    name: 'manus',
    title: 'Manus',
    body: 'After setting up Hermes, I’ve used Manus less and less. But I still use it for deep research on topics that take some time to get information about.',
  },
  {
    name: 'openrouter',
    title: 'OpenRouter',
    body: 'Openrouter connects hundreds of AI models in one place. So it is my go-to tool for my Hermes agent, and when I want to try and benchmark different models in one single place.',
  },
]

export const modelRows = [
  {
    provider: 'Z.ai',
    name: 'GLM 5.2',
    note: 'This is the  model I use in my day-to-day with Hermes Agent. I use it for research, planning and everything in between.',
  },
  {
    provider: 'Cursor',
    name: 'Composer 2.5',
    note: 'For day-to-day coding tasks, I like to use this model. Super light weight, and fast.',
  },
  {
    provider: 'Anthropic',
    name: 'Claude Opus 5',
    note: 'Still the best model for planning long-term tasks like coding a whole section of an app. Too expensive for execution though.',
  },
  {
    provider: 'Anthropic',
    name: 'Claude Fable 5',
    note: 'The best model for front-end work. But too expensive for execution, so I use it very rarely when I need a designer partner that gives me different options for some screens.',
  },
  {
    provider: 'MoonshotAI',
    name: 'Kimi K2.6',
    note: 'Sometimes when I don’t get the level of context I want, I switch to Kimi 2.6. It is better than GLM at some things.',
  },
  {
    provider: 'DeepSeek',
    name: 'DeepSeek V4 Flash 0423',
    note: 'I use it mostly to play RPG with Hermes. It is a great model for roleplaying.',
  },
]

export function workBySlug(slug: string) {
  return workItems.find((item) => item.slug === slug)
}

export function projectBySlug(slug: string) {
  return projectItems.find((item) => item.slug === slug)
}

export type TickerImage = {
  src: string
  href: string
  title: string
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]
    const swap = next[j]
    if (current === undefined || swap === undefined) continue
    next[i] = swap
    next[j] = current
  }
  return next
}

export function randomTickerImages(count = 10): TickerImage[] {
  const items = shuffle([...workItems, ...projectItems]).slice(0, count)
  return items.map((item) => {
    const pool = item.images.length > 0 ? item.images : [item.cover]
    const src = pool[Math.floor(Math.random() * pool.length)] ?? item.cover
    return { src, href: item.href, title: item.title }
  })
}

export function randomWorkImages(count = 10): string[] {
  const pool = workItems.flatMap((item) => (item.images.length > 0 ? item.images : [item.cover]))
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}

export function trailImages(count = 18): string[] {
  const items = [...workItems, ...projectItems]
  const covers = items.map((item) => item.cover)
  const extras = items.flatMap((item) => item.images.filter((src) => src !== item.cover))
  const needed = Math.max(0, count - covers.length)
  const pool = [...covers, ...shuffle(extras).slice(0, needed)]
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}
