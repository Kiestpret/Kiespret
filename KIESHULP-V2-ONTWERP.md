# Kieshulp v2 — ontwerpvoorstel (vibe-cloud)

Status: voorstel om op te reageren. Nog geen code. Datum: 23 juli 2026.

## 1. Doel en principes

Uit het businessplan (PROJECT_CONTEXT.md):

- Positionering: *"de snelste manier voor koppels om een vakantie te kiezen."*
- Optimaliseer voor **duidelijkheid, shortlist en outbound klik-intentie** — niet voor "hoe leuk de swipe voelt".
- Gewenste matching-signalen: **budget, vertrekluchthaven, reisduur, reisstijl** + **"waarom dit past"-uitleg**.
- Grootste risico: engagement zónder doorklikken.

Wat verandert: de huidige **3-stappen-invoer** (sfeer → budget → periode) wordt vervangen door één **vibe-cloud**. Wat blijft: het **swipe-deck + top 3 (shortlist)** erna — ongewijzigd.

## 2. Data-bevinding (bepaalt de woorden)

Uit de echte feed (189 trips):

| Signaal | Onderscheidt? | Bron in data |
|---|---|---|
| Reisstijl: all-inclusive vs. zelf uit eten | **Sterk** | `boardType` (88 AI · 27 ultra-AI · 42 ontbijt · 19 logies) |
| Met/zonder kinderen | **Sterk** | `adultsOnly` (61 van 189) |
| Budget | **Sterk** | `prijs` per variant (€276–1775) |
| Land / regio | **Sterk** | Turkije, Griekenland, Spanje, Egypte, Bulgarije, Portugal, Curaçao, Italië, Kaapverdië, Bonaire |
| Vertrekluchthaven | **Matig** | `airport` (AMS 220 · EIN 35 · RTM 7 · MST 3) |
| Sfeer: rustig / actief / natuur / resort | **Matig** | `sfeer`-tags |
| Sfeer: strand / comfort | **Zwak** (bijna overal) | `sfeer`-tags |
| Reisduur | **Zwak** (95% = 7 nachten) | `duur` per variant |

Consequenties voor het ontwerp:
- De wolk bouwt op de **sterke/matige** signalen. `strand`/`comfort` laten we weg als woord (zijn de standaard).
- **Reisduur vragen we niet** — de feed varieert er nauwelijks op (klopt met de eerder verwijderde stap 4). Komt terug zodra de feed meer variatie heeft.

## 3. De flow (schermen)

```
[1] Vibe-cloud            → tik smaakwoorden aan (0–6)
        +  Praktisch-strip → maand · vertrekluchthaven · (optioneel) land
[2] Wens-bevestiging      → "Dit begrepen we: …"  (corrigeerbaar)
[3] Swipe-deck            → ONGEWIJZIGD, maar voorgefilterd/kleiner en dus relevanter
[4] Top 3 (shortlist)     → elke kaart met "past omdat: …" + doorklik naar aanbieder
        +  "Lees ook"     → best passende gids / vergelijking / hotelreview
```

Twee soorten uitleg, allebei behouden:
- **Wens-bevestiging** (scherm 2): terugkoppeling van de invoer — "we snappen je" + kans om te corrigeren.
- **Waarom-dit-past** (scherm 4, per kaart): "past omdat: adults-only · korte vlucht · binnen budget". Dit is de differentiator uit het plan en blijft staan.

## 4. De woordenwolk → signaal-mapping

~16 woorden, elk gekoppeld aan een echt signaal:

| Woord (in beeld) | Signaal achter de schermen | Type |
|---|---|---|
| Rustig aan | `sfeer: rustig` | ranking + |
| Lekker levendig | `sfeer: rustig` afwezig | ranking − |
| Romantisch met z'n tweeën | ranking naar rustig/adults-only | ranking + |
| Zonder kinderen | `adultsOnly = true` | **knock-out** |
| Juist kindvriendelijk | `adultsOnly = false` | **knock-out** |
| Geen omkijken (all-inclusive) | `boardType ∈ {All-inclusive, Ultra all-inclusive}` | ranking ++ |
| Zelf uit eten / ontdekken | `boardType ∈ {Ontbijt, Logies, Halfpension}` | ranking ++ |
| Klein budget | `prijs ≤ ~€600` | **knock-out (zacht)** |
| Mag wat kosten | hogere prijs / ultra-AI / resort | ranking + |
| Kort vliegen | `vluchtduur ≤ ~4u` | ranking + |
| Ver weg mag | lange vluchten toegestaan (Curaçao e.d.) | ranking + |
| Actief / avontuur | `sfeer: actief/avontuur` | ranking + |
| Natuur | `sfeer: natuur` | ranking + |
| Groot resort met voorzieningen | `sfeer: resort` | ranking + |
| Wellness / ontspanning | `sfeer: rustig/resort` | ranking + |
| Goed eten | ranking naar ultra-AI / land (Italië, Griekenland) | ranking + |

## 5. Praktisch-strip (naast de wolk, overslaanbaar)

- **Maand** — chips (mei t/m november); harde filter op variant-maand.
- **Vertrekluchthaven** — Amsterdam · Eindhoven · Rotterdam · Maastricht · maakt niet uit; harde filter indien gekozen.
- **Al een land in gedachten? (optioneel)** — Turkije · Griekenland · Spanje · Egypte · Bulgarije · Portugal · Italië · Curaçao · Kaapverdië · Bonaire · maakt niet uit. Harde filter indien gekozen.

Belangrijk: specifieke eilanden/landen horen hier, **niet** in de wolk. De wolk blijft over smaak. Zo blijft het snel voor wie geen idee heeft (kerndoelgroep), en flexibel voor wie half beslist is.

## 6. Matching-logica (rules-based, €0)

Twee lagen:

**A. Knock-outs (sluiten uit):**
- Prijs > gekozen budget → eruit.
- Geen variant in gekozen maand → eruit.
- Luchthaven gekozen → alleen die luchthaven.
- Land gekozen → alleen dat land.
- "Zonder kinderen" → alleen `adultsOnly=true`; "kindvriendelijk" → alleen niet-adults-only.

**B. Ranking (score onder de overgebleven trips):**
- Elk overig gekozen woord dat matcht telt mee, met gewichten:
  - reisstijl (boardType) & adults-only-match: hoog (bijv. +5)
  - sfeer-match (rustig/actief/natuur/resort): midden (+3)
  - vluchtduur/prijs-voorkeur: midden (+2)
- Tie-break: prijs-kwaliteit; later populariteit via Plausible (staat al op de roadmap).
- De best scorende trips vormen het **swipe-deck** (voorgefilterd) en de **top 3**.

Randgeval: als knock-outs alles wegfilteren → toon "we versoepelen budget/maand iets" en laat de dichtstbijzijnde matches zien (net als de huidige budget-versoepeling in app.js).

## 7. Wat verandert t.o.v. de huidige /start/

- **Weg:** de 3 aparte stap-schermen (sfeer-kaarten → budget → periode).
- **Nieuw:** vibe-cloud + praktisch-strip + wens-bevestiging als één snelle voorkant.
- **Blijft exact hetzelfde:** het swipe-deck, de shortlist/top-3-logica, de matchReason-uitleg, de affiliate-doorklik via `/api/go`, en de Plausible-events (die hangen we op de nieuwe interacties).
- **Signalen erbij die de data wél heeft maar nu ongebruikt zijn:** boardType (gemak vs. ontdekken), adults-only, vertrekluchthaven, land. Dit maakt de match meetbaar scherper zonder de flow langer te maken.

## 8. Bouwstappen (na jouw akkoord)

1. Woordenlijst + mapping definitief maken (samen 10 min).
2. Nieuwe voorkant bouwen (wolk + strip + wens-bevestiging) — vervangt stap 1–3 in `app.js`/`start.html`.
3. Matching-functie uitbreiden met de knock-outs + gewogen ranking (in `filterTripsCustom`).
4. Swipe-deck ongewijzigd erop aansluiten.
5. Plausible-events verplaatsen/uitbreiden naar de nieuwe interacties (welke woorden worden getikt = waardevolle data).
6. Verificatie + A/B-vriendelijk uitrollen (oude flow desnoods even als fallback).

## 9. Open keuzes voor jou

1. **Woordenlijst** — akkoord met de ~16 hierboven, of wil je andere accenten?
2. **"Kindvriendelijk"-woord** — de site is koppel-gepositioneerd; willen we het "met kinderen"-pad überhaupt aanbieden, of laten we adults-only alleen als positieve keuze staan?
3. **Wens-bevestiging als apart schermpje** of als strook die meegroeit onder de wolk (zoals in de proefversie)?
4. **Fallback** — oude 3-stappen-flow tijdelijk behouden als terugvaloptie, of in één keer vervangen?
