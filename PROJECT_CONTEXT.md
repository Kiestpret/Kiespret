# Project Context

Context captured on 2026-04-09.

## Project Summary

This project explores a travel product that helps users discover and choose package holidays through a swipe-based experience similar to Tinder.

The original concept started as an iOS app, but the current strategic direction is `web-first` for acquisition and validation, with a native iOS app as a later retention product if the concept shows traction.

## Core Idea

Users browse package holidays by swiping through curated trips instead of using traditional filter-heavy travel websites.

The product is not meant to replace travel providers such as TUI or Sunweb. Instead, it should:

- reduce choice overload
- help users reach a shortlist faster
- drive high-intent clicks to partner sites
- monetize through affiliate deeplinks rather than handling booking directly

## Why This Could Work

The strongest value is not "Tinder for travel" as a gimmick, but:

- faster decision-making
- less filter stress
- clearer trip matching
- better shortlist creation for the person who usually plans the trip

The experience should feel like a travel matchmaker rather than a generic OTA.

## Market / Existing Products

Research found that swipe-style travel products already exist in some form, so the swipe mechanic alone is not unique.

What still appears open:

- swipeable `package holidays` rather than only inspiration
- a strong focus on decision-making instead of browsing
- a workflow for the `planner` in a couple or family

Conclusion:

- the concept is not fully novel
- but there is still room for a sharper, better-positioned product

## Recommended Product Positioning

Recommended positioning:

`The fastest way for couples or families to choose a holiday.`

Avoid positioning it simply as:

`Tinder for travel`

Better framing:

- less filter stress
- faster shortlist
- direct partner booking

## Differentiation Opportunities

The strongest differentiators discussed were:

- direct path from discovery to partner booking
- smart matching based on budget, departure airport, travel duration, and travel style
- shortlist creation instead of endless search
- clear "why this trip fits you" explanations
- later: shared or collaborative choosing

## Booking / Supply Model

Recommended model:

- `affiliate deeplink model`

Why:

- no need to build a booking engine
- no payment complexity
- less operational and legal overhead
- easier MVP

Likely product behavior:

- user discovers and saves trips in our product
- clicks through to the travel provider to complete booking

Important caveat:

- final pricing and availability always remain with the partner

## Partner Discussion So Far

We discussed loading package holidays from providers such as TUI or Sunweb.

Key conclusion:

- likely possible via affiliate or partner routes
- not something to assume as an open public booking API
- scraping should be avoided

Practical path:

1. start with affiliate / partner feeds and deeplinks
2. keep booking on the provider side
3. explore deeper commercial integrations later if traction appears

## Best Niches Considered

### 1. Couples

Current strongest recommendation for brand and messaging.

Why:

- strong emotional purchase
- easy-to-understand use case
- one person often does the research but wants to account for the partner
- good fit for shortlist-based discovery

### 2. Families

Potentially very strong problem/solution fit.

Why:

- high planning friction
- concrete filters matter a lot
- decision support may be especially valuable

### 3. Budget sun seekers

Easier to test at scale, but less differentiated as a brand.

## Important Product Insight

We explicitly discussed that "choosing together" sounds attractive, but in reality one person often researches and books the trip.

Therefore the product should initially be built for:

- the planner in a couple or family

Not necessarily for:

- two equal users actively swiping together in real time

Collaborative features can come later.

## Business Model

Primary revenue model:

- affiliate income from leads and/or bookings

Later potential revenue streams:

- sponsored placements
- featured deals
- premium features for users
- B2B / white-label tools for travel brands

### Main Business Risk

The biggest risk discussed:

- users enjoy the swipe experience
- but do not click through or book enough to support a viable business

This means engagement alone is not enough. The business only works if the product improves commercial intent and downstream conversion.

## Business Case Summary

### Strengths

- high-ticket category
- real consumer pain around travel choice overload
- web-first validation is relatively cheap
- affiliate-first model avoids booking complexity

### Weaknesses / Risks

- dependence on partner inventory and affiliate terms
- potentially low margins
- trust issues if pricing differs from partner sites
- hard to scale if traffic acquisition becomes too expensive

### What Must Be Proven

- users understand the concept quickly
- users build shortlists
- users click through to providers
- at least one niche meaningfully outperforms a generic audience

## Lean Business Model Canvas Summary

### Problem

- travel search is overwhelming
- too many filters and tabs
- difficult to decide quickly on a package holiday

### Customer Segments

- primary: planner in a couple
- secondary: planner in a family
- later: budget sun travelers
- later B2B: travel providers

### Unique Value Proposition

- fastest way to choose a holiday as a couple or family

### Solution

- web onboarding
- swipeable trip deck
- shortlist
- partner deeplink

### Channels

- SEO
- TikTok / Instagram / Meta
- Google Search
- Pinterest
- shortlist sharing
- later App Store for retention

### Revenue

- affiliate
- sponsored placements
- premium
- B2B later

### Costs

- design and development
- hosting and analytics
- content and ads
- data / feed integration

### Key Metrics

- landing page to demo start
- swipes per session
- shortlist rate
- outbound click rate
- lead capture rate
- later conversion to booking where measurable

### Unfair Advantage

- sharp focus on decision support rather than generic travel search
- web-first validation
- designed for the actual planner persona

## Web-First Strategy

We agreed that acquisition will likely be much easier on the web than through a native app install.

Current strategic recommendation:

- `web first for discovery and validation`
- `native app later for retention`

Why:

- easier to get traffic from search and social
- lower friction than asking for an app install immediately
- faster experimentation with positioning and niches
- app can later serve saved shortlists, alerts, and returning users

## Funnel Strategy

Recommended funnel:

1. user discovers the concept via social, ads, or search
2. user lands on a niche-specific mobile-first page
3. user starts a lightweight onboarding flow
4. user swipes through matched trips
5. user creates a shortlist
6. user clicks through to a provider or leaves an email
7. later: user returns via app, email, alerts, or saved shortlist

## Growth Strategy Discussed

### Acquisition

- niche landing pages
- short-form social content
- search intent pages
- performance marketing to web, not app store first

### Content Themes

For couples:

- "Find a holiday you both want"
- "The fastest way to choose as a couple"

For families:

- "Find a family holiday without filter chaos"
- "Choose a child-friendly package holiday faster"

## Current Product Assets in This Repo

### iOS Prototype

There is a basic SwiftUI iPhone prototype under:

- `/Users/tessabouters/Documents/New project/VacationSwipe`

This includes:

- onboarding
- swipe deck
- trip details
- shortlist

Important note:

- this has not been fully validated in Xcode in this environment because Xcode tooling was unavailable here

### Web Demo / Landing Site

There is a web-first prototype under:

- `/Users/tessabouters/Documents/New project/web-preview`

Current files:

- [`index.html`](/Users/tessabouters/Documents/New project/web-preview/index.html)
- [`styles.css`](/Users/tessabouters/Documents/New project/web-preview/styles.css)
- [`app.js`](/Users/tessabouters/Documents/New project/web-preview/app.js)

Current web experience includes:

- landing page
- product positioning
- niche explanation
- embedded mobile demo
- onboarding
- swipeable discover flow
- trip detail state
- shortlist state
- simple lead capture demo

Local preview was run through:

- `http://localhost:8000`

## Roadmap

### 30 Days

Goal:

- validate whether people understand and want the concept

Priorities:

- sharpen positioning
- pick a first niche
- improve the website
- add better measurement
- test interest and engagement

### 60 Days

Goal:

- turn the prototype into a real web MVP

Priorities:

- production-ready web structure
- real lead capture
- shortlist sharing
- partner deeplink architecture
- content pages
- initial affiliate setup

### 90 Days

Goal:

- evaluate whether the concept is commercially viable

Priorities:

- test traffic channels
- compare niches
- measure outbound and lead economics
- decide whether to double down on web, build the native app, or reposition

## Week 1 Plan

Week 1 focus:

- sharpen the proposition
- choose the first niche
- align the site with that niche
- define validation metrics

### What Codex Can Do

- rewrite homepage copy
- tighten positioning and CTA language
- improve the website and demo content
- write KPI definitions
- create alternative messaging directions
- improve the visual and interaction polish

### What Tessa Can Do

- choose first niche: likely `couples` or `families`
- decide whether to keep `Tripr` as the name
- define preferred tone and brand feel
- provide taste feedback on the website
- identify potential first partners
- prepare a list of people for early feedback

## Current Recommended Default Assumptions

These were recommended, but should still be treated as working assumptions until explicitly confirmed:

- first niche: `couples`
- working brand name: `Tripr`
- tone: warm, modern, helpful, not overly playful
- strategy: web-first
- monetization: affiliate-first

## Open Decisions

The following are still open and should be finalized:

- final brand name
- whether to start with couples or families
- desired tone and visual style
- which travel providers to prioritize first
- whether the next implementation step should be:
  - cleaner production web app
  - measurement / analytics
  - lead capture backend
  - partner/deeplink structure

## Recommended Immediate Next Steps

1. Confirm first niche
2. Confirm or change the working brand name
3. Refine the current website around one target audience
4. Add measurement to the web demo
5. Prepare a first small user validation round
6. Only after traction: move toward production web MVP and then native app

## Guiding Principle

Do not optimize first for "how fun the swipe feels."

Optimize first for:

- clarity
- shortlist creation
- outbound click intent
- niche fit
- commercial viability

---

## Audit Log

### 14 april 2026 — Persona-walkthrough audit

Volledige doorloop vanuit Emma & Daan (gouden persona, 9/10) en Nikki & Kevin (secondaire, 7/10).

**Wat sterk is:**
- Snelheid van de flow (2 min van landing → top 3)
- Trust line op elke kaart ("Boek direct bij TUI, geen extra kosten")
- Redactioneel advies boven vergelijking
- Duo-sessie via WhatsApp (lage drempel)
- Transparant verdienmodel op Over-pagina

**Gevonden issues en status:**

| # | Issue | Persona | Status |
|---|-------|---------|--------|
| 1 | matchReason ontbrak op resultaatkaarten | Nikki | Gefixed |
| 2 | Wacht-scherm duo: onduidelijk wat er daarna gebeurt | Emma | Gefixed |
| 3 | Dummy affiliate URLs | Beide | Wacht op TradeTracker |
| 4 | Stockfoto's i.p.v. hotelfoto's | Emma | Wacht op echte data |
| 5 | Partner A ziet match niet automatisch na Partner B | Emma | Geparkeerd (vereist polling) |

### 14 april 2026 — Bouwplan v3 audit

Volledige controle van app tegen technisch bouwplan v3.

**5 afwijkingen gefixed:**
1. Shortlist hard begrensd op 3 met vervangmodal
2. Besluitzekerheid-microvraag ("Voelt dit als een duidelijke keuze?")
3. Shortlist opslaan in localStorage
4. Open Graph + Twitter Card meta tags
5. affiliate.js als apart bestand

**1 afwijking bewust geparkeerd:**
6. Partner A automatisch match tonen (vereist WebSockets/polling)
