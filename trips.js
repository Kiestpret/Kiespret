// trips.js — Kiespret dataset v1
// Scope: uitsluitend zonvakanties voor Nederlandse koppels 28–45
// Sfeer-tags: 'strand' | 'actief' | 'resort'
// Prijs: indicatief per persoon o.b.v. april 2026, vliegveld AMS tenzij anders

const trips = [

  // ── MALLORCA ─────────────────────────────────────────────────────────────
  {
    id: 'mallorca-adults-resort',
    title: 'Adults only resort Mallorca',
    destination: 'Mallorca, Spanje',
    hotelName: 'Cala Breeze Resort',
    sfeer: ['resort', 'comfort', 'allinclusive'],
    aanbieder: 'TUI',
    boardType: 'All-inclusive',
    vluchtduur: '2u15',
    adultsOnly: true,
    audience: 'couples',
    matchReason: 'Ideaal voor koppels die willen ontzorgen',
    whyThisTrip: 'All-inclusive resort op loopafstand van het strand — geen keuzes, alleen genieten',
    tags: ['adults-only', 'strand', 'pool', 'allinclusive', 'resort'],
    highlights: ['Infinity pool', 'Inclusief drankjes & maaltijden', '150m van strand'],
    description: 'Mallorca combineert zeker weer, turquoise water en uitstekende service. Dit adults-only resort is perfect voor een koppel dat écht wil ontspannen.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    affiliatePartner: 'TUI',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 899,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 1099, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1199, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
      { maand: 'mei',      duur: 14, airport: 'AMS', prijs: 1199, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
      { maand: 'juni',     duur: 14, airport: 'AMS', prijs: 1499, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/mallorca/' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  {
    id: 'mallorca-strand-actief',
    title: 'Actieve strandweek Mallorca',
    destination: 'Mallorca, Spanje',
    hotelName: 'Porto Playa Hotel',
    sfeer: ['actief', 'strand', 'natuur'],
    aanbieder: 'Sunweb',
    boardType: 'Halfpension',
    vluchtduur: '2u15',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Strand én avontuur in één week',
    whyThisTrip: 'Overdag wandelen of snorkelen, \'s avonds genieten van Mallorca\'s beste restaurants',
    tags: ['strand', 'actief', 'snorkelen', 'wandelen', 'halfpension'],
    highlights: ['Huurfiets of -scooter mogelijk', 'Snorkelspot op 10 min', 'Basis aan het strand'],
    description: 'Voor koppels die niet stilzitten. Mallorca heeft schitterende kustpaden, verborgen baaien en gezellige dorpen. Overdag actief, \'s avonds relaxed.',
    imageUrl: 'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=800&q=80',
    affiliatePartner: 'Sunweb',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.sunweb.nl/vakantie/spanje/mallorca' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.sunweb.nl/vakantie/spanje/mallorca' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.sunweb.nl/vakantie/spanje/mallorca' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1099, affiliateUrl: 'https://www.sunweb.nl/vakantie/spanje/mallorca' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.sunweb.nl/vakantie/spanje/mallorca' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── GRAN CANARIA ─────────────────────────────────────────────────────────
  {
    id: 'gran-canaria-resort',
    title: 'All-inclusive resort Gran Canaria',
    destination: 'Gran Canaria, Spanje',
    hotelName: 'Playa del Inglés Resort',
    sfeer: ['resort', 'comfort', 'allinclusive'],
    aanbieder: 'Corendon',
    boardType: 'All-inclusive',
    vluchtduur: '4u',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Zon gegarandeerd, ook in de winter',
    whyThisTrip: 'Gran Canaria heeft het hele jaar door 24 graden. All-inclusive resort aan de duinen van Maspalomas.',
    tags: ['strand', 'pool', 'allinclusive', 'resort', 'zeker-weer'],
    highlights: ['Jaar-rond zeker zon', 'Duinen van Maspalomas op 5 min', 'Groot zwembadcomplex'],
    description: 'Geen gok op het weer — Gran Canaria heeft 300 dagen zon per jaar. Ideaal voor een ontspannen all-inclusive week waarbij je echt niks hoeft te regelen.',
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    affiliatePartner: 'Corendon',
    variants: [
      { maand: 'januari',  duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
      { maand: 'februari', duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
      { maand: 'maart',    duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
      { maand: 'november', duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
      { maand: 'december', duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.corendon.nl/vakantie/gran-canaria' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── TENERIFE ─────────────────────────────────────────────────────────────
  {
    id: 'tenerife-actief',
    title: 'Actief op Tenerife',
    destination: 'Tenerife, Spanje',
    hotelName: 'Los Gigantes Boutique',
    sfeer: ['actief', 'natuur', 'strand'],
    aanbieder: 'TUI',
    boardType: 'Ontbijt',
    vluchtduur: '4u15',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Natuur, vulkaan en zee in één',
    whyThisTrip: 'Wandel naar de top van de Teide (3.715m) en eindig de dag aan het zwarte strand.',
    tags: ['actief', 'wandelen', 'natuur', 'vulkaan', 'strand'],
    highlights: ['Teide nationaalpark op 1u rijden', 'Snorkelen bij Los Gigantes', 'Zwarte lavastranden'],
    description: 'Tenerife is meer dan zon en strand. De vulkaan Teide, groen noorden en dramatische kliffen — perfect voor koppels die avontuur zoeken.',
    imageUrl: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
    affiliatePartner: 'TUI',
    variants: [
      { maand: 'maart',    duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/tenerife/' },
      { maand: 'april',    duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/tenerife/' },
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/tenerife/' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/tenerife/' },
      { maand: 'november', duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/tenerife/' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── KRETA ────────────────────────────────────────────────────────────────
  {
    id: 'kreta-strand-relax',
    title: 'Ontspannen strandweek Kreta',
    destination: 'Kreta, Griekenland',
    hotelName: 'Elounda Beach Club',
    sfeer: ['strand', 'rustig', 'zon'],
    aanbieder: 'Sunweb',
    boardType: 'Halfpension',
    vluchtduur: '3u30',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Blauwste water van de Middellandse Zee',
    whyThisTrip: 'Kreta heeft het helderste water van Griekenland, heerlijk eten en een relaxte sfeer.',
    tags: ['strand', 'rustig', 'zon', 'eten', 'halfpension'],
    highlights: ['Helder turquoise water', 'Grieks eten op loopafstand', 'Rustige baai'],
    description: 'Kreta is groot, mooi en relaxed. Geen massatoerisme maar authentieke Griekse sfeer, perfect voor koppels die willen opladen.',
    imageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    affiliatePartner: 'Sunweb',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 1049, affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1149, affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
      { maand: 'mei',      duur: 14, airport: 'AMS', prijs: 1199, affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/kreta' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── RHODOS ───────────────────────────────────────────────────────────────
  {
    id: 'rhodos-resort',
    title: 'All-inclusive resort Rhodos',
    destination: 'Rhodos, Griekenland',
    hotelName: 'Faliraki Bay Resort',
    sfeer: ['resort', 'comfort', 'allinclusive'],
    aanbieder: 'TUI',
    boardType: 'All-inclusive',
    vluchtduur: '3u45',
    adultsOnly: true,
    audience: 'couples',
    matchReason: 'Griekenland op z\'n relaxts',
    whyThisTrip: 'Adults-only all-inclusive aan de Egeïsche Zee — middagdutje, cocktail, herhaal.',
    tags: ['resort', 'allinclusive', 'adults-only', 'strand', 'pool'],
    highlights: ['Privéstrand', 'Adults-only pool', 'Inclusief drankjes & snacks'],
    description: 'Rhodos combineert Grieks karakter met comfortabele all-inclusive service. Dit adults-only resort is gemaakt voor koppels die echt willen loskoppelen.',
    imageUrl: 'https://images.unsplash.com/photo-1586861203927-800a5acdce4d?w=800&q=80',
    affiliatePartner: 'TUI',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/griekenland/rhodos/' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 949,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/griekenland/rhodos/' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 1149, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/griekenland/rhodos/' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1249, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/griekenland/rhodos/' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 899,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/griekenland/rhodos/' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── KOS ──────────────────────────────────────────────────────────────────
  {
    id: 'kos-actief-strand',
    title: 'Actieve strandvakantie Kos',
    destination: 'Kos, Griekenland',
    hotelName: 'Tigaki Beach Studios',
    sfeer: ['actief', 'strand', 'natuur'],
    aanbieder: 'D-reizen',
    boardType: 'Ontbijt',
    vluchtduur: '3u30',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Fietsen, strand en authentiek Grieks eten',
    whyThisTrip: 'Kos is het fietseiland van Griekenland — flat, groen en omringd door kristalhelder water.',
    tags: ['actief', 'fietsen', 'strand', 'natuur', 'eten'],
    highlights: ['Plat eiland, ideaal voor fietsen', 'Tigaki strand: kite & wind', 'Lokaal eten in Kos-stad'],
    description: 'Kos is compacter en rustiger dan Rhodos. Perfect voor koppels die actief willen zijn maar ook gewoon op het strand willen liggen.',
    imageUrl: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&q=80',
    affiliatePartner: 'D-reizen',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/griekenland/kos' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/griekenland/kos' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/griekenland/kos' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1099, affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/griekenland/kos' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/griekenland/kos' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── CORFU ────────────────────────────────────────────────────────────────
  {
    id: 'corfu-relax',
    title: 'Rustige strandweek Corfu',
    destination: 'Corfu, Griekenland',
    hotelName: 'Paleokastritsa Bay Hotel',
    sfeer: ['strand', 'rustig', 'zon'],
    aanbieder: 'Sunweb',
    boardType: 'Halfpension',
    vluchtduur: '3u',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Groene heuvels, turquoise baaien — het mooiste van Griekenland',
    whyThisTrip: 'Corfu is groener en romantischer dan de meeste Griekse eilanden — perfect voor koppels.',
    tags: ['strand', 'rustig', 'romantisch', 'natuur', 'halfpension'],
    highlights: ['Paleokastritsa: mooiste baai van Griekenland', 'Groen en bergachtig', 'Kleiner en rustiger'],
    description: 'Corfu combineert weelderig groen met schitterend blauw water. Minder massa, meer sfeer — ideaal voor een romantische week weg.',
    imageUrl: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80',
    affiliatePartner: 'Sunweb',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/corfu' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/corfu' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/corfu' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.sunweb.nl/vakantie/griekenland/corfu' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── ANTALYA / TURKIJE ────────────────────────────────────────────────────
  {
    id: 'antalya-allinclusive',
    title: 'All-inclusive resort Antalya',
    destination: 'Antalya, Turkije',
    hotelName: 'Belek Beach Palace',
    sfeer: ['resort', 'comfort', 'allinclusive'],
    aanbieder: 'Corendon',
    boardType: 'All-inclusive',
    vluchtduur: '3u45',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Meeste waarde voor je geld in de Middellandse Zee',
    whyThisTrip: 'Turkije all-inclusive: uitstekende kwaliteit voor de prijs, groot resortcomplex, warm water.',
    tags: ['resort', 'allinclusive', 'strand', 'pool', 'watersport'],
    highlights: ['Privéstrand & meerdere pools', 'Inclusief alles: eten, drinken, sport', 'Warm water tot oktober'],
    description: 'Antalya is de all-inclusive hoofdstad van de Middellandse Zee. Grote resorts, perfect onderhouden stranden en uitstekende service voor een scherpe prijs.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    affiliatePartner: 'Corendon',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.corendon.nl/vakantie/turkije/antalya' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.corendon.nl/vakantie/turkije/antalya' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.corendon.nl/vakantie/turkije/antalya' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1099, affiliateUrl: 'https://www.corendon.nl/vakantie/turkije/antalya' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.corendon.nl/vakantie/turkije/antalya' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.corendon.nl/vakantie/turkije/antalya' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── BODRUM / TURKIJE ─────────────────────────────────────────────────────
  {
    id: 'bodrum-actief',
    title: 'Actieve week Bodrum',
    destination: 'Bodrum, Turkije',
    hotelName: 'Aegean View Boutique',
    sfeer: ['actief', 'strand', 'natuur'],
    aanbieder: 'TUI',
    boardType: 'Halfpension',
    vluchtduur: '3u30',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Zeilen, snorkelen en Turkse cultuur',
    whyThisTrip: 'Bodrum heeft een levendige haven, mooie baaien en de beste watersportmogelijkheden van Turkije.',
    tags: ['actief', 'zeilen', 'snorkelen', 'strand', 'cultuur'],
    highlights: ['Bodrum kasteel & haven', 'Dagtripje per boot', 'Lokale bazaar'],
    description: 'Bodrum is hip, actief en mooi. Overdag op het water, \'s avonds langs de haven flaneren — perfecte mix voor een avontuurlijk koppel.',
    imageUrl: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&q=80',
    affiliatePartner: 'TUI',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/turkije/bodrum/' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/turkije/bodrum/' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 1049, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/turkije/bodrum/' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1149, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/turkije/bodrum/' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/turkije/bodrum/' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── CYPRUS ───────────────────────────────────────────────────────────────
  {
    id: 'cyprus-resort-adults',
    title: 'Adults-only resort Cyprus',
    destination: 'Cyprus',
    hotelName: 'Nissi Beach Retreat',
    sfeer: ['resort', 'comfort', 'strand'],
    aanbieder: 'TUI',
    boardType: 'Halfpension',
    vluchtduur: '4u30',
    adultsOnly: true,
    audience: 'couples',
    matchReason: 'Langste strandseizoen van de Middellandse Zee',
    whyThisTrip: 'Cyprus heeft tot eind oktober warm water. Adults-only hotel aan het beroemde Nissi Beach.',
    tags: ['adults-only', 'strand', 'resort', 'zon', 'lang-seizoen'],
    highlights: ['Nissi Beach: top 10 Europa', 'Warm water tot nov', 'Rustig en volwassen sfeer'],
    description: 'Cyprus is de onderschatte parel van de Middellandse Zee. Warm, mooi en minder druk dan Griekenland — perfect voor een relaxt koppelweekje.',
    imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    affiliatePartner: 'TUI',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 799,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/cyprus/' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 949,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/cyprus/' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 1149, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/cyprus/' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1249, affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/cyprus/' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/cyprus/' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/cyprus/' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── ALGARVE / PORTUGAL ───────────────────────────────────────────────────
  {
    id: 'algarve-actief',
    title: 'Actieve kustweek Algarve',
    destination: 'Algarve, Portugal',
    hotelName: 'Lagos Cliffs Boutique Hotel',
    sfeer: ['actief', 'natuur', 'strand'],
    aanbieder: 'Sunweb',
    boardType: 'Ontbijt',
    vluchtduur: '2u45',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Spectaculaire rotskusten en verborgen stranden',
    whyThisTrip: 'De Algarve heeft de mooiste kustlijn van Europa — perfect voor koppels die graag wandelen en ontdekken.',
    tags: ['actief', 'wandelen', 'rotskusten', 'strand', 'natuur'],
    highlights: ['Ponta da Piedade: iconische rotsformaties', 'Kajakken langs de kust', 'Verse vis & wine'],
    description: 'De Algarve is anders dan de gemiddelde zonvakantie. Ruige kliffen, gouden stranden en heerlijk eten. Perfect voor actieve koppels die ook willen relaxen.',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80',
    affiliatePartner: 'Sunweb',
    variants: [
      { maand: 'april',    duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.sunweb.nl/vakantie/portugal/algarve' },
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.sunweb.nl/vakantie/portugal/algarve' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.sunweb.nl/vakantie/portugal/algarve' },
      { maand: 'juli',     duur: 7,  airport: 'AMS', prijs: 999,  affiliateUrl: 'https://www.sunweb.nl/vakantie/portugal/algarve' },
      { maand: 'augustus', duur: 7,  airport: 'AMS', prijs: 1099, affiliateUrl: 'https://www.sunweb.nl/vakantie/portugal/algarve' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 849,  affiliateUrl: 'https://www.sunweb.nl/vakantie/portugal/algarve' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── HURGHADA / EGYPTE ────────────────────────────────────────────────────
  {
    id: 'hurghada-allinclusive',
    title: 'All-inclusive Hurghada',
    destination: 'Hurghada, Egypte',
    hotelName: 'Makadi Bay Palace',
    sfeer: ['resort', 'comfort', 'allinclusive'],
    aanbieder: 'Corendon',
    boardType: 'All-inclusive',
    vluchtduur: '5u',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Snorkelen én all-inclusive voor een scherpe prijs',
    whyThisTrip: 'Hurghada combineert geweldig snorkelen in de Rode Zee met uitstekende all-inclusive resorts.',
    tags: ['resort', 'allinclusive', 'snorkelen', 'duiken', 'rode-zee'],
    highlights: ['Koraalrif voor de kust', 'All-inclusive inclusief watersport', 'Budget-vriendelijkste optie'],
    description: 'Voor koppels die het maximale willen voor hun budget. Warm water, kleurrijke koraalriffen en alles inclusief. Hurghada is een uitstekende keuze buiten het hoogseizoen.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    affiliatePartner: 'Corendon',
    variants: [
      { maand: 'januari',  duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
      { maand: 'februari', duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
      { maand: 'maart',    duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
      { maand: 'april',    duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
      { maand: 'november', duur: 7,  airport: 'AMS', prijs: 649,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
      { maand: 'december', duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.corendon.nl/vakantie/egypte/hurghada' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── LANZAROTE ────────────────────────────────────────────────────────────
  {
    id: 'lanzarote-actief',
    title: 'Actieve vulkaanweek Lanzarote',
    destination: 'Lanzarote, Spanje',
    hotelName: 'Playa Blanca Surf Lodge',
    sfeer: ['actief', 'natuur', 'strand'],
    aanbieder: 'D-reizen',
    boardType: 'Ontbijt',
    vluchtduur: '3u45',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Vulkaanlandschap, surfen en wilde kusten',
    whyThisTrip: 'Lanzarote is het meest bijzondere Canarische eiland — zwarte lava, windmolens en uitstekende surfspots.',
    tags: ['actief', 'surfen', 'natuur', 'vulkaan', 'windsurf'],
    highlights: ['Timanfaya nationaalpark', 'Famara: surfstrand', 'Jamieos del Agua'],
    description: 'Lanzarote is niet voor iedereen — maar voor koppels die avontuur zoeken is het een van de mooiste bestemmingen van Europa.',
    imageUrl: 'https://images.unsplash.com/photo-1564415092735-e8a1b64da5b7?w=800&q=80',
    affiliatePartner: 'D-reizen',
    variants: [
      { maand: 'maart',    duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/spanje/lanzarote' },
      { maand: 'april',    duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/spanje/lanzarote' },
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/spanje/lanzarote' },
      { maand: 'oktober',  duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/spanje/lanzarote' },
      { maand: 'november', duur: 7,  airport: 'AMS', prijs: 699,  affiliateUrl: 'https://www.d-reizen.nl/zonvakantie/spanje/lanzarote' },
    ],
    prijsPeilDatum: 'april 2026',
  },

  // ── IBIZA ────────────────────────────────────────────────────────────────
  {
    id: 'ibiza-relax-noorden',
    title: 'Rustig Ibiza (noorden)',
    destination: 'Ibiza, Spanje',
    hotelName: 'Cala San Vicente Retreat',
    sfeer: ['strand', 'rustig', 'zon'],
    aanbieder: 'TUI',
    boardType: 'Ontbijt',
    vluchtduur: '2u30',
    adultsOnly: false,
    audience: 'couples',
    matchReason: 'Ibiza zonder het feestgeweld — rustige baaien en geweldig eten',
    whyThisTrip: 'Het noorden van Ibiza is een wereld apart: rustig, authentiek en schitterend mooi.',
    tags: ['strand', 'rustig', 'eten', 'romantisch', 'ontbijt'],
    highlights: ['Cala San Vicente: rustige baai', 'Authentieke dorpjes', 'Beste restaurants van Ibiza'],
    description: 'Ibiza is meer dan clubs en feesten. Het noorden is groen, rustig en authentiek. Een perfecte keuze voor koppels die willen ontsnappen aan de massa.',
    imageUrl: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eaf09?w=800&q=80',
    affiliatePartner: 'TUI',
    variants: [
      { maand: 'mei',      duur: 7,  airport: 'AMS', prijs: 749,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/ibiza/' },
      { maand: 'juni',     duur: 7,  airport: 'AMS', prijs: 949,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/ibiza/' },
      { maand: 'september',duur: 7,  airport: 'AMS', prijs: 899,  affiliateUrl: 'https://www.tui.nl/zonnige-bestemmingen/spanje/ibiza/' },
    ],
    prijsPeilDatum: 'april 2026',
  },

];

// Helper: match de juiste variant op basis van gebruikersvoorkeuren
function matchVariant(trip, prefs) {
  return trip.variants.find(v =>
    prefs.maanden.includes(v.maand) &&
    v.duur === prefs.duur &&
    v.airport === prefs.airport &&
    v.prijs <= prefs.budgetMax
  ) || null;
}

// Helper: filter trips op sfeer-tags
function filterTrips(prefs) {
  return trips
    .map(trip => {
      const variant = matchVariant(trip, prefs);
      if (!variant) return null;
      // Check sfeer overlap
      const sfeermatch = trip.sfeer.some(s => prefs.sfeer.includes(s));
      if (!sfeermatch) return null;
      return { ...trip, matchedVariant: variant };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sorteer: meeste sfeer-overlap bovenaan
      const scoreA = a.sfeer.filter(s => prefs.sfeer.includes(s)).length;
      const scoreB = b.sfeer.filter(s => prefs.sfeer.includes(s)).length;
      return scoreB - scoreA;
    });
}
