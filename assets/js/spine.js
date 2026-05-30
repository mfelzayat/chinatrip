/**
 * spine.js — "Family Walks China" rebuild
 *
 * Builds: hero path SVG (14 stops + family avatar group),
 * tab system (Today / All Days / Bookings / Survival / Family),
 * and the dynamic Today pane that answers the single most important
 * question for the current trip phase (pre-departure / in-trip / post-trip).
 *
 * NOTE (2026-05-07): wrapped in an IIFE so its top-level `const`s
 * (MEMBERS, STOPS, etc.) don't collide with family-line.js's globals.
 * Without this, `Identifier 'MEMBERS' has already been declared` aborts
 * the whole file and tabs/panes never wire up.
 */
(function () {
"use strict";

const DEPARTURE_ISO = "2026-06-18T06:00:00+02:00"; // EK 924 take-off Cairo
const RETURN_ISO    = "2026-07-01T23:59:00+02:00";
const FAMILY_KEY    = "chinatrip.family.line.v1";
const DATA_URL      = "/data/2026-research.json";

// Traditional Chinese numerals 1-14 for stamp stops
const HANZI = ["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四"];

const STOPS = [
  { day: 1,  city: "transit",  emoji: "✈️", title: "Cairo → Dubai (transit)" },
  { day: 2,  city: "beijing",  emoji: "🏙️", title: "Beijing arrival + Wangfujing" },
  { day: 3,  city: "beijing",  emoji: "🐉", title: "Longqing Gorge + Shilinxia + Houhai" },
  { day: 4,  city: "beijing",  emoji: "🧱", title: "Great Wall Mutianyu + Silk Street" },
  { day: 5,  city: "beijing",  emoji: "🎢", title: "Universal Studios Beijing" },
  { day: 6,  city: "beijing",  emoji: "🏯", title: "Forbidden City + Summer Palace + Zhongguancun" },
  { day: 7,  city: "transit",  emoji: "🚄", title: "G11 → Shanghai" },
  { day: 8,  city: "shanghai", emoji: "🏙️", title: "Bund + Yu Garden" },
  { day: 9,  city: "shanghai", emoji: "🌊", title: "Hangzhou day trip" },
  { day: 10, city: "shanghai", emoji: "🏘️", title: "Zhujiajiao + Dianshan Lake" },
  { day: 11, city: "shanghai", emoji: "🏰", title: "Disney 1" },
  { day: 12, city: "shanghai", emoji: "🎢", title: "Disney 2" },
  { day: 13, city: "shanghai", emoji: "🌉", title: "Bund + PVG farewell" },
  { day: 14, city: "transit",  emoji: "↩️", title: "Return" },
];

const MEMBERS = [
  { id: "mfz",     ar: "محمد",   en: "Mohamed", initial: "م", color: "#4a7c5e", photo: "assets/images/family/mfz.png" },
  { id: "dina",    ar: "دينا",   en: "Dina",    initial: "د", color: "#c1543e", photo: "assets/images/family/dina.png" },
  { id: "fares",   ar: "فارس",  en: "Fares",   initial: "ف", color: "#c8a96e", photo: "assets/images/family/fares.png" },
  { id: "youssef", ar: "يوسف",  en: "Youssef", initial: "ي", color: "#4a7eb3", photo: "assets/images/family/youssef.png" },
  { id: "yassin",  ar: "ياسين", en: "Yassin",  initial: "ي", color: "#7b6cb3", photo: "assets/images/family/yassin.png" },
];

// ── Phase logic ─────────────────────────────────────────────────────
function tripPhase() {
  const now = Date.now();
  const start = new Date(DEPARTURE_ISO).getTime();
  const end = new Date(RETURN_ISO).getTime();
  if (now < start) {
    const days = Math.ceil((start - now) / 86_400_000);
    const hrs  = Math.floor(((start - now) % 86_400_000) / 3_600_000);
    return { phase: "pre", days, hrs, currentDay: 0 };
  }
  if (now > end) return { phase: "post", days: 0, currentDay: 14 };
  // In trip — figure out which day
  const dayMs = 86_400_000;
  const elapsed = now - start;
  const currentDay = Math.min(14, Math.floor(elapsed / dayMs) + 1);
  return { phase: "trip", currentDay };
}

// ── Family state (read existing localStorage from family-line.js) ──
function loadFamily() {
  try {
    const raw = localStorage.getItem(FAMILY_KEY);
    if (!raw) return { members: {}, hearts: {} };
    return JSON.parse(raw);
  } catch { return { members: {}, hearts: {} }; }
}

// ── Path SVG renderer (ink-brush stroke + red seal stops) ───────────
function renderPath(scroller) {
  const phase = tripPhase();
  const stopGap = 130; // px between stops
  const padX = 100;
  const W = padX * 2 + (STOPS.length - 1) * stopGap;
  const H = 240;

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "path-svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W);
  svg.setAttribute("preserveAspectRatio", "xMinYMid meet");

  // ── SVG defs: brush-texture filter + a red-seal pattern ─────────
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `
    <filter id="brushTexture" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="1.6"/>
    </filter>
    <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2"/>
      <feOffset dx="0" dy="1"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  // Stop positions — gentle organic curve, slight wobble per stop
  const positions = STOPS.map((s, i) => ({
    ...s,
    x: padX + i * stopGap,
    y: 120 + Math.sin(i * 0.65) * 28 + (i % 3 - 1) * 4,
  }));

  // City-tint backdrop bands behind the path
  const cityRanges = [
    { city: "beijing",  start: 1, end: 6,  color: "rgba(74, 124, 94, 0.06)" },
    { city: "shanghai", start: 7, end: 13, color: "rgba(200, 54, 44, 0.05)" },
  ];
  for (const r of cityRanges) {
    const a = positions[r.start - 1];
    const b = positions[r.end];
    if (!a || !b) continue;
    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", a.x - 25);
    rect.setAttribute("y", 8);
    rect.setAttribute("width", b.x - a.x + 50);
    rect.setAttribute("height", H - 16);
    rect.setAttribute("fill", r.color);
    rect.setAttribute("rx", "4");
    svg.appendChild(rect);
  }

  // City labels above the bands
  const cityLabels = [
    { city: "Beijing · 北京",  start: 1, end: 6 },
    { city: "Shanghai · 上海", start: 7, end: 13 },
  ];
  for (const l of cityLabels) {
    const a = positions[l.start - 1];
    const b = positions[l.end];
    const t = document.createElementNS(NS, "text");
    t.setAttribute("class", "path-city-label");
    t.setAttribute("x", (a.x + b.x) / 2);
    t.setAttribute("y", 28);
    t.textContent = l.city;
    svg.appendChild(t);
  }

  // ── Brush-stroke path lines ────────────────────────────────────
  const walkedIdx = phase.currentDay;
  for (let i = 0; i < positions.length - 1; i++) {
    const a = positions[i];
    const b = positions[i + 1];
    const dx = b.x - a.x;
    const cx1 = a.x + dx * 0.4;
    const cy1 = a.y + (b.y - a.y) * 0.1 - 14;
    const cx2 = a.x + dx * 0.6;
    const cy2 = b.y + (a.y - b.y) * 0.1 - 14;
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M ${a.x} ${a.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.x} ${b.y}`);
    if (i + 1 < walkedIdx) path.setAttribute("class", "path-line walked");
    else if (i + 1 > walkedIdx + 0.5) path.setAttribute("class", "path-line upcoming");
    else path.setAttribute("class", "path-line");
    svg.appendChild(path);
  }

  // ── Stamp stops (red seals with hanzi day numerals) ─────────────
  for (const s of positions) {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", `translate(${s.x}, ${s.y})`);
    g.setAttribute("class", "path-stop" + (phase.currentDay === s.day ? " today" : ""));
    g.dataset.day = s.day;
    g.dataset.city = s.city;
    g.addEventListener("click", () => openDay(s.day));

    // Outer chop frame (square-ish stamp shape with rounded corners)
    const r = phase.currentDay === s.day ? 22 : 18;
    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("class", "path-stop__chop-bg");
    bg.setAttribute("x", -r);
    bg.setAttribute("y", -r);
    bg.setAttribute("width", r * 2);
    bg.setAttribute("height", r * 2);
    bg.setAttribute("rx", "3");
    g.appendChild(bg);

    const chop = document.createElementNS(NS, "rect");
    chop.setAttribute("class", "path-stop__chop");
    chop.setAttribute("x", -r);
    chop.setAttribute("y", -r);
    chop.setAttribute("width", r * 2);
    chop.setAttribute("height", r * 2);
    chop.setAttribute("rx", "3");
    chop.setAttribute("transform", `rotate(${(s.day % 5) - 2})`);
    g.appendChild(chop);

    // Hanzi day number inside the stamp
    const han = document.createElementNS(NS, "text");
    han.setAttribute("class", "path-stop__hanzi");
    han.setAttribute("dy", "5");
    han.textContent = HANZI[s.day - 1] || s.day;
    g.appendChild(han);

    // Day label (Cormorant) above stamp
    const day = document.createElementNS(NS, "text");
    day.setAttribute("class", "path-stop__day");
    day.setAttribute("dy", -r - 8);
    day.textContent = `Day ${s.day}`;
    g.appendChild(day);

    // Title below stamp
    const lbl = document.createElementNS(NS, "text");
    lbl.setAttribute("class", "path-stop__title");
    lbl.setAttribute("dy", r + 18);
    lbl.textContent = s.title;
    g.appendChild(lbl);

    svg.appendChild(g);
  }

  // ── Family marker (5 portrait circles + halo) ──────────────────
  const markerIdx = phase.phase === "pre" ? 0 : phase.currentDay;
  const baseX = phase.phase === "pre" ? padX - 60 : (positions[Math.max(0, markerIdx - 1)]?.x ?? padX);
  const baseY = phase.phase === "pre" ? 130 : (positions[Math.max(0, markerIdx - 1)]?.y ?? 130);

  const marker = document.createElementNS(NS, "g");
  marker.setAttribute("class", "family-marker");
  marker.setAttribute("transform", `translate(${baseX}, ${baseY - 50})`);

  const halo = document.createElementNS(NS, "circle");
  halo.setAttribute("class", "family-marker__halo");
  halo.setAttribute("r", "30");
  halo.setAttribute("cx", "0");
  halo.setAttribute("cy", "0");
  marker.appendChild(halo);

  // Portrait-style avatars: 5 staggered circles with member colors
  const layout = [
    { x: -16, y:  6, r: 10 },  // mfz (front-left)
    { x:  16, y:  6, r: 10 },  // dina (front-right)
    { x:   0, y: -8, r:  9 },  // fares (back-center)
    { x: -10, y: -2, r:  8 },  // youssef (mid-left)
    { x:  10, y: -2, r:  8 },  // yassin (mid-right)
  ];
  // Per-member clipPath for circular photo crop (added to existing svg-level defs)
  MEMBERS.forEach((m, i) => {
    const p = layout[i];
    const clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", `portrait-clip-${m.id}`);
    const clipC = document.createElementNS(NS, "circle");
    clipC.setAttribute("cx", p.x);
    clipC.setAttribute("cy", p.y);
    clipC.setAttribute("r", p.r);
    clip.appendChild(clipC);
    defs.appendChild(clip);
  });

  MEMBERS.forEach((m, i) => {
    const p = layout[i];
    // Color ring underneath
    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("class", "family-portrait-ring");
    ring.setAttribute("cx", p.x);
    ring.setAttribute("cy", p.y);
    ring.setAttribute("r", p.r);
    ring.setAttribute("fill", m.color);
    marker.appendChild(ring);

    // Image clipped to circle
    const img = document.createElementNS(NS, "image");
    img.setAttribute("class", "family-portrait");
    img.setAttribute("href", m.photo);
    img.setAttributeNS("http://www.w3.org/1999/xlink", "href", m.photo);
    img.setAttribute("x", p.x - p.r);
    img.setAttribute("y", p.y - p.r);
    img.setAttribute("width", p.r * 2);
    img.setAttribute("height", p.r * 2);
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    img.setAttribute("clip-path", `url(#portrait-clip-${m.id})`);
    marker.appendChild(img);

    // Thin outline ring on top
    const outline = document.createElementNS(NS, "circle");
    outline.setAttribute("class", "family-portrait-outline");
    outline.setAttribute("cx", p.x);
    outline.setAttribute("cy", p.y);
    outline.setAttribute("r", p.r);
    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", m.color);
    outline.setAttribute("stroke-width", "0.9");
    marker.appendChild(outline);
  });

  svg.appendChild(marker);
  scroller.appendChild(svg);

  // Auto-scroll to family position
  setTimeout(() => {
    const target = baseX - scroller.clientWidth / 2 + 80;
    scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, 250);
}

// ── Today pane logic ────────────────────────────────────────────────
function renderToday(data) {
  const root = document.getElementById("paneToday");
  if (!root) return;
  const phase = tripPhase();
  const family = loadFamily();

  // Phase-specific hero
  let heroPhase, heroCount, heroKicker;
  if (phase.phase === "pre") {
    heroKicker = "Pre-departure · packing the journey";
    heroPhase  = phase.days <= 7 ? "Take-off this week ✈️" : phase.days <= 30 ? "Take-off in under a month" : "Building the journey";
    heroCount  = `<b>${phase.days}</b> days · ${phase.hrs}h until take-off`;
  } else if (phase.phase === "trip") {
    const stop = STOPS[phase.currentDay - 1];
    heroKicker = `Day ${phase.currentDay} of 14 · ${stop?.title || ""}`;
    heroPhase  = `${stop?.emoji || ""} ${stop?.title || "Today's adventure"}`;
    heroCount  = `<b>${15 - phase.currentDay}</b> days remain`;
  } else {
    heroKicker = "Mission complete";
    heroPhase  = "Welcome home, family ✈️";
    heroCount  = "The memory begins";
  }

  // Most-anticipated day (most family hearts)
  let topDay = null, topCount = 0;
  for (let d = 1; d <= 14; d++) {
    const n = (family.hearts?.[d] || []).length;
    if (n > topCount) { topCount = n; topDay = d; }
  }

  // Most urgent booking (from research data)
  const items = data?.bookings?.items || [];
  const pending = items.filter((b) => {
    if (!b.deadlineIso) return true;
    return new Date(b.deadlineIso).getTime() > Date.now();
  });
  pending.sort((a, b) => {
    const aT = a.deadlineIso ? new Date(a.deadlineIso).getTime() : Infinity;
    const bT = b.deadlineIso ? new Date(b.deadlineIso).getTime() : Infinity;
    return aT - bT;
  });
  const nextBook = pending[0];

  // Family member with no wish yet (gentle nudge)
  const missingWish = MEMBERS.find((m) => !family.members?.[m.id]?.wish?.trim());

  // Mountain-silhouette SVG inline in the hero (Mutianyu-ish profile)
  const mountainSvg = `
    <svg class="today-hero__scene" viewBox="0 0 800 200" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <path d="M 0 200 L 0 130 L 60 100 L 110 140 L 180 80 L 240 120 L 310 60 L 380 110 L 460 50 L 540 100 L 620 70 L 700 120 L 800 90 L 800 200 Z"
            fill="rgba(237, 228, 208, 0.55)"/>
      <path d="M 0 200 L 0 165 L 80 145 L 160 155 L 250 130 L 330 150 L 420 120 L 510 145 L 600 130 L 690 155 L 800 140 L 800 200 Z"
            fill="rgba(237, 228, 208, 0.85)"/>
    </svg>
  `;

  root.innerHTML = `
    <div class="today-stack">
      <div class="today-hero">
        ${mountainSvg}
        <div class="today-hero__kicker">${escapeHtml(heroKicker)}</div>
        <h1 class="today-hero__phase">${escapeHtml(heroPhase)}</h1>
        <div class="today-hero__count">${heroCount}</div>
      </div>

      <div class="today-grid">
        ${nextBook ? `
          <div class="today-card is-booking">
            <span class="today-card__stamp">急</span>
            <div class="today-card__kicker">Next booking · ${nextBook.deadlineIso ? daysUntilLabel(nextBook.deadlineIso) : "no deadline"}</div>
            <h2 class="today-card__title">${escapeHtml(nextBook.title)}</h2>
            ${nextBook.tip ? `<div class="today-card__body">${escapeHtml(nextBook.tip)}</div>` : ""}
            <div class="today-card__meta">
              ${nextBook.city ? `<span><b>${escapeHtml(nextBook.city)}</b></span>` : ""}
              ${nextBook.cancellationWindow ? `<span>cancel: ${escapeHtml(nextBook.cancellationWindow)}</span>` : ""}
            </div>
            ${nextBook.officialUrl ? `<a class="today-card__cta" href="${escapeHtml(nextBook.officialUrl)}" target="_blank" rel="noopener">Open booking →</a>` : ""}
          </div>` : ""}

        ${topDay ? `
          <div class="today-card is-family">
            <span class="today-card__stamp">心</span>
            <div class="today-card__kicker">Family heart · most anticipated</div>
            <h2 class="today-card__title">Day ${topDay} · ${escapeHtml(STOPS[topDay - 1]?.title || "")}</h2>
            <div class="today-card__body">${topCount} of 5 family members hearted this day. See the heatmap for who.</div>
            <button class="today-card__cta" onclick="document.querySelector('[data-tab=family]').click()">View heatmap →</button>
          </div>` : `
          <div class="today-card is-family">
            <span class="today-card__stamp">心</span>
            <div class="today-card__kicker">Family heart · empty</div>
            <h2 class="today-card__title">No hearts yet</h2>
            <div class="today-card__body">Open "All Days" tab. Each day has 5 hearts (one per family member). Have everyone tap the day they're most excited about.</div>
            <button class="today-card__cta" onclick="document.querySelector('[data-tab=days]').click()">Browse days →</button>
          </div>`}

        ${missingWish ? `
          <div class="today-card is-wish">
            <span class="today-card__stamp">愿</span>
            <div class="today-card__kicker">A wish is missing</div>
            <h2 class="today-card__title">${escapeHtml(missingWish.ar)} hasn't shared yet</h2>
            <div class="today-card__body">Ask them: "What's the one thing you're most excited to see in China?"</div>
            <button class="today-card__cta" onclick="document.querySelector('[data-tab=family]').click()">Open Family →</button>
          </div>` : ""}

        <div class="today-card is-visa">
          <span class="today-card__stamp">签</span>
          <div class="today-card__kicker">Visa status</div>
          <h2 class="today-card__title">Application in progress</h2>
          <div class="today-card__body">Processing time ~6 working days. Check back in 5 days.</div>
        </div>
      </div>
    </div>
  `;
}

function daysUntilLabel(iso) {
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (d < 0) return `${-d}d overdue`;
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d <= 7) return `in ${d} days`;
  return `in ${Math.floor(d / 7)} weeks`;
}

// ── All Days pane (compact list, deep-link to classic for full detail) ──
function renderAllDays() {
  const root = document.getElementById("paneDays");
  if (!root) return;
  const items = STOPS.map((s) => `
    <div class="day-acc" data-day="${s.day}" data-city="${s.city}">
      <button class="day-acc__head" type="button">
        <div class="day-acc__num">${s.day}</div>
        <div>
          <div class="day-acc__title">${s.emoji} ${escapeHtml(s.title)}</div>
          <div class="day-acc__sub">${s.city.charAt(0).toUpperCase() + s.city.slice(1)} · Day ${s.day} of 14</div>
        </div>
        <div class="day-acc__chev">›</div>
      </button>
      <div class="day-acc__body">
        <div class="family-hearts" data-day="${s.day}" style="margin-bottom:.85rem">
          <span class="family-hearts__label">العيلة متحمسة لده؟</span>
          ${MEMBERS.map((m) => `<button class="family-heart" data-member="${m.id}" data-day="${s.day}" aria-label="${m.en} hearts day ${s.day}"><img src="${m.photo}" alt="${m.en}" loading="lazy"/></button>`).join("")}
        </div>
        <p style="margin:0 0 .5rem">Full details, photos, halal map, and walking routes are in the deep reference page.</p>
        <a class="today-card__cta" href="/index-classic.html#day-${s.day}" target="_blank" rel="noopener">Open Day ${s.day} in detail →</a>
      </div>
    </div>
  `).join("");
  root.innerHTML = `
    <div style="margin-bottom:1rem;font-size:12px;color:var(--spine-dim)">
      14 days · tap any day to expand summary, then "open in detail" for full content (photos, halal map, walking routes).
    </div>
    <div class="days-accordion">${items}</div>
  `;

  root.querySelectorAll(".day-acc__head").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
    });
  });

  // Apply current heart state to spine-rendered hearts (family-line.js
  // delegated-click handlers will continue to work for toggles)
  const family = loadFamily();
  root.querySelectorAll(".family-heart").forEach((btn) => {
    const dayN = btn.dataset.day;
    const id = btn.dataset.member;
    const list = family.hearts?.[dayN] || [];
    btn.classList.toggle("on", list.includes(id));
  });
}

// ── Bookings + Survival panes (link to /ops.html) ──────────────────
function renderBookings() {
  const root = document.getElementById("paneBookings");
  if (!root) return;
  root.innerHTML = `
    <div class="embed-pane">
      <h2 class="embed-pane__title">Booking Hub · 预订</h2>
      <p class="embed-pane__sub">5 cards · checklist · countdown deadlines · official links · auto-saves what's done</p>
      <a class="embed-pane__cta" href="/ops.html#bookingsSection">Open the Booking Checklist</a>
    </div>
  `;
}
function renderSurvival() {
  const root = document.getElementById("paneSurvival");
  if (!root) return;
  root.innerHTML = `
    <div class="embed-pane">
      <h2 class="embed-pane__title">Survival Kit · 应急</h2>
      <p class="embed-pane__sub">Connectivity · Payments · Transport · Halal food · Embassy · Phrasebook</p>
      <a class="embed-pane__cta" href="/ops.html#survivalSection">Open the Survival Kit</a>
      <p style="margin-top:1.75rem;font-size:11.5px;color:var(--ink-mid);opacity:.7;font-style:italic">Best installed as a PWA from the Ops Hub for offline use in China.</p>
    </div>
  `;
}
function renderShopping() {
  const root = document.getElementById("paneShopping");
  if (!root) return;
  // Compute progress from localStorage (synced with ops.js)
  let done = 0, total = 18;
  try {
    const raw = localStorage.getItem("chinatrip.ops.shopping.done.v1");
    if (raw) done = JSON.parse(raw).length || 0;
  } catch {}
  const pct = total ? Math.round((done / total) * 100) : 0;
  root.innerHTML = `
    <div class="embed-pane">
      <h2 class="embed-pane__title">Shopping Checklist · 购物清单</h2>
      <p class="embed-pane__sub">
        <strong>${done} / ${total}</strong> items checked · ${pct}% done
        <br/>Tech · Family · Gifts · Pre-departure prep
      </p>
      <a class="embed-pane__cta" href="/ops.html#shoppingSection">Open the Shopping List</a>
      <p style="margin-top:1.5rem;font-size:11.5px;color:var(--ink-mid);opacity:.75;line-height:1.6;">
        ⭐ Priority item: <strong>GEEKOM GT1 Mega Mini PC</strong> — order via JD.com Day 1 in Beijing for hotel delivery. Saves ~$500–800 vs Egypt.
      </p>
    </div>
  `;
}

// ── Family pane (just the heatmap from family-line.js) ─────────────
function renderFamily() {
  const root = document.getElementById("paneFamily");
  if (!root) return;
  // Move the legacy family-heatmap section into here on first render
  const legacy = document.querySelector(".family-heatmap");
  if (legacy && !root.contains(legacy)) {
    root.appendChild(legacy);
  }
  // Also surface the family cards
  const cardsLegacy = document.querySelector(".family-line");
  if (cardsLegacy && !root.contains(cardsLegacy)) {
    root.insertBefore(cardsLegacy, root.firstChild);
  }
}

// ── Tabs ───────────────────────────────────────────────────────────
function wireTabs() {
  const tabs = document.querySelectorAll(".spine-tab");
  const panes = document.querySelectorAll(".spine-pane");
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      const target = t.dataset.tab;
      tabs.forEach((x) => x.classList.toggle("active", x === t));
      panes.forEach((p) => p.classList.toggle("active", p.dataset.tab === target));
      // URL hash for deep-link
      history.replaceState({}, "", `#${target}`);
    });
  });

  // Restore from hash
  const initial = location.hash.replace("#", "") || "today";
  const start = document.querySelector(`.spine-tab[data-tab="${initial}"]`);
  if (start) start.click();
}

// ── Open day (called by path stop click) ───────────────────────────
function openDay(d) {
  const tab = document.querySelector('[data-tab="days"]');
  if (tab) tab.click();
  setTimeout(() => {
    const acc = document.querySelector(`.day-acc[data-day="${d}"]`);
    if (acc) {
      acc.classList.add("open");
      acc.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 300);
}

// ── Countdown in hero ──────────────────────────────────────────────
function tickHeroCountdown() {
  const small = document.getElementById("spineHeroCount");
  const big = document.getElementById("spineHeroBig");
  if (!small) return;
  const phase = tripPhase();
  if (phase.phase === "pre") {
    if (big) big.textContent = `${phase.days}d`;
    small.textContent = `until take-off`;
  } else if (phase.phase === "trip") {
    if (big) big.textContent = `D${phase.currentDay}`;
    small.textContent = `of 14 · live`;
  } else {
    if (big) big.textContent = "✓";
    small.textContent = `home · 家`;
  }
}

// ── Helpers ────────────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

// ── Boot ───────────────────────────────────────────────────────────
async function boot() {
  // CRITICAL: wire tabs FIRST so even if a render fails the user can navigate
  try { wireTabs(); } catch (e) { console.error("[spine] wireTabs", e); }
  try { tickHeroCountdown(); } catch (e) { console.error("[spine] countdown", e); }
  try {
    const scroller = document.getElementById("pathScroller");
    if (scroller) renderPath(scroller);
  } catch (e) { console.error("[spine] renderPath", e); }

  let data = null;
  try {
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (res.ok) data = await res.json();
  } catch (e) { console.warn("[spine] data fetch", e?.message); }

  // Wrap each render so one failing pane doesn't kill the others
  try { renderToday(data); }    catch (e) { console.error("[spine] renderToday", e); }
  try { renderAllDays(); }      catch (e) { console.error("[spine] renderAllDays", e); }
  try { renderBookings(); }     catch (e) { console.error("[spine] renderBookings", e); }
  try { renderSurvival(); }     catch (e) { console.error("[spine] renderSurvival", e); }
  try { renderShopping(); }     catch (e) { console.error("[spine] renderShopping", e); }
  try { renderFamily(); }       catch (e) { console.error("[spine] renderFamily", e); }

  setInterval(tickHeroCountdown, 60_000);

  // Listen for family heart toggles (from legacy family-line.js) and re-render Today
  try {
    const observer = new MutationObserver(() => { try { renderToday(data); } catch {} });
    document.querySelectorAll(".family-hearts").forEach((el) =>
      observer.observe(el, { attributes: true, subtree: true, attributeFilter: ["class"] })
    );
  } catch {}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

})();
