// ross-trips.js — Kiespret: kleinschalig Griekenland via Ross Holidays
//
// Handmatig gecureerde pakketreizen (vlucht + zelfverzorgend verblijf + transfer)
// van Ross Holidays, buiten de Corendon-feed om. Worden in app.js in het deck
// gemengd (rossTrips → trips). Los onderhouden zodat een feed-rebuild van
// trips.js deze niet overschrijft.
//
// Curatie-poort: alleen accommodaties met vindbare, sterke losse reviews.
//   - Myrties Stone Houses (Zakynthos): Booking.com 9,7
//   - Akrogiali Studios (Kefalonia):    Booking.com 9,0 (152 reviews)
//
// Prijs = per persoon, INCLUSIEF vlucht, transfer en boekingskosten
// (Ross-pakketprijs, "vanaf" op basis van de 8-daagse variant).
// Alleen 8-daagse varianten: passen in de 6–8-nachten-matcher van het deck.
// affiliate deeplink staat in .data/affiliate-map.json (id = ross-<slug>).

const rossTrips = [
  {
    "id": "ross-myrties-zakynthos",
    "title": "Kleinschalig Zakynthos",
    "destination": "Zakynthos, Griekenland",
    "hotelName": "Myrties Stone Houses",
    "sfeer": ["natuur", "avontuur", "rustig"],
    "aanbieder": "Ross Holidays",
    "boardType": "Zelfverzorgend",
    "vluchtduur": "3u",
    "adultsOnly": false,
    "audience": "couples",
    "matchReason": "Kleinschalig zelfverzorgend op Zakynthos — vlucht inbegrepen via Ross Holidays",
    "whyThisTrip": "Vier stenen huisjes op een oude familieboerderij bij Vasilikos, op loopafstand van het schildpaddenstrand Gerakas.",
    "tags": ["kleinschalig", "zelfverzorgend", "authentiek", "natuur", "rustig", "ionisch"],
    "highlights": [
      "Kleinschalig verblijf",
      "Gastwaardering: 9,7",
      "Zelfverzorgend appartement",
      "Vlucht inbegrepen"
    ],
    "description": "Traditionele familieboerderij uit 1911, verbouwd tot vier knusse studio's en appartementen in het rustige Vasilikos. Zelfverzorgend, authentiek en dicht bij het natuurstrand Gerakas.",
    "imageUrl": "https://www.rossholidays.nl/cache/image/14985584782yrtiestoneo.jpg",
    "affiliatePartner": "Ross Holidays",
    "variants": [
      { "maand": "augustus", "duur": 8, "airport": "AMS", "prijs": 524 },
      { "maand": "september", "duur": 8, "airport": "AMS", "prijs": 524 },
      { "maand": "oktober", "duur": 8, "airport": "AMS", "prijs": 524 }
    ],
    "prijsPeilDatum": "augustus 2026",
    "tripDesc": "op Zakynthos, kleinschalig, zelfverzorgend, gastwaardering 9,7."
  },
  {
    "id": "ross-akrogiali-kefalonia",
    "title": "Kleinschalig Kefalonia",
    "destination": "Kefalonia, Griekenland",
    "hotelName": "Akrogiali Studios",
    "sfeer": ["natuur", "avontuur", "rustig"],
    "aanbieder": "Ross Holidays",
    "boardType": "Zelfverzorgend",
    "vluchtduur": "3u",
    "adultsOnly": false,
    "audience": "couples",
    "matchReason": "Kleinschalig zelfverzorgend op Kefalonia — vlucht inbegrepen via Ross Holidays",
    "whyThisTrip": "Zelfverzorgende studio's pal aan zee in het rustige vissersdorp Poros, met het strand aan de overkant.",
    "tags": ["kleinschalig", "zelfverzorgend", "authentiek", "natuur", "rustig", "ionisch"],
    "highlights": [
      "Kleinschalig verblijf",
      "Gastwaardering: 9,0",
      "Zelfverzorgend appartement",
      "Vlucht inbegrepen"
    ],
    "description": "Zelfverzorgende studio's aan het einde van de kust van Poros, met het strand aan de overkant en tavernes op loopafstand. Rustig, kleinschalig en vriendelijk.",
    "imageUrl": "https://www.rossholidays.nl/cache/image/812x1064_26bccf17409fa853.jpg",
    "affiliatePartner": "Ross Holidays",
    "variants": [
      { "maand": "augustus", "duur": 8, "airport": "AMS", "prijs": 399 },
      { "maand": "september", "duur": 8, "airport": "AMS", "prijs": 399 },
      { "maand": "oktober", "duur": 8, "airport": "AMS", "prijs": 399 }
    ],
    "prijsPeilDatum": "augustus 2026",
    "tripDesc": "op Kefalonia, kleinschalig, zelfverzorgend, gastwaardering 9,0."
  }
];

if (typeof window !== 'undefined') { window.rossTrips = rossTrips; }
