# Kiespret Soft Launch Testplan

## Doel
Kiespret testen met 10-20 vrienden, familieleden en kennissen om de kernfunnel te valideren vóór we breder verkeer gaan aantrekken. We willen weten of de flow werkt, of mensen doorklikken, en waar ze afhaken.

## Wat we willen meten

### Kwantitatief (via Plausible)
| Metric | Event | Doel |
|---|---|---|
| Start rate | `flow_start` | >70% van bezoekers start de flow |
| Onboarding completion | `onboarding_complete` | >80% van starters voltooit onboarding |
| Swipe engagement | `swipe_right` + `swipe_left` | Gemiddeld >10 swipes per sessie |
| Shortlist rate | `shortlist_view` | >60% van swipers bereikt resultaten |
| Outbound click rate | `outbound_click` | >20% van shortlist-viewers klikt door |
| Duo sessie gebruik | `share_link_created` | Minstens 3 duo-sessies in testperiode |

### Kwalitatief (via feedback)
- Was het duidelijk wat Kiespret doet?
- Klopte de top 3 met jullie gevoel?
- Miste je iets?
- Zou je het doorsturen naar iemand die een vakantie zoekt?
- Was er iets verwarrend of irritant?

## Wie we uitnodigen
- 10-20 personen uit eigen netwerk
- Mix van: koppels die actief een vakantie zoeken, koppels die recent geboekt hebben, en koppels die nog niet zoeken
- Leeftijd 25-45, bij voorkeur koppels (niet alleen singles)

## Hoe we uitnodigen
Persoonlijk bericht via WhatsApp of iMessage:

> "Hey! Ik werk aan een keuzehulp voor koppels die een zonvakantie zoeken. Zou je het willen uitproberen en me vertellen wat je ervan vindt? Kost 2-3 minuten: www.kiespret.nl"

Optioneel toevoegen:
> "Bonus: probeer het samen met je partner via de duo-modus!"

## Timing
- Duur: 1-2 weken
- Start: zodra alle commits gepusht zijn en de site live draait
- Evaluatie: na afloop Plausible dashboard checken + feedback bundelen

## Feedbackverzameling
Optie 1 (simpelst): vraag feedback via WhatsApp reply
Optie 2 (gestructureerder): stuur een kort Google Forms formulier met 5 vragen:
1. Hoe duidelijk was het wat Kiespret doet? (1-5)
2. Klopte de top 3 met jullie gevoel? (ja/nee/deels)
3. Zou je het doorsturen naar iemand? (ja/nee)
4. Wat miste je of vond je verwarrend? (open)
5. Andere opmerkingen? (open)

## Wat we NIET testen
- Affiliate conversies (TradeTracker is nog niet actief)
- SEO-verkeer (te vroeg, pagina's zijn net live)
- Betaalde acquisitie (niet relevant in deze fase)

## Succescriteria
De soft launch is geslaagd als:
- Minstens 10 unieke gebruikers de flow voltooien
- De onboarding completion rate >80% is
- Minstens 5 mensen feedback geven
- Er geen kritieke bugs of UX-blokkades gevonden worden
- De gemiddelde feedback op duidelijkheid >3.5/5 is

## Na de soft launch
1. Bugs en UX-issues fixen
2. Feedback verwerken in de flow
3. TradeTracker aanvragen als de funnel werkt
4. Eerste organisch verkeer monitoren via Plausible + SE Ranking
5. Bij 500+ sessies: trips sorteren op populariteit
