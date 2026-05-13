# Implementatie-roadmap — Kiespret SEO

**Versie:** 1.0 (mei 2026)
**Tessa-context:** non-developer, werkt via GitHub UI + plak-commando's in Terminal. Roadmap is afgestemd op die werkwijze: elk technisch ticket is een concreet stappenplan, geen "implementeer X."

> Vier fases over 12 maanden. Elke fase heeft een hoofddoel — als dat doel niet gehaald is, niet doorgaan naar de volgende fase.

---

## Fase 1 — Foundation (week 1-4)

**Hoofddoel:** baseline gemeten, technische foundation staat, eerste 4 hubs + 3 sterke children gepubliceerd of opgefrist.

### Week 1 — meten en verifiëren

| # | Taak | Hoe | Eigenaar |
|---|------|-----|----------|
| 1.1 | Search Console verificatie checken | login → property `https://www.kiespret.nl` → kijk of er data binnenkomt. Zo niet → DNS-verificatie via Vercel. | Tessa |
| 1.2 | GA4 verificatie | `analytics.js` controleren of measurement ID klopt. Test: bezoek site, real-time view in GA4. | Tessa |
| 1.3 | CrUX baseline noteren | https://pagespeed.web.dev/?url=https://www.kiespret.nl/ — LCP, INP, CLS noteren in `SEO-PLAN/baseline.md` | Tessa |
| 1.4 | Indexeringscheck | Search Console → "Pages" → hoeveel zijn geïndexeerd? Wat zijn excludes? Noteren. | Tessa |
| 1.5 | Sitemap submission | Search Console → Sitemaps → `https://www.kiespret.nl/sitemap.xml` indienen | Tessa |
| 1.6 | Bing Webmaster Tools setup | https://www.bing.com/webmasters/ — sitemap submit. Bing voedt ook ChatGPT-search. | Tessa |

### Week 2 — schema markup audit + uitbreiding

| # | Taak |
|---|------|
| 2.1 | Op homepage: `Organization` + `WebSite` (met `SearchAction`) JSON-LD toevoegen |
| 2.2 | Op `/over/`: `AboutPage` + `Person` (Tessa, met foto + bio) toevoegen |
| 2.3 | Op `/gids/methodologie/`: `Article` met `author` |
| 2.4 | Op alle gids-pagina's: `BreadcrumbList` toevoegen (template-aanpassing) |
| 2.5 | Validatie: https://search.google.com/test/rich-results per template één keer |

**Concreet eerste ticket voor 2.1:**
> Voeg in `index.html` binnen `<head>` na de OG-tags het volgende JSON-LD blok toe:
> ```html
> <script type="application/ld+json">
> {
>   "@context": "https://schema.org",
>   "@type": "Organization",
>   "name": "Kiespret",
>   "url": "https://www.kiespret.nl/",
>   "logo": "https://www.kiespret.nl/apple-touch-icon.png",
>   "description": "Keuzehulp voor koppels die samen een zonvakantie kiezen."
> }
> </script>
> ```

### Week 3 — content fase 1 hubs

- Master hub `/gids/` opfrissen
- Cluster hub `/gids/eilanden/` schrijven
- Cluster hub `/gids/griekenland/` schrijven
- `/gids/eilanden/sicilie-of-sardinie/` opfrissen tot template-standaard

### Week 4 — content fase 1 children + audit

- Cluster hub `/gids/adults-only/` schrijven
- `/gids/eilanden/tenerife-of-gran-canaria/` opfrissen
- `/gids/adults-only-griekenland/` opfrissen
- **Eind-week-4 audit:** controleer dat elke gepubliceerde pagina:
  - ≥ 800 woorden
  - "Voor wie wel/niet" module heeft
  - 3-5 FAQ met JSON-LD
  - 2-3 sibling-links + 1 hub-link
  - Citeerbare opening (eerste 80 woorden in directe zinnen)

**Stop-criterium fase 1:** als baseline-meting niet rond is → blijf in fase 1.

---

## Fase 2 — Expansion (week 5-12)

**Hoofddoel:** fase 1 + 2 contentplan v4 compleet (~14 pagina's), GEO-laag actief, eerste organische rankings.

### Week 5-8 — content fase 1 afmaken

Zie [`CONTENT-CALENDAR.md`](CONTENT-CALENDAR.md) maand 2.

Cadans: 2 pagina's per week, allemaal Griekenland-cluster + 2 eilanden.

### Week 9-12 — GEO laag + fase 2 content

#### GEO-laag (kritisch — zie strategy doc pijler 2)

**Week 9:**
- `llms.txt` toevoegen aan root (zie template hieronder)
- 5 best-presterende pagina's: FAQ-blok toevoegen + JSON-LD `FAQPage`

**`llms.txt` template** (in repo root):
```
# Kiespret — Keuzehulp voor zonvakanties

Kiespret helpt koppels sneller een zonvakantie kiezen.
Beantwoord 4 vragen, vergelijk jullie top 3, en boek bij TUI, Sunweb of Corendon.

## Belangrijkste content
- Methodologie: https://www.kiespret.nl/gids/methodologie/
- Master gids: https://www.kiespret.nl/gids/
- Griekenland: https://www.kiespret.nl/gids/griekenland/
- Eilanden vergelijken: https://www.kiespret.nl/gids/eilanden/
- Adults-only: https://www.kiespret.nl/gids/adults-only/
- Turkije: https://www.kiespret.nl/gids/turkije/
- Albanië: https://www.kiespret.nl/gids/albanie/

## Optionele bron
sitemap: https://www.kiespret.nl/sitemap.xml
```

**Week 10:**
- AI-crawler beleid expliciet maken in `robots.txt`:
  ```
  User-agent: GPTBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: Google-Extended
  Allow: /
  ```
- Eerste handmatige AI-prompt-check (vastleggen in `SEO-PLAN/ai-tracking.md`)

**Week 11-12:**
- `/gids/griekenland/corfu-of-zakynthos/` opfrissen
- `/gids/adults-only-hotel-griekenland/` opfrissen
- `/gids/welke-vakantie-past-bij-mij/` opfrissen — wordt landing-page voor "decision help" zoekers
- Brand-mention seeding: 1 organisch nuttige Reddit-post (`r/Reisadvies` of `r/thenetherlands`), 1 Tweakers vakantie-forum reactie, 1 antwoord op Viva-vraag (regel: alleen *nuttig* zijn, geen spam)

**Stop-criterium fase 2:** als geen enkele pagina in top-20 staat na 12 weken → fase 2 verlengen, NIET doorgaan naar fase 3.

---

## Fase 3 — Scale (week 13-24)

**Hoofddoel:** topical authority gevestigd in twee clusters, eerste affiliate-revenue (na TradeTracker go-live), >50 keywords in top-20.

### Maand 4 (juni)

- Trips.js → partner-feed migratie (zie project memory: blokkerend op TradeTracker)
- 8 nieuwe content-pagina's volgens kalender
- Internal-linking matrix uitbreiden in CI-smoke-test (`.github/scripts/smoke.py`):
  - Check: elke vergelijkingspagina linkt naar zijn cluster-hub
  - Check: elke cluster-hub linkt naar minstens 5 children
  - Check: geen broken internal links

### Maand 5 (juli)

- Performance-optimalisatie ronde:
  - LCP-check op alle gids-pagina's, hero-image lazy-load fixen waar nodig
  - INP-check, JS-blokkers identificeren
  - WebP/AVIF voor alle gids-images (huidige `og-image.png` → ook AVIF variant)
- Schema-uitbreiding: `Review` of `AggregateRating` op start-pagina (alleen als er echte reviews zijn — niet faken)

### Maand 6 (augustus)

- Mid-jaar review:
  - Cluster-performance: welke trekt traffic, welke niet?
  - Conversie-data: outbound CTR per cluster
  - Beslissing: welk fase-3 cluster afmaken vs welke parkeren
- Eerste outreach-batch: 5 reisblogs benaderen voor potentieel gastartikel of mention

**Stop-criterium fase 3:** als outbound CTR onder 4% blijft op trafficsterke pagina's → niet schalen, eerst conversie-architectuur herzien.

---

## Fase 4 — Authority (maand 7-12)

**Hoofddoel:** thought leadership, externe authority-signals, Domain Rating 18-25, voorbereiding op jaar 2.

### Maand 7-8 (sep-okt)

- **PR / media outreach:** pitch aan VTwonen, Margriet, NRC reisrubriek. Hoek: "Nederlandse keuzehulp voor koppels die samen reizen kiezen — minder zoeken, meer beslissen."
- Auteur-bijdragen op grote reisblogs (gastposts met do-follow link)
- 4 nieuwe content-pagina's in fase-3 keyword-set

### Maand 9 (nov)

- Winter-piek content: "Wintervakantie kiezen als koppel" cluster (3-4 pagina's)
- App-strategie heroverwegen (zie `PROJECT_CONTEXT.md` — native app is later-fase)

### Maand 10 (dec)

- "Vakantie 2027 boeken" content (zoekvolume-piek in december)
- Affiliate-uitbreiding: Awin? Booking.com? Andere TradeTracker-partners?

### Maand 11 (jan)

- Vroegboeker-piek content (meeste boekingen jan-feb)
- Email-funnel testen: lead capture op gids-pagina's met "ontvang vergelijkingen voor [cluster]"

### Maand 12 (feb)

- **Volledig jaar-1 review:**
  - Welke clusters presteerden, welke niet?
  - Wat was de outbound CTR per cluster?
  - Wat was de affiliate-revenue?
  - KPI-targets gehaald (zie `SEO-STRATEGY.md` sectie 5)?
- **Plan jaar 2** opstellen.

---

## Niet-onderhandelbare technische checks (continu)

| Check | Frequentie | Hoe |
|-------|------------|-----|
| Sitemap valideren | Bij elke nieuwe pagina | Voeg URL handmatig toe + lastmod (CI smoke-test vangt afwijkingen) |
| CWV groen | Maandelijks | https://pagespeed.web.dev/ |
| Search Console errors | Wekelijks | "Pages" + "Crawl stats" |
| Broken internal links | Bij elke deploy | CI smoke-test (uitbreiden in fase 3) |
| Schema validatie | Bij nieuwe template | https://search.google.com/test/rich-results |
| Trailing slash op alle URL's | Continu | CI smoke-test vangt absolute paden (project memory) |
| Geen silent try/catch | Bij elke deploy | Code-review regel (project memory) |

---

## Risk-register

| Risico | Trigger | Actie |
|--------|---------|-------|
| TradeTracker afgewezen | Aanmelding faalt | Awin / direct partner outreach (TUI affiliate, Sunweb partnerprogramma) |
| Pagina's blijven onder #20 | 12 weken geen ranking | SERP-verificatie opnieuw, content dieper maken (≥ 1500 woorden, eigen ervaring), backlink-profiel checken |
| AI-overviews vangen alle clicks | Klikratio gaat dalen | Brand-recognition werk: meer mensen Kiespret-naam laten kennen via ander kanaal |
| Tessa burn-out (1 persoon) | Cadans valt onder 1 pagina/week | Onderhoud-modus: 1 pagina/2 weken, focus op refresh ipv nieuw |
| Vercel cleanUrls breekt iets | 308-redirect loop | Project memory: cleanUrls + trailingSlash dwingt absolute paden af; check share-URL bug en CI smoke-test |
| `trips.js` schaalprobleem | Veel duplicate trips of dataverversing nodig | Partner-feed migratie versnellen (project memory plan) |

---

## Concrete eerste-week-quickstart voor Tessa

**Maandag (~30 min):**
1. Open Search Console — check property verificatie
2. Open https://pagespeed.web.dev/?url=https://www.kiespret.nl/ — schrijf LCP, INP, CLS op in nieuwe file `SEO-PLAN/baseline.md`
3. Voeg toe in `baseline.md`: huidige geïndexeerde pagina's, GA4 sessies vorige 30 dagen

**Dinsdag (~45 min):**
4. `Organization` JSON-LD toevoegen aan `index.html` (template hierboven)
5. Test via https://search.google.com/test/rich-results

**Woensdag (~30 min):**
6. Bing Webmaster Tools account aanmaken + sitemap submitten

**Donderdag (~30 min):**
7. `llms.txt` aanmaken in repo root (template hierboven)
8. `robots.txt` uitbreiden met expliciete AI-crawler permits

**Vrijdag (~1 uur):**
9. Eerste pagina opfrissen volgens template-standaard (kies de meest-presterende vergelijkingspagina volgens GA4)

**Eind week 1: foundation gelegd, klaar voor week 2 schema-rollout.**

---

## Audit log

- **2026-05-08** — versie 1.0. Herzien na elke fase-evaluatie (maand 1, 3, 6, 12).
