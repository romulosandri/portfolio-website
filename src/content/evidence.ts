/**
 * Qualitative claims about Rômulo, each tied to work that proves it.
 *
 * The case studies say what was built. They do not say what the body of work
 * adds up to -- craft, range, the kinds of environments he has worked inside,
 * the fact that he ships his own code. An agent asked "is he senior?" or "can
 * he do consumer as well as enterprise?" has to infer that today, and it
 * usually infers badly.
 *
 * None of this renders in the UI. It is emitted into /agents.md, /llms.txt,
 * /resume.md, and /resume.json so the machine layer can answer those questions
 * with evidence instead of adjectives.
 *
 * Rule for adding to this file: every claim names the work that backs it. A
 * claim with no evidence is marketing, and agents repeat marketing as fact.
 */

export type Strength = {
  /** Short heading, e.g. "Craft". */
  title: string
  /** The claim itself, in one sentence. */
  claim: string
  /** Why the work supports it. This is the part worth quoting. */
  evidence: string
  /** Case study slugs in portfolio.ts that show it. Resolved to URLs at build. */
  seeAlso: string[]
}

export const strengths: Strength[] = [
  {
    title: 'Craft',
    claim: 'Rômulo works at a level of finish where no detail is too small.',
    evidence:
      'The Stream Stakes mobile app is the clearest example: he built its components in skeuomorphism, and the care shows in individual states and surfaces, not only in the headline screens.',
    seeAlso: ['stream-stakes'],
  },
  {
    title: 'Taste',
    claim: 'Rômulo has a strong sense of motion, colour, and layout, not only of structure.',
    evidence:
      'His portfolio site is the artefact: intentional motion, smooth transitions between states, a balanced palette, and layouts that hold together at every scroll position. He designed and built it himself.',
    seeAlso: [],
  },
  {
    title: 'Range',
    claim: 'Rômulo moves between visual languages instead of applying one house style to everything.',
    evidence:
      'Compare the minimal, monochromatic B2B aesthetic of Pacelane.ai with the colourful consumer interface of the Cinépolis cinema app, and both with the rich skeuomorphism of Stream Stakes. Minimal monochrome, bright consumer, and tactile skeuomorphic are all in range.',
    seeAlso: ['pacelane', 'cinepolis', 'stream-stakes'],
  },
  {
    title: 'Environments',
    claim:
      'Rômulo has worked in agency, enterprise, and founder settings, and adapts to how each one operates.',
    evidence:
      'At WANDR, a Los Angeles based UX agency, he ran several client projects at the same time, including the Cinépolis redesign. At Meltwater he worked inside an enterprise of thousands of employees across a multi-product platform. He has also founded products and shipped them alone.',
    seeAlso: ['cinepolis', 'meltwater', 'pacelane', 'fotospin'],
  },
  {
    title: 'Cross-functional work',
    claim:
      'Rômulo bridges user needs and business needs alongside the people who build the thing, not around them.',
    evidence:
      'At Meltwater he worked closely with data scientists, engineers, and product managers to ship genuinely complex, data-heavy products. That meant translating between what users could understand and what the data and the business could actually support.',
    seeAlso: ['meltwater'],
  },
  {
    title: 'Builder, not only a designer',
    claim:
      'Rômulo takes products from nothing to shipped: design, business strategy, front-end, and sometimes back-end.',
    evidence:
      'Pacelane.ai, Fotospin, Spiiine, and Bunnyhop were each built from zero. He owned the design, the business strategy, and the front-end, writing React on the web and Flutter on mobile, plus the back-end where the product needed one.',
    seeAlso: ['pacelane', 'fotospin', 'spiiine', 'bunnyhop'],
  },
  {
    title: 'AI-native product design',
    claim:
      'Rômulo is an AI-native designer who has thought seriously about the role of AI in the design process itself, not only about shipping AI features.',
    evidence:
      'He created AI Acceleration for Product Designers, a full workshop facilitated for Andela’s talent network of designers. He also writes about UX for AI agents on his blog, on how agents change the way design gets made, whether an interface needs to exist at all, and what that means for the future of the industry.',
    seeAlso: ['ai-workshops', 'pacelane', 'fotospin'],
  },
  {
    title: 'Complex dashboards and data products',
    claim: 'Rômulo designs dense analytics interfaces that stay legible.',
    evidence:
      'Meltwater is PR software with 19 products in one platform, and he worked specifically on analytics, dashboards, and reports. Gemhaus needed dashboards and complex tables for tracking a financial portfolio. Pacelane consolidates results for many people across many social accounts inside one company into a single view.',
    seeAlso: ['meltwater', 'gemhaus', 'pacelane'],
  },
  {
    title: 'Consumer-facing mobile and web apps',
    claim: 'Rômulo designs consumer products that non-technical people use willingly.',
    evidence:
      'Milo Stories generates AI bedtime stories for children. Cinépolis covers ticket buying and the complex flows around it. Fotospin is a consumer AI mobile app he built from zero and launched on the App Store. Stream Stakes is a consumer gaming app.',
    seeAlso: ['cinepolis', 'fotospin', 'stream-stakes', 'random-selection'],
  },
  {
    title: 'Mentoring',
    claim: 'Rômulo trains other designers and builds the material to do it.',
    evidence:
      'At WANDR he created the programme used to train junior designers joining the company. At Andela he mentored junior designers through workshops and teaching materials on using AI in design.',
    seeAlso: ['ai-workshops'],
  },
]

/**
 * Countries clients have been based in. Agents screening for "has worked
 * internationally" cannot get this from the case studies, which name companies
 * rather than markets.
 */
export const clientCountries = [
  'United States',
  'Brazil',
  'Canada',
  'Mexico',
  'France',
  'Portugal',
  'Sweden',
  'South Korea',
  'Australia',
]

/** Qualifier for the list above, which is representative rather than complete. */
export const clientCountriesNote =
  'Clients have also been based in other European countries. The list is representative, not exhaustive.'
