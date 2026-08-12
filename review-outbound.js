/* review-outbound.js — Kiespret
 * Vuurt het Plausible-event 'outbound_click' af wanneer iemand op een
 * affiliate-link (/api/go?...) van een reviewpagina klikt.
 *
 * Waarom apart: de reviewpagina's gebruiken kale <a href="/api/go?..."> links
 * (niet de swipe-deck/affiliate.js), waardoor die kliks voorheen NIET in
 * Plausible verschenen. Dit dicht dat meetgat, zodat review-kliks in Plausible
 * te zien zijn (voor het niet-geblokkeerde deel; TradeTracker blijft de
 * server-side waarheid).
 *
 * De links openen in een nieuw tabblad (target="_blank"), dus de pagina blijft
 * staan en het event heeft tijd om te verzenden.
 */
(function () {
  function providerFromId(id) {
    if (!id) return 'onbekend';
    if (id.indexOf('333travel') === 0) return '333travel';
    if (id.indexOf('corendon') === 0) return 'corendon';
    if (id.indexOf('ross') === 0) return 'ross';
    return 'overig';
  }

  function onClick(e) {
    try {
      var href = e.currentTarget.getAttribute('href') || '';
      var query = href.split('?')[1] || '';
      var id = '';
      var parts = query.split('&');
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split('=');
        if (kv[0] === 'id') { id = decodeURIComponent(kv[1] || ''); break; }
      }
      if (typeof window.kiespretTrack === 'function') {
        window.kiespretTrack('outbound_click', { provider: providerFromId(id), trip: id, bron: 'review' });
      }
    } catch (err) { /* stil falen: nooit de klik blokkeren */ }
  }

  function init() {
    var links = document.querySelectorAll('a[href^="/api/go"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', onClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
