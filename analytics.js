/**
 * Kiespret Analytics — 11 custom events conform bouwplan v3
 *
 * Events:
 * 1.  flow_start            — Eerste klik op start-CTA (index.html + app.html)
 * 2.  onboarding_complete   — Na stap 4 van de onboarding
 * 3.  swipe_right           — Trip naar rechts geswypt (bewaard)
 * 4.  swipe_left            — Trip naar links geswypt (overgeslagen)
 * 5.  shortlist_view        — Resultatenpagina (top 3) geopend
 * 6.  comparison_open       — Vergelijking van top 3 bekeken
 * 7.  outbound_click        — Klik op affiliate-link naar aanbieder
 * 8.  share_link_created    — Duo-link aangemaakt
 * 9.  partner_session_start — Partner opent gedeelde link
 * 10. email_capture         — E-mailadres ingevuld
 * 11. restart               — Gebruiker start opnieuw
 *
 * Plausible wordt geladen via cookie-consent.js (altijd, want cookieloos).
 * window.plausible() is beschikbaar als global.
 */

(function() {
  'use strict';

  // Veilige wrapper: als Plausible nog niet geladen is, queue het event
  function track(event, props) {
    if (typeof window.plausible === 'function') {
      if (props) {
        window.plausible(event, { props: props });
      } else {
        window.plausible(event);
      }
    }
  }

  // Maak track functie globaal beschikbaar voor inline calls
  window.kiespretTrack = track;
})();
