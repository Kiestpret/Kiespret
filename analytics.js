/**
 * Kiespret Analytics — custom events voor Plausible
 *
 * Start/funnel events (11):
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
 * Gids/SEO events (4, auto-detect op /gids/ pagina's):
 * 12. gids_cta_click        — Klik op CTA-knop naar /start/
 * 13. gids_scroll_depth     — 25%, 50%, 75%, 100% scroll bereikt
 * 14. gids_internal_click   — Klik op interne "Lees ook" / sibling-link
 * 15. gids_faq_scroll       — Bezoeker bereikt FAQ-sectie
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

  // ─── Gids/SEO page tracking (auto-detect) ───
  if (window.location.pathname.indexOf('/gids/') === 0) {
    initGidsTracking();
  }

  function initGidsTracking() {
    var pagePath = window.location.pathname;

    // 12. gids_cta_click — klik op CTA-knoppen naar /start/
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href') || '';

      // CTA naar /start/
      if (href.indexOf('/start/') === 0) {
        track('gids_cta_click', { page: pagePath, href: href });
      }

      // 14. gids_internal_click — klik op interne gids-link
      if (href.indexOf('/gids/') === 0 && href !== pagePath) {
        track('gids_internal_click', { page: pagePath, target: href });
      }
    });

    // 13. gids_scroll_depth — 25/50/75/100%
    var firedDepths = {};
    var depthThresholds = [25, 50, 75, 100];

    function getScrollPercent() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 100;
      return Math.round((window.scrollY / docHeight) * 100);
    }

    function checkScrollDepth() {
      var pct = getScrollPercent();
      for (var i = 0; i < depthThresholds.length; i++) {
        var threshold = depthThresholds[i];
        if (pct >= threshold && !firedDepths[threshold]) {
          firedDepths[threshold] = true;
          track('gids_scroll_depth', { page: pagePath, depth: String(threshold) });
        }
      }
    }

    var scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
        checkScrollDepth();
      }, 250);
    }, { passive: true });

    // 15. gids_faq_scroll — bezoeker bereikt FAQ-sectie
    var faqFired = false;
    var faqObserver = null;

    function observeFaq() {
      var faqHeadings = document.querySelectorAll('h2');
      var faqEl = null;
      for (var i = 0; i < faqHeadings.length; i++) {
        if (faqHeadings[i].textContent.toLowerCase().indexOf('veelgestelde') !== -1) {
          faqEl = faqHeadings[i];
          break;
        }
      }
      if (!faqEl) return;

      faqObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !faqFired) {
          faqFired = true;
          track('gids_faq_scroll', { page: pagePath });
          faqObserver.disconnect();
        }
      }, { threshold: 0.1 });
      faqObserver.observe(faqEl);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeFaq);
    } else {
      observeFaq();
    }
  }
})();
