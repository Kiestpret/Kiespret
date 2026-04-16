/**
 * Kiespret Affiliate Helper — outbound click met tracking
 *
 * Logt het outbound_click event naar Plausible en opent de
 * affiliate-link in een nieuw tabblad. TradeTracker DirectLinking
 * is cookie-resistent en werkt zonder third-party cookies.
 */

(function() {
  'use strict';

  // Accepteer alleen http(s) URL's — blokkeert javascript: en data: schemes
  function isSafeAffiliateUrl(url) {
    if (typeof url !== 'string') return false;
    var trimmed = url.trim();
    return /^https?:\/\//i.test(trimmed);
  }

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
    var url = trip.matchedVariant.affiliateUrl;

    if (!isSafeAffiliateUrl(url)) {
      console.warn('openAffiliateLink: ongeldige affiliateUrl voor trip', trip.id, url);
      // Laat user weten dat er iets mis is in plaats van stille crash
      if (typeof window.alert === 'function') {
        window.alert('Sorry — deze boeklink is momenteel niet beschikbaar. Probeer een andere vakantie.');
      }
      return;
    }

    // Track via Plausible (kiespretTrack is veilig — faalt stil als niet geladen)
    if (typeof window.kiespretTrack === 'function') {
      window.kiespretTrack('outbound_click', {
        trip: trip.id,
        provider: aanbieder,
        destination: trip.destination
      });
    }

    // Open in nieuw tabblad — noreferrer voorkomt Referer-lek, noopener voorkomt window.opener-manipulatie
    window.open(url, '_blank', 'noopener,noreferrer');
  };
})();
