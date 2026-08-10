# Kiespret — Strategisch SEO-plan (v1.1 refresh)

**Versie:** 1.1 (augustus 2026) — *refresh náást [v1.0](SEO-STRATEGY.md), die intact blijft als audit-trail*
**Site:** https://www.kiespret.nl
**Status:** van soft-launch naar groeifase — **118 sitemap-URL's**, affiliate live via Corendon, GEO-laag actief
**Aanleiding:** dit is de in de [roadmap](IMPLEMENTATION-ROADMAP.md) geplande **mid-jaar review (Fase 3, maand 6)**.

> v1.0 was een *bouwplan* voor een DA-0 soft-launch met ~50 URL's. Sindsdien is het grootste deel van Fase 1-2 uitgevoerd. Dit document meet die voortgang, vult de "❓ onbekend"-velden uit v1.0 met echte audit-data, en herprioriteert voor **aug 2026 → feb 2027**. De keyword-selectie/clustering blijft in `Kiespret-SEO-Contentplan-v4.docx`; de overige v1.0-docs (`COMPETITOR-ANALYSIS`, `SITE-STRUCTURE`, `CONTENT-CALENDAR`) blijven geldig tenzij hieronder anders vermeld.

---

## 1. Wat er is gebeurd sinds v1.0 (mei → aug)

De site heeft stil bijna de hele Fase 1-2 roadmap afgewerkt. Gemeten stand:

| v1.0-item | Toen (mei) | Nu (aug) |
|-----------|-----------|----------|
| Indexeerbare URL's | ~50 | **118** (sitemap) / 113 gids-pagina's |
| Affiliate | ⚠️ dummy URLs, wacht op TradeTracker | ✅ **live** — echte `/api/go`-links, Corendon, `rel="sponsored nofollow"` |
| Structured data | ❓ onbekend | ✅ Article/Review + FAQPage + BreadcrumbList op alle gecontroleerde templates; Organization+WebSite op home |
| `llms.txt` | ❌ | ✅ aanwezig in root |
| AI-crawler beleid (robots) | ❌ | ✅ GPTBot / PerplexityBot / Google-Extended expliciet `Allow` |
| Methodologie-pagina | deels | ✅ `/gids/methodologie/` live, gelinkt vanuit gidsen |
| Citeerbare openingen (GEO) | plan | ✅ TL;DR-blok + "voor wie wel/niet" standaard in template |
| Seizoenscluster | 3 maanden | ✅ **volledige 13-maanden set** (`zonvakantie-*`) |
| Auteur-E-E-A-T | plan | ✅ `Person`-schema (Tessa, LinkedIn `sameAs`) + zichtbare auteursbox |
| **Nieuw contenttype** | — | ✅ **`/gids/hotelreviews/`** — first-hand review met eigen foto's + video's |

**Conclusie:** Fase 1 en 2 zijn inhoudelijk klaar. De site zit nu feitelijk in **Fase 3 (Scale)**. De bottleneck is verschoven van "bouwen" naar **kwaliteit borgen, indexatie/rankings verzilveren, en het nieuwe review-contenttype uitbouwen**.

---

## 2. Bijgewerkte SEO-staat (met echte audit-data)

Op 5 aug 2026 zijn 5 sleutelpagina's individueel geaudit. Dat vult de v1.0-onbekenden:

| Component | Status | Bron |
|-----------|--------|------|
| Structured data | ✅ aanwezig — maar **1 bug + 1 systeemkeuze** (zie §3) | 5-pagina audit |
| Templatekwaliteit | ✅ nieuwste template (`zonvakantie-december`, score 89/100) is de standaard | audit |
| Core Web Vitals (HTML-signalen) | 🟡 goed opgezet (hero-preload, `fetchpriority`, lazy-load, dimensies) — **maar afbeeldingen zijn JPEG, niet WebP/AVIF** | audit |
| Interne links | ✅ sterk; alle gecontroleerde targets bestaan behalve `/gids/hotelreviews/` (§3) | audit |
| Hreflang | ✅ nl-NL/nl-BE/x-default consistent | audit |
| Indexatie / rankings / GA4-sessies | ❓ **nog steeds in te vullen vanuit Search Console + GA4** | — |

> De enige echte "unknown" die overblijft is de **externe** data (Search Console indexatie, rankings, GA4-verkeer). Die kan ik niet meten — dat blijft Tessa's week-1-taak uit de v1.0-roadmap. **Actie: vul `SEO-PLAN/baseline.md` alsnog in** — zonder die cijfers blijft de KPI-tabel schattingen.

---

## 3. Systeembevindingen uit de audit (belangrijkste nieuwe input)

Deze gelden **template-breed**, niet per pagina — daarom horen ze in de strategie, niet in een losse fix:

1. **🟠 Kapotte breadcrumb naar een niet-bestaande hub.** `/gids/hotelreviews/` heeft **geen index-pagina**, terwijl de review-breadcrumb (en het schema) ernaar verwijst. Dit is tegelijk een *fout* én een *kans*: bouw `/gids/hotelreviews/` als hub-pagina. Reviews met eigen media zijn je sterkste E-E-A-T-asset — een cluster eromheen is strategisch waardevol.

2. **🟠 Homepage mist semantische koppen.** Sectietitels op `index.html` staan als `<div class="section-title">` i.p.v. `<h2>`. Zwakke document-outline op je belangrijkste pagina. Puur een template-fix, styling blijft gelijk.

3. **🟡 Schema-duplicatie-bug** op `albanie-of-montenegro` (image/description beland in `publisher` + `logo` i.p.v. alleen Article). Geldig JSON, maar rommelig. Controleer of dezelfde verkeerde edit elders is gekopieerd.

4. **🟡 Koppen-skip (H1 → H3) in oudere templates.** Aanwezig op Saranda/Montenegro/Corendon (CTA-blok met `<h3>` vóór eerste `<h2>`), **afwezig** op de nieuwste template. → oude pagina's naar nieuwe standaard trekken.

5. **🟡 Afbeeldingen zijn JPEG.** Systeembreed. WebP/AVIF-conversie = de grootste resterende CWV-winst (v1.0 Fase-3 item, nog niet gedaan).

6. **🟢 FAQPage-schema overal** — bewuste keuze. Levert geen rich results (Google-restrictie tot gov/health) maar is waardevol voor AI Overviews. **Laten staan**, maar niet rekenen op sterretjes in de SERP.

**Rode draad:** je templatekwaliteit is duidelijk gestegen (nieuwste pagina 89/100 vs oudste 80/100). De winst zit nu in **consistentie**: alle oudere pagina's optrekken naar de nieuwste standaard, plus een handvol systeem-fixes.

---

## 4. Herprioritering — de volgende 6 maanden (aug '26 → feb '27)

v1.0's Fase-3/4 blijft de ruggengraat. Aanpassingen op basis van de werkelijke stand:

### Pijler A — Kwaliteit consolideren (nieuw als #1)
Je hebt 113 gids-pagina's; niet allemaal op de nieuwste standaard. Vóór verder schalen:
- Bouw `/gids/hotelreviews/`-hub (fixt de 404 + opent nieuw cluster)
- Homepage-koppen semantisch maken
- Schema-bug fixen + template-breed verifiëren
- Oudere templates optrekken (koppen, WebP, schema-image/description)
- **Meetlat:** geen nieuwe pagina's tot de audit-fixes uit §3 gedaan zijn

### Pijler B — Indexatie & rankings verzilveren
De GEO/schema/content-basis staat; nu de oogst:
- **Vul de baseline in** (Search Console indexatie + GA4 + CrUX) — kan niet uitgesteld blijven
- Per cluster SERP-positie checken; onder #20 na 12 weken = content verdiepen, niet uitbreiden
- Handmatige AI-citatie-check (Perplexity/ChatGPT) vastleggen in `ai-tracking.md`

### Pijler C — Review-cluster uitbouwen (nieuwe kans)
Het hotelreview-type is je meest onderscheidende, minst kopieerbare content (eigen foto's/video's, echte 11-daagse ervaring). OTA's en AI kunnen dit niet namaken.
- Hub + 3-5 reviews van resorts die je écht kent
- Koppel reviews aan de affiliate-flow (review → `/start/` of directe `/api/go`)
- `Review`-schema is al correct opgezet — schaalbaar

### Pijler D — Affiliate-conversie meten (nu mogelijk)
Affiliate is live → v1.0's "outbound CTR naar /start/" kan nu **echte revenue-CTR** worden.
- Meet outbound CTR naar `/api/go` per cluster
- v1.0-drempel blijft: cluster < 4% outbound → conversie-architectuur herzien vóór schalen

---

## 5. Bijgewerkte KPI-tabel

Baseline-kolom is nog steeds deels TBD (Tessa's Search Console/GA4-invoer). Milestone "aug" is nu een **checkpoint** i.p.v. doel.

| Metric | v1.0-doel aug | Werkelijk aug '26 | Doel nov '26 | Doel feb '27 |
|--------|---------------|-------------------|--------------|--------------|
| Indexeerbare URL's | 70 | ✅ **118** (ruim voor) | 125 | 130-140 |
| Organische sessies/mnd | 1.000 | ❓ **invullen (GA4)** | 4.000 | 8.000 |
| Top-10 keywords | 15 | ❓ invullen (GSC) | 40 | 80 |
| Top-3 keywords | 3 | ❓ invullen | 12 | 30 |
| Outbound CTR → partner | 6% | ❓ meten (nu affiliate live) | 8% | 10% |
| Affiliate-clicks/mnd | 50 | ❓ meten (live!) | 200 | 500 |
| CWV mobiel (75ᵉ pct) | groen | 🟡 meten (JPEG = risico) | groen | groen |
| AI-citaties (handcheck) | 1-2 | ❓ vastleggen | 5-10 | 20+ |
| Hotelreviews (cluster) | — | 1 | 4 | 6-8 |

**Grootste gat:** het is niet *content* (118 URL's ruim voor op schema) maar **meten**. Zonder ingevulde baseline stuur je blind. Dat is de #1 prioriteit deze maand.

---

## 6. Concrete top-10 acties (komende 6 weken)

Afgestemd op Tessa's werkwijze (GitHub UI + plak-commando's), meest impact eerst:

| # | Actie | Type | Waar |
|---|-------|------|------|
| 1 | **Baseline invullen** — GSC indexatie, GA4 sessies 30d, CrUX (LCP/INP/CLS) | meten | `SEO-PLAN/baseline.md` |
| 2 | **`/gids/hotelreviews/`-hub bouwen** (fixt 404 + nieuw cluster) | content+fix | nieuwe map |
| 3 | **Homepage-koppen** `div.section-title` → `<h2>` | template-fix | `index.html` |
| 4 | **Schema-bug** albanie-of-montenegro rechtzetten + template-breed check | fix | gids-templates |
| 5 | **Outbound-CTR meten** naar `/api/go` per cluster (nu affiliate live) | meten | GA4 / analytics |
| 6 | **WebP-conversie** hero's + zware afbeeldingen (start met reviews & home) | performance | `images/` |
| 7 | **Oudere gidsen optrekken** naar nieuwste template (koppen, image-array, title-lengte) | consistentie | gids-templates |
| 8 | **AI-citatie-handcheck** — 5 kernvragen in Perplexity/ChatGPT, vastleggen | GEO | `SEO-PLAN/ai-tracking.md` |
| 9 | **2-3 nieuwe reviews** van resorts die je echt kent | content | `/gids/hotelreviews/` |
| 10 | **CI smoke-test uitbreiden**: broken-internal-link check (had de `/gids/hotelreviews/` 404 gevangen) | techniek | `.github/scripts/smoke.py` |

> Actie #10 is preventief: een broken-link-check in de CI had de breadcrumb-404 automatisch gevangen. Past bij de bestaande smoke-test-aanpak (project memory).

---

## 7. Wat ongewijzigd blijft t.o.v. v1.0

- **Positionering:** beslissingsondersteuning, niet inventaris. Long-tail "X of Y voor koppels", geen head-terms.
- **Difficulty-discipline:** clusters afmaken vóór nieuwe openen; elke pagina in een hub-and-spoke.
- **Kwaliteitsondergrens:** ≥ 800 woorden, "voor wie wel/niet", citeerbare opening, 2-3 sibling-links.
- **Risico-register** uit v1.0 en de roadmap (§ risico's) blijven geldig — met één update: het TradeTracker-risico is **weg** (affiliate is live via Corendon), maar *partner-concentratie* (alles op Corendon) is een nieuw, kleiner risico → op termijn tweede partner overwegen.
- **Contentplan v4** blijft de canonical keyword-bron.

---

## Audit log

- **2026-08-05** — versie 1.1. Mid-jaar review (roadmap Fase 3, maand 6). Voortgang mei→aug gemeten: Fase 1-2 grotendeels uitgevoerd, site in Fase 3. v1.0 blijft intact als audit-trail. Nieuwe input: 5-pagina audit (5 aug), systeembevindingen §3. Grootste openstaande punt: externe baseline (GSC/GA4) nog steeds niet ingevuld.
