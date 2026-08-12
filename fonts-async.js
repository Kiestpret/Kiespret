/* fonts-async.js — Kiespret
 * Laadt de Google Fonts-stylesheet niet-blokkerend: de <link> staat in de HTML
 * op media="print" (blokkeert de weergave dus niet) en wordt hier op
 * media="all" gezet zodra de pagina is geparsed. Zo verdwijnt de font-CSS uit
 * het kritieke renderpad. CSP-veilig: eigen origin, geen inline JavaScript.
 * Zonder JS valt de pagina terug op de <noscript>-variant van de font-link.
 */
(function () {
  function apply() {
    var links = document.querySelectorAll('link[data-async-font]');
    for (var i = 0; i < links.length; i++) links[i].media = 'all';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
