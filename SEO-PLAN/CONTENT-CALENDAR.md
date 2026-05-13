# Content kalender — Kiespret

**Versie:** 1.0 (mei 2026)
**Cadans:** 2 nieuwe / aangescherpte pagina's per week (Tessa solo, non-developer)
**Bron-keywords:** [contentplan v4](../Kiespret-SEO-Contentplan-v4.docx) sectie 7 (fasering)

> Realistisch tempo voor één persoon die ook product en partners aanjaagt. Te traag tempo = gat in content-marketing; te snel tempo = thin content. Twee per week is de balans.

---

## 1. Werkstroom per pagina

Voor elke nieuwe pagina:

```
1. SERP-verificatie (15 min)            → blokkeer of green-light
2. Outline schrijven (30 min)           → koppen, "voor wie wel/niet", FAQ
3. Eerste draft (1.5 uur)               → ≥ 800 woorden, eigen mening
4. Review tegen "voor wie wel/niet"     → kwalificeert het de bezoeker?
5. Internal linking toevoegen           → 2-3 siblings + hub + methodologie
6. Schema toevoegen (Article+FAQPage)   → JSON-LD blok
7. Citeerbare opening checken           → eerste 80 woorden in directe zinnen
8. Publish via GitHub UI                → auto-deploy via Vercel
9. Submit URL in Search Console         → handmatig per pagina
10. Sitemap.xml updaten (lastmod)       → niet vergeten
```

Tijdsbesteding per pagina: **~3-4 uur** (eerste maand langer; daarna sneller door templating).

---

## 2. Maand 1 — fase 1 hubs + eerste 5 children

**Doel:** master-hub + 3 cluster-hubs + de 5 hoogste-volume keywords met diff ≤ 7. Hierdoor staat de architectuur direct.

| Week | Pagina | Type | Keyword | Vol/Diff | Notitie |
|------|--------|------|---------|----------|---------|
| 1 | Master hub `/gids/` opfrissen | Hub | (meerdere) | — | Fundament voor alle clusters |
| 1 | `/gids/methodologie/` opfrissen | E-E-A-T | — | — | Auteursnaam (Tessa) toevoegen |
| 2 | Cluster hub `/gids/eilanden/` | Hub | (meerdere) | — | 8 children + cross-links |
| 2 | `/gids/eilanden/sicilie-of-sardinie/` | Child | sicilie of sardinie | 480 / 7 | Hoogste volume — opnieuw scherpen |
| 3 | Cluster hub `/gids/griekenland/` | Hub | (meerdere) | — | 7 children |
| 3 | `/gids/eilanden/tenerife-of-gran-canaria/` | Child | tenerife of gran canaria | 320 / 7 | Tweede hoogste volume |
| 4 | Cluster hub `/gids/adults-only/` | Hub | (meerdere) | — | Niet verwarren met cluster 1 (Griekenland) |
| 4 | `/gids/adults-only-griekenland/` opfrissen | Child | adults only griekenland | 260 / 7 | Cross-cluster pagina |

**Eind maand 1:** 4 hubs + 3 sterke childs gepubliceerd of opgefrist. Architectuur staat.

---

## 3. Maand 2 — fase 1 children afmaken

**Doel:** Griekenland-cluster compleet + 2 extra eilanden-children.

| Week | Pagina | Keyword | Vol/Diff |
|------|--------|---------|----------|
| 5 | `/gids/griekenland/kos-of-rhodos/` (opfrissen) | kos of rhodos | 140 / 6 |
| 5 | `/gids/griekenland/kreta-of-rhodos/` (opfrissen) | kreta of rhodos | 90 / 6 |
| 6 | `/gids/griekenland/kos-of-kreta/` (opfrissen) | kos of kreta | 110 / 12 |
| 6 | `/gids/griekenland/rustige-eilanden/` (opfrissen) | rustige griekse eilanden | 70 / 7 |
| 7 | `/gids/eilanden/lanzarote-of-fuerteventura/` | lanzarote of fuerteventura | 110 / 7 |
| 7 | `/gids/welke-vakantie-past-bij-mij/` (opfrissen) | welke vakantie past bij mij | 30 / 6 |
| 8 | **Tussen-evaluatie:** Search Console data; welke pagina's krijgen impressies? Welke ranken nog niet? |

**Eind maand 2:** 14-pagina fase-1 content base bestaat. Tijd voor data-driven beslissingen.

---

## 4. Maand 3 — fase 2 + GEO/AI-laag

**Doel:** content uitbreiden naar fase 2 + AI-search readiness toevoegen.

| Week | Pagina/taak | Keyword/doel |
|------|-------------|--------------|
| 9 | `/gids/griekenland/corfu-of-zakynthos/` | corfu of zakynthos (90 / 7) |
| 9 | `llms.txt` toevoegen aan root | GEO foundation |
| 10 | `/gids/adults-only-hotel-griekenland/` | adults only hotel griekenland (110 / 8) |
| 10 | FAQ-blokken toevoegen aan top 5 best-presterende pagina's | AI-citatie kans verhogen |
| 11 | `/gids/eilanden/mallorca-of-menorca/` | mallorca of menorca (70 / 8) |
| 11 | Brand-mention seeding (Reddit, Tweakers, Viva — 1 thread per platform) | AI training data |
| 12 | `/gids/vakantie-zonder-kinderen/` (opfrissen) | vakantie zonder kinderen (70 / 16) |
| 12 | **Maandelijkse SEO-review:** Search Console + handmatige AI-prompt check |

---

## 5. Maand 4-6 — fase 3 + thematic

**Cadans:** 2 pagina's per week, gemixt tussen lange-staart, seasonal en gap-vulling.

### Maand 4 (juni 2026)
- 2 cross-cluster vergelijkingen (Turkije-of-Egypte gat-vulling, etc.)
- 2 Albanië-cluster pagina's
- Seasonal: `/gids/zonvakantie-juli/` en `/gids/zonvakantie-augustus/` (nieuw, zomerpiek vangen)
- Tessa's eigen reiservaring documenteren in 1 pagina (E-E-A-T boost)

### Maand 5 (juli 2026)
- Fase 3 children: Ibiza-of-Mallorca, Malta-of-Cyprus, Adults-only-Turkije/Spanje
- Seasonal: `/gids/zonvakantie-oktober/`, `/gids/herfstvakantie-zon/`
- Eerste auteur-gastpost? (terugkeer-link, externe authority)

### Maand 6 (augustus 2026)
- Stille zomermaand → focus op nieuwe winterzon-content vroegtijdig
- `/gids/winterzon-canarische-eilanden/` opnieuw scherpen
- Nieuwe winterzon-vergelijkingen: Kaapverdië-of-Canarische-eilanden, Egypte-of-Canarische-eilanden
- Mid-jaar evaluatie: cluster-performance review

---

## 6. Maand 7-12 — fase 4 (autoriteit-fase)

**Verschuiving:** minder pure SEO-pagina's, meer thought leadership + linkbuilding.

| Maand | Focus |
|-------|-------|
| 7 (sep) | Outreach: 5 reisblogs voor potentiële wederzijdse links / interview-uitnodigingen |
| 8 (okt) | Pers/media: pitch aan VTwonen, Margriet, NRC-reissectie ("Dutch decision-tool voor koppels") |
| 9 (nov) | Winter-piek content: ski-of-zon? wintervakantie keuzehulp |
| 10 (dec) | Nieuwjaarsplan content: "Vakantie 2027 boeken — waar beginnen?" |
| 11 (jan) | Vroeg-boeker piek: vergelijkingen voor mei-juni 2027 |
| 12 (feb) | Performance review jaar 1 + plan jaar 2 |

**Per maand 7-12:** 1 nieuwe content-pagina/week + 1 outreach- of authority-actie.

---

## 7. Vaste maandelijkse rituelen

### Eerste maandag van de maand (~2 uur)
- Search Console: top queries, top pagina's, CTR-uitschieters
- GA4: outbound CTR per gids-pagina
- Top 3 onder-presterende pagina's: refresh-actie

### Eerste vrijdag van de maand (~30 min)
- AI-prompt-check: 5 standaard prompts in ChatGPT/Perplexity/Gemini
- Krijgen we citaties? Worden we gemention? Noteren in audit-log
- Concurrent-check: rankt iemand nieuw op onze keywords?

### Per kwartaal (~half dag)
- Cluster-performance review: welke cluster trekt traffic, welke niet?
- Beslissing: welk fase-3 cluster afmaken vs welke afblazen?
- Sitemap audit: stale lastmods, broken URLs, schema-validatie

---

## 8. Niet-doen lijst

Pagina's expliciet **niet** schrijven (uit contentplan v4 sectie 1 + concurrentieanalyse):

- ❌ "zonvakantie griekenland" (diff 57)
- ❌ "goedkope all inclusive turkije" — verkeerde persona
- ❌ "vakantie boeken tips" — past niet bij Kiespret-rol
- ❌ "TUI vs Sunweb" — irrelevant
- ❌ "best last minute vakantie" — bargain-frame
- ❌ Generieke "10 mooiste bestemmingen 2027" inspiratie-lijstjes — te breed, lage conversie

---

## 9. Templates en stijl

### 9.1 Citeerbare opening (verplicht, eerste 80 woorden)

```
Voorbeeld voor "Kos of Rhodos":

> Kies Kos als je een rustigere, vlakkere vakantie wilt met
> kortere autoritten en strandlocaties. Kies Rhodos als je
> meer afwisseling, cultuur en levendige plekken zoekt — het
> eiland is groter en biedt meer variatie in dagbesteding.
> Voor koppels zonder kinderen werkt Rhodos vaker beter,
> maar Kos wint als je in 7 dagen niets wil hoeven plannen.
```

Dit blok wordt geciteerd door AI-overviews. Geen marketing-taal, wel directe vergelijking.

### 9.2 "Voor wie wel / niet" module (verplicht)

Drie blokken onderaan elke vergelijkingspagina:

```
**Kies [A] als jullie:**
- [criterium 1]
- [criterium 2]
- [criterium 3]

**Kies [B] als jullie:**
- [criterium 1]
- [criterium 2]
- [criterium 3]

**Niet voor jullie als:**
- [diskwalificator 1]
- [diskwalificator 2]
```

### 9.3 FAQ-blok (3-5 vragen, JSON-LD `FAQPage`)

Voorbeeld vragen:
- "Wat is het verschil tussen [A] en [B] voor koppels?"
- "Welk eiland is rustiger?"
- "Welke is goedkoper?"
- "Welk eiland is beter in [maand]?"
- "Kunnen we vanuit Nederland direct vliegen?"

### 9.4 CTA (verplicht, twee posities)

- Halverwege: in-line tekst-link naar `/start/?focus=[cluster]`
- Onderaan: knop-CTA "Vind jullie top 3 →"

---

## 10. Voortgang-tracker

Suggestie: voeg toe als sectie hieronder per gepubliceerde pagina (handmatig bijhouden):

```
| Datum | URL | Type | Eerste klik (GSC) | Eerste rank top-20 | Eerste outbound click |
|-------|-----|------|-------------------|---------------------|----------------------|
|       |     |      |                   |                     |                      |
```

---

## Audit log

- **2026-05-08** — versie 1.0 opgesteld voor 12 maanden cadans 2/week. Herzien na maand 2-evaluatie.
