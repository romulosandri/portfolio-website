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
    images: workImages('pacelane', 3),
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
    images: workImages('gemhaus', 3),
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
    images: workImages('meltwater', 3),
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
    images: workImages('cinepolis', 3),
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
    images: workImages('stream-stakes', 3),
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
    images: workImages('random-selection', 3),
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

export type ProjectItem = {
  slug: string
  title: string
  year: string
  cover: string
  href: string
}

export const projectItems: ProjectItem[] = [
  {
    slug: 'fotospin',
    title: 'Fotospin.ai',
    year: '2026',
    cover: '/images/projects/fotospin/avif/fotospin-cover.avif',
    href: '/projects',
  },
  {
    slug: 'spiiine',
    title: 'Spiiine',
    year: '2025',
    cover: '/images/projects/spiiine/avif/spiiine-cover.avif',
    href: '/projects',
  },
  {
    slug: 'bunnyhop',
    title: 'Bunnyhop',
    year: '2024',
    cover: '/images/projects/bunnyhop/avif/bunnyhop-cover.avif',
    href: '/projects',
  },
  {
    slug: 'ai-workshops',
    title: 'AI Workshops',
    year: '2022-2026',
    cover: '/images/projects/ai-workshops/avif/ai-workshops-cover.avif',
    href: '/projects',
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
