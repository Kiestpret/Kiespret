/**
 * Kiespret Analytics — 11 custom events conform bouwplan v3
 *
 * Events:
 * 1.  flow_start            — Eerste klik op start-CTA (index.html + start.html)
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
 * Events tijdens eerste paint worden in een lokale queue gezet en geflushed
 * zodra window.plausible beschikbaar is — zo verliezen we geen KPI-data.
 */

(function() {
  'use strict';

  var localQueue = [];
  var flushTimer = null;

  function sendEvent(event, props) {
    try {
      if (props) {
        window.plausible(event, { props: props });
      } else {
        window.plausible(event);
      }
    } catch (e) {
      console.warn('kiespretTrack verzend-fout:', e);
    }
  }

  function flushLocalQueue() {
    if (typeof window.plausible !== 'function') return;
    while (localQueue.length > 0) {
      var item = localQueue.shift();
      sendEvent(item.event, item.props);
    }
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
  }

  function track(event, props) {
    if (typeof window.plausible === 'function') {
      sendEvent(event, props);
      return;
    }
    // Plausible nog niet geladen — queue het event en start flush-timer
    localQueue.push({ event: event, props: props });
    if (!flushTimer) {
      var attempts = 0;
      flushTimer = setInterval(function() {
        attempts++;
        if (typeof window.plausible === 'function') {
          flushLocalQueue();
        } else if (attempts >= 25) {
          // Na 5 seconden geven we het op — events blijven in queue
          clearInterval(flushTimer);
          flushTimer = null;
        }
      }, 200);
    }
  }

  // Maak track functie globaal beschikbaar voor inline calls
  window.kiespretTrack = track;
})();
