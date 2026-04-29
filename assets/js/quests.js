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
        { id: 'b1', icon: '🏯', title: 'عدّ التنانين في القصر الإمبراطوري', desc: 'لازم تلاقي على الأقل 9 تنانين منحوتة في الـ Forbidden City — صوّر كل واحد!', owner: 'all', points: 10, prize: '🍦 اختار طعم الآيس كريم بعد العشا' },
        { id: 'b2', icon: '🧱', title: 'اطلع 1000 درجة على سور الصين', desc: 'كل اللي يكمّل من البرج 1 لحد البرج 5 من غير ما يقعد ياخد نَفَس يكسب', owner: 'all', points: 50, prize: '¥50 cash bonus + وسام البطل' },
        { id: 'b3', icon: '🛷', title: 'انزل بالـ Toboggan لحد تحت', desc: 'الاسلايد الفولاذي من فوق سور الصين — مين بدون فرامل لحد آخر النزلة؟', owner: 'all', points: 20, prize: '🎬 تختار فيلم العائلة الليلة' },
        { id: 'b4', icon: '🥢', title: 'اتعلّم تأكل بالعيدان (Chopsticks)', desc: 'كل اللي يكمّل وجبة كاملة من غير ملعقة ولا شوكة — official Chopsticks Master', owner: 'all', points: 15, prize: '🍰 dessert إضافي' },
        { id: 'b5', icon: '🗣️', title: 'احفظ 5 كلمات صيني', desc: 'نِي هاو · شيي شيي · جايجيين · بو هاو · واي تشي يي', owner: 'all', points: 10, prize: '¥30 bonus' },
        { id: 'b6', icon: '📸', title: 'صورة العيلة كاملة على سور الصين', desc: 'خمسة، مع الجبال ورا — اللي يحدد الـ angle المثالي يكسب', owner: 'mfz', points: 10, prize: 'اختيار الـ playlist في العربية' },
        { id: 'b7', icon: '🍵', title: 'دينا تشتري شاي صيني أصلي من Hutong', desc: 'تختار نوع، تساوم على السعر بالإشارة، وتاخدها بكاكتها الأصلية', owner: 'dina', points: 20, prize: 'يوم spa في Peninsula Shanghai' },
        { id: 'b8', icon: '🌅', title: 'صحى بدري للـ Tiananmen flag raising', desc: 'علم الصين بيتعلى وقت طلوع الشمس — كل واحد يصحى يكسب', owner: 'all', points: 25, prize: '¥40 + بريكفاست بوفيه استثنائي' },
      ],
    },

    // ─── XI'AN (Days 6–9) ───
    {
      group: 'xian',
      groupTitle: 'تحديات شيآن 🗿',
      groupIcon: '🗿',
      list: [
        { id: 'x1', icon: '🗿', title: 'عدّ 100 جندي طين على الأقل', desc: 'الـ Terracotta Warriors فيها 6000 — مين يقدر يميز 100 وش مختلف؟', owner: 'all', points: 30, prize: '¥50 + اختيار مطعم بكره' },
        { id: 'x2', icon: '🚲', title: 'لفّة كاملة على سور شيآن بالعجلة', desc: '14 كيلو متر فوق السور القديم — مين أول واحد يخلص اللفة؟', owner: 'all', points: 50, prize: '¥80 cash + وسام Champion' },
        { id: 'x3', icon: '🍜', title: 'كول طبق biangbiang noodles كامل', desc: 'النودلز الصينية الخاصة بشيآن — خد المغامرة وكول كله', owner: 'all', points: 15, prize: 'تختار breakfast بكره' },
        { id: 'x4', icon: '👑', title: 'احفظ اسم Emperor Qin Shi Huang', desc: 'المؤسس اللي بنا التراكوتا — قول الاسم 3 مرات قدام بابا', owner: 'all', points: 10, prize: '¥20' },
        { id: 'x5', icon: '🚆', title: 'ركبت قطار النوم Soft Sleeper', desc: 'قطار الـ Xi\'an → Shanghai الليلي — أول يوم لك في حياتك تنام في قطار', owner: 'all', points: 40, prize: '¥40 + جايزة خاصة في Shanghai' },
        { id: 'x6', icon: '🏯', title: 'اطلع لفوق الـ Big Wild Goose Pagoda', desc: '7 طبقات فوق بعض — كل اللي يطلع لفوق فوق يكسب', owner: 'all', points: 20, prize: '🍰 dessert إضافي' },
        { id: 'x7', icon: '💃', title: 'حفظت رقصة من Tang Dynasty Show', desc: 'بعد ما تشوف العرض — أول واحد يقلد حركة من الراقصين على الستيج', owner: 'all', points: 25, prize: 'ساعة سهر زيادة الليلة' },
        { id: 'x8', icon: '🏮', title: 'صورة في الـ Muslim Quarter بالليل', desc: 'الفوانيس والنور والجو — أحلى صورة عيلة', owner: 'mfz', points: 10, prize: 'تختار dessert بعد العشا' },
      ],
    },

    // ─── SHANGHAI / DISNEY (Days 10–13) ───
    {
      group: 'shanghai',
      groupTitle: 'تحديات شنغهاي وديزني 🏰',
      groupIcon: '🏰',
      list: [
        { id: 's1', icon: '🚀', title: 'اركب TRON Lightcycle 3 مرات', desc: 'أحسن لعبة في ديزني شنغهاي — التحدي: 3 مرات في يوم واحد', owner: 'all', points: 50, prize: '¥100 cash bonus + وسام TRON Champion' },
        { id: 's2', icon: '🐻', title: 'لقيت LinaBell وصورت معاها', desc: 'صديقة Duffy الجديدة — الطابور 2 ساعة، اللي يستحمل يكسب', owner: 'all', points: 35, prize: 'بدج خاص + اختيار العشا' },
        { id: 's3', icon: '🏴‍☠️', title: 'اركب Pirates of the Caribbean مرتين', desc: 'أحسن Pirates ride في العالم — متستحملش تركب مرة واحدة', owner: 'all', points: 25, prize: '¥40' },
        { id: 's4', icon: '🎆', title: 'شفت ILLUMINATE fireworks لآخره', desc: 'العرض الليلي على القلعة — لازم تعدي السنة بدون نوم 🎆', owner: 'all', points: 20, prize: 'ساعة سهر زيادة + popcorn' },
        { id: 's5', icon: '📸', title: 'صور مع 5 شخصيات Disney', desc: 'Mickey, Minnie, Donald, Spider-Man, Snow White — أو أي 5', owner: 'all', points: 30, prize: '🛍️ اختار الـ souvenir الكبير' },
        { id: 's6', icon: '🌊', title: 'ركبت Roaring Rapids واتبللت', desc: 'الـ water ride — لازم تطلع منها مبلولة عشان التحدي', owner: 'all', points: 20, prize: '¥30 + change of clothes' },
        { id: 's7', icon: '🦊', title: 'لعبت في Zootopia: Hot Pursuit', desc: 'اللعبة الجديدة 2024 — Shanghai exclusive، مفيش في أي ديزني تاني', owner: 'all', points: 25, prize: '¥40' },
        { id: 's8', icon: '🌉', title: 'مشيت على الـ Bund وصورت Pudong', desc: 'الـ skyline من أحسن منظر في شنغهاي', owner: 'all', points: 15, prize: 'تختار restaurant آخر يوم' },
        { id: 's9', icon: '🥟', title: 'دينا تأكل xiaolongbao في Yu Garden', desc: 'الـ soup dumplings — التحدي: من غير ما تحرق نفسك بالحساء الجوّاني', owner: 'dina', points: 20, prize: 'spa session في Peninsula' },
        { id: 's10', icon: '🏰', title: 'صورة العيلة قدام ديزني castle', desc: 'القلعة الأكبر في أي ديزني في العالم — كلكم لابسين ميكي ears', owner: 'mfz', points: 30, prize: 'وسام Family of the Year' },
      ],
    },

    // ─── BONUS (any time) ───
    {
      group: 'bonus',
      groupTitle: 'تحديات الكنز 💎 (في أي وقت)',
      groupIcon: '💎',
      list: [
        { id: 'g1', icon: '📵', title: 'بابا بدون موبايل لـ 6 ساعات', desc: 'يوم واحد بس — في Beijing أو Xi\'an — مفيش screen، مفيش social', owner: 'mfz', points: 50, prize: 'بابا يفوز ¥200 شخصياً 😂' },
        { id: 'g2', icon: '🤝', title: 'اعمل صداقة مع طفل صيني', desc: 'سلام، بدّل صورة، اتفقوا تتراسلوا — international friendship', owner: 'all', points: 30, prize: '¥50 + هدية لصاحبه الجديد' },
        { id: 'g3', icon: '🍱', title: 'جربت 5 أكلات صينية مختلفة', desc: 'مش كل واحدة لازم تعجبك — بس لازم تجرب', owner: 'all', points: 20, prize: 'تختار restaurant غربي بكره' },
        { id: 'g4', icon: '✍️', title: 'اكتب اسمك بالحروف الصينية', desc: 'في خطاط شارع — pictograph صيني أصلي', owner: 'all', points: 15, prize: 'كرت بريدي للأصدقاء في مصر' },
        { id: 'g5', icon: '🐼', title: 'صورة مع تمثال باندا', desc: 'في أي مدينة — الباندا رمز الصين', owner: 'all', points: 5, prize: '¥10' },
        { id: 'g6', icon: '🎤', title: 'غنيت في Karaoke مع العيلة', desc: 'الصينيين عندهم KTV في كل مكان — أغنية واحدة كفاية', owner: 'all', points: 25, prize: 'سهرة karaoke لـ ساعتين كاملة' },
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
  function render() {
    const totals = calcPoints();
    const maxPts = Math.max(...Object.values(totals), 1);

    let html = `
      <div class="quests__inner">
        <div class="quests__head">
          <span class="quests__eyebrow">🎮 وضع العائلة · Family Quest Mode</span>
          <h2 class="quests__title">المسابقة الكبيرة!</h2>
          <p class="quests__sub">كل واحد عنده تحديات. تكمّل تحدي تكسب جايزة فورية. الفايز في كل مدينة بياخد لقب البطل!</p>
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

        ${QUESTS.map(group => {
          const totalPts = group.list.reduce((s, q) => s + q.points, 0);
          const earnedPts = group.list.reduce((s, q) => s + (state.done[q.id] ? q.points : 0), 0);
          return `
          <div class="quest-group">
            <div class="quest-group__head">
              <span class="quest-group__icon">${group.groupIcon}</span>
              <h3 class="quest-group__title">${group.groupTitle}</h3>
              <span class="quest-group__progress">${earnedPts} / ${totalPts}</span>
            </div>
            <div class="quest-grid">
              ${group.list.map(q => `
                <div class="quest-card ${state.done[q.id] ? 'done' : ''}" data-quest="${q.id}" data-owner="${q.owner}">
                  <div class="quest-card__head">
                    <div class="quest-card__icon">${q.icon}</div>
                    <span class="quest-card__owner">${ownerLabel(q.owner)} · ${q.points}pt</span>
                  </div>
                  <h4 class="quest-card__title">${q.title}</h4>
                  <p class="quest-card__desc">${q.desc}</p>
                  <div class="quest-card__prize">${q.prize}</div>
                  <button class="quest-btn" data-action="complete" data-id="${q.id}">
                    ${state.done[q.id] ? `خلصت! (${PLAYERS.find(p=>p.key===state.claimedBy[q.id])?.name || ''})` : 'خلصته! اكسب الجايزة'}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;}).join('')}

        <button class="quests__reset">إعادة كل التحديات (Reset)</button>
      </div>
    `;

    const root = document.getElementById('quests');
    if (root) root.innerHTML = html;
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
     INIT
     ───────────────────────────────────────────── */
  function init() {
    injectQuestsSection();
    arabicizeUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
