import { absoluteUrl, site } from './site'

/**
 * Shared prompt for the footer “Ask about Rômulo Sandri on …” buttons.
 * Each provider’s web app reads `q` on load and pre-fills (and often submits)
 * the composer, so the visitor lands in a conversation instead of an empty homepage.
 */
export const aiAskPrompt = `Who is ${site.name}? Read ${absoluteUrl('/llms.txt')} and summarize his work as a ${site.role}.`

function withQuery(base: string, params: Record<string, string>) {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

export const aiAskLinks = {
  openai: {
    label: 'ChatGPT',
    href: withQuery('https://chatgpt.com/', { q: aiAskPrompt, hints: 'search' }),
  },
  claude: {
    label: 'Claude',
    href: withQuery('https://claude.ai/new', { q: aiAskPrompt }),
  },
  grok: {
    label: 'Grok',
    href: withQuery('https://grok.com/', { q: aiAskPrompt }),
  },
  perplexity: {
    label: 'Perplexity',
    href: withQuery('https://www.perplexity.ai/search', { q: aiAskPrompt }),
  },
} as const
