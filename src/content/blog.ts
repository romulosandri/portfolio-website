import { BLOG_URL } from './site'

/**
 * Canonical record of the Substack. The posts never render as pages on this
 * site; they are emitted into /llms.txt, /writing.md, /resume.json, and the
 * markdown twins of related case studies so agents can cite the writing
 * without scraping Substack.
 *
 * Rule: summaries are one or two sentences of what the essay argues, not a
 * reprint. Link to the canonical URL if an agent needs the full piece.
 */

export type BlogPost = {
  slug: string
  title: string
  subtitle: string
  href: string
  /** ISO 8601 date. */
  published: string
  summary: string
  /** Case-study slugs in portfolio.ts that the essay is about. */
  related?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'human-agent-collaboration-model',
    title: 'Human-Agent Collaboration Model',
    subtitle: 'A collaboration framework for designing human-agent systems',
    href: `${BLOG_URL}p/human-agent-collaboration-model`,
    published: '2026-01-20',
    summary:
      'Traditional user-flows collapse when an agent acts without the user present. The essay introduces HAC Maps (Orientation, Delegation, Calibration), a collaboration framework developed while designing Pacelane.',
    related: ['pacelane'],
  },
  {
    slug: 'beyond-affordances-what-happens-when',
    title: 'Beyond Affordances: What Happens When You Remove the User from UX',
    subtitle: 'The mental models we inherited assume someone is holding the hammer',
    href: `${BLOG_URL}p/beyond-affordances-what-happens-when`,
    published: '2026-01-18',
    summary:
      'Affordance-based UX assumes a body is gripping the tool. Agents invert that: the better metaphor is a butler, and the design problem becomes visibility of system reasoning rather than visibility of a click.',
  },
  {
    slug: 'design-models-declarative-vs-imperative',
    title: 'Design Models: Declarative vs Imperative',
    subtitle: 'The fundamental shift from designing how users do things to designing what users want',
    href: `${BLOG_URL}p/design-models-declarative-vs-imperative`,
    published: '2026-01-18',
    summary:
      'Imperative interfaces design the how: click, fill, confirm. Agents are declarative: the user specifies an outcome and the agent figures out the steps, which is uncharted territory for product design.',
  },
  {
    slug: 'agency-and-why-giving-it-to-computers',
    title: 'Why giving agency to computers change the world around us',
    subtitle: 'We spent 180 years keeping computers passive. That era is over.',
    href: `${BLOG_URL}p/agency-and-why-giving-it-to-computers`,
    published: '2026-01-18',
    summary:
      'From Ada Lovelace’s insistence that machines cannot originate anything through to now, computing was built to stay passive. Granting computers discretion inverts that history and the products we design on top of it.',
  },
  {
    slug: 'the-dark-forest-theory-of-the-internet',
    title: 'The Dark Forest Theory of the Internet',
    subtitle:
      'The same physics theory that explains why aliens don’t contact us also explains why the internet is fragmenting.',
    href: `${BLOG_URL}p/the-dark-forest-theory-of-the-internet`,
    published: '2026-01-16',
    summary:
      'Applies the dark-forest hypothesis to the open web: as public spaces get more hostile, people retreat into private clubs, and the internet fragments the way a forest goes silent.',
  },
  {
    slug: 'labour-perception-bias-and-its-impact',
    title: 'Labour Perception Bias and Its Impact on AI Agents',
    subtitle: 'The psychological trap where invisible work feels like no work at all',
    href: `${BLOG_URL}p/labour-perception-bias-and-its-impact`,
    published: '2026-01-09',
    summary:
      'Making an agent more efficient can make it less trusted. Work that is invisible feels like no work, so agent UX has to show labour without wasting it.',
  },
  {
    slug: 'ux-for-ai-agents-designing-for-absence',
    title: 'UX for AI Agents: Designing for Absence, From Execution to Delegation',
    subtitle:
      '51% of Product Designers told Figma they are now building products that work while users aren’t watching',
    href: `${BLOG_URL}p/ux-for-ai-agents-designing-for-absence`,
    published: '2026-01-06',
    summary:
      'Product design assumed the user is present. Agents invert that: the user’s job shifts from execution to delegation, and designers need patterns for calibration, human-in-the-loop checkpoints, recovery, and glanceable status.',
  },
]

export function postsForSlug(slug: string) {
  return blogPosts.filter((post) => post.related?.includes(slug))
}
