# What’s still missing to ship the website

Audit of `src/content/`, `dist/`, pages, SEO/GEO, safety, performance, and share settings. Written 1 Sep 2026.

**How to read this.** Each item is tagged:

- **You** — something only you can decide or provide
- **Code** — something to implement once you decide
- **Rebuild** — already true in source, but the last `dist/` prerender is stale and still ships the old version

Items are ordered by how much they block going live, not by how long they take.

---

## Snapshot

The architecture is in place: prerendered HTML, JSON-LD, `llms.txt`, `agents.md`, `resume.json`, per-page markdown, sitemap, robots, contact function, Netlify config.

What is **not** done is the last mile: real content confirmation, a mobile layout, a proper favicon/social-image set, licensed fonts, security headers, and a rebuild so `dist/` matches `src/`.

`dist/` is out of date relative to `src/content/`. The prerendered HTML still says Product Designer, still emails `romulosandrirodrigues@gmail.com`, and still links social icons to `github.com` / `x.com` / `linkedin.com` / `instagram.com`. Source already has Senior Product Designer, `contact@romulosandri.com`, and real profile URLs. Do not judge the live site from `dist/` until `npm run build` runs again.

---

## 1. Content I still need from you

### Blockers

| # | What | Where | Why it matters | Status |
| --- | --- | --- | --- | --- |
| 1.1 | Confirm the production domain | `src/content/site.ts` → `SITE_URL` | Every canonical, sitemap URL, OG URL, and JSON-LD `@id` is derived from this. Wrong domain = Google indexes URLs that do not exist. | **You.** Currently `https://romulosandri.com` (guessed). |
| 1.2 | Confirm availability | `src/content/resume.ts` lines 332–349 | The file still says these are guesses. `noticePeriod` is now “Immediate — can start right away”. The rest (`openToWork`, remote, contract, full-time, 8 years, preferred roles) has never been confirmed. | **You.** Ships in `/resume.json` under `meta.availability`. |
| 1.3 | Resend + contact email | `.env.example` | Contact form will 500 until `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are set in Netlify. `contact@romulosandri.com` only works as a From address after the domain is verified in Resend. | **You.** |

### Important for recruiters and agents

| # | What | Where | Why it matters | Status |
| --- | --- | --- | --- | --- |
| 1.4 | Impact metrics on case studies | `portfolio.ts` `delivered[]` | Almost every `delivered` line is an activity (“Product strategy”, “User testing”), not a result. Fotospin is the exception (7,000 downloads / $2,000). Meltwater has 19 products / ~$1B ARR / 20,000+ clients in the prose, not as a delivered line. | **You.** Even rough numbers help. |
| 1.5 | Live product URLs | `portfolio.ts` (no `url` field exists yet) | Pacelane.ai, Fotospin (App Store / Play / site), Spiiine (App Store), Gemhaus, Stream Stakes — none of the case studies link out to the actual product. | **You**, then **Code**. |
| 1.6 | What “Life” in the nav should do | `NavBar.tsx` → `href="#life"` | There is no `id="life"` anywhere. The link is a dead hash. Is it the game, a future page, the About block, or should it be removed? | **You**. |
| 1.7 | Skills list review | `resume.ts` `skillGroups` | ~80 skills across 8 categories, inferred from case studies. This becomes JSON-LD `knowsAbout` and `/resume.json`. Delete anything you would not want to be interviewed on; add what is missing. | **You**. |
| 1.8 | Education years | `resume.ts` | UCSD Interaction Design Professional Certificate is in progress, no start year. Google UX and IDF certificates have no dates. | **You**, optional. |

### Optional / later

| # | What | Status |
| --- | --- | --- |
| 1.9 | Per-image alt text | **You**, later. ~245 images. Fallbacks like “Pacelane.ai — … work, image 7 of 40” are already generated. Real alts for 3–5 hero images per case study would be enough. |
| 1.10 | Language fluency | English is “Fluent”, Portuguese “Native”. Confirm or add Spanish. |
| 1.11 | Kessera | **Done in source.** Footer now maps `projectItems`, so Kessera is gone. `dist/` still shows “Kessera (WIP)” → `/projects` until rebuild. |
| 1.12 | Social profile URLs | **Done in source.** GitHub, X, LinkedIn, Instagram, Substack are real. `dist/` HTML still has the placeholder homepages. |
| 1.13 | Canonical title | **Done in source.** `Senior Product Designer`, with Product Designer and Design Engineer as additional `roles`. `dist/` and `index.html` still say Product Designer. |
| 1.14 | Contact-page social icons | **Done in source.** They are wrapped in `<a>`. `dist/` is stale. |

Copy-paste answers:

```
Domain (1.1):
Availability corrections (1.2):
Notice period: Immediate — can start right away   [keep / change]
Resend From address verified? (1.3): yes / not yet
Metrics (1.4):
  Pacelane:
  Gemhaus:
  Meltwater:
  Cinépolis:
  Stream Stakes:
  Spiiine:
  AI Workshops:
  Bunnyhop:
Live URLs (1.5):
  Pacelane:
  Fotospin:
  Spiiine:
  others:
Life nav (1.6): game / about / new page / remove
Skills (1.7) remove / add:
Education years (1.8):
Alt text (1.9): later / skip
Languages (1.10):
```

---

## 2. Design and responsiveness

There are **no breakpoint classes** in the app (`sm:`, `md:`, `lg:` never appear in pages). Layouts are desktop Figma frames. On a phone this will overflow, clip, or become unusable.

### Nav

- Header is one row: letter-mark name + Play Game chip + Work / Life / Projects / Blog / Contact Me, `gap-3xl`, `px-4xl`.
- No hamburger, no wrap, no shrinking. Name logo plus five items will overflow below ~1100px.
- `whitespace-nowrap` on most labels, so they never wrap.

### Home

- Hero display type is `whitespace-pre` “Product / Designer” — fine at desktop, overflows on small screens.
- About blurb is a fixed `w-[640px]`.
- Value cards are three columns, fixed `h-[380px]`.
- Work grid is always `grid-cols-2`.
- Image ticker is 853×640 images in a horizontal marquee — decorative on desktop, wasted weight on mobile.

### Case studies

- Sticky 480px sidebar + gallery in a row (`gap-4xl`). On a phone the sidebar should stack above the images.
- “See next” is three cards in a row.
- Related work cards are a fixed `w-[853px]` drag-scroll row.

### How I use AI

- Tools are 4 columns × `h-[380px]`.
- Models table has fixed `w-[120px]` + `w-[320px]` columns that will not fit a phone.

### Contact

- Form and status visual sit in a row with `gap-[120px]`.
- Name and email sit in a row.
- Status visual is a large image sequence; it should hide or stack on small screens.

### Footer

- Four `shrink-0` columns, one of them `w-[508px]`, inside a `h-[560px]` bar.
- Will overflow horizontally on anything below a wide desktop.
- Pluto sprite is positioned for a wide footer.

### Display heroes

- Work / Projects / case study titles use `text-display` + `whitespace-nowrap` in a `h-[560px]` block. Long titles (Pacelane.ai, Random Selection, AI Workshops) will clip on tablet/phone.

### Game

- Phaser canvas with a debug grid **on by default** (`debugVisible = true` in `WorldScene.ts`). Colored collision overlays and cell labels ship to visitors.
- No touch controls. Keyboard only (WASD / arrows). Unplayable on a phone unless that is intentional.
- Advertised as “walk through his life and work”; currently a map with debug drawing, not a finished experience.

**Code.** Responsive pass is the largest remaining design job. **You** only need to say whether the mobile version should be a true reflow of the desktop, or a simplified layout (single column, smaller type, hidden tickers/trail).

---

## 3. Links — clickable, and do they go to the right place?

Checked against current **source**. `dist/` HTML is older and still has several of the old bugs.

| Link | Resolves to | Verdict |
| --- | --- | --- |
| Name logo | `/` | OK |
| Play Game | `/game` | OK |
| Work | `/work` | OK |
| Life | `#life` | **Broken.** No target on any page. |
| Projects | `/projects` | OK |
| Blog | Substack (`site.blog.href`) | OK in source, opens a new tab. Missing from stale `dist/` nav. |
| Contact Me | `/contact` | OK |
| Home work cards | `/work/{slug}` | OK, all 6 slugs exist |
| Home How I use AI | `/how-i-use-ai` | OK |
| Home Let’s Talk | `/contact` | OK |
| Footer work list | each `workItems` href | OK in source. Stale `dist/` is missing Random Selection. |
| Footer project list | each `projectItems` href | OK in source. Stale `dist/` still has Kessera → `/projects`. |
| Footer social icons | real profiles | OK in source. Stale `dist/` still points at bare homepages. |
| Contact social icons | same as footer | OK in source |
| WhatsApp / email on contact | `wa.me/…` / `mailto:` | OK |
| Footer `/llms.txt`, `/agents.md`, `/resume.json` | static files | OK — router lets `.{ext}` through |
| Footer AI buttons (ChatGPT, Claude, Grok, Perplexity) | generic homepages | **Clickable but wrong intent.** Label is “Ask about Rômulo Sandri on …” but the URL is `https://chatgpt.com` with no query. They also do not `target="_blank"` or `rel="noopener noreferrer"`. |
| Image ticker | none | **Not clickable.** `TickerImage` has an `href` that is never used. |
| Case study “See next” / related cards | other case studies | OK |
| Unknown work/project slug | in-page “Not found” | OK for `/work/nope` |
| Any other unknown URL | Home page content, Netlify 404 status | **Wrong UX.** Crawlers get 404 (good). Humans land on the homepage with no explanation. |
| `src/components/Header.tsx` | `#work`, `#about`, `mailto:` | **Dead code.** Not mounted. Those hashes also do not exist. |

External profile links in the footer and contact page do not open in a new tab. Only the Blog nav item and the Resend credit do.

**Code** for Life, 404 page, AI-ask URLs, ticker links, `rel`/`target` on externals. **You** for what Life should be, and whether AI buttons should deep-link a prompt.

---

## 4. SEO

Already working (in source, after a rebuild):

- Canonical, description, robots, Open Graph, Twitter card tags per route
- JSON-LD `@graph` (Person, WebSite, ProfilePage / CollectionPage / CreativeWork / ContactPage / Article)
- `sameAs` on Person (once rebuilt)
- `sitemap.xml` of all 16 crawlable routes
- `robots.txt` with named AI crawlers allowed
- Prerendered HTML so non-JS crawlers see content
- One `<h1>` per page (verified by `npm run verify:seo`)

Still missing or wrong:

| Gap | Detail |
| --- | --- |
| Stale prerender | `dist/index.html` still titles and describes you as Product Designer, old email, old `sameAs`. Rebuild is required before indexing. |
| `index.html` fallback title | Hardcoded “Rômulo Sandri, Product Designer”. Shown before JS, and in the SPA shell for 404s. |
| Person `image` | JSON-LD Person has no `image`. Google’s person rich results and Knowledge Graph want a photo. **You:** a square headshot you are happy to be the public face. |
| Open Graph image quality | See §6. Home uses `/images/home/hero-character.png` (a 316px character, not a 1200×630 card). Case studies use full PNG covers, some 2–4 MB. |
| Missing OG extras | No `og:image:width`, `og:image:height`, `og:image:alt`, `og:image:type`. No `twitter:site` / `twitter:creator` (`@sandri_romulo`). |
| Sitemap `lastmod` | Always “today at build”, not when the case study last changed. |
| 404 indexing | `isNoIndex` covers `notFound` and `?ds`, but unknown URLs render Home with Home’s indexable meta during client nav. Netlify’s 404 status saves crawlers; a dedicated noindex 404 page would be cleaner. |
| `html lang` | `en` is correct. No `hreflang` for Portuguese. Only needed if you add a PT version. |
| Search Console / Bing | **You.** After domain is live: submit `sitemap.xml`, verify the property. |
| Duplicate PNG+AVIF in the index | Gallery `<img>` tags point at AVIF only (good). OG points at PNG (required). Fine. |

---

## 5. GEO (generative / agent optimisation)

Already working:

- `/llms.txt`, `/llms-full.txt`, `/agents.md`, `/resume.json`, `/resume.md`
- Markdown twin of every content page (`/work/pacelane.md`, etc.)
- `rel="alternate"` from HTML to the markdown twin
- Footer copy that tells agents where to read
- Skills, dates, availability, education in the machine layer

Still missing or wrong:

| Gap | Detail |
| --- | --- |
| `resume.json` case-study URLs | `scripts/generate-seo-assets.mjs` always writes `${SITE_URL}/work/${slug}`. Fotospin, Spiiine, Bunnyhop, AI Workshops therefore point at `/work/fotospin` etc., which 404. Should use each item’s real `href`. **Code.** |
| AI “ask about me” buttons | Should be prompt URLs, e.g. ChatGPT / Perplexity with `q=` pointing at the live domain + `/llms.txt`. Right now they dump the visitor on an empty chatbot homepage. **Code**, after 1.1. |
| Impact numbers | Agents quote `delivered` and `summary`. Without results, they will describe you as someone who “did research and Figma”. **You** (1.4). |
| Availability still marked TODO in source | Comment in `resume.ts` says the block is guesses. Agents will still publish it. **You** (1.2). |
| No `Person.image` | Same as SEO. Helps image-capable agents attach a face. |
| Prerender HTML is noisy | Home HTML still includes 18 cursor-trail images, duplicated logo ticker, family sprite frames, and hidden opacity styles. Crawlers that do execute JS are fine; ones that ingest raw HTML get a huge blob. The prerender sanitiser is not stripping decorative nodes the way `plans/agent-readable-portfolio.md` described. **Code.** |
| Copy typos agents will repeat | Cursor blurb: “seraching for tickets”. OpenRouter blurb: “Openrouter”. **Code** (trivial) or **You** if you want to rewrite the How I use AI cards. |

---

## 6. Favicons and social images

The things that show up when someone shares a link are **Open Graph** (LinkedIn, iMessage, Slack, Facebook, WhatsApp) and **Twitter Cards** (X). Tags exist. The assets behind them are not share-ready.

### Favicon set

Today: one SVG at `public/favicon.svg` (the RS mark). That is enough for Chrome desktop.

Still missing:

| File | Used by |
| --- | --- |
| `favicon.ico` (16/32/48) | Old browsers, some crawlers |
| `favicon-32x32.png`, `favicon-16x16.png` | Safari, bookmarks |
| `apple-touch-icon.png` (180×180) | iOS home screen, Safari tabs |
| `android-chrome-192x192.png`, `512x512.png` | Android / PWA |
| `site.webmanifest` | Install name, theme colour, icons |
| `<meta name="theme-color">` | Mobile browser chrome |

`index.html` only has `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`. No apple-touch, no manifest.

**You:** confirm the SVG mark is the one you want as the public icon (colour on light and dark). **Code:** generate the PNG/ICO pack from it.

### Social preview images (Open Graph / Twitter)

| Page | Current `og:image` | Problem |
| --- | --- | --- |
| Home, Contact, How I use AI, Game | `/images/home/hero-character.png` (~387 KB, square character) | Platforms want ~1200×630 (1.91:1). A square character letterboxes or crops badly. LinkedIn in particular looks cheap with this. |
| Work / Projects index | First item’s PNG cover | Covers are 2048×1536 project screenshots, not composed share cards. |
| Case studies | That project’s PNG cover | Several are 2–4 MB (`ai-workshops` 2.9 MB, `bunnyhop` 4.0 MB, `cinepolis` 3.2 MB). Facebook/LinkedIn often refuse or downsample huge images. No `og:image:alt`. |

Ideal: one designed 1200×630 PNG per page type (home + maybe one per case study), under ~300 KB, with name, role, and a still from the work. Until then, at least crop/compress a single home card so shares of `/` and `/contact` look intentional.

**You:** a home share image (and optionally per-case-study cards). **Code:** wire them in `seo.ts`, add width/height/alt, add `twitter:site`.

---

## 7. Safety

Contact form is in decent shape: honeypot, HTML escaping, length limits, in-memory rate limit, API key kept server-side, no `VITE_` leak. Remaining gaps:

| Gap | Risk | Who |
| --- | --- | --- |
| No security headers | `netlify.toml` only sets `X-Robots-Tag` and markdown `Content-Type`. Missing `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options` / `frame-ancestors`, `Permissions-Policy`, and a Content-Security-Policy. | **Code** |
| Trial fonts in production | Saans, Season Serif, and Serrif files are named `*-TRIAL-*`. Shipping trial fonts on a public site typically violates the foundry licence. | **You** (buy licences or pick free replacements) then **Code** |
| Missing font files | CSS `@font-face` points at `Serrif-TRIAL-*.ttf` and `JetBrainsMono-*.ttf`. Those files are not in `public/fonts/` (only PP Mondwest + Saans + Season Serif). Browsers 404 and fall back. | **Code** / **You** if Serrif and JetBrains are meant to ship |
| WhatsApp number in JSON-LD and `/resume.json` | Public, scrapeable. Confirm you want that. | **You** |
| Family in the hero | Named sprite folders (`luara`, `naomi`, `diogo`, `tulipa`, `pluto`). Decorative, but they are on a public, indexed page. | **You** |
| Contact form / LGPD | No privacy note on `/contact` about where the message is stored (Resend). Brazil’s LGPD cares about this for a form that collects name + email. A one-line “messages are emailed to me, not stored on this site” is enough. | **You** (wording) + **Code** |
| In-memory rate limit | Resets on every Netlify cold start; does not stop a distributed flood. Fine for a portfolio. Optional: Netlify Blobs or a provider-level cap. | Optional **Code** |
| External links without `rel="noopener noreferrer"` | Footer socials, AI buttons, WhatsApp. Nav Blog is the only one that has it. | **Code** |
| Game debug overlay | Collision colours and cell names visible to everyone. | **Code** |
| `Header.tsx` leftover | Not a security issue; dead nav with `mailto:` only. | **Code** to delete |

---

## 8. Performance

The desktop experience is motion-heavy on purpose. These are the things that will actually hurt LCP / mobile / crawlers:

| Issue | Detail |
| --- | --- |
| No responsive images | Gallery, ticker, and cards serve full AVIFs (covers are 2048-wide). No `srcset`, no `sizes`, no Netlify Image CDN (`/.netlify/images`). |
| Home loads a pile of unused images | Cursor trail: 18 AVIFs. Family: every frame of every member. Logo ticker: duplicated. Image ticker: 10 × 853×640, duplicated for the loop. Hero video `preload="auto"`. |
| Dual PNG + AVIF on disk | Every project image exists twice. Fine for OG (PNG required) and display (AVIF), but it doubles the deploy. Do not also send PNG to the browser. |
| Work-card hover previews | After hover, up to 4 extra full AVIFs per card. Six cards on home = a lot of decode work. |
| Phaser on `/game` | Whole game bundle is in the main Vite graph (`optimizeDeps.include: ['phaser']`). It is not code-split, so visitors who never open `/game` still download it. |
| Lenis + GSAP + cursor trail on every page | Fine on desktop. On low-end phones, hide trail / tickers / family animation. |
| No `width`/`height` on work-card images | Aspect box is there (`aspect-[2048/1536]`), so CLS is mostly OK. Lightbox and ticker are less careful. |
| Fonts | Multiple families, TTF trial files (not WOFF2), no `preload` of the display font. PP Mondwest is the LCP type on home. |
| Prerendered HTML size | Home HTML is enormous because decorative nodes were not stripped. Slows first byte for crawlers and for users on a cold HTML response. |
| Cache headers | Fingerprinted `/assets/*` already get long cache from Netlify defaults. Explicit `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` would still be good. Images under `/images/` revalidate every time in the browser. |

**Code** for code-splitting Phaser, stripping prerender decoration, hiding heavy motion on small/coarse pointers, Image CDN or `srcset`, WOFF2, font preload. **You** only if you want a lighter mobile home (no trail, no ticker).

---

## 9. Deploy and settings still to do

| Item | Who |
| --- | --- |
| Netlify site + domain DNS | **You** |
| Env vars from `.env.example` | **You** |
| Rebuild after content/domain freeze (`npm run build` / Netlify) | **Code** once you confirm 1.1–1.3 |
| Google Search Console + Bing Webmaster, submit sitemap | **You** |
| LinkedIn / iMessage / Slack share test of `/` and one case study | After OG image exists |
| Analytics | None. Add only if you want it (Plausible / Umami / GA). **You** |
| 404 page | **Code** |
| Remove game debug overlay | **Code** |
| Delete unused `src/components/Header.tsx` | **Code** |

---

## 10. Suggested order

1. **You answer §1 blockers** (domain, availability, Resend).
2. **Rebuild** so `dist/` matches source (socials, title, footer, contact links).
3. **Favicon pack + one 1200×630 home OG image** — shares and browser tabs stop looking unfinished.
4. **Responsive pass** — the site is not shippable on a phone today.
5. **Fix known bugs** while that happens: Life nav, 404 page, `resume.json` project URLs, AI-ask prompt links, game debug off, security headers, font 404s / licences, Phaser code-split, prerender sanitise.
6. **Metrics + live URLs + Person photo** when you have them — biggest remaining GEO/recruiter gap.
7. **Search Console** after the domain is live.

If you only do three things this week: confirm the domain, drop in a 1200×630 share image, and tell me what Life should be so the nav stops being a dead link.
