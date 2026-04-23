/**
 * Kiespret Cookie Consent — AVG/GDPR compliant
 *
 * Categorieën:
 * - noodzakelijk: altijd aan (cookie-voorkeur onthouden)
 * - analytisch: Plausible Analytics (cookieloos, laadt altijd — geen toestemming vereist)
 * - marketing: Meta Pixel, TikTok Pixel, etc. (standaard uit, pas laden na toestemming)
 *
 * Vereisten AVG:
 * - Accepteren en Weigeren als gelijkwaardige opties
 * - Geen pre-aangevinkte marketing-cookies
 * - Geïnformeerde toestemming (link naar privacybeleid)
 * - Toestemming intrekbaar (via "Cookie-instellingen" link in footer)
 * - Keuze wordt onthouden via functionele cookie (toegestaan zonder toestemming)
 */

(function() {
  'use strict';

  const COOKIE_NAME = 'kiespret_consent';
  const COOKIE_DAYS = 365;

  // ── Helpers ──
  function getConsent() {
    const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    if (!match) return null;
    try { return JSON.parse(decodeURIComponent(match[1])); } catch(e) { return null; }
  }

  function setConsent(prefs) {
    const val = encodeURIComponent(JSON.stringify(prefs));
    const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
    document.cookie = COOKIE_NAME + '=' + val + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  // Plausible Analytics laadt altijd — geen cookies, geen persoonsgegevens,
  // vrijgesteld onder Telecommunicatiewet art. 11.7a
  function loadPlausible() {
    if (!document.querySelector('script[src*="plausible.io"]')) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://plausible.io/js/pa-TBtTJFQwSHRK7ezq8J6-I.js';
      document.head.appendChild(s);
      window.plausible = window.plausible || function() { (plausible.q = plausible.q || []).push(arguments); };
      plausible.init = plausible.init || function(i) { plausible.o = i || {}; };
      plausible.init();
    }
  }

  function applyConsent(prefs) {
    // Marketing: hier komen straks Meta Pixel, TikTok Pixel, etc.
    if (prefs.marketing) {
      // TODO: Meta Pixel laden
      // TODO: TikTok Pixel laden
    }

    // Event dispatchen zodat andere scripts kunnen reageren
    window.dispatchEvent(new CustomEvent('kiespret:consent', { detail: prefs }));
  }

  // ── Banner HTML ──
  function createBanner() {
    const overlay = document.createElement('div');
    overlay.id = 'cookieConsent';
    overlay.innerHTML = `
      <div class="cc-overlay"></div>
      <div class="cc-dialog" role="dialog" aria-label="Cookie-instellingen" aria-modal="true">
        <div class="cc-main">
          <h2 class="cc-title">Cookie-instellingen</h2>
          <p class="cc-text">Kiespret gebruikt anonieme statistieken (Plausible, zonder cookies) om de website te verbeteren. Met jouw toestemming plaatsen wij daarnaast marketing cookies voor relevante advertenties.</p>
          <p class="cc-text cc-small">Lees meer in ons <a href="/privacybeleid/" class="cc-link">privacybeleid</a>.</p>

          <div class="cc-categories">
            <label class="cc-cat">
              <span class="cc-cat-info">
                <span class="cc-cat-name">Noodzakelijk</span>
                <span class="cc-cat-desc">Voor het onthouden van je cookievoorkeuren. Altijd actief.</span>
              </span>
              <input type="checkbox" checked disabled>
              <span class="cc-toggle cc-toggle-locked"></span>
            </label>

            <label class="cc-cat">
              <span class="cc-cat-info">
                <span class="cc-cat-name">Marketing</span>
                <span class="cc-cat-desc">Voor het tonen van relevante advertenties op social media (Meta, TikTok). Momenteel niet actief.</span>
              </span>
              <input type="checkbox" id="ccMarketing">
              <span class="cc-toggle"></span>
            </label>
          </div>

          <div class="cc-buttons">
            <button class="cc-btn cc-btn-accept" id="ccAcceptAll">Alles accepteren</button>
            <button class="cc-btn cc-btn-reject" id="ccRejectAll">Alleen noodzakelijk</button>
            <button class="cc-btn cc-btn-save" id="ccSavePrefs">Selectie opslaan</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('ccAcceptAll').addEventListener('click', function() {
      var prefs = { noodzakelijk: true, marketing: true };
      setConsent(prefs);
      applyConsent(prefs);
      closeBanner();
    });

    document.getElementById('ccRejectAll').addEventListener('click', function() {
      var prefs = { noodzakelijk: true, marketing: false };
      setConsent(prefs);
      applyConsent(prefs);
      closeBanner();
    });

    document.getElementById('ccSavePrefs').addEventListener('click', function() {
      var prefs = {
        noodzakelijk: true,
        marketing: document.getElementById('ccMarketing').checked
      };
      setConsent(prefs);
      applyConsent(prefs);
      closeBanner();
    });
  }

  function closeBanner() {
    var el = document.getElementById('cookieConsent');
    if (el) el.remove();
  }

  // ── Open instellingen (voor footer-link) ──
  window.openCookieSettings = function() {
    var existing = document.getElementById('cookieConsent');
    if (existing) existing.remove();
    createBanner();
    // Vul huidige voorkeuren in
    var prefs = getConsent();
    if (prefs) {
      document.getElementById('ccMarketing').checked = prefs.marketing || false;
    }
  };

  // ── Styles ──
  var style = document.createElement('style');
  style.textContent = `
    .cc-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 99998;
    }
    .cc-dialog {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 99999;
      display: flex;
      justify-content: center;
      padding: 16px;
    }
    .cc-main {
      background: #fff;
      border-radius: 16px;
      padding: 28px 24px 24px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      font-family: 'DM Sans', sans-serif;
    }
    .cc-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1A1A1A;
    }
    .cc-text {
      font-size: 14px;
      line-height: 1.6;
      color: #666;
      margin-bottom: 8px;
    }
    .cc-small { font-size: 13px; margin-bottom: 20px; }
    .cc-link {
      color: #2A7F9E;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .cc-categories {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    .cc-cat {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      background: #FAFAF8;
      border: 1px solid #E8E8E4;
      border-radius: 10px;
      cursor: pointer;
    }
    .cc-cat input { display: none; }
    .cc-cat-info { flex: 1; }
    .cc-cat-name {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #1A1A1A;
      margin-bottom: 2px;
    }
    .cc-cat-desc {
      display: block;
      font-size: 12px;
      color: #999;
      line-height: 1.4;
    }
    .cc-toggle {
      width: 44px; height: 24px;
      background: #ccc;
      border-radius: 12px;
      position: relative;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .cc-toggle::after {
      content: '';
      position: absolute;
      top: 3px; left: 3px;
      width: 18px; height: 18px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    .cc-cat input:checked + .cc-toggle {
      background: #E07830;
    }
    .cc-cat input:checked + .cc-toggle::after {
      transform: translateX(20px);
    }
    .cc-toggle-locked {
      background: #2A7F9E !important;
      opacity: 0.7;
      cursor: not-allowed;
    }
    .cc-toggle-locked::after {
      transform: translateX(20px);
    }
    .cc-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cc-btn {
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }
    .cc-btn:hover { opacity: 0.88; }
    .cc-btn-accept {
      background: #E07830;
      color: #fff;
    }
    .cc-btn-reject {
      background: #F5F5F2;
      color: #1A1A1A;
      border: 1px solid #E8E8E4;
    }
    .cc-btn-save {
      background: none;
      color: #666;
      font-weight: 500;
      padding: 8px 20px;
    }
    @media (min-width: 480px) {
      .cc-buttons {
        flex-direction: row;
        flex-wrap: wrap;
      }
      .cc-btn-accept, .cc-btn-reject { flex: 1; }
      .cc-btn-save { width: 100%; }
    }
  `;
  document.head.appendChild(style);

  // ── Init ──
  // Plausible laadt altijd (cookieloos, geen toestemming vereist)
  loadPlausible();

  var consent = getConsent();
  if (consent) {
    // Eerder toestemming gegeven → marketing consent toepassen
    applyConsent(consent);
  } else {
    // Geen toestemming → banner tonen
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
})();
