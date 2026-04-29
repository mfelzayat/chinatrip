/* ============================================================
   China Trip 2026 — PLACE PHOTOS v8.0
   Wires a photo to every .stop and .info-card based on
   place-name keyword matching. Photos live next to their info.
   ============================================================ */

(function () {
  'use strict';

  // Place-keyword → image filename(s). First-match wins.
  // Keywords are lowercased substring matches against the stop/info-card text.
  const PLACE_PHOTOS = [
    // Beijing — attractions
    ['forbidden city',         'forbidden-city-1.jpg', '🏯'],
    ['palace museum',          'forbidden-city-1.jpg', '🏯'],
    ['gu gong',                'forbidden-city-1.jpg', '🏯'],
    ['tiananmen',              'tiananmen-square-1.jpg', '🌅'],
    ['gate of heavenly peace', 'tiananmen-square-1.jpg', '🌅'],
    ['mutianyu',               'great-wall-mutianyu-1.jpg', '🧱'],
    ['great wall',             'great-wall-mutianyu-1.jpg', '🧱'],
    ['hutong',                 'beijing-hutong-1.jpg', '🏘️'],
    ['nanluogu',               'beijing-hutong-2.jpg', '🏘️'],
    ['summer palace',          'summer-palace-1.jpg', '🌸'],
    ['kunming lake',           'summer-palace-1.jpg', '🌸'],
    ['temple of heaven',       'temple-of-heaven-1.jpg', '⛩️'],
    ['jingshan',               'forbidden-city-2.jpg', '🌿'],
    ['coal hill',              'forbidden-city-2.jpg', '🌿'],
    ['wangfujing',             'wangfujing-night-1.jpg', '🛍️'],
    // Beijing — restaurants & hotels (use icon placeholders)
    ['capital m',              null, '🍽️'],
    ['imperial mansion',       null, '🏨'],
    ['marriott',               null, '🏨'],
    ['element fresh',          null, '🥗'],
    ['mio',                    null, '🍝'],
    ['four seasons',           null, '🏨'],
    ['blue frog',              null, '🍔'],
    ['hatsune',                null, '🍣'],
    ['wagas',                  null, '🥪'],
    ['pizza marzano',          null, '🍕'],
    ['the schoolhouse',        null, '🍕'],
    ['opera bombana',          null, '🍝'],
    // Xi'an
    ['terracotta',             'xian-terracotta-1.jpg', '🗿'],
    ['mausoleum',              'xian-terracotta-2.jpg', '🗿'],
    ['xi\'an city wall',       'xian-city-wall-1.jpg', '🏯'],
    ['city wall',              'xian-city-wall-1.jpg', '🏯'],
    ['big wild goose',         'xian-pagoda-1.jpg', '🏯'],
    ['wild goose pagoda',      'xian-pagoda-1.jpg', '🏯'],
    ['da ci\'en',              'xian-pagoda-1.jpg', '🏯'],
    ['tang paradise',          'xian-tang-paradise-1.jpg', '🌸'],
    ['tang dynasty show',      null, '🎭'],
    ['huaqing',                null, '♨️'],
    ['shaanxi history museum', 'xian-shaanxi-museum-1.jpg', '🏺'],
    ['muslim quarter',         'xian-muslim-quarter-1.jpg', '🏮'],
    ['huimin',                 'xian-muslim-quarter-1.jpg', '🏮'],
    ['bell tower',             'xian-bell-tower-1.jpg', '🔔'],
    ['drum tower',             'xian-bell-tower-2.jpg', '🥁'],
    // Xi'an restaurants & hotels
    ['crowne plaza',           null, '🏨'],
    ['sofitel',                null, '🏨'],
    ['le grand',               null, '🍷'],
    ['westin',                 null, '🏨'],
    ['vinotech',               null, '🍷'],
    ['wei jia',                null, '🍜'],
    ['biangbiang',             null, '🍜'],
    // Sleeper train
    ['sleeper train',          null, '🛏️'],
    ['soft sleeper',           null, '🛏️'],
    ['d310',                   null, '🚆'],
    ['z40',                    null, '🚆'],
    ['hsr',                    null, '🚄'],
    ['g653',                   null, '🚄'],
    ['high-speed rail',        null, '🚄'],
    ['beijing west',           null, '🚄'],
    // Shanghai — attractions
    ['shanghai disneyland',    'shanghai-disney-1.jpg', '🏰'],
    ['enchanted storybook',    'shanghai-disney-1.jpg', '🏰'],
    ['toy story land',         'disney-toystory-1.jpg', '🤠'],
    ['toy story hotel',        'disney-toystory-2.jpg', '🤠'],
    ['tron lightcycle',        'disney-tron-1.jpg', '🏍️'],
    ['tron',                   'disney-tron-1.jpg', '🏍️'],
    ['pirates of the caribbean','disney-pirates-1.jpg', '🏴‍☠️'],
    ['soaring',                'disney-soaring-1.jpg', '🦅'],
    ['zootopia',               'disney-zootopia-1.jpg', '🦊'],
    ['adventure isle',         'disney-soaring-2.jpg', '🏝️'],
    ['roaring rapids',         'disney-soaring-2.jpg', '🏝️'],
    ['camp discovery',         'disney-soaring-2.jpg', '🏝️'],
    ['pinocchio',              null, '🍝'],
    ['sunnyside',              null, '☕'],
    ['royal banquet',          null, '👸'],
    ['lumière',                null, '🇫🇷'],
    ['aurora',                 null, '🥩'],
    ['wolfgang puck',          null, '🍴'],
    // Shanghai Bund
    ['the bund',               'the-bund-shanghai-1.jpg', '🌃'],
    ['nanjing road',           'nanjing-road-1.jpg', '🛍️'],
    ['yu garden',              'yu-garden-shanghai-1.jpg', '🌿'],
    ['shanghai tower',         'pudong-skyline-1.jpg', '🏙️'],
    ['oriental pearl',         'pudong-skyline-1.jpg', '🏙️'],
    ['pudong',                 'pudong-skyline-2.jpg', '🏙️'],
    ['lost heaven',            null, '🍴'],
    ['mr & mrs bund',          null, '🍷'],
    ['m on the bund',          null, '🍷'],
    ['jean georges',           null, '🇫🇷'],
    ['otto e mezzo',           null, '🍝'],
    ['nanxiang',               null, '🥟'],
    ['baker & spice',          null, '🥐'],
    ['xintiandi',              null, '☕'],
    ['tianzifang',             null, '☕'],
    ['peninsula',              null, '🏨'],
    // Flights & airports
    ['ek 924',                 null, '✈️'],
    ['ek 306',                 null, '✈️'],
    ['ek 303',                 null, '✈️'],
    ['ek 927',                 null, '✈️'],
    ['cairo',                  null, '🇪🇬'],
    ['dubai',                  null, '🇦🇪'],
    ['emirates',               null, '✈️'],
    ['emirates lounge',        null, '🥂'],
  ];

  // Color theming based on city / type — used for placeholder bg
  function placeholderTheme(text) {
    const t = text.toLowerCase();
    if (t.match(/beijing|tiananmen|forbidden|hutong|wangfujing|temple|summer/)) {
      return 'linear-gradient(135deg, #ff5e3a, #ff8c5a)';
    }
    if (t.match(/xi'an|terracotta|wall|pagoda|tang|shaanxi|muslim|bell|drum|crowne plaza|sofitel|westin|vinotech|huaqing|wei jia|biangbiang/)) {
      return 'linear-gradient(135deg, #f5b94a, #ffd28a)';
    }
    if (t.match(/shanghai|disney|bund|pudong|nanjing|yu garden|toy story|tron|pirates|soaring|zootopia|peninsula|lost heaven|jean georges/)) {
      return 'linear-gradient(135deg, #4ec78f, #6bdbb0)';
    }
    if (t.match(/cairo|dubai|emirates|ek\s|airport|flight|sleeper|hsr|train|g653|d310|z40/)) {
      return 'linear-gradient(135deg, #b48bff, #d4b3ff)';
    }
    return 'linear-gradient(135deg, #6e6a82, #9e96b8)';
  }

  function findMatch(text) {
    const lower = text.toLowerCase();
    for (const [keyword, file, emoji] of PLACE_PHOTOS) {
      if (lower.includes(keyword)) {
        return { file, emoji };
      }
    }
    return null;
  }

  function buildPhotoEl(text, fallbackEmoji) {
    const match = findMatch(text);
    const wrap = document.createElement('div');
    wrap.className = 'place-photo';

    if (match && match.file) {
      const img = document.createElement('img');
      img.src = `assets/images/${match.file}`;
      img.alt = text.split('\n')[0].slice(0, 60);
      img.loading = 'lazy';
      wrap.appendChild(img);
    } else {
      const emoji = (match && match.emoji) || fallbackEmoji || '📍';
      wrap.classList.add('place-photo--icon');
      wrap.style.background = placeholderTheme(text);
      const span = document.createElement('span');
      span.className = 'place-photo__emoji';
      span.textContent = emoji;
      wrap.appendChild(span);
    }
    return wrap;
  }

  function decorateStops() {
    const stops = document.querySelectorAll('.stop');
    stops.forEach((stop) => {
      if (stop.querySelector('.place-photo')) return; // already decorated
      const nameEl = stop.querySelector('.stop__name');
      const descEl = stop.querySelector('.stop__desc');
      const text = (nameEl ? nameEl.textContent : '') + ' ' + (descEl ? descEl.textContent : '');
      const iconEl = stop.querySelector('.stop__icon');
      const fallbackEmoji = iconEl ? iconEl.textContent : '📍';
      const photo = buildPhotoEl(text, fallbackEmoji);
      // Insert before stop__icon (so layout: photo + body together)
      stop.insertBefore(photo, stop.firstChild);
      stop.classList.add('has-photo');
    });
  }

  function decorateInfoCards() {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card) => {
      if (card.querySelector('.place-photo')) return;
      // Skip cards in extras grid (they're confirmed bookings — different layout)
      if (card.closest('.extras')) return;
      const titleEl = card.querySelector('.info-card__title');
      const detailEl = card.querySelector('.info-card__detail');
      const labelEl = card.querySelector('.info-card__label');
      const text = (titleEl ? titleEl.textContent : '') + ' ' + (detailEl ? detailEl.textContent : '') + ' ' + (labelEl ? labelEl.textContent : '');
      // Try to detect an emoji from the label (✈ Flight, 🏨 Hotel etc.)
      let fallbackEmoji = '📍';
      if (labelEl) {
        const emojiMatch = labelEl.textContent.match(/[\p{Emoji}]/u);
        if (emojiMatch) fallbackEmoji = emojiMatch[0];
      }
      const photo = buildPhotoEl(text, fallbackEmoji);
      card.insertBefore(photo, card.firstChild);
      card.classList.add('has-photo');
    });
  }

  function run() {
    decorateStops();
    decorateInfoCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
