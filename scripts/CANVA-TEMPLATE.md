# Canva-template — Kiespret vergelijkingsvideo

Eén template, 41 video's. Je bouwt dit ontwerp één keer na, koppelt de tekstvelden
aan `scripts/canva-bulk-vergelijkingen.csv` en laat Bulk Create de rest doen.

Nodig: Canva Pro (Bulk Create zit niet in de gratis versie).

---

## Canvasinstellingen

- **Formaat:** Video, 1080 × 1920 px (9:16)
- **Aantal pagina's:** 5 — elke pagina is één scène
- **Totale duur:** circa 25 seconden

**Veilige marges.** TikTok, Reels en Shorts leggen knoppen over je video heen.
Houd daarom alles binnen:
- boven: 220 px vrij
- onder: 420 px vrij
- links en rechts: 80 px vrij

---

## Huisstijl (exact uit gids.css)

| Rol | Hex |
|---|---|
| Achtergrond | `#FAFAF8` (sand) |
| Tekst | `#1A1A1A` (night) |
| Secundaire tekst | `#666666` (stone) |
| Accent A / links | `#E07830` (sunset) |
| Vlak A | `#FFF0E6` (sunset-light) |
| Accent B / rechts | `#2A7F9E` (ocean) |
| Vlak B | `#E8F4F8` (ocean-light) |

**Lettertypes:** koppen in *Plus Jakarta Sans* (ExtraBold 800), lopende tekst in
*DM Sans* (Regular/Medium). Beide staan in Canva. Vind je Plus Jakarta Sans niet,
gebruik dan Poppins SemiBold — dat komt het dichtst in de buurt.

---

## Pagina 1 — Hook (3 sec)

- Achtergrond: `#FAFAF8`
- **{{hook}}** — Plus Jakarta Sans ExtraBold, **96 px**, `#1A1A1A`
  - Positie: gecentreerd, tekstvak 920 px breed, verticaal midden
  - Regelafstand 1.1, maximaal 3 regels
- Accentstreep: rechthoek 120 × 10 px, `#E07830`, 60 px onder de tekst, gecentreerd
- Logo "kiespret" linksboven, 40 px, `#1A1A1A` (de k in `#E07830`)

*Animatie:* tekst "Rise", accentstreep "Wipe" van links.

---

## Pagina 2 — De twee opties (6 sec)

Verticale splitsing over de volle hoogte:
- Linkerhelft (0-540 px breed): vlak `#FFF0E6`
- Rechterhelft (540-1080 px): vlak `#E8F4F8`

**Links:**
- **{{naam_a}}** — Plus Jakarta Sans ExtraBold, 72 px, `#E07830`, op y ≈ 620
- **{{reden_a}}** — DM Sans Regular, 36 px, `#1A1A1A`, tekstvak 420 px breed, y ≈ 740

**Rechts:** idem met **{{naam_b}}** in `#2A7F9E` en **{{reden_b}}**

*Animatie:* linkerhelft "Slide" van links, rechterhelft "Slide" van rechts,
met 0,3 sec vertraging op rechts. Dat leest als een vergelijking die opbouwt.

---

## Pagina 3 — Het cijfer (6 sec)

Zelfde split als pagina 2, zodat het rustig doorloopt.

**Links, gecentreerd in de helft:**
- **{{label_a}}** — DM Sans Medium, 28 px, `#666666`, HOOFDLETTERS, letterafstand 2
- **{{waarde_a}}** — Plus Jakarta Sans ExtraBold, 60 px, `#1A1A1A`, y ≈ 900

**Rechts:** **{{label_b}}** en **{{waarde_b}}**, zelfde opmaak

*Animatie:* beide "Pop". Dit is het moment waar de kijker naar kijkt — geef het rust.

---

## Pagina 4 — Oordeel (6 sec)

- Achtergrond: `#FAFAF8`
- **{{payoff}}** — Plus Jakarta Sans Bold, 52 px, `#1A1A1A`
  - Tekstvak 900 px breed, gecentreerd, regelafstand 1.25
- Erboven een klein label "ONS ADVIES" — DM Sans Medium, 26 px, `#E07830`, hoofdletters

*Animatie:* "Fade".

---

## Pagina 5 — CTA (4 sec)

- Achtergrond: `#E07830` (volvlak)
- "Vergelijk ze zelf" — Plus Jakarta Sans ExtraBold, 76 px, wit, gecentreerd
- **{{url}}** — DM Sans Medium, 38 px, wit met 85% dekking, 40 px eronder
- Logo "kiespret" in wit onderaan

*Animatie:* "Pan".

---

## Bulk Create koppelen

1. Ontwerp klaar? Klik links op **Apps → Bulk Create**.
2. **Upload data** → kies `scripts/canva-bulk-vergelijkingen.csv`.
3. Klik met rechts op elk tekstvak → **Connect data** → kies de bijbehorende kolom.
   De veldnamen in dit document (`{{hook}}`, `{{naam_a}}` …) komen exact overeen
   met de kolomnamen in de CSV.
4. **Continue → Generate**. Canva maakt 41 varianten.
5. Downloaden als MP4. Doe dit in blokjes van ongeveer 10 — grote batches lopen vast.

---

## Nog te doen per video

Bulk Create vult tekst; het maakt geen geluid en zet geen ondertitels.

- **Muziek:** kies één nummer en gebruik dat voor alle 41. Herkenbaarheid helpt.
  Canva's audiobibliotheek is rechtenvrij voor commercieel gebruik.
- **Geen voice-over nodig.** Tekst-op-beeld met muziek werkt voor dit formaat, en
  scheelt je 41 opnames. Wil je later toch stem, dan neem je die per video op.
- **Ondertitels** zijn niet nodig zolang alle informatie al als tekst in beeld staat.

---

## Controle vóór publiceren

- Klopt het cijfer met `FEITENTABEL.md`?
- Staat er geen tekst achter de knoppen van het platform? (marges hierboven)
- Is de URL onderaan de juiste gidspagina?

---

## De 12 meerweg-pagina's

Vergelijkingen met drie of vier bestemmingen (Turkse Rivièra, Kos/Rhodos/Zakynthos)
passen niet in dit tweekoloms-stramien. Daarvoor is een tweede template nodig met
drie of vier blokken onder elkaar in plaats van naast elkaar. Zeg het als je die
ook wilt, dan lever ik de bijbehorende CSV.
