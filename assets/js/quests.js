/* ============================================================
   China Trip 2026 — QUESTS + FAMILY MODE v8.0
   - Builds Arabic gamified challenge section with rewards
   - Translates hero + city + day titles into Egyptian Arabic
   - localStorage persistence + confetti celebration
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'chinatrip-quests-v1';

  /* ─────────────────────────────────────────────
     PLAYERS — Family members
     ───────────────────────────────────────────── */
  const PLAYERS = [
    { key: 'fares',   name: 'فارس',   age: '16 سنة',  emoji: '🦁' },
    { key: 'youssef', name: 'يوسف',   age: '12 سنة',  emoji: '⚡️' },
    { key: 'yassin',  name: 'ياسين',  age: '12 سنة',  emoji: '🚀' },
    { key: 'dina',    name: 'دينا',   age: 'الماما',  emoji: '🌸' },
    { key: 'mfz',     name: 'بابا',   age: 'الكابتن', emoji: '🧭' },
  ];

  /* ─────────────────────────────────────────────
     QUESTS — organized by city
     points: 5 = easy, 10 = medium, 20 = hard, 50 = epic
     owner: who can claim it (or 'all' = any family member)
     ───────────────────────────────────────────── */
  const QUESTS = [
    // ─── BEIJING (Days 2–5) ───
    {
      group: 'beijing',
      groupTitle: 'تحديات بكين 🏯',
      groupIcon: '🏯',
      list: [
        { id: 'b5', day: 2, when: 'بعد الوصول · ~17:00', icon: '🗣️', title: 'احفظ 5 كلمات صيني', desc: 'نِي هاو · شيي شيي · جايجيين · بو هاو · واي تشي يي', owner: 'all', points: 10, prize: '¥30 bonus' },
        { id: 'b4', day: 2, when: 'العشا · 19:30', icon: '🥢', title: 'اتعلّم تأكل بالعيدان', desc: 'كل اللي يكمّل وجبة كاملة من غير ملعقة ولا شوكة', owner: 'all', points: 15, prize: '🍰 dessert إضافي' },
        { id: 'b8', day: 3, when: 'الفجر · 04:30', icon: '🌅', title: 'صحى بدري للـ Tiananmen flag raising', desc: 'علم الصين بيتعلى وقت طلوع الشمس — كل واحد يصحى يكسب', owner: 'all', points: 25, prize: '¥40 + بريكفاست استثنائي' },
        { id: 'b1', day: 3, when: 'الـ Forbidden City · 09:00', icon: '🏯', title: 'عدّ التنانين في القصر الإمبراطوري', desc: 'لازم تلاقي على الأقل 9 تنانين منحوتة — صوّر كل واحد!', owner: 'all', points: 10, prize: '🍦 اختار طعم الآيس كريم بعد العشا' },
        { id: 'b2', day: 4, when: 'سور الصين · 10:00', icon: '🧱', title: 'اطلع 1000 درجة على سور الصين', desc: 'كل اللي يكمّل من البرج 1 لحد البرج 5 من غير ما يقعد ياخد نَفَس', owner: 'all', points: 50, prize: '¥50 + وسام البطل' },
        { id: 'b6', day: 4, when: 'سور الصين · 11:00', icon: '📸', title: 'صورة العيلة كاملة على سور الصين', desc: 'خمسة، مع الجبال ورا — اللي يحدد الـ angle المثالي يكسب', owner: 'mfz', points: 10, prize: 'اختيار الـ playlist في العربية' },
        { id: 'b3', day: 4, when: 'النزول · 13:30', icon: '🛷', title: 'انزل بالـ Toboggan لحد تحت', desc: 'الاسلايد الفولاذي من فوق سور الصين — مين بدون فرامل؟', owner: 'all', points: 20, prize: '🎬 تختار فيلم العائلة الليلة' },
        { id: 'b7', day: 5, when: 'الـ Hutongs · 09:00', icon: '🍵', title: 'دينا تشتري شاي صيني أصلي', desc: 'تختار نوع، تساوم بالإشارة، وتاخدها بكاكتها الأصلية', owner: 'dina', points: 20, prize: 'يوم spa في Peninsula Shanghai' },
      ],
    },

    // ─── XI'AN (Days 6–9) ───
    {
      group: 'xian',
      groupTitle: 'تحديات شيآن 🗿',
      groupIcon: '🗿',
      list: [
        { id: 'x3', day: 7, when: 'الغدا · 13:00', icon: '🍜', title: 'كول طبق biangbiang noodles كامل', desc: 'النودلز الصينية الخاصة بشيآن — خد المغامرة وكول كله', owner: 'all', points: 15, prize: 'تختار breakfast بكره' },
        { id: 'x1', day: 7, when: 'التراكوتا · 09:30', icon: '🗿', title: 'عدّ 100 جندي طين على الأقل', desc: 'الـ Terracotta Warriors فيها 6000 — مين يقدر يميز 100 وش مختلف؟', owner: 'all', points: 30, prize: '¥50 + اختيار مطعم بكره' },
        { id: 'x4', day: 7, when: 'الموقع · 11:00', icon: '👑', title: 'احفظ اسم Emperor Qin Shi Huang', desc: 'المؤسس اللي بنا التراكوتا — قول الاسم 3 مرات قدام بابا', owner: 'all', points: 10, prize: '¥20' },
        { id: 'x6', day: 8, when: 'الباجودا · 09:30', icon: '🏯', title: 'اطلع لفوق الـ Big Wild Goose Pagoda', desc: '7 طبقات فوق بعض — كل اللي يطلع لفوق فوق يكسب', owner: 'all', points: 20, prize: '🍰 dessert إضافي' },
        { id: 'x7', day: 8, when: 'Tang Show · 19:30', icon: '💃', title: 'حفظت رقصة من Tang Dynasty Show', desc: 'أول واحد يقلد حركة من الراقصين بعد العرض', owner: 'all', points: 25, prize: 'ساعة سهر زيادة الليلة' },
        { id: 'x2', day: 9, when: 'السور · 10:00', icon: '🚲', title: 'لفّة كاملة على سور شيآن بالعجلة', desc: '14 كيلو متر فوق السور القديم — مين أول واحد يخلص اللفة؟', owner: 'all', points: 50, prize: '¥80 + وسام Champion' },
        { id: 'x8', day: 9, when: 'Muslim Quarter · 16:30', icon: '🏮', title: 'صورة في الـ Muslim Quarter بالليل', desc: 'الفوانيس والنور والجو — أحلى صورة عيلة', owner: 'mfz', points: 10, prize: 'تختار dessert بعد العشا' },
        { id: 'x5', day: 9, when: 'القطار · 19:30', icon: '🚆', title: 'ركبت قطار النوم Soft Sleeper', desc: 'قطار الـ شيآن → شنغهاي الليلي — أول مرة تنام في قطار', owner: 'all', points: 40, prize: '¥40 + جايزة خاصة في شنغهاي' },
      ],
    },

    // ─── SHANGHAI / DISNEY (Days 10–13) ───
    {
      group: 'shanghai',
      groupTitle: 'تحديات شنغهاي وديزني 🏰',
      groupIcon: '🏰',
      list: [
        { id: 's1', day: 10, when: 'TRON · 10:30', icon: '🚀', title: 'اركب TRON Lightcycle 3 مرات', desc: 'أحسن لعبة في ديزني شنغهاي — التحدي: 3 مرات في يوم واحد', owner: 'all', points: 50, prize: '¥100 + وسام TRON Champion' },
        { id: 's3', day: 10, when: 'Pirates · 14:00', icon: '🏴‍☠️', title: 'اركب Pirates of the Caribbean مرتين', desc: 'أحسن Pirates ride في العالم — متستحملش تركب مرة واحدة', owner: 'all', points: 25, prize: '¥40' },
        { id: 's6', day: 10, when: 'Adventure Isle · 17:00', icon: '🌊', title: 'ركبت Roaring Rapids واتبللت', desc: 'الـ water ride — لازم تطلع منها مبلولة عشان التحدي', owner: 'all', points: 20, prize: '¥30 + change of clothes' },
        { id: 's2', day: 11, when: 'Adventure Isle · 09:30', icon: '🐻', title: 'لقيت LinaBell وصورت معاها', desc: 'صديقة Duffy الجديدة — الطابور 2 ساعة، اللي يستحمل يكسب', owner: 'all', points: 35, prize: 'بدج خاص + اختيار العشا' },
        { id: 's4', day: 11, when: 'الفايرووركس · 20:30', icon: '🎆', title: 'شفت ILLUMINATE fireworks لآخره', desc: 'العرض الليلي على القلعة — لازم تعدي السنة بدون نوم 🎆', owner: 'all', points: 20, prize: 'ساعة سهر زيادة + popcorn' },
        { id: 's5', day: 11, when: 'طول اليوم', icon: '📸', title: 'صور مع 5 شخصيات Disney', desc: 'Mickey, Minnie, Donald, Spider-Man, Snow White — أو أي 5', owner: 'all', points: 30, prize: '🛍️ اختار الـ souvenir الكبير' },
        { id: 's7', day: 12, when: 'Zootopia · 14:30', icon: '🦊', title: 'لعبت في Zootopia: Hot Pursuit', desc: 'اللعبة الجديدة 2024 — Shanghai exclusive، مفيش في أي ديزني تاني', owner: 'all', points: 25, prize: '¥40' },
        { id: 's10', day: 12, when: 'القلعة · 12:00', icon: '🏰', title: 'صورة العيلة قدام ديزني castle', desc: 'القلعة الأكبر في أي ديزني في العالم — كلكم لابسين ميكي ears', owner: 'mfz', points: 30, prize: 'وسام Family of the Year' },
        { id: 's8', day: 12, when: 'الـ Bund · 19:00', icon: '🌉', title: 'مشيت على الـ Bund وصورت Pudong', desc: 'الـ skyline من أحسن منظر في شنغهاي', owner: 'all', points: 15, prize: 'تختار restaurant آخر يوم' },
        { id: 's9', day: 13, when: 'Yu Garden · 11:30', icon: '🥟', title: 'دينا تأكل xiaolongbao في Yu Garden', desc: 'الـ soup dumplings — من غير ما تحرق نفسك بالحساء الجوّاني', owner: 'dina', points: 20, prize: 'spa session في Peninsula' },
      ],
    },

    // ─── BONUS (any time) ───
    {
      group: 'bonus',
      groupTitle: 'تحديات الكنز 💎 (في أي وقت)',
      groupIcon: '💎',
      list: [
        { id: 'g1', day: null, when: 'أي يوم', icon: '📵', title: 'بابا بدون موبايل لـ 6 ساعات', desc: 'يوم واحد بس — مفيش screen، مفيش social', owner: 'mfz', points: 50, prize: 'بابا يفوز ¥200 شخصياً 😂' },
        { id: 'g2', day: null, when: 'أي وقت', icon: '🤝', title: 'اعمل صداقة مع طفل صيني', desc: 'سلام، بدّل صورة، اتفقوا تتراسلوا — international friendship', owner: 'all', points: 30, prize: '¥50 + هدية لصاحبه الجديد' },
        { id: 'g3', day: null, when: 'طول الرحلة', icon: '🍱', title: 'جربت 5 أكلات صينية مختلفة', desc: 'مش كل واحدة لازم تعجبك — بس لازم تجرب', owner: 'all', points: 20, prize: 'تختار restaurant غربي بكره' },
        { id: 'g4', day: null, when: 'في أي شارع خطاطين', icon: '✍️', title: 'اكتب اسمك بالحروف الصينية', desc: 'في خطاط شارع — pictograph صيني أصلي', owner: 'all', points: 15, prize: 'كرت بريدي للأصدقاء في مصر' },
        { id: 'g5', day: null, when: 'في أي مدينة', icon: '🐼', title: 'صورة مع تمثال باندا', desc: 'الباندا رمز الصين', owner: 'all', points: 5, prize: '¥10' },
        { id: 'g6', day: null, when: 'بالليل', icon: '🎤', title: 'غنيت في Karaoke مع العيلة', desc: 'الصينيين عندهم KTV في كل مكان — أغنية واحدة كفاية', owner: 'all', points: 25, prize: 'سهرة karaoke لـ ساعتين' },
      ],
    },
  ];

  /* ─────────────────────────────────────────────
     STATE
     ───────────────────────────────────────────── */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { done: {}, claimedBy: {}, points: {} };
    } catch { return { done: {}, claimedBy: {}, points: {} }; }
  }
  function saveState(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }
  let state = loadState();

  function calcPoints() {
    const totals = {};
    PLAYERS.forEach(p => totals[p.key] = 0);
    Object.entries(state.claimedBy).forEach(([qid, who]) => {
      const q = findQuest(qid);
      if (q && totals[who] !== undefined) totals[who] += q.points;
    });
    return totals;
  }
  function findQuest(id) {
    for (const g of QUESTS) {
      const q = g.list.find(q => q.id === id);
      if (q) return q;
    }
    return null;
  }

  /* ─────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────── */
  // Day metadata (label + sub) — for rendering day groups
  const DAY_META = {
    1:  { label: 'اليوم 1 · الخميس 18 يونيو',  sub: '✈️ من القاهرة لدبي' },
    2:  { label: 'اليوم 2 · الجمعة 19 يونيو',  sub: '🏙️ وصلنا بكين' },
    3:  { label: 'اليوم 3 · السبت 20 يونيو',   sub: '🏯 يوم الأباطرة في الـ Forbidden City' },
    4:  { label: 'اليوم 4 · الأحد 21 يونيو',   sub: '🧱 سور الصين العظيم — Mutianyu' },
    5:  { label: 'اليوم 5 · الاتنين 22 يونيو', sub: '🏘️ الـ Hutongs والقصر الصيفي' },
    6:  { label: 'اليوم 6 · التلات 23 يونيو',  sub: '🚄 من بكين لشيآن بقطار 350 كم/س' },
    7:  { label: 'اليوم 7 · الأربع 24 يونيو',  sub: '🗿 جنود الطين 6000 — التراكوتا' },
    8:  { label: 'اليوم 8 · الخميس 25 يونيو',  sub: '🏯 الباجودا والـ Tang Dynasty Show' },
    9:  { label: 'اليوم 9 · الجمعة 26 يونيو',  sub: '🛏️ السور + قطار النوم لشنغهاي' },
    10: { label: 'اليوم 10 · السبت 27 يونيو',  sub: '🏰 وصلنا ديزني — يوم TRON' },
    11: { label: 'اليوم 11 · الأحد 28 يونيو',  sub: '🎢 ديزني 2 — Pirates + Adventure Isle' },
    12: { label: 'اليوم 12 · الاتنين 29 يونيو',sub: '🎆 ديزني 3 + النقلة لـ Bund' },
    13: { label: 'اليوم 13 · التلات 30 يونيو', sub: '🌃 شنغهاي الأخير — Bund + Pudong' },
    14: { label: 'اليوم 14 · الأربع 1 يوليو',  sub: '🏠 رجوع البيت' },
  };

  function questsByDay() {
    const map = {};
    const bonus = [];
    QUESTS.forEach(g => g.list.forEach(q => {
      if (q.day == null || q.day === 'bonus') {
        bonus.push(q);
      } else {
        if (!map[q.day]) map[q.day] = [];
        map[q.day].push(q);
      }
    }));
    return { byDay: map, bonus };
  }

  function renderQuestCard(q) {
    return `
      <div class="quest-card ${state.done[q.id] ? 'done' : ''}" data-quest="${q.id}" data-owner="${q.owner}">
        <div class="quest-card__head">
          <div class="quest-card__icon">${q.icon}</div>
          <div class="quest-card__meta">
            ${q.when ? `<span class="quest-card__when">⏰ ${q.when}</span>` : ''}
            <span class="quest-card__owner">${ownerLabel(q.owner)} · ${q.points}pt</span>
          </div>
        </div>
        <h4 class="quest-card__title">${q.title}</h4>
        <p class="quest-card__desc">${q.desc}</p>
        <div class="quest-card__prize">${q.prize}</div>
        <button class="quest-btn" data-action="complete" data-id="${q.id}">
          ${state.done[q.id] ? `خلصت! (${PLAYERS.find(p=>p.key===state.claimedBy[q.id])?.name || ''})` : 'خلصته! اكسب الجايزة'}
        </button>
      </div>
    `;
  }

  function render() {
    const totals = calcPoints();
    const maxPts = Math.max(...Object.values(totals), 1);
    const { byDay, bonus } = questsByDay();

    // Build day-grouped HTML
    let daysHtml = '';
    for (let n = 1; n <= 14; n++) {
      const list = byDay[n];
      if (!list || !list.length) continue;
      const meta = DAY_META[n] || { label: `اليوم ${n}`, sub: '' };
      const totalPts = list.reduce((s, q) => s + q.points, 0);
      const earnedPts = list.reduce((s, q) => s + (state.done[q.id] ? q.points : 0), 0);
      daysHtml += `
        <div class="quest-day" data-day="${n}">
          <div class="quest-day__head">
            <div class="quest-day__num">${n}</div>
            <div class="quest-day__info">
              <h3 class="quest-day__label">${meta.label}</h3>
              <p class="quest-day__sub">${meta.sub}</p>
            </div>
            <span class="quest-day__progress">${earnedPts}/${totalPts}</span>
          </div>
          <div class="quest-grid">
            ${list.map(renderQuestCard).join('')}
          </div>
        </div>
      `;
    }
    // Bonus
    if (bonus.length) {
      const totalPts = bonus.reduce((s, q) => s + q.points, 0);
      const earnedPts = bonus.reduce((s, q) => s + (state.done[q.id] ? q.points : 0), 0);
      daysHtml += `
        <div class="quest-day quest-day--bonus">
          <div class="quest-day__head">
            <div class="quest-day__num">★</div>
            <div class="quest-day__info">
              <h3 class="quest-day__label">تحديات الكنز · في أي وقت</h3>
              <p class="quest-day__sub">💎 جوايز إضافية، أعمل أي واحدة في أي يوم</p>
            </div>
            <span class="quest-day__progress">${earnedPts}/${totalPts}</span>
          </div>
          <div class="quest-grid">
            ${bonus.map(renderQuestCard).join('')}
          </div>
        </div>
      `;
    }

    let html = `
      <div class="quests__inner">
        <div class="quests__head">
          <span class="quests__eyebrow">🎮 وضع العائلة · Family Quest Mode</span>
          <h2 class="quests__title">المسابقة الكبيرة!</h2>
          <p class="quests__sub">التحديات منظمة بالأيام، كل تحدي ليه وقته. خلّص تحدي تكسب جايزة فورية!</p>
        </div>

        <div class="leaderboard">
          <h3 class="leaderboard__title">لوحة الأبطال</h3>
          <div class="players">
            ${PLAYERS.map(p => `
              <div class="player ${totals[p.key] === maxPts && maxPts > 0 ? 'leader' : ''}" data-key="${p.key}">
                <div class="player__avatar">${p.emoji}</div>
                <div class="player__name">${p.name}</div>
                <div class="player__age">${p.age}</div>
                <div class="player__points" data-points="${p.key}">${totals[p.key]}</div>
                <div class="player__label">نقطة</div>
              </div>
            `).join('')}
          </div>
        </div>

        ${daysHtml}

        <button class="quests__reset">إعادة كل التحديات (Reset)</button>
      </div>
    `;

    const root = document.getElementById('quests');
    if (root) root.innerHTML = html;
    // Re-render the inline per-day quest cards too (so checked state syncs)
    if (typeof injectInlineQuestsPerDay === 'function') injectInlineQuestsPerDay();
  }

  function ownerLabel(o) {
    if (o === 'all') return 'الكل';
    const p = PLAYERS.find(p => p.key === o);
    return p ? p.name : o;
  }

  /* ─────────────────────────────────────────────
     COMPLETION FLOW — pick player → record → celebrate
     ───────────────────────────────────────────── */
  function completeQuest(id) {
    const q = findQuest(id);
    if (!q || state.done[id]) return;

    // Pick who claimed it
    const owner = q.owner;
    let eligible = owner === 'all' ? PLAYERS : PLAYERS.filter(p => p.key === owner);

    let picked;
    if (eligible.length === 1) {
      picked = eligible[0];
    } else {
      // Show picker
      const choice = prompt(
        `مين خلّص التحدي؟\n${eligible.map((p, i) => `${i+1}. ${p.name} ${p.emoji}`).join('\n')}\n\nاكتب رقم (1-${eligible.length}):`
      );
      const idx = parseInt(choice, 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= eligible.length) return;
      picked = eligible[idx];
    }

    state.done[id] = true;
    state.claimedBy[id] = picked.key;
    saveState(state);

    showPrize(q, picked);
    confettiBlast();
    render();

    // Bump animation on player
    setTimeout(() => {
      const playerEl = document.querySelector(`.player[data-key="${picked.key}"]`);
      if (playerEl) {
        playerEl.classList.add('bumped');
        setTimeout(() => playerEl.classList.remove('bumped'), 700);
      }
    }, 100);
  }

  function showPrize(quest, player) {
    let pop = document.getElementById('prizePopup');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'prizePopup';
      pop.className = 'prize-popup';
      document.body.appendChild(pop);
    }
    pop.innerHTML = `
      <div class="prize-popup__card">
        <div class="prize-popup__icon">${quest.icon}</div>
        <h3 class="prize-popup__title">مبروك ${player.name}! ${player.emoji}</h3>
        <p class="prize-popup__sub">${quest.title}</p>
        <div class="prize-popup__prize">${quest.prize}</div>
        <p class="prize-popup__sub" style="font-size:.8rem;opacity:.7;">+ ${quest.points} نقطة في لوحة الأبطال</p>
        <button class="prize-popup__close">يلا نكمّل!</button>
      </div>
    `;
    pop.classList.add('show');
    pop.querySelector('.prize-popup__close').addEventListener('click', () => pop.classList.remove('show'));
    pop.addEventListener('click', (e) => { if (e.target === pop) pop.classList.remove('show'); });
  }

  function confettiBlast() {
    const colors = ['#ff5e3a', '#f5b94a', '#4ec78f', '#b48bff', '#ff5e8a', '#ffffff'];
    const N = 60;
    for (let i = 0; i < N; i++) {
      const c = document.createElement('span');
      c.className = 'q-confetti';
      c.style.background = colors[i % colors.length];
      c.style.left = (50 + (Math.random() - 0.5) * 60) + 'vw';
      c.style.top = '40vh';
      const dx = (Math.random() - 0.5) * 800;
      const dy = -(200 + Math.random() * 400);
      c.style.transform = 'translate(0,0) rotate(0)';
      c.style.transition = 'transform 1.6s cubic-bezier(.2,.7,.2,1), opacity 1.6s ease';
      document.body.appendChild(c);
      requestAnimationFrame(() => {
        c.style.transform = `translate(${dx}px, ${dy + 600}px) rotate(${Math.random() * 720}deg)`;
        c.style.opacity = '0';
      });
      setTimeout(() => c.remove(), 1700);
    }
  }

  /* ─────────────────────────────────────────────
     EVENT WIRING
     ───────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quest-btn[data-action="complete"]');
    if (btn && !btn.closest('.quest-card.done')) {
      completeQuest(btn.dataset.id);
      return;
    }
    if (e.target.closest('.quests__reset')) {
      if (confirm('متأكد إنك عاوز تعيد كل التحديات؟ الكل هيرجع صفر!')) {
        state = { done: {}, claimedBy: {}, points: {} };
        saveState(state);
        render();
      }
    }
  });

  /* ─────────────────────────────────────────────
     ARABIC TEXT SWAPS — translate visible UI
     ───────────────────────────────────────────── */
  function arabicizeUI() {
    // Hero
    const heroTitle = document.querySelector('.site-header__title');
    if (heroTitle) {
      heroTitle.innerHTML = 'مغامرة العيلة في الصين';
      heroTitle.setAttribute('lang', 'ar');
      heroTitle.setAttribute('dir', 'rtl');
    }

    const heroSubs = document.querySelectorAll('.site-header__sub');
    if (heroSubs[0]) heroSubs[0].innerHTML = 'عيلة الزيات · 5 مغامرين · 14 يوم';
    if (heroSubs[1]) heroSubs[1].innerHTML = 'من 18 يونيو لـ 1 يوليو 2026';
    if (heroSubs[2]) heroSubs[2].innerHTML = '<strong>بكين · شيآن · شنغهاي · ديزني لاند</strong>';
    heroSubs.forEach(el => { el.setAttribute('lang', 'ar'); el.setAttribute('dir', 'rtl'); });

    // City compass
    const cityRewrites = {
      'beijing': { name: 'بكين', dates: '19 → 23 يونيو · 4 ليالي', zh: '北京 · العاصمة الإمبراطورية' },
      'xian':    { name: 'شيآن', dates: '23 → 26 يونيو · 3 ليالي', zh: '西安 · العاصمة القديمة' },
      'shanghai':{ name: 'شنغهاي', dates: '27 يونيو → 1 يوليو · 4 ليالي', zh: '上海 · المدينة الحديثة' },
    };
    Object.entries(cityRewrites).forEach(([key, txt]) => {
      const card = document.querySelector(`.city-card[data-city="${key}"]`);
      if (!card) return;
      const name = card.querySelector('.city-card__name'); if (name) name.textContent = txt.name;
      const dates = card.querySelector('.city-card__dates'); if (dates) dates.textContent = txt.dates;
      const zh = card.querySelector('.city-card__zh'); if (zh) zh.textContent = txt.zh;
      const cta = card.querySelector('.city-card__cta'); if (cta) cta.textContent = 'يلا نشوف اليوميات';
      card.setAttribute('dir', 'rtl');
      card.setAttribute('lang', 'ar');
    });

    // Cities section header
    const citiesTitle = document.querySelector('.cities-section__title');
    if (citiesTitle) { citiesTitle.textContent = 'تلات مدن، تلات شخصيات'; citiesTitle.setAttribute('dir','rtl'); citiesTitle.setAttribute('lang','ar'); }
    const citiesSub = document.querySelector('.cities-section__sub');
    if (citiesSub) { citiesSub.textContent = 'دوس على المدينة عشان تروح يومياتها فوراً'; citiesSub.setAttribute('dir','rtl'); citiesSub.setAttribute('lang','ar'); }

    // Events section header
    const evEyebrow = document.querySelector('.events-section__eyebrow');
    if (evEyebrow) { evEyebrow.textContent = 'بيحصل وقت ما إنتم هناك'; evEyebrow.setAttribute('dir','rtl'); evEyebrow.setAttribute('lang','ar'); }
    const evTitle = document.querySelector('.events-section__title');
    if (evTitle) { evTitle.textContent = 'الدنيا متحركة في نفس وقتكم'; evTitle.setAttribute('dir','rtl'); evTitle.setAttribute('lang','ar'); }
    const evSub = document.querySelector('.events-section__sub');
    if (evSub) { evSub.textContent = 'مهرجانات، عروض، رياضة، ومعارض كلها بتحصل في أيامكم — فرص ميتفوّتش'; evSub.setAttribute('dir','rtl'); evSub.setAttribute('lang','ar'); }

    // Route map title
    const rmTitle = document.querySelector('.route-map__title');
    if (rmTitle) { rmTitle.textContent = '8,124 كيلو · عيلة واحدة · تلات مدن'; rmTitle.setAttribute('dir','rtl'); rmTitle.setAttribute('lang','ar'); }
    const rmSub = document.querySelector('.route-map__subtitle');
    if (rmSub) { rmSub.textContent = 'الرحلة · The Journey'; }

    // Day titles — fun Egyptian Arabic versions
    const dayTitles = {
      1:  '✈️ شد الحيل! من القاهرة لدبي',
      2:  '🏙️ وصلنا بكين! أول ضربة من الحضارة',
      3:  '🏯 يوم الأباطرة في الـ Forbidden City',
      4:  '🧱 سور الصين العظيم — توبوغان النزول!',
      5:  '🏘️ لفّة الـ Hutongs والقصر الصيفي',
      6:  '🚄 من بكين لشيآن — قطار 350 كم/س',
      7:  '🗿 جنود الطين 6000 — لقاء الإمبراطور',
      8:  '🏯 الباجودا والـ Tang Dynasty Show',
      9:  '🛏️ يوم على السور + قطار النوم لشنغهاي',
      10: '🏰 وصلنا ديزني! يوم TRON',
      11: '🎢 ديزني يوم 2 — Pirates + Adventure Isle',
      12: '🎆 ديزني يوم 3 + النقلة لـ The Bund',
      13: '🌃 شنغهاي الأخير — Bund + Pudong',
      14: '🏠 رجوع البيت — Cairo، نشوفك تاني!',
    };
    Object.entries(dayTitles).forEach(([day, title]) => {
      const t = document.querySelector(`.day-section[data-day="${day}"] .day-title`);
      if (t) { t.textContent = title; t.setAttribute('dir','rtl'); t.setAttribute('lang','ar'); }
    });

    // Day dates → Arabic dates
    const arDates = {
      1: 'الخميس · 18 يونيو 2026',
      2: 'الجمعة · 19 يونيو 2026',
      3: 'السبت · 20 يونيو 2026',
      4: 'الأحد · 21 يونيو 2026',
      5: 'الاتنين · 22 يونيو 2026',
      6: 'التلات · 23 يونيو 2026',
      7: 'الأربع · 24 يونيو 2026',
      8: 'الخميس · 25 يونيو 2026',
      9: 'الجمعة · 26 يونيو 2026',
      10:'السبت · 27 يونيو 2026',
      11:'الأحد · 28 يونيو 2026',
      12:'الاتنين · 29 يونيو 2026',
      13:'التلات · 30 يونيو 2026',
      14:'الأربع · 1 يوليو 2026',
    };
    Object.entries(arDates).forEach(([day, txt]) => {
      const d = document.querySelector(`.day-section[data-day="${day}"] .day-date`);
      if (d) { d.textContent = txt; d.setAttribute('dir','rtl'); d.setAttribute('lang','ar'); }
    });

    // Mobile tab labels → Arabic
    const tabRewrites = { 'top': 'البيت', 'beijing': 'بكين', 'xian': 'شيآن', 'shanghai': 'ديزني', 'extras': 'الخطة' };
    Object.entries(tabRewrites).forEach(([target, txt]) => {
      const lbl = document.querySelector(`.mobile-tab[data-target="${target}"] .mobile-tab__label`);
      if (lbl) lbl.textContent = txt;
    });

    // ===== TIMELINE ITEMS — full Arabic for all 14 days =====
    const TIMELINE_AR = {
      1: [
        ['20:05', 'EK 924 يقلع من القاهرة (CAI · Terminal 2) — Emirates A380'],
        ['00:40', 'وصلنا دبي (DXB · Terminal 3) — ترانزيت ~3 ساعات و10 دقايق'],
        ['~',     'ريلاكس في صالة Emirates'],
      ],
      2: [
        ['03:50', 'EK 306 يقلع من دبي (DXB · Terminal 3) — Boeing 777-300ER'],
        ['15:25', 'هبوط في بكين (PEK)'],
        ['17:00', 'الـ Check-in في فندق <strong>The Imperial Mansion · Marriott</strong>'],
        ['19:30', 'العشا في <strong>Capital M</strong> — أوروبي مودرن، بلكونة بإطلالة على Tiananmen'],
      ],
      3: [
        ['09:00', 'القصر الإمبراطوري (Forbidden City) — دخول من بوابة Meridian'],
        ['12:00', 'لفّة في ميدان Tiananmen'],
        ['13:00', 'الغدا: <strong>Element Fresh</strong> — سلطات وسندويتشات وباستا'],
        ['14:00', 'حديقة Jingshan — منظر بانورامي للأسطح الذهبية'],
        ['16:30', 'ريلاكس في الفندق'],
        ['19:00', 'العشا: <strong>Mio</strong> — مطعم إيطالي فاخر في Four Seasons'],
        ['21:00', 'لفّة اختيارية في شارع Wangfujing'],
      ],
      4: [
        ['08:00', 'خروج من الفندق — عربية خاصة'],
        ['09:30', 'وصول Mutianyu (1.5 ساعة طريق)'],
        ['09:45', 'تلفريك لفوق السور'],
        ['10:00', 'مشي 1.5 كيلو على السور — من برج لبرج'],
        ['12:00', 'الغدا: <strong>The Schoolhouse</strong> — pizza on wood-fired oven وقايمة غربية'],
        ['13:30', 'الـ Toboggan لتحت (مغامرة الأولاد!)'],
        ['14:30', 'الرجوع لبكين'],
        ['17:00', 'العشا في الفندق أو <strong>Blue Frog Bar & Grill</strong>'],
      ],
      5: [
        ['09:00', 'لفة في حواري Hutong + ركوب pedicab'],
        ['11:30', 'الغدا: <strong>Wagas</strong> أو <strong>Pizza Marzano</strong> — أكل غربي مكيف'],
        ['13:30', 'القصر الصيفي (颐和园) — بحيرة Kunming'],
        ['16:30', 'هيكل السماء (天坛 Temple of Heaven)'],
        ['19:00', 'العشا: <strong>Hatsune</strong> — ياباني-غربي للأولاد'],
        ['21:00', '⏰ ضبط منبه — قطار يوم 6 الساعة 7:39!'],
      ],
      6: [
        ['06:00', 'الـ Check-out · عربية لمحطة Beijing West'],
        ['07:00', 'الوصول للمحطة · security · فطار في المحطة'],
        ['07:39', '<strong>قطار G653</strong> يقلع من Beijing West — direct لـ Xi\'an'],
        ['13:46', 'الوصول لـ Xi\'an North · مترو Line 2 لمحطة Provincial Stadium'],
        ['14:30', 'الـ Check-in في <strong>Crowne Plaza Xi\'an by IHG</strong> ✅'],
        ['17:30', 'سور المدينة القديم وقت غروب — البوابة الجنوبية'],
        ['20:00', 'العشا: <strong>Le Grand</strong> في Sofitel أو مطعم الفندق'],
      ],
      7: [
        ['08:00', 'الخروج من الفندق — عربية لـ Lintong (40 كم شرق)'],
        ['09:00', 'الوصول لمقبرة الإمبراطور Qin Shi Huang'],
        ['09:30', 'الحفرة الأولى — 6000 جندي في تشكيل عسكري'],
        ['10:30', 'الحفرة 2: cavalry · الحفرة 3: مركز قيادة'],
        ['11:30', 'قاعة العربات البرونزية'],
        ['13:00', 'الغدا: <strong>Wei Jia</strong> — biangbiang نودلز خفيفة'],
        ['14:30', 'قصر Huaqing — الينابيع الساخنة الإمبراطورية'],
        ['17:30', 'الرجوع لشيآن · العشا في الفندق (غربي)'],
      ],
      8: [
        ['09:30', 'باجودا الإوزة الكبيرة (大雁塔) — معبد Da Ci\'en'],
        ['11:30', 'عرض النوافير — أكبر نوافير موسيقية في آسيا'],
        ['12:30', 'الغدا: <strong>Vinotech</strong> أو Pizza Hut للأولاد'],
        ['14:30', 'Tang Paradise — حديقة إمبراطورية مُعاد بناؤها'],
        ['17:30', 'عشا خفيف في الفندق (Crowne Plaza)'],
        ['19:30', '<strong>عرض Tang Dynasty</strong> فقط (بدون عشا) — 90 دقيقة'],
        ['21:30', 'الرجوع للفندق · pack — قطار النوم بكره!'],
      ],
      9: [
        ['08:00', 'فطار في الـ Crowne Plaza · pack نهائي'],
        ['09:00', 'إيجار عجلة على السور — البوابة الجنوبية (¥45/3 ساعات)'],
        ['10:30', 'لفة كاملة على السور (~14 كم، 90 دقيقة easy)'],
        ['11:45', '⚠️ الـ <strong>Check-out قبل 12:00</strong> — اترك الشنط في bell desk'],
        ['12:30', 'الغدا: مطعم الفندق أو Vinotech'],
        ['14:00', 'متحف Shaanxi History — 370 ألف قطعة أثرية'],
        ['16:30', 'لفة سريعة في سوق Muslim Quarter (للجو، مش للأكل)'],
        ['17:30', 'استلام الشنط · عشا غربي خفيف'],
        ['19:30', 'الركوب في قطار النوم · مقصورتك'],
        ['20:00', '🛏️ <strong>قطار النوم Xi\'an → Shanghai</strong> · بكره الصبح في Bund'],
      ],
      10: [
        ['07:30', 'وصلنا Shanghai · ننزل من القطار'],
        ['08:00', 'فطار: <strong>Sunnyside Café · Toy Story Hotel</strong> — بوفيه غربي'],
        ['09:30', 'إيداع الشنط في الفندق (early bag drop)'],
        ['10:00', 'shuttle لباب الـ park · يوم ديزني الأول!'],
        ['10:30', 'استراتيجية الـ rope drop: TRON Lightcycle Power Run الأول'],
        ['12:30', 'الغدا: <strong>Pinocchio Village Kitchen</strong> — pizza, pasta'],
        ['14:00', 'Pirates of the Caribbean: Battle for the Sunken Treasure'],
        ['17:00', 'Roaring Rapids · Soaring Over the Horizon'],
        ['19:30', 'العشا: <strong>World of Disney Café</strong> أو Sunnyside Café'],
        ['20:00', 'إضاءات القلعة + ألعاب نارية'],
        ['22:00', 'الرجوع للفندق · نوم!'],
      ],
      11: [
        ['08:30', 'فطار في الـ Sunnyside Café'],
        ['09:30', 'Adventure Isle: Roaring Rapids (هتتبل، هات poncho)'],
        ['11:00', 'Camp Discovery climbing · Stitch Encounter'],
        ['12:30', 'الغدا: <strong>Royal Banquet Hall</strong> — character dining داخل القلعة'],
        ['14:30', 'Tomorrowland: Buzz · Jet Packs · TRON re-ride'],
        ['16:00', 'Mickey Avenue Parade route'],
        ['17:30', 'Fantasyland: Once Upon a Time · Seven Dwarfs Mine Train'],
        ['19:30', 'العشا: <strong>Aurora</strong> أو <strong>Lumière\'s Kitchen</strong>'],
        ['20:30', '"Ignite the Dream" ألعاب نارية'],
      ],
      12: [
        ['09:00', 'يوم ديزني الأخير — TRON تاني، Soaring تاني، أي حاجة فاتت'],
        ['12:00', 'غدا في الـ park · صور أخيرة · souvenirs من Avenue M'],
        ['14:00', 'الـ Check-out من Toy Story Hotel · taxi لـ Peninsula'],
        ['15:30', 'الـ Check-in في <strong>Peninsula Shanghai</strong> · Bund-view'],
        ['17:00', 'لفّة في شارع Nanjing East'],
        ['19:00', 'العشا: <strong>Mr & Mrs Bund</strong> (Paul Pairet, فرنسي مودرن)'],
        ['21:00', 'لفة ليلية على الـ Bund — Pudong منوّر بالضو'],
      ],
      13: [
        ['09:00', 'حديقة Yu Garden + سوق المدينة القديمة — 450 سنة'],
        ['11:30', 'غدا خفيف: <strong>Nanxiang Steamed Bun</strong> — xiaolongbao'],
        ['13:30', 'Pudong: Shanghai Tower (118 طابق)'],
        ['15:30', 'Coffee في <strong>Baker & Spice</strong> أو Wagas في Xintiandi'],
        ['16:00', 'Tianzifang أو Xintiandi — boutique shopping'],
        ['18:00', 'صورة عائلة أخيرة على الـ Bund وقت غروب'],
        ['19:00', 'العشا الوداع: <strong>Lost Heaven</strong> أو <strong>Jean Georges</strong>'],
        ['21:30', 'الرجوع للفندق · pack · نوم بدري — رحلة 00:05!'],
      ],
      14: [
        ['00:05', 'EK 303 يقلع من Shanghai PVG (T2) → Dubai DXB (T3) · A380-800 · 8س 40د'],
        ['04:45', 'هبوط في دبي · ترانزيت ~3س 30د'],
        ['08:15', 'EK 927 من Dubai DXB (T3) → Cairo CAI (T2) · A380-800 · 3س 50د'],
        ['11:05', 'هبوط في القاهرة — ولا أحلى! 🎉'],
      ],
    };
    Object.entries(TIMELINE_AR).forEach(([day, items]) => {
      const tl = document.querySelector(`.day-section[data-day="${day}"] .timeline`);
      if (!tl) return;
      tl.innerHTML = items.map(([time, text]) =>
        `<li><span class="time">${time}</span>${text}</li>`
      ).join('');
      tl.setAttribute('dir', 'rtl');
      tl.setAttribute('lang', 'ar');
    });

    // Extras section headings
    document.querySelectorAll('.extras h2').forEach(h => {
      const txt = h.textContent.split('·')[0].trim();
      const map = {
        'Confirmed Bookings': 'الحجوزات المؤكدة',
        'Mandarin Phrasebook': 'كلمات صيني تعرفها',
        'Practical Tips': 'نصايح عملية',
        'Emergency Contacts': 'أرقام الطوارئ',
        'Before Leaving Cairo': 'قبل ما تطلع من القاهرة',
        'Estimated Costs': 'التكلفة التقديرية',
        'Apps to Install': 'تطبيقات لازم تنزلها',
        'Getting Around': 'كيف تتنقّل',
        'Plan B': 'خطة بديلة',
      };
      Object.keys(map).forEach(k => {
        if (txt.indexOf(k) === 0) {
          h.textContent = map[k];
          h.setAttribute('dir', 'rtl');
          h.setAttribute('lang', 'ar');
        }
      });
    });

    // ===== STOPS — translate by day =====
    const STOPS_AR = {
      2: [
        { name: 'فندق Imperial Mansion · Marriott Beijing', desc: 'شقة فاخرة 2 غرفة نوم · حي Dongcheng · 4 ليالي (19→23 يونيو) · حجز #6845.657.812 · CNY 13,183 (EGP 101,529 شامل بريكفاست بوفيه غربي يومي)' },
        { name: 'مطعم Capital M (أوروبي حديث)', desc: 'بلكونة شهيرة فوق Qianmen · المنيو أسترالي-أوروبي · سي فود، لحم خروف، باستا، بط · إطلالة Tiananmen في الغروب · مناسب جداً للأولاد' },
      ],
      3: [
        { name: 'القصر الإمبراطوري (Forbidden City)', desc: 'أكبر مجمع قصور في العالم · 9999 غرفة · من عصري Ming و Qing · 600 سنة تاريخ إمبراطوري' },
        { name: 'ميدان Tiananmen', desc: 'أكبر ميدان عام في العالم · بوابة السلام السماوي · صورة Mao الشهيرة' },
        { name: 'حديقة Jingshan', desc: 'تل الفحم — أحسن منظر مرتفع للقصر الذهبي · مثالي للصور' },
      ],
      4: [
        { name: 'سور الصين العظيم — Mutianyu', desc: 'أحسن جزء مرمم من السور · أهدأ من Badaling · مناظر جبلية ساحرة · فيه توبوغان للنزول' },
        { name: 'مطعم The Schoolhouse · Mutianyu', desc: 'مدرسة قرية قديمة من الخمسينات اتحولت لمطعم · بيتزا فرن خشب، ساندوتشات، سلطات، خبز طازج · بتديرها عيلة أمريكية من 15+ سنة' },
      ],
      5: [
        { name: 'حواري Nanluogu Xiang (Hutongs)', desc: 'حواري عمرها 800 سنة · روح بكين القديمة · بيوت شاي، محلات حرفيين، بارات مخفية · اركب pedicab في المتاهة' },
        { name: 'القصر الصيفي (颐和园)', desc: 'منتجع إمبراطوري · 290 هكتار من بحيرة Kunming + تل العمر الطويل · الممر الطويل (728 متر معرض رسم) · القارب الرخامي · تراث UNESCO' },
        { name: 'معبد السماء (天坛)', desc: 'مذبح من عصر Ming كان الأباطرة بيدعوا فيه للحصاد · قاعة الصلاة الدائرية الشهيرة · الناس بتلعب تاي تشي عند الفجر · موقع UNESCO' },
      ],
      6: [
        { name: 'قطار G653 · بكين West → شيآن North', desc: 'قطار سريع مباشر · 07:39 → 13:46 (6س 7د) · درجة 2 ~$75 للشخص = ~$377 للخمسة · التذاكر بتفتح 8 صباحاً قبل 15 يوم على Trip.com أو 12306' },
        { name: 'سور شيآن (古城墙)', desc: 'أحسن سور قديم محفوظ في الصين · 14 كم محيط · 12 متر ارتفاع · بُني في عصر Ming 1370 · امشي أو استأجر عجلة (¥45 / 3 ساعات) · الغروب من البوابة الجنوبية لا يُنسى' },
        { name: 'مطعم Le Grand · Sofitel Legend', desc: 'فرنسي فاخر داخل فندق التراث السوفيتي · ستيك، سي فود، نبيذ · أوثق عشا غربي في شيآن · بديل: Westin Italian Trattoria' },
      ],
      7: [
        { name: 'جيش التراكوتا (兵马俑)', desc: '8000 جندي طين بحجم طبيعي بيحرسوا مقبرة الإمبراطور Qin Shi Huang (210 ق.م) · اكتشفوهم 1974 فلاحين بيحفروا بير · تراث UNESCO · "العجيبة الثامنة"' },
        { name: 'قصر Huaqing (华清宫)', desc: 'منتجع حمامات ساخنة عمره 2800 سنة · بستان حب الإمبراطور Xuanzong مع المحظية Yang Guifei · مساءً عرض "أغنية الحزن الأبدي" التانغي على جبل Li' },
        { name: 'Wei Jia (魏家凉皮) — غدا صيني خفيف', desc: 'سلسلة نودلز عصرية نظيفة · biangbiang، نودلز سمسم باردة، dumplings · آمنة، مكيفة، مناسبة للأولاد · "must-try" شيآني خفيف' },
      ],
      8: [
        { name: 'باجودا الإوزة الكبيرة (大雁塔)', desc: 'باجودا تانغية 7 طوابق طوب، 64 متر · بُنيت 652 ميلادي لتخزين السوترا البوذية · اطلع لفوق علشان منظر شيآن' },
        { name: 'Tang Paradise (大唐芙蓉园)', desc: '66 هكتار حديقة معاد بناءها كحديقة إمبراطورية تانغية · بافيليون، بحيرات، عروض ضوئية مسائية · "مشية تانغ" 20:30' },
        { name: 'عرض Tang Dynasty — تذكرة العرض فقط', desc: 'تخطي وليمة الـ dumplings الثقيلة (18 طبق كتير على الذوق الغربي). كول خفيف في الفندق وتعالى 19:30 لتذكرة العرض. نفس الموسيقى والرقص بنصف الضغط على المعدة.' },
      ],
      9: [
        { name: 'العجلة على السور', desc: 'لفّة 14 كم فوق سور Ming · تجربة شيآن المميزة · عجلة فردية ¥45/3س أو ثنائية ¥90/3س · بسرعة هادية ووقفات على الأبراج · أفق المدينة من الباجودا والـ Drum Tower' },
        { name: 'متحف شينشي للتاريخ', desc: 'من أهم 4 متاحف في الصين · كنوز ذهب تانغية، برونزيات هانية، يَشَب زو · شيآن كانت عاصمة 13 سلالة فالمجموعة لا تضاهى · مجاني بس احجز أونلاين على WeChat قبل 3 أيام' },
        { name: 'Muslim Quarter — مشي سوق فقط', desc: 'أحسن كـ مشية 30 دقيقة (فوانيس، فواكه مجففة، خطاطين، صور) — مش وجهة عشا. الأكل قد يكون ثقيل/غريب. عظيم للجو، بعدها ارجع للفندق لعشا غربي.' },
      ],
      10: [
        { name: 'ديزني لاند شنغهاي', desc: 'أكبر منتجع Disney في آسيا · القلعة المسحورة (الأطول في أي ديزني) · TRON Lightcycle، Pirates، Roaring Rapids · منطقتين فريدتين: Treasure Cove و Gardens of Imagination' },
        { name: 'Toy Story Hotel · Shanghai Disney Resort', desc: 'فندق ميزانية فاخر داخل المنتجع · واجهات Woody, Buzz, Jessie · 3 ليالي (27-30 يونيو) · باص مجاني كل 10 دقايق · Sunnyside Café بوفيه غربي' },
        { name: 'Pinocchio Village Kitchen — أكل غربي داخل الباركة', desc: 'خدمة سريعة بطابع إيطالي · بيتزا، باستا، سلطات، شيبس، آيس كريم · المنيو واضح · أسهل غدا داخل الباركة · جرب Aurora (أمريكي) و Lumière\'s Kitchen (فرنسي) في Disneyland Hotel' },
      ],
      11: [
        { name: 'Adventure Isle', desc: 'فريد لشنغهاي · Roaring Rapids ركوبة نهر (هتتبلل) · Camp Discovery حبال + تسلق · Soaring Over the Horizon (قبة IMAX — رقم 1 في الصين)' },
        { name: 'Royal Banquet Hall — أكل شخصيات', desc: 'داخل القلعة المسحورة · منيو غربي/دولي محدد (~¥350/كبير) · Mickey, Donald, Snow White بيزوروا كل ترابيزة · احجز قبل 60+ يوم على تطبيق Disney' },
        { name: 'Aurora & Lumière\'s Kitchen', desc: 'Aurora = ستيك أمريكي بمنظر أفق · Lumière\'s = فرنسي كلاسيكي في فندق المنتجع · الاتنين عشا غربي ممتاز · مفتوح لكل الضيوف' },
      ],
      12: [
        { name: 'The Peninsula Shanghai', desc: 'فخامة آرت ديكو شهيرة على الـ Bund · بار Sir Elly\'s السطح بإطلالة Pudong · 2 ليالي (29 يونيو → 1 يوليو) · غرفة عيلة بإطلالة · فطار غربي في The Lobby' },
        { name: 'Mr & Mrs Bund (Paul Pairet)', desc: 'الشيف ميشلان Paul Pairet · بيسترو فرنسي حديث على الـ Bund · مطبخ مفتوح، خدمة ليلية · احجز قبل 1-2 أسبوع · بدائل: M on the Bund · 8½ Otto e Mezzo Bombana (إيطالي 3 نجوم)' },
        { name: 'Nanjing Road East', desc: 'شارع تسوق مشاة 5.5 كم · لافتات نيون، مولات، أكشاك سناكس · مشي مباشر من Peninsula لـ People\'s Square' },
        { name: 'الـ Bund (外滩)', desc: 'كورنيش 1930 · 52 مبنى آرت ديكو يواجهوا ناطحات Pudong · أحسن وقت 19:00-21:00 لما الجانبين يضيئوا' },
      ],
      13: [
        { name: 'Yu Garden (豫园)', desc: 'حديقة خاصة عمرها 450 سنة من عصر Ming في المدينة القديمة · صخور، بحيرات koi، حواجز التنين · السوق المجاور = يَشَب، حرير، خط للسوفنير' },
        { name: 'Shanghai Tower', desc: '632 متر · تاني أعلى مبنى في العالم · الدور 118 منظر · أسرع مصعد في العالم (74 كم/س، 55 ثانية) · ¥180/كبير' },
        { name: 'Tianzifang / Xintiandi', desc: 'بيوت shikumen 1920 مرممة · كافيهات indie، بوتيك مصممين، جاليريهات · Tianzifang أصلي · Xintiandi مصقول وغالي' },
        { name: 'Lost Heaven / Jean Georges', desc: 'Lost Heaven = Yunnan بطريقة غربية نظيفة (أخف من الصيني العادي) · Jean Georges = فرنسي فاخر 3 على الـ Bund لليلة وداع · بدائل: Cuivre · Le Comptoir de Pierre Gagnaire' },
      ],
    };
    Object.entries(STOPS_AR).forEach(([day, stops]) => {
      const sec = document.querySelector(`.day-section[data-day="${day}"]`);
      if (!sec) return;
      const elStops = sec.querySelectorAll('.stop');
      stops.forEach((s, i) => {
        if (!elStops[i]) return;
        const n = elStops[i].querySelector('.stop__name');
        const d = elStops[i].querySelector('.stop__desc');
        if (n) n.textContent = s.name;
        if (d) d.textContent = s.desc;
      });
    });

    // ===== INFO CARDS — translate label/title/detail =====
    const INFO_AR = {
      1: [{ label: '✈ الطيران', title: 'EK 924 · القاهرة → دبي', detail: 'إيرباص A380-800 · 3س 35د · ترانزيت في دبي ~3 ساعات قبل EK 306 · مرجع الحجز <strong>8GCRQP</strong> (Emirates PNR: L62SIF) · Economy class · 2 شنط لكل راكب · وكيل: Asfar El Marwan Travel، القاهرة، 0663240456' }],
      2: [{ label: '✈ الطيران', title: 'EK 306 · دبي → بكين PEK', detail: 'Boeing 777-300ER · إقلاع 03:50 · هبوط 15:25 · 7س 35د (مش A380 الرحلة دي) · هبوط T3' }],
      3: [{ label: '🍽️ الأكل — غربي', title: 'الغدا: Element Fresh · العشا: Mio (Four Seasons)', detail: 'Element Fresh = أحسن سلسلة أكل صحي غربي في بكين. Mio = إيطالي فاخر داخل Four Seasons — باستا تتعمل قدامك، بيتزا فرن خشب، مناسب للأولاد. لو حابب صيني خفيف: Jing Yaa Tang في The Opposite House.' }],
      6: [
        { label: '🎫 التذاكر — احجز يوم 9 يونيو!', title: 'G653 · درجة 2 × 5', detail: '~CNY 537/شخص ($75) · ~$377 المجموع · المبيعات تفتح 08:00 بتوقيت بكين قبل 15 يوم بالظبط · بدائل: G89 (08:55→13:53), G655 (08:35→14:32), G801 (10:48→17:14)' },
        { label: '🏨 الفندق — 3 ليالي (23-26 يونيو) · ✅ مؤكد', title: 'Crowne Plaza Xi\'an by IHG', detail: 'No.1 Zhu Que Zhong Road, Beilin · 📞 +86 29 8866 8888 · مترو Line 2 → Provincial Stadium · حجز 5489.642.171 · PIN 1418 · 2 غرف (Twin + King) · فطار شامل · check-in 14:00 — القطار يصل 13:46' },
      ],
      7: [{ label: '🎫 الجولة', title: 'جولة نص يوم للتراكوتا مع مرشد إنجليزي', detail: 'Klook / Trip.com: ~$30-50/شخص · شامل توصيل ذهاب وعودة + تذكرة + مرشد · احجز قبل · ~$150-250 للخمسة' }],
      8: [{ label: '🎭 العرض فقط — بدون وليمة', title: 'عرض Tang Dynasty (تذكرة عرض فقط)', detail: '~$35/شخص عرض فقط · ~$175 للخمسة (بدلاً من ~$300 مع الوليمة). كول في الفندق قبل. احجز Klook / Trip.com / كونسيرج الفندق.' }],
      9: [
        { label: '🛏️ القطار (الليلي)', title: 'شيآن → شنغهاي · Soft Sleeper', detail: 'D310 درجة D ~19:30→07:30 · أو Z درجة عادية ~16 ساعة · Soft sleeper 4 أسرة ¥900-1200/سرير · المجموع ~¥4500-6000 (~$650-900) لعيلة 5 · التذاكر قبل 15 يوم على Trip.com / 12306' },
        { label: '🛌 استراتيجية الحجز', title: 'عيلة 5 — احجز مقصورة كاملة + سرير', detail: 'احجز مقصورة 4 أسرة كاملة (باب يقفل) + سرير في المقصورة المجاورة. أو لو متاح: 2× deluxe 2 سرير (خاص + حمام)' },
      ],
      10: [{ label: '🎢 استراتيجية يوم 1', title: 'تجاوز الطوابير', detail: 'افتح تطبيق Shanghai Disney Resort · فعّل Premier Access لـ TRON + Pirates لو الميزانية بتسمح (~¥120/ركوبة/شخص) · استخدم Premier فقط لأهم 2 ركوبات · Mickey & Friends meet-greet صباحاً' }],
      12: [{ label: '🤔 نقطة قرار', title: 'ديزني يوم 3 أو يوم شنغهاي كامل؟', detail: 'لو الأولاد لسه متحمسين → ديزني الصبح + النقلة لـ Peninsula العصر. لو متشبعين → checkout 11:00، عصر كامل في الـ Bund + Yu Garden + Tianzifang. Peninsula ثابت.' }],
      14: [{ label: '✈ الطيران', title: 'EK 303 + EK 927 · شنغهاي → القاهرة عبر دبي', detail: 'الرحلتين على إيرباص A380-800 · إجمالي السفر ~16 ساعة (شامل ترانزيت دبي) · مرجع الحجز <strong>8GCRQP</strong> · Emirates PNR L62SIF · Economy (Q) · 2 شنط لكل راكب' }],
    };
    Object.entries(INFO_AR).forEach(([day, list]) => {
      const sec = document.querySelector(`.day-section[data-day="${day}"]`);
      if (!sec) return;
      const cards = sec.querySelectorAll('.info-card');
      list.forEach((info, i) => {
        if (!cards[i]) return;
        const lbl = cards[i].querySelector('.info-card__label');
        const t = cards[i].querySelector('.info-card__title');
        const d = cards[i].querySelector('.info-card__detail');
        if (lbl) lbl.textContent = info.label;
        if (t) t.textContent = info.title;
        if (d) d.innerHTML = info.detail;
      });
    });

    // ===== TIP BOXES =====
    const TIPS_AR = {
      1: 'كراسي A380 الدور الفوقاني هادية أكتر في الرحلات الليلية. عيلة 5 — احجز كراسي 62A–62E (لو متاحة) صف كامل. لاونج دبي T3 (Concourse A/B) شغال 24 ساعة.',
      2: 'الجوازات في PEK ممكن تاخد 45-90 دقيقة. لو فيه fast-track استخدمه. Capital M بياخد حجز عبر OpenTable — احجز قبل واطلب البلكونة.',
      3: 'احجز تذاكر الـ Forbidden City أونلاين قبل — الـ walk-ins محدودة. روح بدري تتفادى الزحام. الحديقة الإمبراطورية الخلفية (Yuhuayuan) أهدا وأجمل.',
      4: 'الـ Toboggan (¥100/شخص) سلايد فولاذي بينزل من فوق الجبل — فارس ويوسف وياسين هيتذكروها للأبد. اشتري التذاكر من تحت، اطلع تلفريك، انزل سلايد. الحد الأدنى للطول: 1.2م.',
      5: 'حضّر الشنطة الليلة! قطار G653 بكره 07:39 من بكين West — البوابات بتقفل قبل 5 دقايق. خد 90 دقيقة: فندق → محطة → security → رصيف. احجز Didi أو ليموزين الفندق 06:00.',
      6: 'احجز G653 لحظة فتح التذاكر — بكين→شيآن أكتر خط HSR شعبية في الصين والدرجة 2 بتنفد في ساعات. خد الجوازات — التذاكر المطبوعة/PDF بتتقرأ على البوابة. مفيش أكل في القطار، بس المحطة فيها مطاعم. مأخذ كهربا في كل كرسي.',
      7: 'استأجر مرشد — من غيره الـ Pits بتبان مجرد تماثيل مكسورة. مع المرشد كل تمثال له قصة (ضباط vs مشاة، تسريحات الشعر حسب الرتبة، آثار الطلاء الأصلي). Pit 1 الأكبر — ابدأ منه. خد ميه؛ الموقع ضخم والظل محدود.',
      8: 'Tang Paradise أحسن في وقت الغروب لمساء الليل لما الإضاءة تشتغل. بكره قطار نوم لشنغهاي — حضّر شنطة سفر صغيرة، الشنط الكبيرة تفضل في الفندق لحد الرحيل.',
      9: 'Soft sleeper (软卧) = 4 أسرة مبطنة في مقصورة بباب يقفل، شراشف، مخدة، بطانية، موزع ميه ساخنة آخر العربية. خد سناكس، ميه، شبشب، قناع نوم، سدادات أذن. الأولاد هيحبوها — القطار بيهز برفق، تصحى في مدينة تانية.',
      10: 'اركب TRON لحظة فتح الباركة — بحلول 11:00 الانتظار 90 دقيقة. خد شواحن متنقلة (هتستهلك البطارية مع التطبيق). الغدا في Pinocchio أأمن أكل داخل الباركة. بعد 18:00 الطوابير أقصر.',
      11: 'يوم 2 = نظّم سرعتك. اعمل الركوبات اللي يوم 1 فاتت، بعدها ارتاح في الفندق ظهراً. ارجع للمسير + الفايرووركس. Royal Banquet Hall = التجربة اللي تستحق الحجز المسبق — منيو غربي محدد، شخصيات على الترابيزة.',
      12: 'بار Sir Elly\'s السطح في Peninsula (الدور 14) لا يفوت لغروب على الـ Bund. Toy Story Hotel checkout 11:00 — اطلب الـ reception يحفظ الشنط. احجز Mr & Mrs Bund قبل 1-2 أسبوع — الجمعة/الأسبوع بتنفد بسرعة.',
      13: 'بكرة طيارة EK 303 الساعة 00:05 — اخرج من الفندق 21:00 لمطار PVG (T1، Emirates). Online check-in بيفتح قبل 24 ساعة. خد 3 ساعات في المطار للطيران منتصف الليل.',
      14: 'صرّح بأي مقتنيات ثقافية أو حاجات قيمتها فوق ¥5000 في جمارك PVG. Emirates بتسمح بـ 30 كجم لكل واحد (Economy) / 40-50 كجم (Business/First). إجمالي السماح للعيلة = طاقة كبيرة للسوفنير.',
    };
    Object.entries(TIPS_AR).forEach(([day, txt]) => {
      const sec = document.querySelector(`.day-section[data-day="${day}"]`);
      if (!sec) return;
      const tipSpan = sec.querySelector('.tip-box span:not(.tip-box__icon)');
      if (tipSpan) tipSpan.innerHTML = txt;
    });
  }

  /* ─────────────────────────────────────────────
     INSERT QUESTS SECTION (after events-section)
     ───────────────────────────────────────────── */
  function injectQuestsSection() {
    if (document.getElementById('quests')) return;
    const events = document.querySelector('.events-section');
    if (!events) return;

    const sec = document.createElement('section');
    sec.className = 'quests';
    sec.id = 'quests';
    sec.setAttribute('dir', 'rtl');
    sec.setAttribute('lang', 'ar');
    events.parentNode.insertBefore(sec, events.nextSibling);
    render();
  }

  /* ─────────────────────────────────────────────
     INLINE QUEST CARDS — embed inside each day section
     ───────────────────────────────────────────── */
  function renderInlineQuest(q) {
    const isDone = !!state.done[q.id];
    const claimedBy = state.claimedBy[q.id];
    const claimedName = claimedBy ? PLAYERS.find(p => p.key === claimedBy)?.name : '';
    return `
      <div class="quest-inline ${isDone ? 'done' : ''}" data-quest-inline="${q.id}">
        <div class="quest-inline__icon">${q.icon}</div>
        <div class="quest-inline__body">
          <div class="quest-inline__title">${q.title}</div>
          <div class="quest-inline__meta">
            <span class="quest-inline__when">${q.when || ''}</span>
            <span class="quest-inline__points">${q.points} نقطة</span>
            <span class="quest-inline__prize">${q.prize}</span>
          </div>
        </div>
        <button class="quest-inline__btn" data-action="complete" data-id="${q.id}">
          ${isDone ? `${claimedName || 'خلصت'} ✓` : 'خلصته!'}
        </button>
      </div>
    `;
  }
  function injectInlineQuestsPerDay() {
    document.querySelectorAll('.day-quests').forEach(el => el.remove());
    const byDay = {};
    QUESTS.forEach(group => {
      group.list.forEach(q => {
        if (q.day == null) return;
        if (!byDay[q.day]) byDay[q.day] = [];
        byDay[q.day].push(q);
      });
    });
    Object.entries(byDay).forEach(([day, list]) => {
      const sec = document.querySelector(`.day-section[data-day="${day}"]`);
      if (!sec) return;
      const content = sec.querySelector('.day-content');
      if (!content) return;
      const timeline = content.querySelector('.timeline');
      const wrap = document.createElement('div');
      wrap.className = 'day-quests';
      wrap.setAttribute('dir', 'rtl');
      wrap.innerHTML = `
        <div class="day-quests__head">تحديات اليوم · ${list.length} لعبة</div>
        <div class="day-quests__list">
          ${list.map(q => renderInlineQuest(q)).join('')}
        </div>
      `;
      if (timeline && timeline.parentNode) {
        if (timeline.nextSibling) {
          timeline.parentNode.insertBefore(wrap, timeline.nextSibling);
        } else {
          timeline.parentNode.appendChild(wrap);
        }
      } else {
        content.appendChild(wrap);
      }
    });
  }

  /* ─────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────── */
  function init() {
    injectQuestsSection();
    arabicizeUI();
    injectInlineQuestsPerDay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
