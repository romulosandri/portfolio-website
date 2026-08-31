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
    year: '2026',
    cover: '/images/work/pacelane/avif/pacelane-cover.avif',
    images: workImages('pacelane', 40),
    href: '/work/pacelane',
    client: 'Pacelane',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
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
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
    ],
  },
  {
    slug: 'meltwater',
    title: 'Meltwater',
    year: '2024',
    cover: '/images/work/meltwater/avif/meltwater-cover.avif',
    images: workImages('meltwater', 42),
    href: '/work/meltwater',
    client: 'Stream Streaks',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
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
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
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
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
    ],
  },
  {
    slug: 'random-selection',
    title: 'Random Selection',
    year: '2022-2026',
    cover: '/images/work/random-selection/avif/random-selection-cover.avif',
    images: workImages('random-selection', 49),
    href: '/work/random-selection',
    client: 'Random Selection',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
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
    year: '2026',
    cover: '/images/projects/fotospin/avif/fotospin-cover.avif',
    images: projectImages('fotospin', 8),
    href: '/projects/fotospin',
    client: 'Fotospin',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
    ],
  },
  {
    slug: 'spiiine',
    title: 'Spiiine',
    year: '2025',
    cover: '/images/projects/spiiine/avif/spiiine-cover.avif',
    images: projectImages('spiiine', 6),
    href: '/projects/spiiine',
    client: 'Spiiine',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
    ],
  },
  {
    slug: 'bunnyhop',
    title: 'Bunnyhop',
    year: '2024',
    cover: '/images/projects/bunnyhop/avif/bunnyhop-cover.avif',
    images: projectImages('bunnyhop', 10),
    href: '/projects/bunnyhop',
    client: 'Bunnyhop',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
    ],
  },
  {
    slug: 'ai-workshops',
    title: 'AI Workshops',
    year: '2022-2026',
    cover: '/images/projects/ai-workshops/avif/ai-workshops-cover.avif',
    images: projectImages('ai-workshops', 11),
    href: '/projects/ai-workshops',
    client: 'AI Workshops',
    role: 'Product Designer',
    duration: '13 Months',
    description:
      'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    delivered: [
      'Full Design System with components and tokens',
      '91 high resolution and responsive screens in light and dark modes',
      'Desktop research on competitors and the industry',
      'Kickoff and brand workshops to learn about the problem',
    ],
  },
]

export const valueCards = [
  {
    title: 'Love for the craft',
    body: 'No detail is too small. How a product feels is the sum of tiny decisions — a label, a delay, an edge case. I treat each one as a chance to delight, not something to ship later.',
  },
  {
    title: 'Ship, then refine',
    body: 'I aim for a first cut we can use, not a perfect one we can present. Once it’s live, I go back into the product — motion, labels, the last 10% — until the whole journey feels simple.',
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
