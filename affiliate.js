/**
 * Kiespret Affiliate Helper — outbound click met tracking
 *
 * Opent de affiliate-redirect via /api/go (verbergt echte URLs).
 * TradeTracker DirectLinking is cookie-resistent en werkt zonder
 * third-party cookies.
 *
 * LET OP: dit bestand wordt momenteel niet geladen in HTML.
 * De outbound-logica zit in start.html → openOutbound().
 * Dit bestand bestaat als standalone helper voor toekomstig gebruik.
 */

(function() {
  'use strict';

  window.openAffiliateLink = function(trip) {
    if (!trip) {
      console.warn('openAffiliateLink: trip ontbreekt');
      return;
    }
    if (!trip.matchedVariant) {
      console.warn('openAffiliateLink: matchedVariant ontbreekt voor trip', trip.id);
      return;
    }

    var aanbieder = trip.aanbieder || trip.affiliatePartner || 'onbekend';
    var variantIdx = trip.variants ? trip.variants.indexOf(trip.matchedVariant) : 0;
    if (variantIdx < 0) variantIdx = 0;

    // Bouw redirect-URL via /api/go — echte affiliate-URLs staan niet meer in trips.js
    var goUrl = '/api/go?id=' + encodeURIComponent(trip.id) + '&v=' + encodeURIComponent(variantIdx);

    // Track via Plausible (kiespretTrack is veilig — faalt stil als niet geladen)
    if (typeof window.kiespretTrack === 'function') {
      window.kiespretTrack('outbound_click', {
        trip: trip.id,
        provider: aanbieder,
        destination: trip.destination
      });
    }

    // Open in nieuw tabblad — noopener voorkomt window.opener-manipulatie
    // GEEN noreferrer: TradeTracker heeft de Referer nodig voor herkomst-attributie
    window.open(goUrl, '_blank', 'noopener');
  };
})();
