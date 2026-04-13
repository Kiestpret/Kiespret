const tripData = [
  {
    id: "mallorca",
    title: "Adults only zonweek",
    destination: "Mallorca, Spanje",
    hotelName: "Cala Breeze Resort",
    pricePerPerson: 899,
    nights: 7,
    departureLabel: "Vertrek in juni",
    airport: "Schiphol",
    boardType: "All-inclusive",
    provider: "TUI",
    matchReason: "Rechtstreekse vlucht en binnen je budget",
    tags: ["Adults only", "Strand", "Rust"],
    highlights: ["Transfer inbegrepen", "4-sterren resort", "5 min van het strand"],
    audience: "couples",
    styles: ["Zon", "Romantisch"],
    description:
      "Een rustige zonweek voor koppels die vooral willen ontspannen zonder eindeloos te zoeken."
  },
  {
    id: "alanya",
    title: "Budget zon break",
    destination: "Alanya, Turkije",
    hotelName: "Blue Pearl Hotel",
    pricePerPerson: 649,
    nights: 8,
    departureLabel: "Vertrek in september",
    airport: "Eindhoven",
    boardType: "Ultra all-inclusive",
    provider: "Sunweb",
    matchReason: "Goede prijs voor late summer sun",
    tags: ["Voordelig", "Zwembad", "Zonzeker"],
    highlights: ["Veel voor weinig", "Directe vlucht", "Gratis wifi"],
    audience: "budget",
    styles: ["Zon"],
    description:
      "Voor mensen die vooral zon, gemak en een scherpe prijs willen zonder ingewikkelde filters."
  },
  {
    id: "santorini",
    title: "Romantische escape",
    destination: "Santorini, Griekenland",
    hotelName: "Aegean Cliff Suites",
    pricePerPerson: 1299,
    nights: 6,
    departureLabel: "Vertrek in augustus",
    airport: "Dusseldorf",
    boardType: "Logies + ontbijt",
    provider: "TUI",
    matchReason: "Perfect voor een romantische week samen",
    tags: ["Romantisch", "Boutique", "Uitzicht"],
    highlights: ["Infinity pool", "Caldera view", "Adults preferred"],
    audience: "couples",
    styles: ["Romantisch", "Luxe"],
    description:
      "Een boutique-achtige trip met uitzicht en net genoeg luxe om speciaal te voelen."
  },
  {
    id: "kos",
    title: "Familie all-in topdeal",
    destination: "Kos, Griekenland",
    hotelName: "Sunny Coast Family Club",
    pricePerPerson: 1049,
    nights: 8,
    departureLabel: "Vertrek in mei",
    airport: "Schiphol",
    boardType: "All-inclusive",
    provider: "Sunweb",
    matchReason: "Kindvriendelijk met korte transfertijd",
    tags: ["Familie", "Kids club", "Waterpark"],
    highlights: ["Familiekamers", "Kinderbuffet", "Splash zone"],
    audience: "families",
    styles: ["Familie", "Zon"],
    description:
      "Gemaakt voor gezinnen die vooral gemak, entertainment en all-inclusive zekerheid willen."
  },
  {
    id: "dubai",
    title: "Luxe city + beach",
    destination: "Dubai, VAE",
    hotelName: "Harbor Lights Downtown",
    pricePerPerson: 1549,
    nights: 5,
    departureLabel: "Vertrek in november",
    airport: "Schiphol",
    boardType: "Halfpension",
    provider: "TUI",
    matchReason: "Luxe break met zon buiten het hoogseizoen",
    tags: ["Luxe", "Stad", "Beach club"],
    highlights: ["Rooftop pool", "Centraal gelegen", "Premium kamers"],
    audience: "couples",
    styles: ["Luxe"],
    description:
      "Voor reizigers die een stijlvolle korte break willen met zon, stad en comfort."
  }
];

const site = document.getElementById("site");

const state = {
  mode: "landing",
  screen: "onboarding",
  tab: "discover",
  detailTripId: null,
  currentIndex: 0,
  favorites: [],
  toast: "",
  leadEmail: "",
  preferences: {
    budget: "750 - 1250",
    departureMonth: "Juni",
    airport: "Schiphol",
    duration: "6 - 8 nachten",
    style: "Zon",
    audience: "couples"
  }
};

const options = {
  budget: ["Tot 750", "750 - 1250", "1250+"],
  departureMonth: ["Mei", "Juni", "September", "Flexibel"],
  airport: ["Schiphol", "Eindhoven", "Dusseldorf", "Maakt niet uit"],
  duration: ["3 - 5 nachten", "6 - 8 nachten", "9+ nachten"],
  style: ["Zon", "Romantisch", "Familie", "Luxe"]
};

function renderSite() {
  site.innerHTML = `
    <div class="site-shell">
      <header class="site-header">
        <div class="nav">
          <a class="brand" href="#top">
            <span class="brand-mark">✈</span>
            <span>Tripr</span>
          </a>
          <nav class="nav-links">
            <a href="#how-it-works">Hoe het werkt</a>
            <a href="#niches">Niches</a>
            <a href="#demo">Demo</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div class="nav-actions">
            <button class="button button-secondary" data-action="jump-demo">Bekijk demo</button>
            <button class="button button-primary" data-action="start-app">Start swipen</button>
          </div>
        </div>
      </header>

      <main>
        <section class="hero" id="top">
          <div class="hero-copy">
            <div class="eyebrow">Web-first vakantie matchmaker</div>
            <h1>Vind sneller een vakantie die <span>bij jullie past</span></h1>
            <p>
              Tripr helpt de planner in een relatie of gezin om in minuten tot een shortlist te komen.
              Geen filterjungle, maar swipebare pakketreizen met duidelijke prijs, vertrekpunt en partnerlink.
            </p>
            <div class="hero-actions">
              <button class="button button-primary" data-action="start-app">Probeer de demo</button>
              <a class="button button-secondary" href="#how-it-works">Zie hoe het werkt</a>
            </div>
            <div class="hero-metrics">
              <div class="metric-chip">Voor koppels en gezinnen</div>
              <div class="metric-chip">Affiliate-first, geen eigen booking engine</div>
              <div class="metric-chip">Web eerst, app later voor retentie</div>
            </div>
          </div>

          <div class="hero-visual" id="demo">
            <div class="phone-stage">
              <div class="phone-frame">
                <div class="phone-screen">
                  ${renderApp()}
                </div>
              </div>
              <div class="glow"></div>
            </div>
          </div>
        </section>

        <section class="section-wrap">
          <div class="grid-3">
            <article class="info-card">
              <div class="icon-badge">01</div>
              <h3>Minder keuzestress</h3>
              <p>De app toont alleen pakketreizen die passen bij budget, vertrekpunt, reisduur en stijl.</p>
            </article>
            <article class="info-card">
              <div class="icon-badge">02</div>
              <h3>Ontdekken én beslissen</h3>
              <p>Niet alleen inspiratie, maar ook een shortlist die je meteen kunt openen bij de aanbieder.</p>
            </article>
            <article class="info-card">
              <div class="icon-badge">03</div>
              <h3>Gebouwd voor de planner</h3>
              <p>Perfect voor degene die normaal alle tabs open heeft staan en nu sneller wil vergelijken.</p>
            </article>
          </div>
        </section>

        <section class="section-wrap" id="niches">
          <div class="section-heading">
            <div>
              <div class="eyebrow">Waar het het best werkt</div>
              <h2>Drie niches die <span>commercieel</span> logisch zijn</h2>
            </div>
            <p>
              De beste start is niet “iedereen die op vakantie wil”, maar een doelgroep met veel keuzestress
              en hoge intentie.
            </p>
          </div>

          <div class="grid-3">
            <article class="niche-card active">
              <h3>Koppels</h3>
              <p>De sterkste merkpositie. Een van de twee zoekt, maar wil wel rekening houden met de ander.</p>
              <div class="niche-tag">Beste merkverhaal</div>
            </article>
            <article class="niche-card">
              <h3>Gezinnen</h3>
              <p>Zakelijk heel interessant, omdat filters als kindvriendelijk, reisduur en luchthaven erg zwaar wegen.</p>
              <div class="niche-tag">Sterk probleem-oplossing fit</div>
            </article>
            <article class="niche-card">
              <h3>Budget zon</h3>
              <p>Makkelijk om te testen, breed genoeg voor volume, maar minder onderscheidend als merk dan koppels.</p>
              <div class="niche-tag">Makkelijkste testmarkt</div>
            </article>
          </div>
        </section>

        <section class="section-wrap" id="how-it-works">
          <div class="section-heading">
            <div>
              <div class="eyebrow">Hoe het werkt</div>
              <h2>Van advertentie naar <span>shortlist</span></h2>
            </div>
            <p>
              Deze website is opgezet als web-first funnel: eerst ontdekt iemand het concept, daarna krijgt die
              direct waarde via een mobiele swipeflow.
            </p>
          </div>

          <div class="steps">
            <article class="step-card">
              <div class="step-number">Stap 1</div>
              <h3>Kom binnen via social of search</h3>
              <p>Een niche-landingspagina belooft een snelle match in plaats van traditionele filters.</p>
            </article>
            <article class="step-card">
              <div class="step-number">Stap 2</div>
              <h3>Kies simpele voorkeuren</h3>
              <p>Budget, vertrekmaand, luchthaven en type vakantie zijn genoeg voor een eerste match.</p>
            </article>
            <article class="step-card">
              <div class="step-number">Stap 3</div>
              <h3>Swipe, bewaar, vergelijk</h3>
              <p>De gebruiker ervaart direct waarde en bouwt een shortlist zonder accountdrempel.</p>
            </article>
            <article class="step-card">
              <div class="step-number">Stap 4</div>
              <h3>Klik door naar partner</h3>
              <p>De boeking gebeurt bij de aanbieder. Jij focust op selectie, intentie en doorsturen.</p>
            </article>
          </div>
        </section>

        <section class="section-wrap">
          <article class="quote-card">
            <div>
              <div class="eyebrow">Positionering</div>
              <blockquote>“De snelste manier om als stel of gezin een vakantie te kiezen.”</blockquote>
            </div>
            <div class="quote-meta">
              Geen algemene travel site, maar een beslis-tool voor de persoon die normaal het voorwerk doet.
              Dat maakt de boodschap scherper, de funnel sterker en de app later waardevoller.
            </div>
          </article>

          <div class="lead-card">
            <input
              type="email"
              id="lead-email"
              placeholder="Laat je e-mailadres achter voor early access of prijsalerts"
              value="${escapeHtml(state.leadEmail)}"
            />
            <button class="button button-primary" data-action="save-lead">Ik wil updates</button>
          </div>
          <div class="lead-note">Voor nu slaan we dit alleen lokaal op als demo-interactie.</div>
        </section>

        <section class="cta-band">
          <div class="cta-inner">
            <div class="cta-copy">
              <div class="eyebrow" style="color: rgba(255,255,255,0.76);">Volgende stap</div>
              <h2>Van website naar <span>echte MVP</span></h2>
              <p>
                Dit is nu een sterke web-first basis. Hierna kunnen we een productieversie bouwen met echte feeds,
                analytics, lead capture en affiliate deeplinks.
              </p>
            </div>
            <div class="cta-panel">
              <ul class="cta-points">
                <li>Landingspagina per niche</li>
                <li>Echte partner-deeplinks</li>
                <li>Shortlist delen via WhatsApp</li>
                <li>Prijsalerts en e-mailcapture</li>
              </ul>
              <p class="foot-note">De huidige demo is bewust dependency-vrij, zodat je hem meteen lokaal kunt openen.</p>
            </div>
          </div>
        </section>

        <section class="section-wrap" id="faq">
          <div class="section-heading">
            <div>
              <div class="eyebrow">FAQ</div>
              <h2>Wat deze eerste site <span>wel en niet</span> doet</h2>
            </div>
            <p>
              Dit is bedoeld als web-first validatieomgeving. Geen backend, geen echte partnerfeed, wel een duidelijke productrichting.
            </p>
          </div>

          <div class="grid-3">
            <article class="faq-card">
              <h3>Is dit al live-ready?</h3>
              <p>Nog niet. Het is een sterke marketing + productdemo die we kunnen doorbouwen naar een echte MVP.</p>
            </article>
            <article class="faq-card">
              <h3>Kan dit straks affiliate worden?</h3>
              <p>Ja. De detail-CTA’s zijn nu placeholders, maar kunnen later echte deeplinks naar partners openen.</p>
            </article>
            <article class="faq-card">
              <h3>Hebben we nog een native app nodig?</h3>
              <p>Waarschijnlijk later wel voor retentie, alerts en saved shortlists. Voor acquisitie is web slimmer.</p>
            </article>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <div>Tripr concept website</div>
        <div>Gebouwd als web-first funnel voor vakantie matching</div>
      </footer>
    </div>
    ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
  `;

  bindSiteEvents();
}

function renderApp() {
  if (state.screen === "onboarding") {
    return renderOnboarding();
  }

  if (state.screen === "detail") {
    return renderDetail();
  }

  return renderMain();
}

function renderOnboarding() {
  return `
    <div class="screen onboarding">
      <div class="statusbar"><span>9:41</span><span>Tripr demo</span></div>
      <div class="eyebrow">Swipebare pakketreizen</div>
      <h1 class="hero-title">Vind sneller een vakantie voor jullie</h1>
      <p class="hero-text">
        Stel je voorkeuren in en krijg meteen een deck met pakketreizen dat voelt alsof iemand het voorwerk al heeft gedaan.
      </p>
      ${renderOptionSection("Budget per persoon", "budget")}
      ${renderOptionSection("Wanneer wil je weg?", "departureMonth")}
      ${renderOptionSection("Vertrek vanaf", "airport")}
      ${renderOptionSection("Hoe lang wil je weg?", "duration")}
      ${renderOptionSection("Wat voor vakantie zoek je?", "style")}
      <button class="primary-button" data-action="launch-deck">Bekijk mijn matches</button>
    </div>
  `;
}

function renderOptionSection(title, key) {
  return `
    <section class="section">
      <h3>${title}</h3>
      <div class="chip-grid">
        ${options[key]
          .map(
            (option) => `
              <button class="chip ${state.preferences[key] === option ? "active" : ""}" data-action="select-option" data-key="${key}" data-value="${option}">
                ${option}
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMain() {
  return `
    <div class="screen ${state.tab === "discover" ? "discover" : "favorites"}">
      <div class="statusbar"><span>9:41</span><span>${state.tab === "discover" ? "Ontdekken" : "Shortlist"}</span></div>
      ${state.tab === "discover" ? renderDiscover() : renderFavorites()}
      <div class="tabbar">
        <button class="tab-button ${state.tab === "discover" ? "active" : ""}" data-action="switch-tab" data-tab="discover">Ontdekken</button>
        <button class="tab-button ${state.tab === "favorites" ? "active" : ""}" data-action="switch-tab" data-tab="favorites">Shortlist</button>
      </div>
    </div>
  `;
}

function renderDiscover() {
  const ranked = getRankedTrips();
  const remaining = ranked.slice(state.currentIndex);
  const cards = remaining.slice(0, 3);

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Voor jou</div>
        <h2 class="title">Matches</h2>
      </div>
      <button class="secondary-button" data-action="reset-deck">Reset</button>
    </div>
    <p class="subtitle">${remaining.length} pakketreizen passen nu bij je voorkeuren.</p>
    <div class="card-stack">
      ${
        cards.length
          ? cards.map((trip, index) => renderTripCard(trip, index)).reverse().join("")
          : `
            <div class="trip-card" style="background:white;color:var(--ink);justify-content:center;align-items:center;text-align:center;">
              <div>
                <div class="eyebrow" style="color:var(--accent);">Deck leeg</div>
                <h3>Je hebt alle matches bekeken</h3>
                <p class="subtitle">Reset het deck of verander je voorkeuren om opnieuw te beginnen.</p>
              </div>
            </div>
          `
      }
    </div>
    <p class="swipe-hint">Gebruik de knoppen om te bewaren of over te slaan. Tik op een kaart voor details.</p>
    <div class="action-row">
      <button class="icon-button reject" data-action="reject-trip">✕</button>
      <button class="icon-button save" data-action="save-trip">♥</button>
    </div>
    <p class="legal-note">Definitieve prijs en beschikbaarheid worden bepaald op de website van de aanbieder.</p>
  `;
}

function renderTripCard(trip, index) {
  return `
    <article class="trip-card layer-${index}" data-action="open-detail" data-trip-id="${trip.id}">
      <div class="card-top">
        <span class="pill">${trip.provider}</span>
        <span class="pill">${trip.pricePerPerson} p.p.</span>
      </div>
      <div>
        <h3 class="trip-title">${trip.title}</h3>
        <p class="trip-destination">${trip.destination}</p>
        <p class="match-reason">${trip.matchReason}</p>
        <div class="pills" style="margin-top: 14px;">
          <span class="mini-chip">${trip.nights} nachten</span>
          <span class="mini-chip">${trip.airport}</span>
          <span class="mini-chip">${trip.boardType}</span>
        </div>
        <div class="tag-row" style="margin-top: 12px;">
          ${trip.tags.map((tag) => `<span class="mini-chip">${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderFavorites() {
  const favorites = getFavoriteTrips();

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Jouw lijst</div>
        <h2 class="title">Shortlist</h2>
      </div>
      <button class="secondary-button" data-action="back-onboarding">Voorkeuren</button>
    </div>
    <p class="subtitle">Bewaar de reizen die goed voelen en gebruik later echte deeplinks naar de aanbieder.</p>
    ${
      favorites.length
        ? `
          <div class="favorite-list">
            ${favorites
              .map(
                (trip) => `
                  <article class="favorite-card" data-action="open-detail" data-trip-id="${trip.id}">
                    <h3>${trip.title}</h3>
                    <p>${trip.destination}</p>
                    <div class="favorite-meta">${trip.pricePerPerson} p.p. · ${trip.nights} nachten · ${trip.provider}</div>
                  </article>
                `
              )
              .join("")}
          </div>
        `
        : `
          <div class="empty-state">
            <div>
              <div class="eyebrow">Nog leeg</div>
              <h3>Nog geen shortlist</h3>
              <p>Bewaar je favoriete reizen tijdens het swipen om hier later te vergelijken.</p>
            </div>
          </div>
        `
    }
  `;
}

function renderDetail() {
  const trip = tripData.find((item) => item.id === state.detailTripId);

  return `
    <div class="screen detail">
      <div class="statusbar"><span>9:41</span><span>${trip.provider}</span></div>
      <div class="topbar">
        <button class="secondary-button" data-action="back-main">Terug</button>
        <div class="eyebrow">${trip.provider}</div>
      </div>
      <div class="hero-card">
        <div class="eyebrow" style="color: rgba(255,255,255,0.76);">Pakketreis</div>
        <h1 class="trip-title">${trip.title}</h1>
        <p class="trip-destination">${trip.hotelName}</p>
      </div>

      <section class="detail-card">
        <h3>Over deze reis</h3>
        <div class="detail-row"><div class="detail-label">Bestemming</div><div class="detail-value">${trip.destination}</div></div>
        <div class="detail-row"><div class="detail-label">Prijs vanaf</div><div class="detail-value">${trip.pricePerPerson} per persoon</div></div>
        <div class="detail-row"><div class="detail-label">Verblijf</div><div class="detail-value">${trip.nights} nachten · ${trip.boardType}</div></div>
        <div class="detail-row"><div class="detail-label">Vertrek</div><div class="detail-value">${trip.departureLabel} vanaf ${trip.airport}</div></div>
        <div class="detail-row"><div class="detail-label">Waarom jij</div><div class="detail-value">${trip.matchReason}</div></div>
      </section>

      <section class="detail-card">
        <h3>Waarom deze trip werkt</h3>
        <div class="bullet-list">
          ${trip.highlights
            .map(
              (item) => `
                <div class="bullet-item">
                  <div class="bullet-icon">●</div>
                  <div>${item}</div>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="detail-card">
        <h3>Boeken via partner</h3>
        <p class="subtitle">${trip.description}</p>
        <button class="primary-button" data-action="partner-click" data-provider="${trip.provider}">Bekijk bij ${trip.provider}</button>
      </section>
    </div>
  `;
}

function getRankedTrips() {
  return [...tripData]
    .map((trip) => ({ trip, score: scoreTrip(trip) }))
    .sort((a, b) => {
      if (b.score === a.score) {
        return a.trip.pricePerPerson - b.trip.pricePerPerson;
      }
      return b.score - a.score;
    })
    .map((item) => item.trip);
}

function scoreTrip(trip) {
  let score = 0;

  if (state.preferences.airport === "Maakt niet uit" || trip.airport === state.preferences.airport) {
    score += 3;
  }

  if (state.preferences.style === "Zon" && trip.styles.includes("Zon")) score += 4;
  if (state.preferences.style === "Romantisch" && trip.styles.includes("Romantisch")) score += 4;
  if (state.preferences.style === "Familie" && trip.styles.includes("Familie")) score += 4;
  if (state.preferences.style === "Luxe" && trip.styles.includes("Luxe")) score += 4;

  if (state.preferences.audience === "couples" && trip.audience === "couples") score += 3;
  if (state.preferences.audience === "families" && trip.audience === "families") score += 3;
  if (state.preferences.audience === "budget" && trip.audience === "budget") score += 3;

  if (state.preferences.budget === "Tot 750" && trip.pricePerPerson <= 750) score += 3;
  if (state.preferences.budget === "750 - 1250" && trip.pricePerPerson >= 750 && trip.pricePerPerson <= 1250) score += 3;
  if (state.preferences.budget === "1250+" && trip.pricePerPerson >= 1250) score += 3;

  if (state.preferences.duration === "3 - 5 nachten" && trip.nights <= 5) score += 2;
  if (state.preferences.duration === "6 - 8 nachten" && trip.nights >= 6 && trip.nights <= 8) score += 2;
  if (state.preferences.duration === "9+ nachten" && trip.nights >= 9) score += 2;

  if (state.preferences.departureMonth === "Flexibel") score += 1;
  if (trip.departureLabel.toLowerCase().includes(state.preferences.departureMonth.toLowerCase())) score += 2;

  return score;
}

function getFavoriteTrips() {
  return state.favorites
    .map((id) => tripData.find((trip) => trip.id === id))
    .filter(Boolean);
}

function bindSiteEvents() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
  });

  const leadInput = document.getElementById("lead-email");
  if (leadInput) {
    leadInput.addEventListener("input", (event) => {
      state.leadEmail = event.target.value;
    });
  }
}

function handleAction(event) {
  const target = event.currentTarget;
  const action = target.dataset.action;

  switch (action) {
    case "jump-demo":
      document.getElementById("demo").scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    case "start-app":
      state.screen = "onboarding";
      state.tab = "discover";
      scrollToDemo();
      renderSite();
      break;
    case "select-option":
      state.preferences[target.dataset.key] = target.dataset.value;
      if (target.dataset.key === "style" && target.dataset.value === "Familie") {
        state.preferences.audience = "families";
      }
      renderSite();
      break;
    case "launch-deck":
      state.screen = "main";
      state.currentIndex = 0;
      state.tab = "discover";
      renderSite();
      break;
    case "switch-tab":
      state.tab = target.dataset.tab;
      renderSite();
      break;
    case "reset-deck":
      state.currentIndex = 0;
      renderSite();
      break;
    case "reject-trip":
      state.currentIndex += 1;
      renderSite();
      break;
    case "save-trip":
      saveCurrentTrip();
      break;
    case "open-detail":
      state.detailTripId = target.dataset.tripId;
      state.screen = "detail";
      renderSite();
      break;
    case "back-main":
      state.screen = "main";
      renderSite();
      break;
    case "back-onboarding":
      state.screen = "onboarding";
      renderSite();
      break;
    case "partner-click":
      showToast(`Hier komt later de affiliate deeplink naar ${target.dataset.provider}.`);
      break;
    case "save-lead":
      if (!state.leadEmail.trim()) {
        showToast("Vul eerst een e-mailadres in om deze CTA te testen.");
        return;
      }
      showToast(`Top. "${state.leadEmail}" is lokaal ingevuld als demo lead.`);
      renderSite();
      break;
    default:
      break;
  }
}

function saveCurrentTrip() {
  const trip = getRankedTrips()[state.currentIndex];
  if (!trip) {
    return;
  }

  if (!state.favorites.includes(trip.id)) {
    state.favorites.push(trip.id);
  }

  state.currentIndex += 1;
  renderSite();
}

function scrollToDemo() {
  setTimeout(() => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 20);
}

function showToast(message) {
  state.toast = message;
  renderSite();
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    state.toast = "";
    renderSite();
  }, 2800);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

renderSite();
