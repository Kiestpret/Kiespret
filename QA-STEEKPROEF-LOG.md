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

## Ronde 1, batch 2 — 2026-08-03

**Gecontroleerde pagina's (sitemap-posities 11 t/m 20):**
1. `/gids/griekenland/beste-eilanden-koppels/`
2. `/gids/griekenland/kos-of-rhodos-of-zakynthos/`
3. `/gids/griekenland/corfu-of-zakynthos/`
4. `/gids/eilanden/mallorca-of-menorca/`
5. `/gids/adults-only-hotel-griekenland/`
6. `/gids/vakantie-zonder-kinderen/`
7. `/gids/eilanden/ibiza-of-mallorca/`
8. `/gids/adults-only-turkije/`
9. `/gids/adults-only-spanje/`
10. `/gids/zonvakantie-juni/`

### Bevindingen per pagina

**`/gids/griekenland/beste-eilanden-koppels/`** — 11 gedachtestreepjes vervangen (o.a. de caldera-tussenzin naar haakjes, twee zinssplitsingen met een punt, één dubbele punt bij het Naxos-eten). JSON-LD (Article/FAQPage/BreadcrumbList) geldig, FAQ-volgorde komt overeen met de `<h3>`-volgorde. Links en foto's in orde. `dateModified` 2026-07-18 → 2026-08-03.

**`/gids/griekenland/kos-of-rhodos-of-zakynthos/`** — 11 gedachtestreepjes vervangen. Daarnaast één consistentiefix: in de kieshulp-uitkomst stond "(2-2,5u ferry)" terwijl het FAQ-antwoord op dezelfde pagina "per catamaran in 2 tot 2,5 uur" zegt; conform de FEITENTABEL-schrijfregel (altijd boottype erbij) gewijzigd naar "(2-2,5u per catamaran)". `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/griekenland/corfu-of-zakynthos/`** — 12 gedachtestreepjes vervangen (2 tabelcellen → middot; het FAQ-antwoord over de reisduur is zowel in het JSON-LD als in de zichtbare tekst identiek aangepast, dus die blijven in sync). **Fotoconflict gevonden**: `photo-1543412560-1538feff707d` staat hier als "Paleokastritsa baai, Corfu" en op `/gids/griekenland/kos-of-rhodos-of-zakynthos/` als "Turquoise baai met steile kliffen op Zakynthos". Eén van de twee alt-teksten is fout; niet gegokt, zie open punten. `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/eilanden/mallorca-of-menorca/`** — 8 gedachtestreepjes vervangen (2 tabelcellen → middot). Foto's (mix van eigen `/images/mallorca/`-bestanden en Unsplash) kloppen met de bijschriften, geen duplicaten. `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/adults-only-hotel-griekenland/`** — 11 gedachtestreepjes vervangen. Hotelprijzen (€750-1.300 p.p./week) staan niet in `FEITENTABEL.md` en zijn niet te toetsen; ongemoeid gelaten. `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/vakantie-zonder-kinderen/`** — 8 gedachtestreepjes vervangen. Watertemperaturen (22-26°C) staan niet in de feitentabel, niet toetsbaar. `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/eilanden/ibiza-of-mallorca/`** — 9 gedachtestreepjes vervangen (2 tussenzinnen naar haakjes, 2 tabelcellen → middot). `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/adults-only-turkije/`** — 10 gedachtestreepjes vervangen. **Feitelijke correctie**: het prijsanker voor de Turkse Rivièra stond op "±€550-800 p.p. per week met vlucht all-inclusive", terwijl `FEITENTABEL.md` €650-900 p.p. voorschrijft. Gecorrigeerd naar **±€650-900**. De Bodrum-indicatie (€700-950 p.p.) valt binnen/boven het anker en is als boutique-premium plausibel; ongemoeid gelaten. `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/adults-only-spanje/`** — 7 gedachtestreepjes vervangen. Spaanse prijzen staan niet in de feitentabel. `dateModified` bijgewerkt naar 2026-08-03.

**`/gids/zonvakantie-juni/`** — 17 gedachtestreepjes vervangen (2 tussenzinnen naar haakjes, het FAQ-antwoord over stedenhitte in JSON-LD én zichtbare tekst identiek aangepast). **Prijsafwijking gevonden, niet aangepast**: de pagina noemt tweemaal "vanaf circa 219 euro p.p." voor een week all-inclusive Turkije (en €350-450 p.p. voor 4-sterren), terwijl het anker in `FEITENTABEL.md` €650-900 p.p. is. Zie open punten. `dateModified` bijgewerkt naar 2026-08-03.

### Sitebreed resultaat deze batch
- **104 gedachtestreepjes** vervangen over 10 pagina's. Verdeling: komma's waar het een losse bijzin was, dubbele punten waar uitleg of een opsomming volgt, haakjes bij tussenzinnen met eigen komma's, punt-splitsingen bij twee volwaardige zinnen, en een middot voor de vaste meta-labels (`Geschreven door Tessa · Maker van Kiespret`, `Keuzehulp voor koppels · geen boekingssite`) en tabelcellen. Alle 10 pagina's bevatten nu 0 gedachtestreepjes.
- JSON-LD: alle 30 `<script type="application/ld+json">`-blokken opnieuw gevalideerd na de wijzigingen, allemaal geldige JSON.
- FAQ-volgorde: op alle 10 pagina's komt de schema-volgorde overeen met de zichtbare `<h3>`-volgorde.
- Interne links: 0 gebroken `href="/..."`-links gevonden.
- Auteursnaam: overal "Tessa van Kiespret" / "Maker van Kiespret", geen achternaam zichtbaar (LinkedIn-`sameAs` blijft staan zoals afgesproken).
- Trema's/diakrieten: geen fouten gevonden (Andalusië, Sicilië, Deià, Kaş, Málaga, Egeïsche correct).
- Andere AI-tells: geen overmatig gebruik van "bovendien/daarnaast/kortom" (maximaal 1 per pagina).
- Titels: 9 van de 10 ≤ 60 tekens. Meta descriptions liggen tussen 120 en 164 tekens.

### Open punten (niet zelf aangepast)
1. **Fotoconflict `photo-1543412560-1538feff707d`**: gebruikt als Corfu (Paleokastritsa) op `/gids/griekenland/corfu-of-zakynthos/` én als Zakynthos op `/gids/griekenland/kos-of-rhodos-of-zakynthos/`. Eén alt-tekst is per definitie fout. Voorstel: de foto verifiëren op Unsplash, de juiste bestemming aanhouden en de andere pagina een geverifieerde vervanger geven. Daarna vastleggen in de geverifieerde-fotolijst.
2. **Turkije-prijsanker op `/gids/zonvakantie-juni/`**: "vanaf circa 219 euro p.p." (Mahmutlar/Alanya, Corendon) en "350-450 euro p.p." voor 4-sterren staan ver onder het anker van €650-900 p.p. uit `FEITENTABEL.md`. Beide zijn expliciet als "vanaf" en "indicatief" geformuleerd en aan een operator gekoppeld, dus niet zonder meer fout, maar de site spreekt zichzelf nu tegen (`/gids/adults-only-turkije/` zegt €650-900). Voorstel: óf de juni-prijzen optrekken naar het anker, óf het anker in `FEITENTABEL.md` verbreden naar bijvoorbeeld "€650-900 p.p. gangbaar, vanaf ±€250 p.p. bij budgetlocaties buiten de topweken" en dat overal consistent doorvoeren.
3. **Titellengte `/gids/zonvakantie-juni/`**: "Zonvakantie juni 2027: 6 beste bestemmingen voor koppels | Kiespret" is 67 tekens. Voorstel: "Zonvakantie juni 2027: 6 bestemmingen voor koppels | Kiespret" (61) of het jaartal laten vallen.
4. **Korte meta descriptions**: `/gids/eilanden/ibiza-of-mallorca/` (120 tekens) en `/gids/vakantie-zonder-kinderen/` (125 tekens) blijven onder de richtlijn van 150-160. Voorstel: aanvullen met een concreet onderscheidend detail (prijsindicatie of vliegtijd). Niet aangepast omdat het geen fout is.
5. **Niet-toetsbare cijfers**: hotelprijzen (Griekenland/Spanje), watertemperaturen en vliegtijden op deze pagina's staan niet in `FEITENTABEL.md`. Overweging: watertemperaturen per bestemming en vliegtijden vanuit Nederland als extra secties aan de feitentabel toevoegen, zodat toekomstige batches ze wel kunnen toetsen.

---

## Ronde 1, batch 3 — 2026-08-10

**Gecontroleerde pagina's (sitemap-posities 21 t/m 30):**
1. `/gids/zonvakantie-september/`
2. `/gids/winterzon-canarische-eilanden/`
3. `/gids/griekenland/rhodos-of-zakynthos/`
4. `/gids/eilanden/cyprus-of-kreta/`
5. `/gids/romantische-vakantie-europa/`
6. `/gids/huwelijksreis/`
7. `/gids/eilanden/malta-of-cyprus/`
8. `/gids/dubrovnik-of-split/`
9. `/gids/welke-vakantie-past-bij-mij/`
10. `/gids/vakantie-twee-personen/`

### Bevindingen per pagina

**`/gids/zonvakantie-september/`** — 24 gedachtestreepjes vervangen, de meeste van alle pagina's in deze batch. Verdeling: 6 dubbele punten (waar uitleg volgt), 9 komma's, 2 punt-splitsingen ("Tot half oktober is het comfortabel.", "Zo gebruik je maar 5 vakantiedagen voor 9 nachten."), 2 haakjesparen (Montenegro-seizoen, "meer cultuur (Sicilië, Kroatië, Kreta)"), 2 middots (auteursregel, footer) en 1 alt-tekst herschreven naar "Rustig strand in de nazomer in september". Ook één AI-tell weggehaald: "is bovendien beperkt" → "is ook beperkt". **Prijsafwijking gevonden, niet aangepast**: tweemaal "vanaf circa €200 p.p." en "€300-450 p.p. voor 4-sterren" voor een week all-inclusive Turkije, tegenover het anker van €650-900 p.p. in `FEITENTABEL.md`. Zelfde patroon als op `/gids/zonvakantie-juni/` (batch 2). Zie open punten. `dateModified` 2026-07-14 → 2026-08-10.

**`/gids/winterzon-canarische-eilanden/`** — 11 gedachtestreepjes vervangen: 7 tabelcellen → middot, 1 komma in het FAQ-antwoord over de watertemperatuur (JSON-LD), de alt-tekst van de eigen foto ("Zonsondergang op de rotskust van Tenerife, eigen foto Kiespret") en de twee vaste meta-labels. Foto's kloppen met de bijschriften (Tenerife-kust, eigen foto, Maspalomas-duinen, Timanfaya), geen duplicaten op de pagina. `dateModified` 2026-07-13 → 2026-08-10.

**`/gids/griekenland/rhodos-of-zakynthos/`** — 9 gedachtestreepjes vervangen: 2 tabelcellen → middot, 2 punt-splitsingen, 1 dubbele punt bij St. Paul's Bay en de vaste labels. Het St. Paul's Bay-antwoord staat zowel in het FAQ-schema als in de zichtbare tekst en is in beide identiek aangepast, dus die blijven in sync. De kieshulp-intro is herschreven van "Tik aan wat bij jullie past — we tonen dan hotels" naar "Tik aan wat bij jullie past, dan tonen we hotels". Oppervlaktes (Rhodos 1.401 km², Zakynthos 406 km²) kloppen. `dateModified` 2026-07-13 → 2026-08-10.

**`/gids/eilanden/cyprus-of-kreta/`** — 10 gedachtestreepjes vervangen: 2 tabelcellen → middot, 1 haakjespaar bij de julihitte, 2 dubbele punten, rest komma's + vaste labels. Het FAQ-antwoord over de vlucht Heraklion–Larnaca is in JSON-LD én zichtbare tekst identiek aangepast. Oppervlaktes (Kreta 8.336 km², Cyprus 9.251 km²) kloppen en zijn consistent met `/gids/eilanden/malta-of-cyprus/`. `dateModified` 2026-07-13 → 2026-08-10.

**`/gids/romantische-vakantie-europa/`** — 8 gedachtestreepjes vervangen: 3 dubbele punten, 3 komma's/voegwoord ("mei of september-oktober, want in de zomer zijn de paden overvol") en de vaste labels. De 8 budgetranges in de tabel komen overeen met de bedragen in de lopende tekst. `dateModified` 2026-07-18 → 2026-08-10.

**`/gids/huwelijksreis/`** — **0 gedachtestreepjes**, de enige schone pagina in deze batch. JSON-LD geldig, FAQ-volgorde komt overeen met de `<h3>`-volgorde, links in orde. Enige punt: de meta description is 208 tekens en wordt in de zoekresultaten afgekapt (zie open punten). Geen inhoudelijke wijziging, dus `dateModified` bewust op 2026-07-28 gelaten.

**`/gids/eilanden/malta-of-cyprus/`** — 16 gedachtestreepjes vervangen, waarvan 9 in de "wie kiest wat"-tabel → middot. Verder 1 haakjespaar bij de julihitte, 2 dubbele punten (Ramla Bay, "micro-culturen") en 1 komma. `daarnaast` komt 1x voor, binnen de norm. `dateModified` 2026-07-14 → 2026-08-10.

**`/gids/dubrovnik-of-split/`** — 3 gedachtestreepjes vervangen (1 komma + de 2 vaste labels). Prijzen gecontroleerd: de €50-70 en €35 p.p. gaan over een diner voor twee en de stadsmuurwandeling, niet over ligbedden, dus het Kroatië-ligbedanker (€15-30 per set) is hier niet van toepassing. Zlatni Rat wordt genoemd zonder strandtype-claim, dus geen conflict met de kiezel-regel uit `FEITENTABEL.md`. `dateModified` 2026-07-13 → 2026-08-10.

**`/gids/welke-vakantie-past-bij-mij/`** — 4 gedachtestreepjes vervangen: de `<h2>` "Stap 1: bepaal jullie sfeer — strand, cultuur of mix" naar haakjes, 1 dubbele punt en de vaste labels. De budgettabel en de bedragen in het FAQ-schema komen overeen. `dateModified` 2026-05-05 → 2026-08-10.

**`/gids/vakantie-twee-personen/`** — 4 gedachtestreepjes vervangen (1 komma, 1 dubbele punt, 2 vaste labels). De totaalbedragen per koppel (€1.000-2.400) en de p.p.-bedragen (€500-1.200) zijn intern consistent en volgen de schrijfregel "weekbudget per koppel". `dateModified` 2026-05-05 → 2026-08-10.

### Sitebreed resultaat deze batch
- **89 gedachtestreepjes** vervangen over 9 pagina's; `/gids/huwelijksreis/` was al schoon. Alle 10 pagina's staan nu op 0, ook in HTML-comments en attributen.
- JSON-LD: alle 30 `<script type="application/ld+json">`-blokken (3 per pagina: Article, FAQPage, BreadcrumbList) opnieuw gevalideerd na de wijzigingen, allemaal geldige JSON.
- FAQ-volgorde: op alle 10 pagina's komt de schema-volgorde overeen met de zichtbare `<h3>`-volgorde. De extra `<h3>` "Lees ook" op 6 pagina's is een sectiekop, geen FAQ-item, en verstoort de volgorde niet.
- Interne links: 0 gebroken `href="/..."`-links.
- Auteursnaam: overal "Tessa van Kiespret" / "Maker van Kiespret"; geen achternaam in zichtbare tekst. De LinkedIn-`sameAs` in het schema blijft staan zoals afgesproken.
- Trema's/diakrieten: geen fouten (Kroatië, Italië, Sicilië, Sardinië, Rivièra, Brač, Šolta, Koločep, Kaş correct).
- Andere AI-tells: na de fix op `/gids/zonvakantie-september/` komt "bovendien" nergens meer voor; "daarnaast" 1x, "kortom" en "tevens" 0x.
- Foto's: geen enkele pagina heeft twee identieke zichtbare foto's. Wel drie Unsplash-ID's die over pagina's heen terugkomen, met consistente alt-teksten (zie open punten).
- `dateModified`: op alle 9 gewijzigde pagina's bijgewerkt naar 2026-08-10.

### Open punten (niet zelf aangepast)
1. **Turkije-prijsanker nu op twee pagina's in conflict.** `/gids/zonvakantie-september/` noemt "vanaf circa €200 p.p." en "€300-450 p.p. voor 4-sterren", `/gids/zonvakantie-juni/` noemt "vanaf circa 219 euro p.p." en "€350-450 p.p.", terwijl `/gids/adults-only-turkije/` sinds batch 2 op het anker van €650-900 p.p. staat. Dit is dezelfde open kwestie als batch 2, maar hij raakt nu meerdere seizoenspagina's, dus het is de moeite waard om hem te sluiten. Voorstel: `FEITENTABEL.md` verbreden naar "€650-900 p.p. gangbaar voor 4-sterren all-inclusive in het hoogseizoen; vanaf ±€200-450 p.p. bij budgetlocaties en resthoteldeals in het naseizoen", en die formulering op alle Turkije-pagina's aanhouden. Zolang dat niet is besloten blijven de bedragen ongemoeid.
2. **Meta description `/gids/huwelijksreis/` is 208 tekens** en wordt afgekapt. Voorstel: inkorten tot ±155 tekens, bijvoorbeeld "Waar op huwelijksreis? Vergelijk de Malediven, Mauritius en Bali met romantische bestemmingen dichter bij huis, op sfeer, budget en vliegtijd."
3. **Meta descriptions onder de richtlijn**: `/gids/griekenland/rhodos-of-zakynthos/` (121), `/gids/eilanden/cyprus-of-kreta/` (123), `/gids/eilanden/malta-of-cyprus/` (123) en `/gids/dubrovnik-of-split/` (130) blijven onder de 150-160. Voorstel: aanvullen met een concreet cijfer (vliegtijd of prijsindicatie). Geen fout, dus niet aangepast.
4. **Titels boven de ~60 tekens**: `/gids/zonvakantie-september/` (74), `/gids/vakantie-twee-personen/` (69), `/gids/romantische-vakantie-europa/` (67) en `/gids/welke-vakantie-past-bij-mij/` (62). De 74-tekens-titel is de sterkste kandidaat om in te korten; "Zonvakantie september: 7 bestemmingen voor koppels | Kiespret" is 61 tekens.
5. **Unsplash-ID's die over pagina's heen terugkomen** (geen duplicaten binnen één pagina, dus geen harde fout): `photo-1613395877344` (Oia/Santorini) op `/gids/romantische-vakantie-europa/` en `/gids/huwelijksreis/`; `photo-1507525428034` en `photo-1567335991483` (generiek tropisch strand) op `/gids/huwelijksreis/` en `/gids/welke-vakantie-past-bij-mij/`. De alt-teksten spreken elkaar niet tegen. Overweging: op termijn variëren voor visueel onderscheid.
6. **Niet-toetsbare cijfers in deze batch**: watertemperaturen per maand (19-28°C), vliegtijden vanuit Nederland (2-4,5 uur Europa, 10,5 uur Malediven, 12 uur Mauritius), de ferry Lanzarote–Fuerteventura (30 min) en de seizoensvlucht Heraklion–Larnaca (±1,5 uur) staan niet in `FEITENTABEL.md`. Dit is dezelfde aanbeveling als in batch 2 en wordt nu voor de tweede keer geraakt. Voorstel: secties "watertemperatuur per bestemming per maand", "vliegtijden vanuit Nederland" en "korte veerverbindingen" toevoegen aan de feitentabel.

---
