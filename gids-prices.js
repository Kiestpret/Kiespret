/* gids-prices.js — Kiespret
 * Toont een dynamische "vanaf"-prijsindicatie in de CTA-blokken van gids-pagina's.
 * - Detecteert de relevante bestemming(en) uit de land=-parameter in de CTA-links.
 * - Laadt trips.js alleen lazy in als er een bestemming op de pagina staat.
 * - Zoekt de laagste vanaf-prijs (p.p., incl. vlucht) per bestemming.
 * - Toont een klein vertrouwenssignaal-blok bij de CTA; verbergt zich bij geen match.
 *
 * Bewuste keuzes (autonome run):
 * - Lazy-load van trips.js (±320 KB) i.p.v. op elke gids-pagina, voor performance.
 * - Matching op trip.destination ("Regio, Land") via hele-woord + accent-ongevoelig,
 *   zodat zowel regio-tokens (Kos) als land-tokens (Turkije) werken.
 * - Geen prijs => blok wordt niet getoond (geen lege/0-prijzen).
 */
(function () {
  'use strict';

  function init() {
    var tokens = collectTokens();
    if (!tokens.length) return; // geen bestemmingscontext op deze pagina

    loadTrips(function (trips) {
      if (!trips || !trips.length) return;
      render(tokens, trips);
    });
  }

  // ── 1. Bestemmingen uit de CTA-links (?...&land=Kos,Kreta) ──
  function collectTokens() {
    var out = [];
    var seen = {};
    var links = document.querySelectorAll('.cta-block a[href*="land="]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      var m = /[?&]land=([^&]*)/.exec(href);
      if (!m) continue;
      var raw;
      try { raw = decodeURIComponent(m[1].replace(/\+/g, ' ')); }
      catch (e) { raw = m[1]; }
      var parts = raw.split(',');
      for (var j = 0; j < parts.length; j++) {
        var t = parts[j].trim();
        if (!t) continue;
        var key = t.toLowerCase();
        if (!seen[key]) { seen[key] = true; out.push(t); }
      }
    }
    return out;
  }

  // ── 2. trips.js lazy inladen (of hergebruiken indien al aanwezig) ──
  function loadTrips(cb) {
    if (typeof trips !== 'undefined' && trips && trips.length) {
      cb(trips);
      return;
    }
    var existing = document.querySelector('script[data-kiespret-trips]');
    if (existing) {
      existing.addEventListener('load', function () {
        cb(typeof trips !== 'undefined' ? trips : null);
      });
      return;
    }
    var s = document.createElement('script');
    s.src = '/trips.js';
    s.async = true;
    s.setAttribute('data-kiespret-trips', '1');
    s.onload = function () { cb(typeof trips !== 'undefined' ? trips : null); };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }

  // ── 3. Matching + laagste prijs ──
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function lowestFor(token, trips) {
    var nt = norm(token);
    if (!nt) return null;
    // hele-woord match binnen "regio, land" (accent-ongevoelig)
    var re = new RegExp('(^|[^a-z0-9])' + escapeRe(nt) + '([^a-z0-9]|$)');
    var min = Infinity;
    var partner = null;
    for (var i = 0; i < trips.length; i++) {
      var trip = trips[i];
      if (!re.test(norm(trip.destination))) continue;
      var vars = trip.variants || [];
      for (var v = 0; v < vars.length; v++) {
        var p = Number(vars[v].prijs);
        if (p && p < min) { min = p; partner = trip.aanbieder || trip.affiliatePartner; }
      }
    }
    if (min === Infinity) return null;
    return { label: token, price: min, partner: partner };
  }

  // ── 4. Render in elk CTA-blok ──
  function render(tokens, trips) {
    var results = [];
    for (var i = 0; i < tokens.length; i++) {
      var r = lowestFor(tokens[i], trips);
      if (r) results.push(r);
    }
    if (!results.length) return; // geen enkele match => niets tonen

    var blocks = document.querySelectorAll('.cta-block');
    if (!blocks.length) return;

    for (var b = 0; b < blocks.length; b++) {
      var block = blocks[b];
      if (block.querySelector('.gids-price')) continue; // niet dubbel
      var el = buildEl(results);
      var btn = block.querySelector('.cta-btn');
      if (btn) block.insertBefore(el, btn);
      else block.appendChild(el);
    }

    // optionele impressie-tracking (breekt niets als analytics ontbreekt)
    try {
      if (typeof window.kiespretTrack === 'function') {
        window.kiespretTrack('gids_price_view', {
          bestemming: results.map(function (r) { return r.label; }).join(',')
        });
      }
    } catch (e) { /* stil */ }
  }

  function buildEl(results) {
    var wrap = document.createElement('div');
    wrap.className = 'gids-price';

    var line = document.createElement('p');
    line.className = 'gids-price-line';

    var prefix = results.length === 1 ? 'Vakanties naar ' : '';
    var html = prefix;
    for (var i = 0; i < results.length; i++) {
      if (i > 0) html += ' <span class="gids-price-sep">·</span> ';
      html += '<strong>' + esc(results[i].label) + ' vanaf €' +
        formatPrice(roundDown(results[i].price)) + ' p.p.</strong>';
    }
    line.innerHTML = html;

    var note = document.createElement('p');
    note.className = 'gids-price-note';
    note.textContent = 'Vanaf-prijs p.p. incl. vlucht — indicatief';

    wrap.appendChild(line);
    wrap.appendChild(note);
    return wrap;
  }

  // Naar beneden afronden op €10 — getoonde "vanaf" blijft zo altijd
  // gelijk aan of lager dan de echte laagste prijs (nooit overstaten).
  function roundDown(n) {
    return Math.floor(Number(n) / 10) * 10;
  }
  function formatPrice(n) {
    return Number(n).toLocaleString('nl-NL');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
