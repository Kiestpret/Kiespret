# QA-steekproef log — kiespret.nl

Wekelijkse kwaliteitscontrole op een roterende steekproef van 10 pagina's uit `sitemap.xml`.
Gecontroleerd: gedachtestreepjes (AI-tell), feitelijke consistentie tegen `FEITENTABEL.md`, foto's (alt-tekst + duplicaten), JSON-LD geldigheid + FAQ-volgorde, titel/meta-lengte, interne links, `dateModified`.

Elke week pakt de taak de eerstvolgende 10 pagina's uit de sitemap die nog niet aan de beurt zijn geweest sinds de laatste volledige ronde. Bij een nieuwe ronde wordt weer bovenaan de sitemap begonnen.

---

## Ronde 1, batch 1 — 2026-07-27

**Gecontroleerde pagina's (eerste 10 uit sitemap.xml):**
1. `/` (index.html)
2. `/start/` (start.html)
3. `/gids/eilanden/sicilie-of-sardinie/`
4. `/gids/eilanden/tenerife-of-gran-canaria/`
5. `/gids/eilanden/lanzarote-of-fuerteventura/`
6. `/gids/griekenland/kos-of-rhodos/`
7. `/gids/griekenland/kreta-of-rhodos/`
8. `/gids/griekenland/kos-of-kreta/`
9. `/gids/adults-only-griekenland/`
10. `/gids/griekenland/rustige-eilanden/`

### Bevindingen per pagina

**`/` (index.html)** — 10 gedachtestreepjes gevonden en vervangen (komma's, één middot voor de merk-tagline in `<title>`/OG/Twitter, één middot voor een kopje). Interne links, JSON-LD (WebSite/Organization/FAQPage) allemaal geldig. Geen Article-schema op deze pagina, dus geen `dateModified`.

**`/start/`** — 16 gedachtestreepjes in zichtbare tekst vervangen (komma's + 4x middot voor korte UI-labels). De overgebleven gedachtestreepjes staan alleen nog in HTML-comments (niet zichtbaar voor bezoekers) en zijn met opzet ongemoeid gelaten. Geen JSON-LD op deze pagina.

**`/gids/eilanden/sicilie-of-sardinie/`** — 18 gedachtestreepjes vervangen. **Dubbele foto gevonden**: hero-afbeelding en de "cultuur"-sectiefoto gebruiken beide `photo-1523365154888` (Scopello-kustfoto), alleen met andere crop/alt-tekst. Niet zelf vervangen (geen geverifieerd alternatief in de fotolijst) — zie open punten. `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/eilanden/tenerife-of-gran-canaria/`** — 6 gedachtestreepjes vervangen. Foto's, links, JSON-LD in orde. `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/eilanden/lanzarote-of-fuerteventura/`** — 12 gedachtestreepjes vervangen. **Dubbele foto gevonden**: hero en de Timanfaya-sectiefoto gebruiken beide `photo-1643727230494` (wel een geverifieerde Lanzarote-vulkaanfoto uit de fotolijst, maar tweemaal op dezelfde pagina). Niet vervangen, zie open punten. `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/griekenland/kos-of-rhodos/`** — 10 gedachtestreepjes vervangen (incl. 1 middot in tabelcel). Foto's, links, JSON-LD in orde, FAQ-schema-volgorde komt overeen met zichtbare `<h3>`-volgorde. `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/griekenland/kreta-of-rhodos/`** — 17 gedachtestreepjes vervangen (incl. de herhaalde "Van Chania tot Lindos" tagline in title/OG/Twitter/JSON-LD-description → middot, en 2 tabelcellen → middot). `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/griekenland/kos-of-kreta/`** — 13 gedachtestreepjes vervangen. `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/adults-only-griekenland/`** — 6 gedachtestreepjes vervangen. `dateModified` bijgewerkt naar 2026-07-27.

**`/gids/griekenland/rustige-eilanden/`** — 9 gedachtestreepjes vervangen (incl. de "Van Milos tot Naxos" tagline in meta/JSON-LD → middot). `dateModified` bijgewerkt naar 2026-07-27.

### Sitebreed resultaat deze batch
- **111 gedachtestreepjes** vervangen in zichtbare tekst over 10 pagina's (komma's/dubbele punten/haakjes/punt-splitsingen volgens de regel; middot voor korte meta-labels, taglines en tabelcellen). Gedachtestreepjes in HTML-comments (developer-notities, niet zichtbaar) zijn bewust laten staan.
- JSON-LD: alle 24 gecontroleerde `<script type="application/ld+json">`-blokken zijn geldige JSON, ook na alle wijzigingen opnieuw gevalideerd.
- FAQ-schema-volgorde: komt op alle 8 gids-pagina's overeen met de zichtbare `<h3>`-volgorde.
- Interne links: geen 404's gevonden (rekening houdend met Vercel `cleanUrls`/`trailingSlash`-rewrites, bijv. `/over/` → `over.html`).
- Auteursnaam: overal correct "Tessa van Kiespret" / "Maker van Kiespret", geen achternaam zichtbaar.
- Trema's/diakrieten: geen fouten gevonden (Sicilië, Sardinië correct geschreven).
- Titel/meta: alle titels ≤ 60 tekens, behalve Sicilië-of-Sardinië (67 tekens, licht over de richtlijn, niet aangepast omdat dit geen "duidelijke fout" is).
- Feitelijke consistentie tegen `FEITENTABEL.md`: geen tegenstrijdigheden gevonden. Deze 10 pagina's gaan over Italië/Canarische Eilanden/Griekenland; `FEITENTABEL.md` dekt momenteel vooral Albanië/Montenegro/Kroatië/Turkije/Griekse ferry's, dus er was weinig direct te toetsen.

### Open punten (niet zelf aangepast)
1. **Dubbele zichtbare foto op `/gids/eilanden/sicilie-of-sardinie/`**: hero + sectiefoto gebruiken hetzelfde Unsplash-ID (`photo-1523365154888`). Voorstel: één van de twee vervangen door een andere geverifieerde Sicilië/Sardinië-foto (niet gegokt, staat nog niet in de geverifieerde fotolijst).
2. **Dubbele zichtbare foto op `/gids/eilanden/lanzarote-of-fuerteventura/`**: hero + Timanfaya-sectiefoto gebruiken hetzelfde Unsplash-ID (`photo-1643727230494`). Dit ID zelf is wel geverifieerd correct voor Lanzarote-vulkaanlandschap, maar dubbel gebruik op één pagina blijft een steekje. Voorstel: één instantie vervangen door een andere Lanzarote-foto.
3. **Titellengte** `Sicilië of Sardinië: welk eiland past bij jullie? (2026) | Kiespret` is 67 tekens, iets boven de ~60-richtlijn. Niet aangepast (kleine overschrijding, geen harde fout).

---
