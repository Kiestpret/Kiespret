    // ── HTML ESCAPE (XSS-defense voor innerHTML templates) ─────────────────
    const _escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    function escapeHtml(val) {
      if (val === null || val === undefined) return '';
      return String(val).replace(/[&<>"']/g, ch => _escapeMap[ch]);
    }
    // Alleen http(s) URL's toelaten in img src / window.open
    function safeUrl(val) {
      if (typeof val !== 'string') return '';
      const trimmed = val.trim();
      if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed;
      return '';
    }

    // ── STATE ──────────────────────────────────────────────────────────────
    const prefs = {
      sfeer: [],
      budgetMax: null,
      maanden: [],
      duur: null,      // 0 = maakt niet uit
      airport: 'AMS',
      focusLands: [],   // vanuit gids-pagina: prioriteer deze landen/regio's (kan meerdere zijn bij vergelijkingen)
    };

    let currentTrips = [];
    let currentIndex = 0;
    let liked = [];
    let likedTags = {};    // positieve tag-scoring (ja's)
    let dislikedTags = {}; // negatieve tag-scoring (nee's)
    let undoState = null;  // snapshot voor undo
    let undoTimer = null;  // auto-hide timer

    const MAX_DECK = 10;  // bouwplan: 8–10 kaarten

    // ── PROGRESS ───────────────────────────────────────────────────────────
    function setProgress(pct, step, total) {
      document.getElementById('progressFill').style.width = pct + '%';
      document.getElementById('navStep').textContent = total
        ? `Stap ${step} van ${total}` : step;
    }

    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      window.scrollTo(0, 0);
    }

    // ── STAP 1: SFEER ──────────────────────────────────────────────────────
    function selectSfeer(el) {
      document.querySelectorAll('.sfeer-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      prefs.sfeer = el.dataset.sfeer.split(',');
      document.getElementById('btnSfeer').disabled = false;
    }

    function goToStap2() { setProgress(33, 2, 3); showScreen('screen-budget'); }

    // ── STAP 2: BUDGET (4 ranges conform bouwplan) ─────────────────────────
    function selectBudget(el) {
      document.querySelectorAll('#screen-budget .option-btn').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      prefs.budgetMax = parseInt(el.dataset.budget);
      document.getElementById('btnBudget').disabled = false;
    }

    function goToStap3() { setProgress(66, 3, 3); showScreen('screen-periode'); }

    // ── STAP 3: PERIODE (jun–okt) ──────────────────────────────────────────
    function toggleMaand(el) {
      el.classList.toggle('selected');
      prefs.maanden = Array.from(document.querySelectorAll('.period-btn.selected'))
        .map(b => b.dataset.maand);
      document.getElementById('btnPeriode').disabled = prefs.maanden.length === 0;
    }

    // ── MATCHING (intern 6-8 nachten, sfeer als ranking) ──────────────────
    function matchVariantCustom(trip, prefs) {
      return trip.variants.find(v =>
        prefs.maanden.includes(v.maand) &&
        v.duur >= 6 && v.duur <= 8 &&
        v.airport === prefs.airport &&
        v.prijs <= prefs.budgetMax
      ) || null;
    }

    function filterTripsCustom(prefs) {
      const sorted = trips
        .map(trip => {
          const variant = matchVariantCustom(trip, prefs);
          if (!variant) return null;
          // Sfeer als ranking: match geeft hogere score, maar geen uitsluiting
          let tagScore = trip.sfeer.filter(s => prefs.sfeer.includes(s)).length;
          // Focus-boost: trips uit het land/regio van de gids-pagina krijgen prioriteit
          if (prefs.focusLands.length > 0) {
            const dest = (trip.destination || '').toLowerCase();
            if (prefs.focusLands.some(l => dest.includes(l.toLowerCase()))) tagScore += 5;
          }
          return { ...trip, matchedVariant: variant, tagScore };
        })
        .filter(Boolean)
        .sort((a, b) => b.tagScore - a.tagScore);

      // Bestemmingsdiversiteit: max 2 trips per land (of 4 als het het focus-land is)
      const countPerCountry = {};
      return sorted.filter(t => {
        const parts = (t.destination || '').split(',');
        const c = (parts[parts.length - 1] || 'unknown').trim();
        const isFocus = prefs.focusLands.length > 0 && prefs.focusLands.some(l => c.toLowerCase().includes(l.toLowerCase()));
        const maxForCountry = isFocus ? 4 : 2;
        countPerCountry[c] = (countPerCountry[c] || 0) + 1;
        return countPerCountry[c] <= maxForCountry;
      });
    }

    // ── START SWIPEN ───────────────────────────────────────────────────────
    function startSwipen() {
      // Event: onboarding_complete
      kiespretTrack('onboarding_complete');

      const origBudget = prefs.budgetMax;

      currentTrips = filterTripsCustom(prefs);
      currentIndex = 0;
      liked = [];
      likedTags = {};
      dislikedTags = {};

      // Fallback: budget loslaten als te weinig resultaten
      if (currentTrips.length < 3) {
        prefs.budgetMax = 9999;
        currentTrips = filterTripsCustom(prefs);
      }
      // Laatste redmiddel: ook duur-filter loslaten (met diversiteit)
      if (currentTrips.length < 3) {
        const all = trips
          .map(trip => {
            const variant = trip.variants.find(v =>
              prefs.maanden.includes(v.maand) && v.airport === prefs.airport
            );
            if (!variant) return null;
            return { ...trip, matchedVariant: variant, tagScore: 0 };
          })
          .filter(Boolean)
          .sort(() => Math.random() - 0.5);
        const cpc = {};
        currentTrips = all.filter(t => {
          const parts = (t.destination || '').split(',');
          const c = (parts[parts.length - 1] || 'unknown').trim();
          cpc[c] = (cpc[c] || 0) + 1;
          return cpc[c] <= 2;
        });
      }

      // Herstel originele prefs voor eventuele restart
      prefs.budgetMax = origBudget;

      // Bouwplan: max 8–10 kaarten
      if (currentTrips.length > MAX_DECK) {
        currentTrips = currentTrips.slice(0, MAX_DECK);
      }

      if (currentTrips.length === 0) {
        // Echt geen resultaten — toon nette melding
        showNoResults();
        return;
      }

      setProgress(100, 'Swipen', null);
      document.getElementById('navStep').textContent = '';
      showScreen('screen-swipe');
      renderCards();
    }

    function showNoResults() {
      setProgress(100, 'Helaas', null);
      showScreen('screen-results');
      const list = document.getElementById('resultsList');
      const adviceBox = document.getElementById('adviceBox');
      list.innerHTML = '';
      adviceBox.innerHTML = '';
      list.innerHTML = `
        <div style="text-align:center;padding:48px 24px">
          <div style="font-size:40px;margin-bottom:12px">🤷</div>
          <h3 style="margin-bottom:8px;font-family:'Plus Jakarta Sans',sans-serif">Geen vakanties gevonden</h3>
          <p style="color:var(--stone);margin-bottom:24px">We konden geen vakanties vinden die bij jullie voorkeuren passen. Probeer een andere maand of reisduur.</p>
          <button class="cta-btn" data-action="restart" style="max-width:300px;margin:0 auto">Opnieuw beginnen</button>
        </div>`;
    }

    // ── KAARTEN RENDEREN ───────────────────────────────────────────────────
    function renderCards() {
      const stack = document.getElementById('cardStack');
      stack.innerHTML = '';

      if (currentIndex >= currentTrips.length) {
        if (isDuoPartnerB) {
          // Partner B klaar → stuur likes naar server, bereken overlap
          completeDuoSession();
        } else if (liked.length > 0) {
          // Solo of Partner A klaar → toon keuze
          showPostSwipeChoice();
        } else {
          showResults();
        }
        return;
      }

      updateCounter();

      for (let i = Math.min(currentIndex + 1, currentTrips.length - 1); i >= currentIndex; i--) {
        const trip = currentTrips[i];
        const card = buildCard(trip, i === currentIndex);
        card.classList.add(i === currentIndex ? 'front-card' : 'back-card');
        stack.appendChild(card);
      }

      initDrag(stack.querySelector('.front-card'));

      // Preload afbeeldingen van de volgende 2 kaarten
      preloadNextImages(currentIndex + 2, 2);
    }

    function preloadNextImages(startIdx, count) {
      for (var i = startIdx; i < startIdx + count && i < currentTrips.length; i++) {
        var url = currentTrips[i].imageUrl;
        if (url && !preloadNextImages._cache[url]) {
          var img = new Image();
          img.src = url;
          preloadNextImages._cache[url] = true;
        }
      }
    }
    preloadNextImages._cache = {};

    // Sfeer label map for match tags
    const sfeerLabelMap = { strand: 'strand', rustig: 'rust', zon: 'zon', actief: 'actief', natuur: 'natuur', avontuur: 'avontuur', resort: 'resort', comfort: 'comfort', allinclusive: 'all-inclusive', romantisch: 'romantisch', luxe: 'luxe', wellness: 'wellness', pool: 'pool', 'adults-only': 'adults only' };

    // Helper: extract rating from highlights or trip.rating
    function extractRating(trip) {
      if (trip.rating) return String(trip.rating).replace('.', ',');
      for (const h of (trip.highlights || [])) {
        const m = h.match(/Gastwaardering[:\s]*(\d[\d,\.]*)/i);
        if (m) return m[1].replace('.', ',');
      }
      return '';
    }

    // Helper: extract star level from highlights
    function extractStars(trip) {
      for (const h of (trip.highlights || [])) {
        const m = h.match(/(\d)-sterren/i);
        if (m) return m[1];
      }
      return '';
    }

    // Helper: short month label
    function shortMaand(m) {
      const map = { januari:'jan', februari:'feb', maart:'mrt', april:'apr', mei:'mei', juni:'jun', juli:'jul', augustus:'aug', september:'sep', oktober:'okt', november:'nov', december:'dec' };
      return map[(m || '').toLowerCase()] || m;
    }

    function buildCard(trip, isFront) {
      const v = trip.matchedVariant;
      const card = document.createElement('div');
      card.className = 'trip-card';
      card.dataset.id = trip.id;

      // Destination: bekende bestemmingen tonen als regio, onbekende met land erbij
      const destParts = (trip.destination || '').split(',');
      const destRegion = destParts[0].trim();
      const destCountry = (destParts[1] || '').trim();
      const wellKnown = ['Kreta','Zakynthos','Rhodos','Kos','Corfu','Mallorca','Ibiza','Menorca','Tenerife','Gran Canaria','Fuerteventura','Lanzarote','Sicilië','Sardinië','Madeira','Dubai','Hurghada','Marmaris','Bodrum','Antalya','Istanbul','Marrakech','Lissabon','Porto'];
      const destCity = wellKnown.includes(destRegion) ? destRegion : `${destRegion}, ${destCountry}`;

      // Laag 1: bestemmingsbeschrijving (foto-overlay) — eerste zin
      const fullDesc = trip.whyThisTrip || '';
      const firstDot = fullDesc.indexOf('.');
      const destDesc = firstDot > 0 && firstDot < 120 ? fullDesc.substring(0, firstDot + 1) : fullDesc.substring(0, 80);
      // Laag 2: trip-specifieke beschrijving (body)
      const tripSpecific = trip.tripDesc || '';

      // Adults only badge on photo
      const aoBadge = trip.adultsOnly
        ? `<span class="card-ao-badge">Adults only</span>` : '';

      // Beste match label on first card
      const bestMatchLabel = (isFront && currentIndex === 0)
        ? `<div class="best-match-label">Onze eerste tip</div>` : '';

      // Compact info: duration, month, flight time
      const duur = Number(v.duur) || 0;
      const maand = shortMaand(v.maand);
      const vlucht = escapeHtml(trip.vluchtduur);
      const compactInfo = `${duur} nch · ${escapeHtml(maand)} · ✈ ${vlucht}`;

      // Badges (max 3): rating, boardType, stars
      const badges = [];
      const rating = extractRating(trip);
      if (rating) badges.push(`<span class="tag">⭐ ${escapeHtml(rating)}</span>`);
      if (trip.boardType) badges.push(`<span class="tag">${escapeHtml(trip.boardType)}</span>`);
      const stars = extractStars(trip);
      if (stars) badges.push(`<span class="tag">${escapeHtml(stars)}-sterren</span>`);
      const badgesHtml = badges.slice(0, 3).join('');

      // Match tags: intersection of user sfeer and trip sfeer
      const matchingTags = (trip.sfeer || [])
        .filter(s => prefs.sfeer.includes(s))
        .map(s => sfeerLabelMap[s] || s)
        .filter((v, i, a) => a.indexOf(v) === i);
      const matchTagsHtml = matchingTags.length >= 2
        ? `<div class="card-match-tags">Past bij jullie: ${escapeHtml(matchingTags.join(', '))}</div>`
        : '';

      // Footer: hotel name + aanbieder
      const hotelName = trip.hotelName || trip.title || '';
      const aanbiederSafe = escapeHtml(trip.aanbieder);
      const destSafe = escapeHtml(trip.destination);

      // Trip-specifieke beschrijving als die er is
      // tripDesc niet meer apart tonen — info zit al in badges + match-tags

      card.innerHTML = `
        <div class="card-overlay overlay-yes">JA!</div>
        <div class="card-overlay overlay-no">NEE</div>
        <div class="card-img-wrap">
          ${bestMatchLabel}
          <img class="card-img" src="${escapeHtml(safeUrl(trip.imageUrl))}" alt="${destSafe}" draggable="false">
          <div class="card-dest-overlay">
            <h3>${escapeHtml(destCity)}</h3>
          </div>
          ${aoBadge}
        </div>
        <div class="card-body">
          <div class="card-dest-desc">${escapeHtml(destDesc)}</div>
          <div class="card-price-row">
            <div class="card-price">€${Number(v.prijs) || 0} <span>p.p.</span></div>
            <div class="card-compact-info">${compactInfo}</div>
          </div>
          <div class="card-highlights">${badgesHtml}</div>
          ${matchTagsHtml}
          <div class="card-footer">
            <span class="card-footer-hotel">${escapeHtml(hotelName)} · via ${aanbiederSafe}</span>
            <span class="card-footer-trust">Geen extra kosten</span>
          </div>
        </div>
      `;
      return card;
    }

    function updateCounter() {
      const remaining = currentTrips.length - currentIndex;
      document.getElementById('swipeCounter').textContent =
        `${currentIndex + 1} van ${currentTrips.length}`;
    }

    // ── DRAG / SWIPE ───────────────────────────────────────────────────────
    function initDrag(card) {
      if (!card) return;
      let startX = 0, startY = 0, dx = 0;
      let dragging = false;
      let velocityX = 0, lastMoveX = 0, lastMoveTime = 0;
      const overlayYes = card.querySelector('.overlay-yes');
      const overlayNo  = card.querySelector('.overlay-no');

      function onStart(e) {
        dragging = true;
        const pt = e.touches ? e.touches[0] : e;
        startX = pt.clientX;
        startY = pt.clientY;
        lastMoveX = pt.clientX;
        lastMoveTime = Date.now();
        velocityX = 0;
        card.classList.add('dragging');
      }

      var intentLocked = false; // false = not yet decided, 'h' = horizontal, 'v' = vertical

      function onMove(e) {
        if (!dragging) return;
        const pt = e.touches ? e.touches[0] : e;
        dx = pt.clientX - startX;
        const dy = pt.clientY - startY;

        // Lock-in swipe-richting na 8px beweging
        if (!intentLocked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
          intentLocked = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
        }
        // Verticale intentie: laat browser scrollen, doe niets
        if (intentLocked === 'v') return;
        // Horizontale intentie: blokkeer scroll, beweeg kaart
        if (e.cancelable) e.preventDefault();

        // Velocity tracking (~100ms window)
        var now = Date.now();
        var dtMs = now - lastMoveTime;
        if (dtMs > 16) {
          velocityX = (pt.clientX - lastMoveX) / dtMs; // px/ms
          lastMoveX = pt.clientX;
          lastMoveTime = now;
        }

        const rot = dx * 0.06;
        card.style.transform = `translate(${dx}px, ${dy * 0.3}px) rotate(${rot}deg)`;
        const overlayThreshold = 80;
        const ratio = Math.min(Math.abs(dx) / overlayThreshold, 1);
        if (dx > 0) { overlayYes.style.opacity = ratio; overlayNo.style.opacity = 0; }
        else { overlayNo.style.opacity = ratio; overlayYes.style.opacity = 0; }
      }

      function onEnd() {
        if (!dragging) return;
        dragging = false;
        intentLocked = false;
        card.classList.remove('dragging');
        const threshold = 80;
        // Velocity flick: hoge snelheid (>0.6 px/ms) + minimaal 30px drag
        var isFlick = Math.abs(velocityX) > 0.6 && Math.abs(dx) > 30;
        if (dx > threshold || (isFlick && dx > 30)) resolveSwipe('right');
        else if (dx < -threshold || (isFlick && dx < -30)) resolveSwipe('left');
        else { card.style.transform = ''; overlayYes.style.opacity = 0; overlayNo.style.opacity = 0; }
      }

      // Opruimen: verwijder vorige window-listeners
      if (initDrag._cleanup) initDrag._cleanup();

      function cleanup() {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchend', onEnd);
      }
      initDrag._cleanup = cleanup;

      card.addEventListener('mousedown', onStart);
      card.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }

    // ── KEYBOARD SUPPORT (pijltjestoetsen) ──────────────────────────────
    document.addEventListener('keydown', function(e) {
      // Alleen actief tijdens swipe-fase
      var swipeScreen = document.getElementById('screen-swipe');
      if (!swipeScreen || !swipeScreen.classList.contains('active')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); swipeCard('right'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); swipeCard('left'); }
    });

    function swipeCard(dir) {
      const front = document.querySelector('.front-card');
      if (!front) return;
      resolveSwipe(dir, front);
    }

    function resolveSwipe(dir, card) {
      const front = card || document.querySelector('.front-card');
      if (!front) return;

      // Snapshot voor undo (vóór state-wijziging)
      undoState = {
        dir: dir,
        index: currentIndex,
        liked: [...liked],
        likedTags: Object.assign({}, likedTags),
        dislikedTags: Object.assign({}, dislikedTags),
        deck: [...currentTrips]
      };

      if (dir === 'right') {
        front.classList.add('fly-right');
        const trip = currentTrips[currentIndex];

        // Event: swipe_right
        kiespretTrack('swipe_right', { trip: trip.id, destination: trip.title });
        kiespretClusterTrack('liked', trip.destination);

        liked.push(trip);
        saveShortlist();

        // Bouwplan: tag-scoring — track tags van gelikte trips
        trip.tags.forEach(tag => { likedTags[tag] = (likedTags[tag] || 0) + 1; });

        // Herorden na 3 likes (bouwplan) en daarna na elke like
        if (liked.length >= 3) {
          reorderRemainingDeck();
        }
      } else {
        front.classList.add('fly-left');
        var skipTrip = currentTrips[currentIndex];

        // Nee-learning: track tags van afgewezen trips
        skipTrip.tags.forEach(tag => { dislikedTags[tag] = (dislikedTags[tag] || 0) + 1; });

        // Herorden deck als er al likes zijn (nee's beïnvloeden volgorde)
        if (liked.length >= 2) {
          reorderRemainingDeck();
        }

        // Event: swipe_left
        kiespretTrack('swipe_left', { trip: skipTrip.id, destination: skipTrip.title });
        kiespretClusterTrack('skipped', skipTrip.destination);
      }

      currentIndex++;
      setTimeout(() => renderCards(), 420);
      showUndoButton();
    }

    // ── UNDO ───────────────────────────────────────────────────────────────
    function showUndoButton() {
      const btn = document.getElementById('undoBtn');
      if (!btn) return;
      btn.classList.remove('fading');
      btn.classList.add('visible');
      if (undoTimer) clearTimeout(undoTimer);
      undoTimer = setTimeout(function() {
        btn.classList.add('fading');
        setTimeout(function() {
          btn.classList.remove('visible', 'fading');
          undoState = null;
        }, 300);
      }, 4000);
    }

    function undoLastSwipe() {
      if (!undoState) return;
      var snap = undoState;
      undoState = null;

      // Herstel state
      currentIndex = snap.index;
      liked = snap.liked;
      likedTags = snap.likedTags;
      dislikedTags = snap.dislikedTags;
      currentTrips = snap.deck;
      saveShortlist();

      // Verberg undo-knop
      if (undoTimer) clearTimeout(undoTimer);
      var btn = document.getElementById('undoBtn');
      if (btn) btn.classList.remove('visible', 'fading');

      // Herrender kaarten
      renderCards();

      // Track event
      kiespretTrack('swipe_undo', { dir: snap.dir, trip: currentTrips[snap.index].id });
    }

    // ── SMART SCORING: herorden deck op basis van ja's EN nee's ─────────
    function reorderRemainingDeck() {
      const remaining = currentTrips.slice(currentIndex + 1);
      remaining.sort((a, b) => scoreTripSmart(b) - scoreTripSmart(a));
      currentTrips = [
        ...currentTrips.slice(0, currentIndex + 1),
        ...remaining
      ];
    }

    function scoreTripSmart(trip) {
      var score = 0;
      // Positief: tags die matchen met gelikete trips (zwaar gewicht)
      trip.tags.forEach(function(tag) { score += (likedTags[tag] || 0) * 2; });
      // Negatief: tags die matchen met afgewezen trips
      trip.tags.forEach(function(tag) { score -= (dislikedTags[tag] || 0); });
      // Bonus: zelfde land/regio als gelikete trips
      if (liked.length > 0) {
        var likedRegions = liked.map(function(t) { return (t.destination.split(',')[1] || '').trim(); }).filter(Boolean);
        var tripRegion = (trip.destination.split(',')[1] || '').trim();
        if (tripRegion && likedRegions.indexOf(tripRegion) !== -1) score += 1;
      }
      // Penalty: zelfde land als meerdere afgewezen trips
      var dislikedCount = currentTrips.slice(0, currentIndex).filter(function(t) {
        return !liked.includes(t) && (t.destination.split(',')[1] || '').trim() === ((trip.destination.split(',')[1] || '').trim());
      }).length;
      if (dislikedCount >= 2) score -= 2;
      // Prijs-voorkeur: lichte bonus voor trips duidelijk onder budget (max +2).
      // Doel: outbound-conversie omhoog zonder dat goedkope altijd wint.
      if (prefs.budgetMax && prefs.budgetMax < 9999 && trip.matchedVariant) {
        var prijsRatio = trip.matchedVariant.prijs / prefs.budgetMax;
        if (prijsRatio <= 0.75) score += 1;
        if (prijsRatio <= 0.60) score += 1;
      }
      return score;
    }

    // ── RESULTATEN + VERGELIJKINGSLAAG + REDACTIONEEL ADVIES ───────────────
    function showResults() {
      setProgress(100, 'Jullie top 3', null);
      showScreen('screen-results');

      // Event: shortlist_view
      kiespretTrack('shortlist_view', { count: String(Math.min(liked.length, 3)) });
      // Event: comparison_open (top 3 vergelijking wordt direct getoond)
      kiespretTrack('comparison_open');

      const list = document.getElementById('resultsList');
      const adviceBox = document.getElementById('adviceBox');
      list.innerHTML = '';
      adviceBox.innerHTML = '';

      // Sorteer likes op tag-score (hoogste eerst) en pak top 3
      // Top 3 op basis van scoreTripSmart (gebruikt likedTags/dislikedTags/regio/prijs),
      // niet alleen de onboarding-tagScore. Persoonlijker resultaat dat ook spontane
      // swipe-keuzes meeneemt.
      const sortedLikes = [...liked].sort((a, b) => scoreTripSmart(b) - scoreTripSmart(a));
      const top3 = sortedLikes.slice(0, 3);

      if (top3.length === 0) {
        list.innerHTML = `
          <div style="text-align:center;padding:48px 24px">
            <div style="font-size:40px;margin-bottom:12px">🤔</div>
            <h3 style="margin-bottom:8px;font-family:'Plus Jakarta Sans',sans-serif">Geen favorieten</h3>
            <p style="color:var(--stone);margin-bottom:24px">Je hebt alle kaarten overgeslagen. Probeer het opnieuw met ruimere voorkeuren.</p>
            <button class="cta-btn" data-action="restart" style="max-width:300px;margin:0 auto">Opnieuw beginnen</button>
          </div>`;
        return;
      }

      // Uitleg selectie-logica (selectionNote bevat alleen een cijfer, maar we escapen defensief)
      const totalLiked = liked.length;
      const selectionNote = totalLiked > 3
        ? `Je hebt ${Number(totalLiked)} vakanties bewaard. Dit zijn de 3 die het beste passen bij je swipegedrag — op basis van sfeer, bestemming en wat je wel en niet leuk vond.`
        : `Op basis van jullie voorkeuren en swipegedrag — gesorteerd op beste match.`;
      adviceBox.innerHTML = `
        <div class="selection-note">${selectionNote}</div>`;

      // Bouwplan: redactioneel advies boven vergelijking
      if (top3.length >= 2) {
        const advice = generateAdvice(top3);
        adviceBox.innerHTML += `
          <div class="advice-box">
            <div class="advice-label">Ons advies</div>
            ${advice}
          </div>`;
      }

      const medals = ['🥇', '🥈', '🥉'];
      const rankLabels = ['Beste match', 'Goede optie', 'Ook een aanrader'];
      const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

      // Bouwplan: voeg sfeer-label toe per trip
      const sfeerLabels = {
        'strand': 'Strand & zon', 'rustig': 'Strand & zon', 'zon': 'Strand & zon',
        'actief': 'Actief & verkennen', 'natuur': 'Actief & verkennen', 'avontuur': 'Actief & verkennen',
        'resort': 'Resort & comfort', 'comfort': 'Resort & comfort', 'allinclusive': 'Resort & comfort'
      };

      // Toon microvraag als er favorieten zijn
      document.getElementById('confidenceBlock').style.display = top3.length > 0 ? '' : 'none';
      document.querySelector('.confidence-btns').style.display = top3.length > 0 ? 'flex' : 'none';
      document.getElementById('confidenceThanks').style.display = 'none';

      // Genereer deellink (alleen als er favorieten zijn)
      if (top3.length > 0) {
        const shareUrl = generateShareUrl();
        document.getElementById('shareUrl').value = shareUrl;
        document.getElementById('shareBlock').style.display = '';
      } else {
        document.getElementById('shareBlock').style.display = 'none';
      }

      top3.forEach((trip, i) => {
        const v = trip.matchedVariant;
        const sfeerLabel = sfeerLabels[trip.sfeer[0]] || trip.sfeer[0];
        const aanbiederSafe = escapeHtml(trip.aanbieder);
        const destSafe = escapeHtml(trip.destination);
        const hotelName = escapeHtml(trip.hotelName || trip.title || '');
        const whyText = escapeHtml(trip.whyThisTrip || '');
        const ratingVal = extractRating(trip);
        const starsVal = extractStars(trip);
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
          <div class="result-rank-banner ${rankClasses[i]}">
            ${medals[i]} ${rankLabels[i]}
          </div>
          <img class="result-img" src="${escapeHtml(safeUrl(trip.imageUrl))}" alt="${destSafe}">
          <div class="result-body">
            <div class="result-title">${hotelName}</div>
            <div class="result-dest">📍 ${destSafe}</div>
            ${whyText ? `<p style="font-size:13px;color:var(--stone);margin-bottom:10px;line-height:1.5">${whyText}</p>` : ''}
            <div class="result-dims">
              <span class="dim-label">Sfeer</span><span class="dim-value">${escapeHtml(sfeerLabel)}</span>
              <span class="dim-label">Prijs</span><span class="dim-value">€${Number(v.prijs) || 0} p.p. · ${escapeHtml(v.maand)} · ${Number(v.duur) || 0} nachten</span>
              <span class="dim-label">Vluchtduur</span><span class="dim-value">${escapeHtml(trip.vluchtduur)} vanaf Schiphol</span>
              <span class="dim-label">Boardtype</span><span class="dim-value">${escapeHtml(trip.boardType)}${starsVal ? ' · ' + escapeHtml(starsVal) + '-sterren' : ''}${ratingVal ? ' · ⭐ ' + escapeHtml(ratingVal) : ''}</span>
              <span class="dim-label">Aanbieder</span><span class="dim-value">${aanbiederSafe}</span>
            </div>
            <div class="result-row">
              <div class="result-price">€${Number(v.prijs) || 0}<small> p.p.</small></div>
              <button class="book-btn" data-book-btn>
                Bekijk bij ${aanbiederSafe} →
              </button>
            </div>
          </div>`;
        // Wire click handler via JS (geen inline onclick → geen string-injection risk)
        const bookBtn = card.querySelector('[data-book-btn]');
        if (bookBtn) {
          const vIdx = trip.variants.indexOf(v);
          bookBtn.addEventListener('click', () => openOutbound(trip.aanbieder, trip.id, vIdx >= 0 ? vIdx : 0));
        }
        list.appendChild(card);
      });
    }

    // Bouwplan: redactioneel advies genereren
    function generateAdvice(top3) {
      const cheapest = top3.reduce((a, b) =>
        a.matchedVariant.prijs < b.matchedVariant.prijs ? a : b);
      const bestMatch = top3.reduce((a, b) =>
        (a.tagScore || 0) > (b.tagScore || 0) ? a : b);

      // Use hotelName and destination for specificity
      function tripLabel(trip) {
        const hotel = trip.hotelName || trip.title || '';
        const dest = (trip.destination || '').split(',')[0].trim();
        return hotel + (dest ? ' in ' + dest : '');
      }

      const bestRating = extractRating(bestMatch);
      const ratingNote = bestRating ? ' en gastwaardering ' + bestRating : '';

      if (cheapest.id !== bestMatch.id) {
        return `Als prijs belangrijker is: <strong>${escapeHtml(tripLabel(cheapest))}</strong> (€${Number(cheapest.matchedVariant.prijs) || 0} p.p.). Voor de beste sfeer-match: <strong>${escapeHtml(tripLabel(bestMatch))}</strong>${escapeHtml(ratingNote)}.`;
      }
      return `<strong>${escapeHtml(tripLabel(bestMatch))}</strong> heeft de beste combinatie van prijs (€${Number(bestMatch.matchedVariant.prijs) || 0})${escapeHtml(ratingNote)} — de sterkste keuze.`;
    }

    // ── OUTBOUND MODAL (bouwplan: tussenstap voor affiliate klik) ──────────
    function openOutbound(aanbieder, tripId, variantIdx) {
      const modal = document.getElementById('outboundModal');
      const safeAanbieder = escapeHtml(aanbieder);
      // Bouw redirect-URL via /api/go — affiliate-URLs staan niet meer in trips.js
      const goUrl = '/api/go?id=' + encodeURIComponent(tripId) + '&v=' + encodeURIComponent(variantIdx);
      document.getElementById('modalTitle').textContent = 'Jullie topkeuze staat klaar';
      document.getElementById('modalBody').innerHTML =
        `Je boekt zo direct bij <strong>${safeAanbieder}</strong> — op hun website zie je de actuele prijs en beschikbaarheid. Geen extra kosten via Kiespret.`;
      const goBtn = document.getElementById('modalGo');
      goBtn.textContent = `Ga naar ${aanbieder} →`;
      goBtn.onclick = () => {
        // Event: outbound_click
        kiespretTrack('outbound_click', { provider: aanbieder, trip: tripId });
        var clickedTrip = currentTrips.find(t => t.id === tripId) || liked.find(t => t.id === tripId);
        if (clickedTrip) kiespretClusterTrack('booked', clickedTrip.destination);
        window.open(goUrl, '_blank', 'noopener');
        closeModal();
      };
      modal.classList.add('active');
    }

    function closeModal() {
      document.getElementById('outboundModal').classList.remove('active');
    }

    // ── LOCALSTORAGE: shortlist opslaan/laden ──────────────────────────
    function saveShortlist() {
      try {
        const ids = liked.map(t => t.id);
        localStorage.setItem('kiespret_shortlist', JSON.stringify(ids));
        localStorage.setItem('kiespret_prefs', JSON.stringify(prefs));
      } catch(e) { /* localStorage niet beschikbaar */ }
    }

    function loadShortlist() {
      try {
        const ids = JSON.parse(localStorage.getItem('kiespret_shortlist'));
        const savedPrefs = JSON.parse(localStorage.getItem('kiespret_prefs'));
        if (!ids || !Array.isArray(ids) || ids.length === 0) return false;

        // Herstel prefs
        if (savedPrefs) {
          prefs.sfeer = savedPrefs.sfeer || [];
          prefs.budgetMax = savedPrefs.budgetMax || 9999;
          prefs.maanden = savedPrefs.maanden || [];
          prefs.duur = savedPrefs.duur !== undefined ? savedPrefs.duur : 0;
          prefs.airport = savedPrefs.airport || 'AMS';
        }

        // Herstel gelikte trips
        liked = ids.map(id => {
          const trip = trips.find(t => t.id === id);
          if (trip && !trip.matchedVariant) {
            // Probeer variant te matchen met opgeslagen prefs
            trip.matchedVariant = matchVariantCustom(trip, prefs) || trip.variants[0];
            trip.tagScore = trip.sfeer.length;
          }
          return trip;
        }).filter(Boolean);

        return liked.length > 0;
      } catch(e) { return false; }
    }

    // ── BESLUITZEKERHEID-MICROVRAAG ────────────────────────────────────
    function answerConfidence(answer) {
      kiespretTrack('decision_confidence', { answer: answer });
      document.querySelector('.confidence-btns').style.display = 'none';

      if (answer === 'nee') {
        // Toon optie om door te swipen met extra kaarten
        document.getElementById('confidenceThanks').innerHTML = `
          <p style="margin-bottom:12px">Geen probleem! We kunnen meer opties laden.</p>
          <button class="cta-btn" data-action="loadMoreTrips" style="max-width:300px;margin:0 auto;font-size:14px">
            Bekijk meer vakanties →
          </button>
        `;
        document.getElementById('confidenceThanks').style.display = '';
      } else {
        document.getElementById('confidenceThanks').innerHTML = 'Bedankt! Klik hierboven op "Bekijk bij [aanbieder]" om de actuele prijs te checken.';
        document.getElementById('confidenceThanks').style.display = '';
      }
    }

    function loadMoreTrips() {
      // Zoek trips die nog niet in het originele deck zaten
      var allMatching = filterTripsCustom(prefs);
      var alreadySeen = currentTrips.map(function(t) { return t.id; });
      var newTrips = allMatching.filter(function(t) { return alreadySeen.indexOf(t.id) === -1; });

      if (newTrips.length === 0) {
        // Geen nieuwe trips beschikbaar — toon gestylede melding
        var stack = document.getElementById('cardStack');
        stack.innerHTML = '<div style="text-align:center;padding:48px 24px">' +
          '<div style="font-size:40px;margin-bottom:12px">🏖️</div>' +
          '<h3 style="margin-bottom:8px;font-family:\'Plus Jakarta Sans\',sans-serif">Alles bekeken!</h3>' +
          '<p style="color:var(--stone);margin-bottom:24px">Er zijn geen extra vakanties beschikbaar met deze filters.</p>' +
          '<button class="cta-btn" data-action="showResults" style="max-width:300px;margin:0 auto">Bekijk je top 3 →</button>' +
          '</div>';
        return;
      }

      // Sorteer nieuwe trips op smart score
      newTrips.sort(function(a, b) { return scoreTripSmart(b) - scoreTripSmart(a); });

      // Voeg max 5 nieuwe kaarten toe
      var extra = newTrips.slice(0, 5);
      currentTrips = currentTrips.concat(extra);
      currentIndex = currentTrips.length - extra.length;

      setProgress(100, 'Meer opties', null);
      showScreen('screen-swipe');
      renderCards();
    }

    // ── POST-SWIPE KEUZE: duo of solo ──────────────────────────────────
    function showPostSwipeChoice() {
      const stack = document.getElementById('cardStack');
      stack.innerHTML = `
        <div style="text-align:center;padding:32px 16px">
          <div style="font-size:40px;margin-bottom:12px">🎯</div>
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:700;margin-bottom:8px">Je hebt ${liked.length} vakantie${liked.length > 1 ? 's' : ''} bewaard!</h2>
          <p style="font-size:14px;color:var(--stone);margin-bottom:28px">Wat wil je nu doen?</p>

          <button class="cta-btn" data-action="createDuoSession" style="margin-bottom:12px;background:var(--ocean)">
            🔗 Deel met mijn partner
          </button>
          <p style="font-size:12px;color:var(--stone);margin-bottom:24px">Je partner swipt dezelfde vakanties en jullie zien de match</p>

          <button class="cta-btn" data-action="showResults" style="background:var(--sunset)">
            Bekijk mijn top 3 →
          </button>
          <p style="font-size:12px;color:var(--stone);margin-top:4px">Ga direct naar je resultaten (solo)</p>
        </div>`;
    }

    // ── DUO-SESSIE ─────────────────────────────────────────────────────
    var duoSessionId = null;
    var isDuoPartnerB = false;

    // Partner A: maak duo-sessie aan na swipen
    async function createDuoSession() {
      const top3Ids = liked.slice(0, 3).map(t => t.id);
      const allLikedIds = liked.map(t => t.id);

      try {
        const res = await fetch('/api/session/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            likedIds: allLikedIds,
            deckParams: {
              sfeer: prefs.sfeer,
              budgetMax: prefs.budgetMax,
              maanden: prefs.maanden,
              duur: prefs.duur,
              airport: prefs.airport
            }
          })
        });

        const data = await res.json();
        if (data.sessionId) {
          duoSessionId = data.sessionId;
          const duoUrl = window.location.origin + '/start/?duo=' + duoSessionId;
          document.getElementById('duoShareUrl').value = duoUrl;
          showScreen('screen-duo-wait');
          kiespretTrack('share_link_created', { method: 'duo', sessionId: duoSessionId });
        } else {
          alert('Er ging iets mis bij het aanmaken van de sessie. Probeer het opnieuw.');
        }
      } catch (e) {
        alert('Verbindingsfout. Controleer je internet en probeer het opnieuw.');
      }
    }

    function copyDuoLink() {
      const url = document.getElementById('duoShareUrl').value;
      navigator.clipboard.writeText(url).then(() => {
        const btns = document.querySelectorAll('.share-copy-btn');
        btns.forEach(b => { if (b.closest('#screen-duo-wait')) { b.textContent = 'Gekopieerd!'; setTimeout(() => { b.textContent = 'Kopieer'; }, 2000); }});
      });
    }

    function shareDuoViaWhatsApp() {
      const url = document.getElementById('duoShareUrl').value;
      const text = 'Hey! Ik heb vakanties voor ons uitgekozen op Kiespret. Swipe jij ook even? Dan zien we welke we allebei leuk vinden: ' + url;
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }

    // Partner B: laad duo-sessie
    async function loadDuoSession(sessionId) {
      try {
        const res = await fetch('/api/session/get?id=' + sessionId);
        const data = await res.json();

        if (data.error) {
          alert('Deze link is verlopen of ongeldig.');
          showScreen('screen-sfeer');
          return false;
        }

        if (data.status === 'completed' && data.matches) {
          // Sessie al afgerond — toon match resultaat
          showDuoMatches(data.matches);
          return true;
        }

        // Toon lens-weergave
        duoSessionId = sessionId;
        isDuoPartnerB = true;
        const dp = data.deckParams;

        const sfeerMap = {
          'strand': 'Strand & zon', 'rustig': 'Strand & zon', 'zon': 'Strand & zon',
          'actief': 'Actief & avontuur', 'natuur': 'Actief & avontuur', 'avontuur': 'Actief & avontuur',
          'resort': 'Resort & comfort', 'comfort': 'Resort & comfort', 'allinclusive': 'Resort & comfort'
        };
        const sfeerLabel = dp.sfeer ? dp.sfeer.map(s => sfeerMap[s] || s).filter((v,i,a) => a.indexOf(v) === i).join(', ') : '';
        const maandMap = { mei: 'mei', jun: 'juni', jul: 'juli', aug: 'augustus', sep: 'september', okt: 'oktober' };
        const maanden = dp.maanden ? dp.maanden.map(m => maandMap[m] || m).join(', ') : '';
        const budgetLabel = dp.budgetMax === 9999 ? 'geen limiet' : 'tot €' + dp.budgetMax + ' p.p.';
        const duurLabel = dp.duur === 0 ? 'flexibel' : dp.duur + ' nachten';

        // Veilige DOM-constructie: Partner A's data komt via de API en mag NIET als HTML gerenderd worden
        const lens = document.getElementById('duoLensDetails');
        lens.textContent = '';
        const lensRows = [
          ['Sfeer', sfeerLabel],
          ['Periode', maanden],
          ['Budget', budgetLabel],
          ['Duur', duurLabel]
        ];
        lensRows.forEach(([label, value], idx) => {
          const strong = document.createElement('strong');
          strong.textContent = label + ':';
          lens.appendChild(strong);
          lens.appendChild(document.createTextNode(' ' + value));
          if (idx < lensRows.length - 1) lens.appendChild(document.createElement('br'));
        });

        // Sla deck params op zodat Partner B dezelfde trips ziet
        prefs.sfeer = dp.sfeer || [];
        prefs.budgetMax = dp.budgetMax || 9999;
        prefs.maanden = dp.maanden || [];
        prefs.duur = dp.duur !== undefined ? dp.duur : 0;
        prefs.airport = dp.airport || 'AMS';

        kiespretTrack('partner_session_start', { sessionId: sessionId });
        showScreen('screen-duo-welcome');
        return true;

      } catch (e) {
        alert('Verbindingsfout. Controleer je internet en probeer het opnieuw.');
        return false;
      }
    }

    // Partner B: start swipen met dezelfde deck
    function startDuoSwipen() {
      currentTrips = filterTripsCustom(prefs);
      currentIndex = 0;
      liked = [];
      likedTags = {};

      if (currentTrips.length > MAX_DECK) {
        currentTrips = currentTrips.slice(0, MAX_DECK);
      }

      setProgress(100, 'Swipen', null);
      document.getElementById('navStep').textContent = '';
      showScreen('screen-swipe');
      renderCards();
    }

    // Partner B: stuur likes naar server en toon matches
    async function completeDuoSession() {
      const likedIds = liked.map(t => t.id);

      try {
        const res = await fetch('/api/session/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: duoSessionId, likedIds })
        });

        const data = await res.json();
        if (data.matches !== undefined) {
          showDuoMatches(data.matches, data.overlapType);
        } else {
          alert('Er ging iets mis. Probeer het opnieuw.');
        }
      } catch (e) {
        alert('Verbindingsfout. Controleer je internet en probeer het opnieuw.');
      }
    }

    // Toon duo match-resultaat
    function showDuoMatches(matchIds, overlapType) {
      showScreen('screen-duo-match');

      const header = document.getElementById('duoMatchHeader');
      const sub = document.getElementById('duoMatchSub');
      const list = document.getElementById('duoMatchList');
      const adviceBox = document.getElementById('duoMatchAdvice');
      list.innerHTML = '';
      adviceBox.innerHTML = '';

      // Zoek trips op
      const matchedTrips = matchIds.map(id => {
        const trip = trips.find(t => t.id === id);
        if (trip && !trip.matchedVariant) {
          trip.matchedVariant = trip.variants[0];
          trip.tagScore = trip.sfeer.length;
        }
        return trip;
      }).filter(Boolean);

      // Bouwplan: overlapscore weergave
      if (!overlapType) {
        overlapType = matchedTrips.length >= 2 ? 'perfect' : matchedTrips.length === 1 ? 'bijna' : 'geen';
      }

      if (overlapType === 'perfect') {
        header.querySelector('.results-emoji').textContent = '💕';
        header.querySelector('h2').textContent = 'Jullie zijn het eens!';
        sub.textContent = matchedTrips.length === 1
          ? 'Jullie hebben allebei dezelfde vakantie gekozen — perfecte match!'
          : 'Jullie hebben ' + matchedTrips.length + ' vakanties allebei leuk gevonden!';
      } else if (overlapType === 'bijna') {
        header.querySelector('.results-emoji').textContent = '🤝';
        header.querySelector('h2').textContent = 'Bijna een match!';
        sub.textContent = 'Jullie hebben 1 vakantie allebei leuk gevonden. Bekijk de details hieronder.';
      } else {
        header.querySelector('.results-emoji').textContent = '🤔';
        header.querySelector('h2').textContent = 'Jullie smaak verschilt';
        sub.textContent = 'Geen overlap dit keer. Probeer het opnieuw met andere instellingen!';
        list.innerHTML = `
          <div style="text-align:center;padding:24px">
            <button class="cta-btn" data-action="restart" style="max-width:300px;margin:0 auto">Opnieuw beginnen met andere voorkeuren</button>
          </div>`;
        return;
      }

      // Toon gematchte trips
      const sfeerLabels = {
        'strand': 'Strand & zon', 'rustig': 'Strand & zon', 'zon': 'Strand & zon',
        'actief': 'Actief & verkennen', 'natuur': 'Actief & verkennen', 'avontuur': 'Actief & verkennen',
        'resort': 'Resort & comfort', 'comfort': 'Resort & comfort', 'allinclusive': 'Resort & comfort'
      };

      matchedTrips.forEach((trip, i) => {
        const v = trip.matchedVariant;
        const sfeerLabel = sfeerLabels[trip.sfeer[0]] || trip.sfeer[0];
        const aanbiederSafe = escapeHtml(trip.aanbieder);
        const destSafe = escapeHtml(trip.destination);
        const hotelName = escapeHtml(trip.hotelName || trip.title || '');
        const whyText = escapeHtml(trip.whyThisTrip || '');
        const ratingVal = extractRating(trip);
        const starsVal = extractStars(trip);
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
          <div class="result-rank-banner rank-1">
            💕 Jullie match ${matchedTrips.length > 1 ? (i + 1) : ''}
          </div>
          <img class="result-img" src="${escapeHtml(safeUrl(trip.imageUrl))}" alt="${destSafe}">
          <div class="result-body">
            <div class="result-title">${hotelName}</div>
            <div class="result-dest">📍 ${destSafe}</div>
            ${whyText ? `<p style="font-size:13px;color:var(--stone);margin-bottom:10px;line-height:1.5">${whyText}</p>` : ''}
            <div class="result-dims">
              <span class="dim-label">Sfeer</span><span class="dim-value">${escapeHtml(sfeerLabel)}</span>
              <span class="dim-label">Prijs</span><span class="dim-value">€${Number(v.prijs) || 0} p.p. · ${escapeHtml(v.maand)} · ${Number(v.duur) || 0} nachten</span>
              <span class="dim-label">Vluchtduur</span><span class="dim-value">${escapeHtml(trip.vluchtduur)} vanaf Schiphol</span>
              <span class="dim-label">Boardtype</span><span class="dim-value">${escapeHtml(trip.boardType)}${starsVal ? ' · ' + escapeHtml(starsVal) + '-sterren' : ''}${ratingVal ? ' · ⭐ ' + escapeHtml(ratingVal) : ''}</span>
              <span class="dim-label">Aanbieder</span><span class="dim-value">${aanbiederSafe}</span>
            </div>
            <div class="result-row">
              <div class="result-price">€${Number(v.prijs) || 0}<small> p.p.</small></div>
              <button class="book-btn" data-book-btn>
                Bekijk bij ${aanbiederSafe} →
              </button>
            </div>
          </div>`;
        const bookBtn = card.querySelector('[data-book-btn]');
        if (bookBtn) {
          const vIdx = trip.variants.indexOf(v);
          bookBtn.addEventListener('click', () => openOutbound(trip.aanbieder, trip.id, vIdx >= 0 ? vIdx : 0));
        }
        list.appendChild(card);
      });

      kiespretTrack('duo_match_found', { overlapType, matchCount: String(matchedTrips.length) });
    }

    // ── SHORTLIST DELEN VIA URL ──────────────────────────────────────────
    function generateShareUrl() {
      const top3 = liked.slice(0, 3);
      if (top3.length === 0) return '';
      const ids = top3.map(t => t.id);
      const encoded = btoa(JSON.stringify(ids));
      return window.location.origin + '/start/?shortlist=' + encodeURIComponent(encoded);
    }

    function copyShareLink() {
      const url = document.getElementById('shareUrl').value;
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('shareCopyBtn');
        btn.textContent = 'Gekopieerd!';
        setTimeout(() => { btn.textContent = 'Kopieer'; }, 2000);
      });
      kiespretTrack('share_link_created', { method: 'copy' });
    }

    function shareViaWhatsApp() {
      const url = document.getElementById('shareUrl').value;
      const text = 'Kijk, dit zijn mijn top 3 vakantiekeuzes op Kiespret: ' + url;
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
      kiespretTrack('share_link_created', { method: 'whatsapp' });
    }

    // Controleer bij laden of er een ?shortlist= parameter is
    function checkSharedShortlist() {
      const params = new URLSearchParams(window.location.search);
      const shortlistParam = params.get('shortlist');
      if (!shortlistParam) return false;

      try {
        const ids = JSON.parse(atob(decodeURIComponent(shortlistParam)));
        if (!Array.isArray(ids) || ids.length === 0) return false;

        // Zoek trips op ID
        const sharedTrips = ids.map(id => trips.find(t => t.id === id)).filter(Boolean);
        if (sharedTrips.length === 0) return false;

        // Koppel een standaard variant aan elke trip (eerste beschikbare)
        sharedTrips.forEach(trip => {
          if (!trip.matchedVariant) {
            trip.matchedVariant = trip.variants[0];
            trip.tagScore = trip.sfeer.length;
          }
        });

        liked = sharedTrips;
        showResults();

        // Pas header aan
        document.querySelector('.results-header h2').textContent = 'Iemands top ' + sharedTrips.length;
        document.querySelector('.results-sub').textContent = 'Deze vakanties zijn met je gedeeld via Kiespret';

        // Verberg share-blok (ontvanger hoeft niet opnieuw te delen)
        document.getElementById('shareBlock').style.display = 'none';

        return true;
      } catch(e) {
        console.error('checkSharedShortlist failed:', e);
        return false;
      }
    }

    // ── RESTART ────────────────────────────────────────────────────────────
    function restart() {
      // Event: restart
      kiespretTrack('restart');

      try { localStorage.removeItem('kiespret_shortlist'); localStorage.removeItem('kiespret_prefs'); } catch(e) {}

      prefs.sfeer = [];
      prefs.budgetMax = null;
      prefs.maanden = [];
      prefs.duur = null;
      likedTags = {};
      dislikedTags = {};

      document.querySelectorAll('.sfeer-card, .option-btn, .period-btn, .duur-btn')
        .forEach(el => el.classList.remove('selected'));
      document.querySelectorAll('#btnSfeer, #btnBudget, #btnPeriode, #btnDuur')
        .forEach(btn => btn.disabled = true);

      setProgress(0, 'Stap 1 van 3', null);
      document.getElementById('navStep').textContent = 'Stap 1 van 3';
      showScreen('screen-sfeer');
    }

    // ── INIT: check voor duo-sessie, gedeelde shortlist, of SEO deeplink ─
    (function init() {
      const params = new URLSearchParams(window.location.search);
      const duoParam = params.get('duo');

      if (duoParam) {
        // Partner B opent duo-link
        loadDuoSession(duoParam);
      } else if (!checkSharedShortlist()) {
        // Check of er params vanuit SEO-pagina's meekomen
        const sfeerParam = params.get('sfeer');
        const landParam = params.get('land');

        // Land/regio('s) onthouden voor focus-boost in matching
        // Bijv. ?land=Kos,Kreta of ?land=Griekenland
        if (landParam) {
          prefs.focusLands = landParam.split(',').map(l => l.trim());
        }

        if (sfeerParam) {
          // Pre-fill stap 1 met sfeer uit URL, bijv. ?sfeer=strand,rustig
          const sfeerTags = sfeerParam.split(',');
          let bestCard = null;
          let bestOverlap = 0;
          document.querySelectorAll('.sfeer-card').forEach(card => {
            const cardTags = card.dataset.sfeer.split(',');
            const overlap = cardTags.filter(t => sfeerTags.includes(t)).length;
            if (overlap > bestOverlap) {
              bestOverlap = overlap;
              bestCard = card;
            }
          });
          if (bestCard) {
            selectSfeer(bestCard);
          }

          // Als er ook een land-focus is, sla stap 1 over → direct naar budget
          if (landParam) {
            goToStap2();
          } else {
            showScreen('screen-sfeer');
          }
        } else {
          // Geen params → toon stap 1 normaal
          showScreen('screen-sfeer');
        }
      }
    // ── DELEGATED EVENT HANDLER (vervangt alle onclick= attributen) ────
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      switch (action) {
        case 'selectSfeer':      selectSfeer(btn); break;
        case 'selectBudget':     selectBudget(btn); break;
        case 'toggleMaand':      toggleMaand(btn); break;
        case 'goToStap2':        goToStap2(); break;
        case 'goToStap3':        goToStap3(); break;
        case 'startSwipen':      startSwipen(); break;
        case 'swipeCard':        swipeCard(btn.getAttribute('data-dir')); break;
        case 'undoLastSwipe':    undoLastSwipe(); break;
        case 'showResults':      showResults(); break;
        case 'closeModal':       closeModal(); break;
        case 'restart':          restart(); break;
        case 'loadMoreTrips':    loadMoreTrips(); break;
        case 'createDuoSession': createDuoSession(); break;
        case 'copyShareLink':    copyShareLink(); break;
        case 'shareViaWhatsApp': shareViaWhatsApp(); break;
        case 'copyDuoLink':      copyDuoLink(); break;
        case 'shareDuoViaWhatsApp': shareDuoViaWhatsApp(); break;
        case 'startDuoSwipen':   startDuoSwipen(); break;
        case 'answerConfidence': answerConfidence(btn.getAttribute('data-answer')); break;
      }
    });

    })();
