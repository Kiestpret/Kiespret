/**
 * Kiespret Affiliate Helper — outbound click met tracking
 *
 * Logt het outbound_click event naar Plausible en opent de
 * affiliate-link in een nieuw tabblad. TradeTracker DirectLinking
 * is cookie-resistent en werkt zonder third-party cookies.
 */

(function() {
  'use strict';

  window.openAffiliateLink = function(trip) {
    if (!trip || !trip.matchedVariant) return;

    var aanbieder = trip.aanbieder || trip.affiliatePartner;
    var url = trip.matchedVariant.affiliateUrl;

    // Track via Plausible
    if (typeof window.kiespretTrack === 'function') {
      window.kiespretTrack('outbound_click', {
        trip: trip.id,
        provider: aanbieder,
        destination: trip.destination
      });
    }

    // Open in nieuw tabblad
    window.open(url, '_blank', 'noopener');
  };
})();
