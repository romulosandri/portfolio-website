import type { AppLogoName } from '../design-system/AppLogo'

export type WorkItem = {
  slug: string
  title: string
  year: string
  cover: string
  images: string[]
  href: string
  /** Live product or company site. Omit when there is no public URL. */
  url?: string
  client: string
  role: string
  duration: string
  description: string
  delivered: string[]
  /** One quotable sentence. This is what an LLM repeats when asked about the project. */
  summary: string
  /** Skill and domain keywords. Feeds JSON-LD `keywords` and the markdown mirrors. */
  tags: string[]
  /** Tools and technologies used, for skill matching. */
  tools: string[]
  /** ISO 8601, year or year-month. The `year` field above is display-only and unparseable. */
  startDate: string
  /** ISO 8601, or null when the work is ongoing. */
  endDate: string | null
  /**
   * Optional per-image alt text, parallel to `images`. Where an entry is missing
   * or empty, `imageAltFor` generates a positional fallback -- still far better
   * for crawlers than the empty alt these images shipped with.
   */
  imageAlts?: string[]
}

/**
 * Alt text for gallery image `index`, falling back to a generated description
 * when no hand-written alt exists.
 */
export function imageAltFor(item: WorkItem, index: number) {
  const provided = item.imageAlts?.[index]
  if (provided) return provided
  if (index === 0) return `${item.title} — project cover`
  return `${item.title} — ${item.role} work, image ${index} of ${item.images.length - 1}`
}

/** Hostname for display, e.g. `pacelane.ai` from `https://pacelane.ai`. */
export function productHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
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
    url: 'https://pacelane.ai',
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
    summary:
      'Co-founded and designed Pacelane.ai, an AI writing agent that drafts LinkedIn posts in an executive’s own voice, taking it from product strategy and brand through Figma to a shipped React front-end.',
    tags: ['AI Product', 'Product Strategy', 'Design Systems', 'Front-End Development', '0 to 1', 'SaaS'],
    tools: ['Figma', 'React', 'TypeScript', 'Tailwind CSS'],
    startDate: '2025',
    endDate: '2026',
    imageAlts: [
      "Pacelane home dashboard in light mode, with follower and engagement metrics, a weekly ideas calendar, and a table of top LinkedIn engagers.",
      "Pacelane home screen in dark mode, with a welcome greeting, a LinkedIn post composer, and quick-action cards for video, transcripts, URLs, and news.",
      "Pacelane post editor, with a knowledge and drafts sidebar, a LinkedIn draft in the center, and an AI writing-assistant chat on the right.",
      "Pacelane Posts library in dark mode, with post analytics, a daily activity chart, and a searchable grid of content cards.",
      "Pacelane onboarding in light mode, asking for a LinkedIn profile URL to calibrate the writing voice.",
      "Pacelane content calendar in light mode, a monthly grid of scheduled, posted, and suggested LinkedIn posts.",
      "Pacelane component spec for labels, showing empty, search, create, multi-select, color picker, and edit states.",
      "Pacelane organization settings in dark mode, a four-up of People invites, Guidelines files, a member detail drawer, and bulk select.",
      "Pacelane For Today dashboard in light mode, with two side-by-side AI LinkedIn drafts from a sales meeting.",
      "Pacelane home dashboard in light mode, with follower and engagement metrics, a weekly ideas calendar, and a table of top LinkedIn engagers.",
      "Pacelane Discovery feed in light mode, a masonry grid of LinkedIn posts with search and filters.",
      "Pacelane mobile navigation in dark mode, showing the sidebar and the organization switcher for Ramp, Anthropic, and Perplexity.",
      "Pacelane onboarding success screen, with a You are Ready modal, a completed setup checklist, and confetti.",
      "Pacelane tone-of-voice settings, with a personality radar chart and cards for hook style, CTA style, and emoji usage.",
      "Pacelane component spec for labels, showing empty, search, create, multi-select, color picker, and edit states.",
      "Pacelane tone-of-voice settings, with a personality radar chart and cards for hook style, CTA style, and emoji usage.",
      "Pacelane transcripts dashboard in dark mode, a dated grid of meeting cards with actions to draft posts from each recording.",
      "Pacelane knowledge base, showing document cards with category tags and upload dates.",
      "Pacelane Engage connections tab, a grid of LinkedIn prospect cards with AI relationship insights and a request composer.",
      "Pacelane knowledge base in light mode, a two-up of detailed list view and visual grid view.",
      "Pacelane Audiences dashboard, with engager metrics, a people table, and a detail drawer of AI insights and CRM actions.",
      "Pacelane Pace Board for The Pace Keepers group, with membership stats and a ranked leaderboard of posters.",
      "Pacelane Analytics in dark mode, with topic insights, an impressions table, and a Topic Details panel of related posts.",
      "Pacelane Engage feed in light mode, a multi-column stream of lead posts with buttons to generate AI comments.",
      "Pacelane Discovery in light mode, a news feed with a details panel of article summary and content opportunities.",
      "Pacelane Pace Board in light mode, with ranking, posts-per-week, and streak metrics above a member leaderboard.",
      "Pacelane brand posters, a six-up of high-contrast campaign stills with experimental wordmarks and slogans.",
      "Pacelane Run Club photo of two runners wearing maroon shirts printed with The Pacelane Run Club.",
      "Pacelane merchandise two-up of dark t-shirts, one Founder Runner Creator and one Pacelane Run Club.",
      "Pacelane settings spec, a six-up of Account, Preferences, Notifications, Organization, People, and Billing screens.",
      "Pacelane Ideas dashboard in light mode, a grid of tagged topic cards with source icons and Write Post actions.",
      "Pacelane writing agent, with a chat of hook suggestions on the left and a LinkedIn post preview with version tabs on the right.",
      "Pacelane dashboard four-up in light mode, showing Audiences, Context files, Strategy, and the Posts library.",
      "Pacelane sign-in screen in dark mode, with email, password, and Google login on a centered card.",
      "Pacelane onboarding in dark mode, asking for a LinkedIn profile URL to calibrate the writing voice.",
      "Pacelane marketing landing page in two-up scroll, covering the seller-creator hero, social proof, product UI, testimonials, and a free-trial CTA.",
      "Pacelane marketing landing page in two-up scroll, covering the personality hero, WhatsApp agent, knowledge base, editor, testimonials, and FAQ.",
      "Pacelane marketing landing page in two-up scroll, covering the personality hero, WhatsApp agent, knowledge base, editor, testimonials, and FAQ.",
      "Pacelane home dashboard in light mode, with a modal to paste a YouTube URL and prompt a LinkedIn post from the video.",
      "Pacelane performance reports in dark mode, a two-up of a quarterly growth letter and a LinkedIn activity summary.",
      "Pacelane landing section with a lead-gen form beside a book mockup of The State of LinkedIn Brazil.",
    ],
  },
  {
    slug: 'gemhaus',
    title: 'Gemhaus',
    year: '2025',
    cover: '/images/work/gemhaus/avif/gemhaus-cover.avif',
    images: workImages('gemhaus', 35),
    href: '/work/gemhaus',
    url: 'https://gemhaus.com',
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
    summary:
      'Designed Gemhaus end to end, a fractional real-estate investment app where users buy a slice of a home and track rent, portfolio performance, and expenses.',
    tags: ['Fintech', 'PropTech', '0 to 1', 'Mobile Design', 'Design Systems', 'Web App'],
    tools: ['Figma'],
    startDate: '2025',
    endDate: '2025',
    imageAlts: [
      "Gemhaus Web property dashboard with cash-flow, equity, and risk scores plus performance charts.",
      "Gemhaus Web property dashboard with cash-flow, equity, and risk scores plus performance charts.",
      "Gemhaus Web property dashboard with cash-flow, equity, and risk scores plus performance charts.",
      "Gemhaus Web listing for a home with a photo gallery, specs, and a payment calculator.",
      "Gemhaus Mobile onboarding step with a lifestyle photo, testimonial, and form, shown in light and dark modes.",
      "Gemhaus Web portfolio dashboard with net worth, a performance chart, and progress toward investment goals.",
      "Gemhaus Sign-up form beside a tablet showing a property dashboard with scores and cash-flow charts.",
      "Gemhaus Rental calculator modal over a web property page, with loan inputs and a monthly income summary.",
      "Gemhaus Split web screen with a stepped form beside a lifestyle photo and investor testimonial.",
      "Gemhaus Web Your Properties grid with cash-flow scores, AI recommendations, and performer badges.",
      "Gemhaus Mobile welcome screen after onboarding, with Find Properties and Dashboard actions in light and dark modes.",
      "Gemhaus Web notifications list grouped into new and seen, with equity, goal, and payment alerts.",
      "Gemhaus Split web screen with a stepped form beside a lifestyle photo and investor testimonial.",
      "Gemhaus Web profile page for uploading and managing investor documents.",
      "Gemhaus Web settings page listing subscription invoices with payment status.",
      "Gemhaus Mobile profile documents screen with an upload drop zone, shown in dark and light modes.",
      "Gemhaus Split web screen with a stepped form beside a lifestyle photo and investor testimonial.",
      "Gemhaus Split web screen with a stepped form beside a lifestyle photo and investor testimonial.",
      "Gemhaus Web profile page with goal progress bars and selectable investment objectives.",
      "Gemhaus Empty image placeholder with a photo icon on a gray background.",
      "Gemhaus Web manager dashboard with client counts, portfolio value, and a client overview table.",
      "Gemhaus Mobile onboarding step with a lifestyle photo, testimonial, and form, shown in light and dark modes.",
      "Gemhaus Web log history with an inflows and outflows chart and a rent-and-expense transaction list.",
      "Gemhaus Offer-sent confirmation modal showing the new billable property and invoice total.",
      "Gemhaus Mobile property listing with photos, price, and specs, shown in light and dark modes.",
      "Gemhaus Web checkout for the subscription plan, with billable-property count and payment details.",
      "Gemhaus Four mobile screens for adding a property: details, search, billing confirmation, and success.",
      "Gemhaus Add-goal modal on the web profile, with goal type, target amount, and color.",
      "Gemhaus Cash-flow inputs modal on the web dashboard for categorizing bank transactions as income or expenses.",
      "Gemhaus Loan-terms step with amount, term, and rate, shown on mobile and web in light and dark modes.",
      "Gemhaus Web Find Properties marketplace with a map, listing cards, and suggested homes.",
      "Gemhaus Mobile portfolio dashboard with net-worth goals and a property breakdown, shown in dark and light modes.",
      "Gemhaus Mobile property-breakdown cards beside a log-history chart of rent inflows and expenses.",
      "Gemhaus Pitch-deck grid covering the product, market, team, traction, and revenue model.",
      "Gemhaus Marketing site with a hero, product mockups, feature sections, and a waitlist call to action.",
      "Gemhaus Marketing site with a hero, product mockups, feature sections, and a waitlist call to action.",
    ],
  },
  {
    slug: 'meltwater',
    title: 'Meltwater',
    year: '2024-2025',
    cover: '/images/work/meltwater/avif/meltwater-cover.avif',
    images: workImages('meltwater', 42),
    href: '/work/meltwater',
    url: 'https://meltwater.com',
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
    summary:
      'Senior Product Designer at Meltwater, a near-$1B ARR media intelligence platform, where I added AI insights to Insight Reports and designed the universal filter system now used across all 19 of their products.',
    tags: ['Enterprise SaaS', 'AI Features', 'Data Visualization', 'Design Systems', 'B2B', 'Analytics'],
    tools: ['Figma'],
    startDate: '2024',
    endDate: '2025',
    imageAlts: [
      "Meltwater Explore overview for a PepsiCo search, with boolean query, mentions feed, and mentions-trend widgets.",
      "Meltwater Explore overview for a Tesla search, with boolean query, mentions feed, and mentions-trend widgets.",
      "Meltwater Analyze PepsiCo Media Impact Dashboard with an article-level analytics modal.",
      "Meltwater Campaign Dashboard with the Card Settings drawer open on Tesla Total Engagement.",
      "Meltwater Explore overview with a Filtered Mentions drawer on a PepsiCo search.",
      "Meltwater Edit Card workspace with a KPI card preview and a right-hand configuration panel.",
      "Meltwater Article-level analytics for a selected mention, with reach, sentiment, and duplicate coverage.",
      "Meltwater Universal Filters modal with custom categories, AND/OR operators, and visual and enrichment filters.",
      "Meltwater Edit Card workspace with a KPI card preview and a right-hand configuration panel.",
      "Meltwater Universal Filters exploration comparing parent-only versus cascading location selection.",
      "Meltwater Create Campaign Dashboard wizard on the select-inputs step.",
      "Meltwater Untitled Analyze dashboard with the Update settings panel open on a Highlighted articles card.",
      "Meltwater Coverage Report with a dashboard menu for duplicate, layout, and cover-slide actions.",
      "Meltwater Explore overview for a PepsiCo search, with boolean query, mentions feed, and mentions-trend widgets.",
      "Meltwater PR Insight Report builder modal for generating a Key Messages Report.",
      "Meltwater Edit Card workspace with a KPI card preview and a right-hand configuration panel.",
      "Meltwater Create Dashboard wizard showing Brand Health, Mentions, and Earned Media Measurement templates.",
      "Meltwater Analyze PepsiCo Media Impact Dashboard with KPI cards, readership insights, and share of voice.",
      "Meltwater Image uploader component spec showing empty, crop, and multi-image states.",
      "Meltwater Edit Card workspace for a custom image card, with Fill and Fit sizing in Card Settings.",
      "Meltwater Explore overview for a Tesla search, with boolean query, mentions feed, and mentions-trend widgets.",
      "Meltwater Curate Mentions panel for choosing articles to include in a PR Insight Report.",
      "Meltwater PR Insight Report builder with the Add slides modal highlighting AI slides.",
      "Meltwater Thought Leadership AI slide variations for a PR Insight Report comparing brand leadership scores.",
      "Meltwater PR Insight Report Topic Analysis slide with AI-ranked themes for Rivian.",
      "Meltwater PR Insight Report builder questionnaire for positioning strategy and brand messages.",
      "Meltwater PR Insight Report builder editing a Key Messages Penetration slide with the settings panel open.",
      "Meltwater Breakout Post alert setup with Facebook pages, recipients, and delivery channels.",
      "Meltwater PR Insight Report builder showing Topic Analysis and Key Messages Penetration AI slides.",
      "Meltwater Coverage Report cover editor with Image Settings for cover photo and logo.",
      "Meltwater Analyze Brand Report for Europe with the Update settings panel open.",
      "Meltwater Analyze landing page promoting PR Insight Reports, AI insights, and recent work.",
      "Meltwater Create Coverage Report wizard for selecting search inputs and a readership metric.",
      "Meltwater Universal Filters modal with custom categories, AND/OR operators, and visual and enrichment filters.",
      "Meltwater Explore overview for a PepsiCo search, with boolean query, mentions feed, and mentions-trend widgets.",
      "Meltwater Analyze Earned Media Measurement dashboard with volume-of-posts KPIs and top news cards.",
      "Meltwater Universal Filters modal with custom categories, AND/OR operators, and visual and enrichment filters.",
      "Meltwater Coverage Report builder with highlighted mentions and a panel for selecting results.",
      "Meltwater Analyze Brand Report dashboard with mentions, top publications, and an AI mentions-trend chart.",
      "Meltwater Campaign Dashboard overview with PR and engagement KPIs above a mentions-over-time chart.",
      "Meltwater Add Card modal for dashboard widgets such as volume of posts, engagement, and net sentiment.",
      "Meltwater Coverage Report builder showing an editable cover slide.",
      "Meltwater Home with a good-morning greeting and pick-up-where-you-left-off cards.",
    ],
  },
  {
    slug: 'cinepolis',
    title: 'Cinepolis',
    year: '2023',
    cover: '/images/work/cinepolis/avif/cinepolis-cover.avif',
    images: workImages('cinepolis', 24),
    href: '/work/cinepolis',
    url: 'https://cinepolis.com',
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
    summary:
      'Led the mobile app redesign for Cinépolis, the third-largest cinema chain in the world, covering showtimes, format and seat selection, concessions, and ticketing across native iOS and Android.',
    tags: ['Mobile Design', 'iOS', 'Android', 'E-commerce', 'User Research', 'Design Systems'],
    tools: ['Figma'],
    startDate: '2023',
    endDate: '2023',
    imageAlts: [
      "Two dark phones: the Cinépolis home feed with short video stories and Avatar showtimes, and the movie detail page with IMAX and 4DX badges plus buy-tickets and trailer buttons.",
      "Dark Cinépolis Movies tab with theater chips, short video stories, and showtime cards for Avatar and Creed III with format badges and buy-tickets.",
      "Cinépolis Two dark phones of Avatar details: poster, runtime, IMAX and 4DX, and buy-tickets above; expanded synopsis, cast row, and short video clips below.",
      "Cinépolis Six dark Avatar story frames covering share, a buy-tickets prompt, trivia overlays, and an in-story quiz with results.",
      "Cinépolis Four dark concession screens for customizing popcorn size and flavor, bottled water quantity, and a classic combo before adding it to the cart.",
      "Cinépolis Dark seat map for Avatar at an IMAX 4DX showtime, step 2 of 4, with selected, taken, and accessible seats.",
      "Cinépolis Three light Movies-tab phones: showtimes with buy-tickets, presales with notify-me, and the same card layout using placeholder posters.",
      "Cinépolis Two dark cart phones: Avatar tickets with seat-type pickers, then a combo, seating-upgrade promo, and order total.",
      "Cinépolis Three dark phones for concession ordering: a food menu, then combo screens for choosing drink and popcorn sizes.",
      "Cinépolis Dark screen to add food to a show, listing compatible Avatar and Creed III tickets and an incompatible booking at another theater.",
      "Cinépolis Two light Food-tab phones: a featured combo banner over a snack grid, then a two-column menu of priced combos.",
      "Cinépolis Two dark phones for choosing a showtime: a date carousel and theater filters, then a grid of IMAX and 4DX times.",
      "Cinépolis Five dark Club phones showing Fan, Fanático, and Super Fanático loyalty cards with QR codes, points, benefits, and weekly promos.",
      "Cinépolis Dark Orders tab with perforated ticket cards for Creed III and M3GAN, each offering view details and rate.",
      "Cinépolis Four light shopping-cart screens for Avatar showing empty seats and food, a filled cart, and seats without concessions.",
      "Cinépolis Two phones after checkout: a blue confirmation with QR code and Apple Wallet, and a dark receipt of items, totals, and payment.",
      "Cinépolis Two dark Discover phones: short video stories and a festival banner, then weekend editorial cards for Oppenheimer and Barbie.",
      "Cinépolis Two dark phones: Creed III ticket details with seats and a rate-experience button, and final checkout with loyalty pay and a saved card.",
      "Cinépolis Five light account screens for editing a profile, picking a birthdate, changing a password, and verifying a new phone number.",
      "Five phones for empty, loading, and error paths: no showtimes, a skeleton schedule, offline, a spinner, and the Cinépolis splash mark.",
      "Cinépolis Design-system sheet of iOS and Android bottom navigation in light and dark, plus nearby-theater rows with IMAX and 4DX icons.",
      "Cinépolis Two concession phones showing a combos grid and a bottled-water list with prices and favorite hearts.",
      "Cinépolis Dark phone with a blue digital Avatar ticket listing theater, hall, and seat above a scannable QR code.",
      "Figma molecules library for Cinépolis, with action, navigation, card, and display components beside text and color styles.",
      "Figma overview of the native Cinépolis file, with rows of light and dark high-fidelity screens for home, seats, food, cart, and club.",
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
    summary:
      'Designed Stream Stakes, a mobile game built on a direct Universal Music catalogue contract where players stake on which song in a pairing will outperform the other around real release moments.',
    tags: ['Mobile Design', 'Gaming', 'Music', 'Consumer App', 'User Research', 'Design Systems'],
    tools: ['Figma'],
    startDate: '2024',
    endDate: '2024',
    imageAlts: [
      "Two Stream Stakes screens: the home dashboard with a featured artist, genre filters, and artist grid beside My Entries tracking live winning and losing song pairings.",
      "Stream Stakes home screen with a contest countdown, featured artist banner, and a grid of upcoming artists.",
      "Login landing with social sign-in, email login form, and sign-up form for Stream Stakes.",
      "Four-step Stream Stakes flow: pick artists, choose song matchups, mark a Diamond Pick and stake, then review the entry.",
      "Stream Stakes Onboarding screens for selecting three artists and three music genres.",
      "Two Stream Stakes screens: the home dashboard with a featured artist, genre filters, and artist grid beside My Entries tracking live winning and losing song pairings.",
      "Stream Stakes button styles from the design system, from icon and ghost variants to a purple primary.",
      "Stream Stakes Finalize Entry screens for choosing a song pairing, setting the stake, and confirming against the prize pool.",
      "Add-debit-card and deposit screens for funding a Stream Stakes wallet.",
      "Stream Stakes home screen with a contest countdown, featured artist banner, and a grid of upcoming artists.",
      "Stream Stakes Playlist Points redemption screen converting earned points into wallet funds.",
      "Stream Stakes Diamonds Balance overlay tracking progress toward a free contest entry.",
      "Stream Stakes friend profile with win stats and activity, beside Pool Details showing live pairing results against the prize pool.",
      "Stream Stakes Song pairing screens before and after selecting which track will be more popular.",
      "Artist biography overlay with a now-playing bar over the Stream Stakes home screen.",
      "Stream Stakes Matchup screen for picking one song in a pairing, with progress toward the required artist picks.",
      "Stream Stakes Entry summary card listing chosen songs by artist with win and loss indicators.",
      "Stream Stakes Player profile with funds, streaks, and leaderboard beside a Friends Activity feed of song picks.",
      "Stream Stakes Concept pairing screen staking on two album releases beside a YOUR STAKES dashboard of active matchups.",
      "Figma file for Stream Stakes showing clustered mobile screens for pairing, stake, results, home, and profile.",
      "Figma file for Stream Stakes showing clustered mobile screens for pairing, stake, results, home, and profile.",
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
    summary:
      'A collection of freelance product design, UX, and front-end engagements from 2023 to 2026, each taken from research through to an interface a team could ship.',
    tags: ['Freelance', 'Product Design', 'UX Design', 'Front-End Development', 'Design Systems'],
    tools: ['Figma', 'React', 'Flutter'],
    startDate: '2023',
    endDate: null,
    imageAlts: [
      "Two mobile screens from a checkout flow, with a shopping cart, applied promo code, and a checkout page for shipping and payment.",
      "Four mostra ai screens showing welcome login, the home marketplace, a blazer product detail, and the Voga Store profile.",
      "Three job-search screens showing a dark splash, a personalized UI Designer feed, and a Netguru Junior UI/UX Designer posting.",
      "Two mobile screens from a checkout flow, with a shopping cart, applied promo code, and a checkout page for shipping and payment.",
      "Two music-app screens showing a home feed of new releases and a Now Playing view with album art, controls, and lyrics.",
      "A fashion store home screen greeting Rômulo with SS22 banners, category tabs, and a two-column product grid.",
      "Two Abrigo screens showing a pet-adoption home feed and Belinha’s profile with health details and an Adopt button.",
      "Two KnownLenders views showing loan payment details and a dashboard of active loans with a missed-payment alert.",
      "Four Overheard screens showing a live meeting transcript, a share modal, captured commitments, and session playback.",
      "Paragon invoice confirmation for a paid invoice, with a thank-you message, PDF download, and a work overview from East Rutherford to New York.",
      "Paragon work-order details for a Nashville-to-Chicago shipment, with job information, a live map, and driver status.",
      "A laptop mockup of Raffaela Sandri’s personal-chef site, pairing plated appetizers with a Portuguese headline to turn a home into a restaurant.",
      "Elsie.ai dark footer with a newsletter signup, link columns, a Sign Up For Free button, and compliance badges.",
      "KnownLenders Sign Off Contract, with one party signed and a Sign Document action for the second.",
      "KnownLenders celebrating a paid-off loan with confetti, a congratulations modal, and a credit-score increase.",
      "Else.ai dark pricing page with Free, Basic, and Premium plan cards and a monthly or annual billing toggle.",
      "Two Deal Hub dashboard states listing construction deals with tasks, priority tags, and premium expectation.",
      "Five Paragon mobile screens covering Nashville-to-Chicago trip tracking and a Stripe invoice payment with a thank-you confirmation.",
      "Ten family-app screens walking through splash, login, and step-by-step account creation ending at Formar Família.",
      "MiloStories landing page for creating bedtime stories, with illustrated heroes, benefits, pricing, and testimonials.",
      "Milo pricing page highlighting a Milo Premium trial beside storybook illustrations and a Get Started Now banner.",
      "Two MiloStories mobile screens showing an Explore feed for a bike adventure story and a chapter reader with audio playback.",
      "MiloStories Explore page with a create-story sidebar, category chips, and a grid of illustrated story cards.",
      "Milo Stories sign-up split between a forest story illustration and a name-and-password form with Google sign-up.",
      "Paragon Work dashboard listing Phoenix-to-Denver work orders with filters, search, and a Create Work Order button.",
      "Paragon route planner for Nashville to Chicago, with a map of locked pins and a segment card to send for approval.",
      "AI4GOV legislation search with a date-range picker overlay on a dark Portuguese interface.",
      "Two VALHALLA screens showing a crypto-gaming homepage and a World of Warcraft marketplace of latest trades.",
      "Fastpilot landing page promising simple websites fast, with a hero photo and a dark integrations strip for Notion, Slack, and more.",
      "Andarezzi shop layouts for LightSmart lighting, showing a desktop homepage and a mobile scroll of bestsellers and collections.",
      "Novus Coinverse converter turning CASH into NCV, with a Portuguese FAQ below.",
      "NovusCoinVerse latest-trades table of in-game items on the Good Old Times server.",
      "Four Os Nossos onboarding screens for a custody calendar, expense splits, joint decisions, and in-app parent chat.",
      "Four vendor screens for store signup, adding a product, sort options, and color, price, and distance filters.",
      "Four Raffaela Sândri pages covering home, catering, services, and contact for her personal chef and catering site.",
      "Four astrology-lesson screens showing a Pisces lesson, a video lesson, Bruna Inglez’s profile, and a choose-your-sign signup.",
      "A laptop mockup of Champagne Bollinger’s About Us page with a bottle, editorial copy, and a heritage photo collage.",
      "Ten family-app screens walking through splash, login, and step-by-step account creation ending at Formar Família.",
      "Two PROJECT X screens showing a talent profile and a messages inbox.",
      "PROJECT X talent search with a recent-searches overlay and a suggestion card.",
      "PROJECT X search results for a young stylish lead, with an Activity feed of submissions beside a grid of headshots.",
      "SunCity Camp landing page for Martian glamping in Wadi Rum, with a dome hero, booking dates, and accommodation cards.",
      "AFRL homepage with a radar hero, the Lead Discover Develop Deliver line, and three news article cards.",
      "Audition 01 share step, filtering agents and managers by category and location before releasing to casting lists.",
      "Asset Panda IT Assets dashboard with a table of MacBooks, iMacs, and Dell hardware.",
      "SmartBrew landing page for the RMX-32 coffee maker, with preorder, a companion-app preview, and press logos.",
      "Audition 01 general-info step with a date-time picker over a TWD Season 3 open-call form.",
      "CO2ignArt homepage declaring ethical digital art has arrived, with iridescent sculpture, carbon-funding stats, and sign-in.",
      "3rd Singapore Tech Conference hero with the Marina Bay skyline, July dates, and a speakers sidebar.",
      "Rômulo Sandri portfolio contact with a black-and-white portrait, an orange Let’s Do Something Amazing headline, and LinkedIn and email buttons.",
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
    url: 'https://fotospin.com.br',
    client: 'Fotospin',
    role: 'Founder, Developer, Product and Brand Designer',
    duration: '1.5 Years',
    description:
      'Fotospin turns a simple selfie into professional photos. You pick a look, lawyer, doctor, or a prompt of your own, and the app generates headshots you can actually use. I founded it to learn how to ship with AI, and took it from brand and product design through a Flutter app on iOS and Android, plus the website. In 6 months it reached 7,000 downloads and $2,000 in revenue.',
    delivered: [
      '7,000 downloads and $2,000 in revenue in 6 months',
      'Mobile app design',
      'Full design system in Figma and in the front-end',
      'Full front-end in Flutter',
      'Full back-end with Supabase and Fal.ai',
      'Website in Framer',
    ],
    summary:
      'Founded Fotospin.ai, an AI headshot app that reached 7,000 downloads and $2,000 in revenue in 6 months, shipping brand, product, Flutter on iOS and Android, and a Supabase and Fal.ai back-end as a solo founder.',
    tags: ['AI Product', 'Generative AI', 'Mobile App', 'Founder', 'Full-Stack', 'Consumer App'],
    tools: ['Figma', 'Flutter', 'Supabase', 'Fal.ai', 'Framer'],
    startDate: '2025',
    endDate: null,
    imageAlts: [
      "Fotospin’s home screen browses profession-based headshot styles beside a checkout for a Micro Pack of three AI headshots at R$9.99.",
      "Fotospin Lawyer style intro with a What to Expect grid, beside a Nutritionist result offering Download, Edit Photo, and Generate Headshot.",
      "Fotospin Lawyer headshot generating behind a scan line, beside the Studio editor with a prompt field and Edit Photo under a selected photo.",
      "Fotospin’s home screen browses profession-based headshot styles beside a checkout for a Micro Pack of three AI headshots at R$9.99.",
      "Fotospin Onboarding asks for a profession, then for a gender, each dark screen pairing serif type with thumbnail headshots.",
      "Fotospin Profile shows a coin balance and a grid of generated headshots beside Settings with delete account, tester login, and a copyable user ID.",
      "Fotospin What are Coins? explainer beside an empty Studio prompting the user to select a photo and describe an edit.",
      "Fotospin Select Photo contrasts good and bad selfie examples beside a Crop Your Photo screen with a square grid over a portrait.",
      "Fotospin Any special requests? lets the user add notes and source photos beside the same good-versus-bad photo guidelines.",
    ],
  },
  {
    slug: 'spiiine',
    title: 'Spiiine',
    year: '2024',
    cover: '/images/projects/spiiine/avif/spiiine-cover.avif',
    images: projectImages('spiiine', 6),
    href: '/projects/spiiine',
    url: 'https://spiiine.com',
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
    summary:
      'Founded and shipped Spiiine to the App Store, an iOS app that aggregates brand collaboration opportunities for UGC creators into a single feed.',
    tags: ['Mobile App', 'iOS', 'Founder', 'Creator Economy', 'Full-Stack', 'Consumer App'],
    tools: ['Figma', 'Flutter', 'Supabase', 'Framer'],
    startDate: '2024',
    endDate: '2024',
    imageAlts: [
      "A Spiiine login with a photo hero and purple Log In button sits beside a dark feed of UGC brand collaborations listing budgets and locations.",
      "An App Store preview for Spiiine shows the listing metadata above a row of iPhone screenshots for signup, profiles, and collaboration jobs.",
      "Spiiine Post Details shows a creator video with a Contact button beside a Sign Up screen for checking work categories.",
      "Spiiine Lily Anderson’s creator profile with bio, tags, and stats sits beside a Post screen with a vertical video and Contact action.",
      "A Spiiine login with a photo hero and purple Log In button sits beside a dark feed of UGC brand collaborations listing budgets and locations.",
      "Spiiine Two dark discovery feeds show creator cards with product photos, Available badges, and clap counts.",
      "Spiiine Offline, iOS update, and Android update screens share a gradient header and a single action to reload or update the app.",
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
    summary:
      'Building Bunnyhop, an in-progress attempt at the largest web design system available, with thousands of components, 300 colour palettes, hundreds of motion-ready sections, and an MCP server for designers.',
    tags: ['Design Systems', 'Motion Design', 'Front-End Development', 'MCP', 'Web', 'Work in Progress'],
    tools: ['Figma', 'React', 'TypeScript', 'GSAP'],
    startDate: '2026',
    endDate: null,
    imageAlts: [
      "Bunnyhop Three palette variants of the same Escape to the mountains lodge section appear on light, charcoal, and terracotta backgrounds.",
      "Bunnyhop Three palette variants of the same Escape to the mountains lodge section appear on light, charcoal, and terracotta backgrounds.",
      "Bunnyhop dark Features section with an operating-system headline and trial CTAs, a Projects tab, and a 3D staircase graphic.",
      "Bunnyhop Eight Who we work with variants rearrange type, color, and background around a headline, two buttons, and a six-logo grid.",
      "Figma Variables maps Bunnyhop’s color-neutral tokens from 00 to 950 across cobblestone, sand, stone, slate, and steel modes.",
      "A Figma canvas of Features section layouts sits beside Bunnyhop’s layers list and typography and color styles.",
      "Bunnyhop Nine form components share serif headings and olive buttons for verification, booking, contact, RSVP, and scheduling.",
      "Bunnyhop Technology Services block with a video card, stacked notification lists, and a bar for Sign Up, Help Center, and Contact Sales.",
      "Bunnyhop Avatar Group library in Figma, showing circular and rectangular stacked avatars beside the styles panel.",
      "Bunnyhop Figma Variables maps section color-schemes so background, fade-gradient, and foreground tokens resolve across palettes.",
      "Bunnyhop Three stacked panels show a fruit-illustrated color palette, a Midjourney style guide, and an archived 2006 Twitter homepage.",
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
    summary:
      'Created and facilitated AI Acceleration for Product Designers, a six-week hands-on workshop for Andela’s talent network on applying current AI tools throughout the product design process.',
    tags: ['Teaching', 'AI Tools', 'Workshop Design', 'Product Design', 'Public Speaking'],
    tools: ['Figma', 'Cursor', 'ChatGPT'],
    startDate: '2026',
    endDate: '2026',
    imageAlts: [
      "AI Acceleration workshop Chatbot vs. Agent slide, contrasting a Perceive–Plan–Act–Observe loop with a robot at a desk and a person directing it.",
      "AI Acceleration workshop title slide with the Andela logo, duration and level tags, and a portrait against a green panel.",
      "AI Acceleration workshop Chatbot vs. Agent slide, contrasting a Perceive–Plan–Act–Observe loop with a robot at a desk and a person directing it.",
      "AI Acceleration workshop MCP connector-layer slide, listing Paper, Chromium, Linear, Granola, Figma, and Notion as tools for designers.",
      "AI Acceleration workshop Agent anatomy slide, with the LLM as the brain alongside tools, memory, and subagents.",
      "AI Acceleration workshop table of four prompting techniques—zero-shot, few-shot, chain-of-thought, and role prompting—mapped to designer use cases.",
      "AI Acceleration workshop Intelligence vs. Judgement table, then Augment, Delegate, and Own modes of working with AI.",
      "AI Acceleration workshop Discovery & Empathize slide, listing research artifacts beside an illustration of a man studying papers.",
      "AI Acceleration workshop slide on how a language model works, explaining next-token prediction beside a vintage computer.",
      "AI Acceleration workshop Midjourney slide, with six AI illustrations beside a taste-benchmark table of strengths, watch-outs, and uses.",
      "AI Acceleration workshop Nano Banana Pro slide, listing image-model strengths and watch-outs above five AI portraits of the same man.",
      "AI Acceleration workshop title slide with the Andela logo, duration and level tags, and a portrait against a green panel.",
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
    body: 'My go-to agent harness when I am on my computer. Use it for everything, from editing things on Figma using the Figma MCP, to personal things like searching for tickets to a concert, and specially for coding.',
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
    body: 'OpenRouter connects hundreds of AI models in one place. So it is my go-to tool for my Hermes agent, and when I want to try and benchmark different models in one single place.',
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
    return { src, title: item.title }
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
