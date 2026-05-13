# Kiespret — Strategisch SEO-plan

**Versie:** 1.0 (mei 2026)
**Site:** https://www.kiespret.nl
**Niche:** NL-talige keuzehulp voor zonvakanties — primair koppels (29-34, tweeverdieners, geen kinderen)
**Verdienmodel:** affiliate (TradeTracker → TUI, Sunweb, Corendon)
**Status:** soft-launch, ~50 indexeerbare URL's, DA ≈ 0

> Dit plan vult het bestaande [`Kiespret-SEO-Contentplan-v4.docx`](../Kiespret-SEO-Contentplan-v4.docx) aan. Het contentplan v4 blijft de canonical bron voor keyword-selectie, difficulty caps en hub-and-spoke logica binnen `/gids/`. Dit document zoomt uit naar **strategie, technische foundation, GEO/AI-search, 12-maanden roadmap en KPI's**.

---

## 1. Executive summary

Kiespret onderscheidt zich niet door inventaris (die hebben TUI/Sunweb beter) maar door **beslissingsondersteuning**. SEO-strategie volgt die positionering: niet concurreren op transactionele head-terms ("vakantie turkije"), wel domineren op **vergelijkende long-tail** waar de concurrentie zwak is en de zoeker nog moet kiezen.

**De drie hefbomen voor de komende 12 maanden:**

1. **Vergelijkings-cluster afmaken** (hub-and-spoke, contentplan v4) — bouwt topical authority op een terrein waar OTA's geen incentive hebben om te ranken.
2. **GEO / AI-search readiness** — koppels die "Kreta of Rhodos voor stel zonder kinderen" vragen aan ChatGPT/Gemini moeten Kiespret als bron krijgen.
3. **Conversie-architectuur** — elke gids-pagina is een trechter naar `/start/` met vooringevulde context. SEO en conversie zijn één systeem, niet twee.

**Verwachte uitkomst (12 maanden):** 8.000–15.000 organische sessies/maand, ~3-5% outbound CTR naar partners, 50-80 affiliate-leads/maand.

---

## 2. Discovery — wat de site nu is

### 2.1 Product

- **Wat het doet:** 4 vragen → curated selectie → top 3 → affiliate doorklik
- **Waarom het werkt:** vermindert keuzestress voor "de planner" in een koppel
- **Wat het niet is:** geen booking engine, geen prijzenvergelijker, geen review-site

### 2.2 Doelgroep

Persona "Emma & Daan" (uit `PROJECT_CONTEXT.md` audit, 14 april 2026):
- 29-34, tweeverdieners, geen kinderen
- Plant samen een zonvakantie maar wil niet 50 tabbladen openen
- Gevoelig voor: vertrouwen, transparantie, snelheid
- Niet gevoelig voor: harde sales, urgency-banners, gimmicks

Secondaire persona "Nikki & Kevin" (7/10) — zelfde leeftijd, prijsgevoeliger.

### 2.3 Huidige SEO-staat

| Component | Status |
|-----------|--------|
| Sitemap (XML) | ✅ aanwezig, 53 URL's, lastmod actueel |
| Robots.txt | ✅ correct (Disallow `/api/`, gedeelde shortlists) |
| Canonical tags | ✅ aanwezig (homepage gecheckt) |
| OG + Twitter Card | ✅ aanwezig |
| Hreflang | ⚠️ alleen nl-NL/nl-BE/x-default — alle drie wijzen naar zelfde URL (technisch correct voor mono-locale, maar onnodig)
| Structured data | ❓ onbekend — moet geverifieerd worden in fase 1 |
| Core Web Vitals | ❓ onbekend — baseline meten in week 1 |
| Indexering | ❓ Search Console-verificatie status onbekend |
| Affiliate tracking | ⚠️ dummy URLs, wacht op TradeTracker (project memory) |
| Trip-data | ⚠️ hardcoded `trips.js` (62KB), migratie naar partner-feeds in plan |

### 2.4 Bestaande content (snapshot 8 mei 2026)

- **Hub-pagina's:** `/gids/`, `/gids/griekenland/`, `/gids/eilanden/`, `/gids/adults-only/`, `/gids/turkije/`, `/gids/albanie/`, `/gids/methodologie/`
- **Vergelijkings-pagina's:** ~30 (Kreta-of-Rhodos, Sicilië-of-Sardinië, etc.)
- **Thema-pagina's:** zonvakantie-mei/juni/september, winterzon-canarische-eilanden, romantische-vakantie-europa
- **Funnel-pagina's:** `/`, `/start/`, `/over/`
- **Legal:** `/privacybeleid/`, `/voorwaarden/`

Het bestaande contentplan v4 blijft leidend voor uitbreiding.

---

## 3. Concurrentieanalyse (samenvatting)

Volledige analyse: zie [`COMPETITOR-ANALYSIS.md`](COMPETITOR-ANALYSIS.md).

**Kort:**

| Concurrent | Wat ze doen | Waar Kiespret kan winnen |
|------------|-------------|--------------------------|
| TUI / Sunweb / Corendon | OTA's met booking engine | Vergelijkende long-tail; zij ranken op transactioneel, niet op "X of Y" |
| Vakantiediscounter, Prijsvrij | Prijs-aggregatoren | Niet-prijs criteria (sfeer, koppelvriendelijkheid, rust) |
| Zoover / TripAdvisor | Reviews | Beslis-hulp ipv eindeloos lezen |
| Vliegwinkel "Vakantie Keuzehulp" | Quiz-tool | Diepere content per uitkomst, geen funnel naar één eigen booking |
| Reisblogs (Reizen Met Richard, Travelvalley, ANWB) | Inspiratie | Persoonlijker, persona-specifieker, decision-first |

**Belangrijkste inzicht:** OTA's hebben geen incentive om "Kos of Rhodos voor koppels" te schrijven — dat houdt hun zoeker juist *uit* hun search-funnel. Daar zit Kiespret's permanente voorsprong.

---

## 4. Strategische pijlers

### 4.1 Pijler 1 — Vergelijkings-autoriteit (kern)

Topical authority op "X of Y voor [doelgroep]" queries. Zie contentplan v4 voor de complete keyword-lijst en clustering.

**Niet-onderhandelbaar:**
- Difficulty cap ≤ 12 voor fase 1 (DA = 0)
- Elke pagina onderdeel van een cluster (hub + 5-10 children)
- "Voor wie wel / niet" module op elke vergelijkingspagina

### 4.2 Pijler 2 — GEO / AI-search readiness

Vanaf 2025-2026 verschuift een groeiend deel van long-tail traffic naar AI-antwoorden (Google AI Overviews, ChatGPT search, Perplexity, Gemini). Voor een keuzehulp is dit **kritisch**: gebruikers vragen letterlijk "welke vakantie past bij ons als koppel zonder kinderen" aan een LLM.

**Implementatie (fase 1-2):**

1. **`llms.txt`** in root met overzicht van alle gids-content + methodologie-pagina
2. **Citeerbare passages** — elke vergelijkingspagina opent met een 50-80-woorden samenvatting in directe voltooide zinnen ("Kies Kreta als je…, kies Rhodos als je…")
3. **FAQ-blokken** met JSON-LD `FAQPage` schema (3-5 vragen per gids-pagina)
4. **Author/methodology signals** — `/gids/methodologie/` is publiek bewijs van hoe Kiespret kiest, met Schema.org `Article` en zichtbare auteur (Tessa)
5. **Robots-toegankelijkheid voor AI-crawlers** — geen blanket Disallow op `GPTBot`, `PerplexityBot`, `Google-Extended` (tenzij commercieel onwenselijk; dan bewuste keuze)
6. **Brand-mention seeding** — Reddit `r/Reisadvies`, Tweakers vakantie-forum, Viva, Margriet community: organische vermeldingen waar AI-modellen op trainen

### 4.3 Pijler 3 — SEO ↔ conversie als één systeem

SEO traffic die niet doorklikt naar `/start/` is verspilling. Architectuur (uit contentplan v4):
- **Laag 1:** contextuele CTA's halverwege + onderaan elke gids-pagina
- **Laag 2:** vooringevulde onboarding via URL-parameters (`/start/?focus=griekenland&style=rustig`)
- **Laag 3:** inline mini-vergelijking direct op de gids zonder doorklik

**Meetpunt:** outbound CTR naar `/start/` per gids-pagina ≥ 8%. Onder die drempel = pagina herzien, niet uitbreiden.

### 4.4 Pijler 4 — Technische foundation

Zie [`IMPLEMENTATION-ROADMAP.md`](IMPLEMENTATION-ROADMAP.md) sectie "Phase 1". Kort:
- Search Console + GA4 + CrUX baseline in week 1
- Schema markup audit + uitbreiding (`Article`, `FAQPage`, `BreadcrumbList`, `Organization`)
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Internal linking matrix (uit v4) implementeren en automatisch valideren via CI smoke-test

---

## 5. KPI-doelen (12 maanden)

Baselines worden in week 1 vastgesteld. Targets zijn realistisch voor een DA-0 site die niet betaalt voor backlinks.

| Metric | Baseline (mei 2026) | 3 mnd (aug) | 6 mnd (nov) | 12 mnd (mei 2027) |
|--------|---------------------|-------------|-------------|-------------------|
| Organische sessies/maand | TBD (~0-200) | 1.000 | 4.000 | 12.000 |
| Top-10 ranking keywords | TBD | 15 | 40 | 100+ |
| Top-3 ranking keywords | TBD | 3 | 12 | 35 |
| Geïndexeerde pagina's | ~50 | 70 | 90 | 110-130 |
| Outbound CTR → `/start/` | TBD | 6% | 8% | 10% |
| Affiliate-clicks/maand | 0 (dummy) | 50 | 200 | 600 |
| Domain Rating (Ahrefs) | 0-2 | 5 | 10 | 18-25 |
| Core Web Vitals (mobiel, 75ᵉ percentiel) | TBD | groen | groen | groen |
| AI-citaties (Perplexity/ChatGPT, manual check) | 0 | 1-2 | 5-10 | 20+ |

> **Belangrijke kanttekening:** affiliate-clicks pas vanaf moment dat TradeTracker live is (project memory: blokkerend). Tot die tijd geldt outbound CTR naar `/start/` als hoofdindicator.

---

## 6. Risico's en aannames

| Risico | Impact | Mitigatie |
|--------|--------|-----------|
| TradeTracker partnership wordt afgewezen of vertraagd | Hoog — geen revenue | Backup: directe affiliate-deals met TUI/Sunweb apart, of Awin als netwerk |
| AI-overviews kannibaliseren long-tail traffic | Middel — je krijgt mention zonder klik | Pijler 2 (GEO): wees de bron die geciteerd wordt + brand-recognition |
| Kostbare "of"-keywords blijken laag-converterend | Hoog — bouwt traffic, geen revenue | Outbound CTR meten per cluster; clusters zonder conversie niet uitbreiden |
| Google update raakt thin programmatic-style content | Middel | Elke pagina ≥ 800 woorden, eigen mening, "voor wie wel/niet"-module |
| Trips.js niet vervangen door partner-feed | Middel — schaalprobleem voor variatie | Plan in project memory; aparte werkstroom |
| Tessa is solo, non-developer | Hoog — bottleneck op uitvoering | Plan zo opbouwen dat content-schrijven (waar Tessa het sterkst is) de bottleneck mag zijn, niet techniek |

---

## 7. Hoe dit plan te gebruiken

| Document | Gebruik wanneer |
|----------|-----------------|
| [`SEO-STRATEGY.md`](SEO-STRATEGY.md) (dit document) | Strategische beslissingen, "moeten we X doen?" |
| [`COMPETITOR-ANALYSIS.md`](COMPETITOR-ANALYSIS.md) | Per cluster de SERP-verificatie doen |
| [`SITE-STRUCTURE.md`](SITE-STRUCTURE.md) | URL beslissen, internal linking valideren |
| [`CONTENT-CALENDAR.md`](CONTENT-CALENDAR.md) | Wat schrijf ik deze week? |
| [`IMPLEMENTATION-ROADMAP.md`](IMPLEMENTATION-ROADMAP.md) | Wat is de volgende technische taak? |
| `Kiespret-SEO-Contentplan-v4.docx` | Definitieve keyword-lijst + difficulty + clustering |

**Wijzigingen aan dit plan:** noteer datum + reden in een audit-log onderaan elk document, zoals het `PROJECT_CONTEXT.md` doet. Verwijder geen oude versies — markeer ze als achterhaald.
