# What I need from you to finish the SEO / GEO setup

The build works end to end today: 16 prerendered pages, JSON-LD on every route,
and the full agent layer (`llms.txt`, `agents.md`, `resume.json`, per-page markdown
mirrors, sitemap, robots). Everything below is content I could not invent for you.

Each item says what breaks if it stays as-is. Answer inline in the **Your answer**
blocks and I will wire them in — most are one-line changes.

---

## 1. Blockers — the site should not go live without these

### 1.1 The production domain

- **File:** [src/content/site.ts](../src/content/site.ts) line 5
- **Now:** `SITE_URL = 'https://romulosandri.com'` (I guessed)
- **Why it matters:** every canonical tag, every `sitemap.xml` entry, every
  Open Graph URL, and every JSON-LD `@id` is derived from this one constant. If it
  is wrong, Google indexes URLs that do not exist and the whole entity graph points
  at a dead domain.

**Your answer:**
```
Domain:
```

---

### 1.2 Real social profile URLs

- **Files:** [src/content/site.ts](../src/content/site.ts) line 38 (`sameAs`, currently empty),
  [src/design-system/FooterSection.tsx](../src/design-system/FooterSection.tsx) lines 15-18
- **Now:** the footer links point at bare domains — `https://github.com`, `https://x.com`,
  `https://linkedin.com`, `https://instagram.com`. I left `site.sameAs` empty rather than
  copying the placeholders in.
- **Why it matters:** `sameAs` is the primary signal Google and LLMs use to decide that
  "Rômulo Sandri, product designer in Palmas" on this site is the same person as the one on
  LinkedIn. Without it you are an unverified name. A link to a bare homepage is worse than
  no link, because a crawler follows it and finds nothing about you.
- **Bonus:** LinkedIn matters most here. Recruitment agents cross-reference it first.

**Your answer:**
```
LinkedIn:
GitHub:
X / Twitter:
Instagram:
Dribbble / Behance / Read.cv (optional):
```

---

### 1.3 Your canonical job title

- **File:** [src/content/site.ts](../src/content/site.ts) line 19
- **Now:** `role: 'Product Designer'`
- **Why it matters:** the site used to contradict itself — `site.ts` said "Product Designer"
  while the footer said "Senior Product Designer and Design Engineer". Conflicting titles make
  entity extraction treat them as different people. It is now a single constant feeding the
  home `<h1>`, every page title, the footer prose, and the JSON-LD `Person.jobTitle`.
- **Think of it as:** the exact phrase you want to rank for and be described as.

**Your answer:**
```
Canonical title:
```

---

## 2. Important — these directly affect recruitment agents

### 2.1 Availability

- **File:** [src/content/resume.ts](../src/content/resume.ts) lines 224-240
- **Now:** all guesses. This is what ships today:

| Field | Current value |
| --- | --- |
| `openToWork` | `true` |
| `openToRemote` | `true` |
| `openToRelocation` | `false` |
| `openToContract` | `true` |
| `openToFullTime` | `true` |
| `seniority` | `Senior` |
| `yearsOfExperience` | `8` |
| `noticePeriod` | `'TODO'` (literally the string "TODO" — must be fixed) |
| `preferredRoles` | Senior Product Designer, Design Engineer, Lead Product Designer, Founding Designer |

- **Why it matters:** this block lands in `/resume.json` under `meta.availability` and is the
  first thing a screening agent reads. `noticePeriod: 'TODO'` currently ships to production.

**Your answer:** (correct anything wrong, and give me a real notice period)
```
Corrections:
Notice period:
```

---

### 2.2 Metrics for your case studies

- **File:** [src/content/portfolio.ts](../src/content/portfolio.ts), the `delivered` array on each item
- **Now:** every case study lists *activities* ("Product strategy", "User testing",
  "Full front-end in React") but no *results*.
- **Why it matters:** this is the single biggest remaining gap. Screening agents and hiring
  managers look for impact. "Designed universal filters" is weak; "Designed universal filters
  adopted across all 19 products, used by 20,000+ clients" is strong. You already have two
  great numbers in your prose (Meltwater's ~$1B ARR and 19 products) but nothing for the rest.

Anything you have for these, even rough:

```
Pacelane      — users / funding / launch status:
Gemhaus       — waitlist size / launch / investment volume:
Meltwater     — adoption, time saved, anything beyond the 19 products:
Cinépolis     — App Store rating / conversion / ticket volume:
Stream Stakes — players / retention / did it launch:
Fotospin      — downloads / revenue / App Store rating:
Spiiine       — downloads / active creators / current status:
AI Workshops  — number of participants / feedback score:
Bunnyhop      — component count is already there; anything else:
```

---

### 2.3 Contact page social icons are not clickable

- **File:** [src/pages/ContactPage.tsx](../src/pages/ContactPage.tsx) line 137
- **Now:** `<SocialIcon type={type} />` renders five icons (email, GitHub, X, LinkedIn,
  Instagram) with no `<a>` wrapper at all. They are decorative images.
- **Why it matters:** a visitor on your contact page cannot click through to any profile, and a
  crawler sees no outbound links. This is a plain bug, separate from the placeholder URLs above.
- **I can fix this** as soon as I have the URLs from 1.2. Confirm you want them linked.

**Your answer:**
```
Link them? (yes/no):
```

---

## 3. Optional — improves things, safe to skip

### 3.1 Education

- **File:** [src/content/resume.ts](../src/content/resume.ts) line 212
- **Now:** empty array. JSON-LD omits `alumniOf` entirely and `agents.md` explicitly tells
  agents not to state education history, so nothing is broken — the site just says nothing.
- **Decision:** give me degree / field / institution / years, or confirm you would rather leave
  it out permanently and I will delete the empty scaffolding.

**Your answer:**
```
Education (or "skip"):
```

---

### 3.2 Language fluency

- **File:** [src/content/resume.ts](../src/content/resume.ts) lines 215-218
- **Now:** Portuguese "Native speaker", English "Professional working proficiency" (my guess).
- Add Spanish or others if relevant.

**Your answer:**
```
Corrections:
```

---

### 3.3 Skills list review

- **File:** [src/content/resume.ts](../src/content/resume.ts) lines 44-100
- **Now:** ~45 skills across six categories (Product Design, Research, Design Systems,
  Engineering, AI, Tools), inferred from your case studies.
- **Why glance at it:** this array becomes JSON-LD `Person.knowsAbout` and the `skills` block in
  `/resume.json`. It is how an agent decides whether you match a role. Worth 60 seconds to
  delete anything you would not want to be asked about in an interview, and add what is missing.

**Your answer:**
```
Remove:
Add:
```

---

### 3.4 Per-image alt text

- **File:** [src/content/portfolio.ts](../src/content/portfolio.ts), optional `imageAlts` per item
- **Now:** generated fallbacks like `"Pacelane.ai — Co-founder (CPO), Product and Brand Designer
  work, image 7 of 40"`. Better than the empty `alt=""` these shipped with, but not descriptive.
- **Scale:** ~245 images across 10 case studies, so hand-writing all of them is a real project.
  Suggestion: write real alt text for the 3-5 strongest images per case study and let the rest
  fall back.

**Your answer:**
```
Want to do this? (yes / later / skip):
```

---

### 3.5 Two content oddities I noticed

Not SEO issues, just things that look unintentional:

- [src/design-system/FooterSection.tsx](../src/design-system/FooterSection.tsx) line 28 lists
  **"Kessera (WIP)"** in the footer projects nav, linking to `/projects`. There is no Kessera in
  `projectItems`, so it is a dead-end link to a project that does not exist on the site.
- The footer nav is a hardcoded list that duplicates `workItems` / `projectItems`. It will drift
  the next time you add a case study. I can make it read from the content files.

**Your answer:**
```
Kessera — remove, or add a real case study?
Make footer nav dynamic? (yes/no):
```

---

## 4. Deploying

Nothing needed from you code-wise — `netlify.toml` and a `netlify-build` script that installs
Chromium before prerendering are already committed. Once you have a domain:

1. Import the repo on Netlify.
2. Point the domain at it.
3. Add the three contact form variables from `.env.example` under Site configuration →
   Environment variables.
4. Update `SITE_URL` (item 1.1) and rebuild.
5. Submit `https://<domain>/sitemap.xml` in Google Search Console.

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server, no prerendering, no `/api/contact` |
| `npx netlify dev` | Dev server with the contact function wired up |
| `npm run build` | Typecheck, build, prerender all routes, generate agent files |
| `npm run build:spa` | Build without prerendering, for a fast check |
| `npm run verify:seo` | Re-run all output checks against `dist/` |

---

## Fastest path

If you only do three things: **the domain (1.1)**, **the LinkedIn URL (1.2)**, and
**the notice period (2.1)**. Those unblock deployment. Everything else can land later
without a rebuild of the architecture.
