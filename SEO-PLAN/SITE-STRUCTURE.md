# Site-structuur — Kiespret

**Versie:** 1.0 (mei 2026)

> Architectuur-document. Vult contentplan v4 (sectie 2 "Master-hubstructuur") aan met conventies voor URL's, internal linking, breadcrumbs en navigatie. Bedoeld als referentie voor elke nieuwe pagina.

---

## 1. URL-conventies

### 1.1 Vercel-config (CRITICAL)

Uit project memory: `vercel.json` heeft `cleanUrls: true` + `trailingSlash: true`. Dit betekent:

- ✅ Goed: `/gids/griekenland/kreta-of-rhodos/` (clean, trailing slash)
- ❌ Fout: `/gids/griekenland/kreta-of-rhodos.html` (geeft 308 redirect)
- ❌ Fout: `/gids/griekenland/kreta-of-rhodos` (geeft 308 redirect)

**Regel:** alle interne links, share-URLs, sitemap-entries en JS-redirect targets gebruiken `/path/` met trailing slash. De CI smoke-test (`.github/scripts/smoke.py`) vangt dit; output rood = niet mergen.

### 1.2 Slug-regels

- **Taal:** Nederlands, kleine letters, koppelteken-gescheiden
- **Speciale tekens:** geen accenten (`sicilie`, niet `sicilië`); `é` → `e`
- **Lengte:** ≤ 50 tekens
- **Vergelijkingen:** altijd `[a]-of-[b]` (alfabetisch eerste eerst), bv. `kos-of-rhodos`
- **Cluster:** subfolder ipv prefix → `/gids/griekenland/kreta-of-rhodos/`, niet `/gids/kreta-of-rhodos/`
- **Geen datums in URL** (geen `/2026/`)
- **Geen ID's in URL** (geen `/?id=42`)

---

## 2. Site-architectuur

```
/                                          [funnel — homepage]
├── /start/                                 [funnel — onboarding flow]
├── /over/                                  [trust — auteur, methodologie kort]
├── /gids/                                  [MASTER HUB]
│   ├── /gids/methodologie/                [E-E-A-T]
│   ├── /gids/welke-vakantie-past-bij-mij/ [decision-help, top-funnel]
│   │
│   ├── /gids/griekenland/                 [CLUSTER 1 HUB]
│   │   ├── /gids/griekenland/kos-of-rhodos/
│   │   ├── /gids/griekenland/kreta-of-rhodos/
│   │   ├── /gids/griekenland/kos-of-kreta/
│   │   ├── /gids/griekenland/corfu-of-zakynthos/
│   │   ├── /gids/griekenland/rhodos-of-zakynthos/
│   │   ├── /gids/griekenland/rustige-eilanden/
│   │   └── /gids/griekenland/romantisch-grieks-eiland/
│   │
│   ├── /gids/eilanden/                    [CLUSTER 2 HUB]
│   │   ├── /gids/eilanden/sicilie-of-sardinie/
│   │   ├── /gids/eilanden/tenerife-of-gran-canaria/
│   │   ├── /gids/eilanden/lanzarote-of-fuerteventura/
│   │   ├── /gids/eilanden/mallorca-of-menorca/
│   │   ├── /gids/eilanden/ibiza-of-mallorca/
│   │   ├── /gids/eilanden/malta-of-cyprus/
│   │   ├── /gids/eilanden/cyprus-of-kreta/
│   │   └── /gids/eilanden/canarische-eilanden-vergelijken/
│   │
│   ├── /gids/adults-only/                 [CLUSTER 3 HUB]
│   │   ├── /gids/adults-only-griekenland/        ← let op: bestaande slug zonder subfolder
│   │   ├── /gids/adults-only-hotel-griekenland/
│   │   ├── /gids/adults-only-turkije/
│   │   ├── /gids/adults-only-spanje/
│   │   └── /gids/vakantie-zonder-kinderen/
│   │
│   ├── /gids/turkije/                     [CLUSTER 4 HUB — NIEUW]
│   │   ├── /gids/turkije/side-of-alanya/
│   │   ├── /gids/turkije/antalya-of-side/
│   │   ├── /gids/turkije/bodrum-of-antalya/
│   │   ├── /gids/turkije/all-inclusive/
│   │   ├── /gids/turkije/beste-reistijd/
│   │   ├── /gids/turkije/strandvakantie/
│   │   └── /gids/turkije/turkse-riviera/
│   │
│   ├── /gids/albanie/                     [CLUSTER 5 HUB — NIEUW]
│   │   ├── /gids/albanie/saranda-of-ksamil/
│   │   ├── /gids/albanie/albanese-riviera/
│   │   ├── /gids/albanie/veiligheid/
│   │   ├── /gids/albanie/kosten/
│   │   ├── /gids/albanie/beste-reistijd/
│   │   └── /gids/albanie/strandvakantie/
│   │
│   ├── [Cross-cluster vergelijkingen — leven op /gids/ root]
│   │   ├── /gids/turkije-of-griekenland/
│   │   ├── /gids/turkije-of-egypte/
│   │   ├── /gids/albanie-of-griekenland/
│   │   ├── /gids/albanie-of-kroatie/
│   │   ├── /gids/albanie-of-montenegro/
│   │   ├── /gids/dubrovnik-of-split/
│   │   └── /gids/vakantie-twee-personen/
│   │
│   └── [Seasonal — leven op /gids/ root]
│       ├── /gids/zonvakantie-mei/
│       ├── /gids/zonvakantie-juni/
│       ├── /gids/zonvakantie-september/
│       ├── /gids/winterzon-canarische-eilanden/
│       └── /gids/romantische-vakantie-europa/
│
├── /privacybeleid/
└── /voorwaarden/
```

### 2.1 Inconsistentie om op te lossen (fase 1)

De huidige sitemap heeft `/gids/adults-only-griekenland/` op root-niveau in plaats van `/gids/adults-only/griekenland/`. Volgens contentplan v4 moet dit binnen `/gids/adults-only/` cluster zitten.

**Beslissing voor fase 1:**
- Optie A (aanbevolen) — laat bestaande slugs staan (geen 301-storm), behandel `/gids/adults-only/` als hub die linkt naar de root-level pages
- Optie B — verhuis naar subfolders met 301-redirects (alleen als al heel weinig backlinks zijn — geldt nu)

**Aanbeveling:** kies A nu. Heroverweeg in fase 3 als blijkt dat clean folder-structure beter rankt.

### 2.2 "Cross-cluster" pagina's

Sommige vergelijkingen passen niet binnen één cluster (bv. "Turkije of Griekenland"). Conventie:
- **Slug op `/gids/` root**: `/gids/turkije-of-griekenland/`
- **Hub-link**: beide cluster-hubs (Turkije + Griekenland) linken er naar
- **Internal linking**: linkt zelf naar beide cluster-hubs + 1-2 children uit elk

---

## 3. Internal linking matrix

Uit contentplan v4 sectie 3, hier als praktische regel-set.

### 3.1 Hub-pagina

Een cluster-hub linkt naar:
- ✅ Master hub (`/gids/`)
- ✅ Alle children in eigen cluster (5-10 links)
- ✅ 1-2 cross-cluster pages die relevant zijn
- ❌ Geen externe links naar concurrenten
- ✅ Affiliate-CTA naar `/start/?focus=[cluster]`

### 3.2 Child-pagina (vergelijking)

Een vergelijkingspagina linkt naar:
- ✅ Eigen cluster-hub (1 link, in de breadcrumb + minstens 1x in body)
- ✅ 2-3 sibling-vergelijkingen ("Bekijk ook…")
- ✅ 1 cross-cluster relevante pagina (bv. Kos-of-Rhodos → Adults Only Griekenland)
- ✅ `/gids/methodologie/` (E-E-A-T signaal)
- ✅ `/start/?focus=[cluster]` als CTA
- ❌ Geen links naar OTA-domeinen behalve via `/start/` of via expliciete affiliate-links met `rel="sponsored nofollow"`

### 3.3 Anchor-tekst regels

- **Wel:** beschrijvend, natuurlijk lopend
  - "Bekijk ook onze vergelijking van [Kreta en Rhodos]"
  - "Lees meer over [adults-only Griekenland]"
- **Niet:** exact-match keyword stuffing
  - ❌ "kreta of rhodos" als losse linktekst
  - ❌ "klik hier"
- **Verhouding:** ~70% beschrijvend, ~20% brand/contextueel ("onze methodologie", "Kiespret"), ~10% exact-match

### 3.4 Validatie via CI

De smoke-test (`.github/scripts/smoke.py`) zou idealiter checken:
- Elke gids-pagina heeft een breadcrumb-link naar zijn cluster-hub
- Elke cluster-hub linkt naar minstens 5 children
- Geen broken internal links

Toevoegen aan smoke-test als nieuwe check in fase 2 (zie roadmap).

---

## 4. Breadcrumbs

Elke pagina onder `/gids/` heeft een visuele breadcrumb + JSON-LD `BreadcrumbList`:

```
Home > Gids > Griekenland > Kos of Rhodos
```

JSON-LD voorbeeld voor `/gids/griekenland/kos-of-rhodos/`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.kiespret.nl/"},
    {"@type": "ListItem", "position": 2, "name": "Gids", "item": "https://www.kiespret.nl/gids/"},
    {"@type": "ListItem", "position": 3, "name": "Griekenland", "item": "https://www.kiespret.nl/gids/griekenland/"},
    {"@type": "ListItem", "position": 4, "name": "Kos of Rhodos"}
  ]
}
```

---

## 5. Navigatie

### 5.1 Top-nav (sticky, mobiel-first)

- **Logo (links)** → `/`
- **"Gids"** → `/gids/`
- **CTA-knop "Start" (rechts, sunset-color)** → `/start/`

### 5.2 Footer

- **Kolom 1 — Navigatie:** Home, Start, Gids, Over Kiespret
- **Kolom 2 — Populaire gidsen:** top 5 best-presterende gids-pagina's (handmatig roteren per kwartaal o.b.v. Search Console)
- **Kolom 3 — Legal:** Privacybeleid, Voorwaarden
- **Onderaan:** "Kiespret is een keuzehulp. We boeken niets zelf — boekingen lopen via TUI, Sunweb of Corendon. [Lees meer](/over/)."

---

## 6. Page templates per type

| Type | Template-componenten |
|------|---------------------|
| **Homepage** | Hero, USP, sample comparisons, social proof, CTA |
| **`/start/`** | Onboarding (4 vragen), top-3 resultaat, deeplinks |
| **Master hub `/gids/`** | Intro + 3-5 cluster-hubs uitgelicht, link naar methodologie |
| **Cluster hub** | Cluster-intro, 5-10 child-cards, "voor wie wel/niet"-module, CTA |
| **Vergelijkingspagina** | Citeerbare opening, vergelijkingstabel, "voor wie wel/niet", FAQ, CTA, related links |
| **Thema-pagina (seasonal)** | Intro, 3-5 bestemmingsuggesties met link naar vergelijkingen, CTA |
| **Methodologie** | Hoe Kiespret werkt, criteria, transparantie affiliate, auteur-info |
| **Over** | Tessa's verhaal, contact, persmaterialen |

---

## 7. Schema markup per template

| Template | Schema's |
|----------|----------|
| Homepage | `Organization`, `WebSite` (met `SearchAction`) |
| Master hub | `CollectionPage`, `BreadcrumbList` |
| Cluster hub | `CollectionPage`, `BreadcrumbList` |
| Vergelijkingspagina | `Article`, `BreadcrumbList`, `FAQPage` |
| Thema-pagina | `Article`, `BreadcrumbList` |
| Methodologie | `Article` (met `author`), `BreadcrumbList` |
| `/start/` | géén schema (interactieve tool) |
| `/over/` | `AboutPage`, `Person` (Tessa) |

Implementatie-volgorde: zie [`IMPLEMENTATION-ROADMAP.md`](IMPLEMENTATION-ROADMAP.md) fase 1.

---

## 8. Indexering-regels

| URL-patroon | Robots | Reden |
|-------------|--------|-------|
| `/`, `/start/`, `/over/`, `/gids/**` | `index, follow` | Default |
| `/start/?shortlist=*` | Disallow in robots.txt | Persoonlijke shareable URL |
| `/start/?duo=*` | Disallow in robots.txt | Persoonlijke duo-sessie |
| `/start/?focus=*` | `index, follow` (de query is geen unieke gebruiker, wel functioneel — maar canonical → `/start/`) | Marketing-deeplink |
| `/api/**` | Disallow in robots.txt | Endpoints |
| `/privacybeleid/`, `/voorwaarden/` | `index, follow`, lage priority | Compliance |
| `/404.html` | `noindex` | Errorpage |

**Belangrijk:** alle `/start/?*` varianten moeten `<link rel="canonical" href="https://www.kiespret.nl/start/">` hebben om duplicate-content te voorkomen.

---

## Audit log

- **2026-05-08** — versie 1.0. Volgende update: na fase 1 (schema-implementatie + smoke-test uitbreiding).
