/* ============================================================
   China Trip 2026 — main.js (v3.0)
   - Countdown (days until 18 June 2026 / Disney 27 June)
   - IntersectionObserver: nav active state + fade-in animations
   - Smooth scroll on nav click
   - Lightbox on image click (delegated, works for photo strips)
   - Pre-departure checklist with localStorage persistence
   - Confetti on checkbox tick
   - Print handler
   - Last updated timestamp
   ============================================================ */

(function () {
  'use strict';

  /* ── Countdown ── */
  const TRIP_START = new Date('2026-06-18T00:00:00+02:00'); // Cairo time
  const DISNEY_START = new Date('2026-06-27T00:00:00+08:00'); // Shanghai time
  const cd = document.getElementById('countdown');
  function tickCountdown() {
    if (!cd) return;
    const now = Date.now();
    const tripDays = Math.ceil((TRIP_START.getTime() - now) / 86400000);
    const disneyDays = Math.ceil((DISNEY_START.getTime() - now) / 86400000);
    if (tripDays > 0) {
      cd.textContent = `🐉 ${tripDays} day${tripDays === 1 ? '' : 's'} until Beijing · 🏰 ${disneyDays} until Disney`;
    } else if (disneyDays > 0) {
      cd.textContent = `✈️ Trip in progress · 🏰 ${disneyDays} until Disney`;
    } else {
      cd.textContent = `✈️ Trip in progress`;
    }
  }
  tickCountdown();
  setInterval(tickCountdown, 1000 * 60 * 30); // every 30 min

  /* ── Active nav highlight + fade-in animations ── */
  const navBtns = document.querySelectorAll('.day-nav__btn');
  const sections = document.querySelectorAll('.day-section[data-day]');

  if ('IntersectionObserver' in window && sections.length) {
    // active nav highlight
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const day = entry.target.dataset.day;
            navBtns.forEach((btn) => {
              btn.classList.toggle('active', btn.dataset.day === day);
            });
            const activeBtn = document.querySelector(`.day-nav__btn[data-day="${day}"]`);
            if (activeBtn) {
              activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((sec) => navObserver.observe(sec));

    // fade-in
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    sections.forEach((sec) => fadeObserver.observe(sec));
  } else {
    // No IO support — show all
    sections.forEach((sec) => sec.classList.add('in-view'));
  }

  /* ── Smooth scroll nav click ── */
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(`.day-section[data-day="${btn.dataset.day}"]`);
      if (target) {
        const navH = document.querySelector('.day-nav')?.offsetHeight || 56;
        const y = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── Lightbox (delegated, works for any image) ── */
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo lightbox');
  lb.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9999',
    'background:rgba(26,24,20,.92)',
    'display:none', 'align-items:center', 'justify-content:center',
    'cursor:zoom-out', 'backdrop-filter:blur(4px)',
    '-webkit-backdrop-filter:blur(4px)',
  ].join(';');

  const lbImg = document.createElement('img');
  lbImg.style.cssText = [
    'max-width:92vw', 'max-height:90vh',
    'border-radius:6px',
    'box-shadow:0 8px 60px rgba(0,0,0,.7)',
    'object-fit:contain',
    'cursor:default',
    'display:block',
  ].join(';');
  lbImg.setAttribute('alt', '');

  const lbCaption = document.createElement('p');
  lbCaption.style.cssText = [
    'position:absolute', 'bottom:2rem', 'left:50%',
    'transform:translateX(-50%)',
    'color:rgba(246,240,231,.85)',
    'font-family:var(--ff-ui,sans-serif)',
    'font-size:.82rem',
    'text-align:center',
    'max-width:80vw',
    'pointer-events:none',
  ].join(';');

  const lbClose = document.createElement('button');
  lbClose.setAttribute('aria-label', 'Close lightbox');
  lbClose.style.cssText = [
    'position:absolute', 'top:1.2rem', 'right:1.5rem',
    'background:none', 'border:none', 'cursor:pointer',
    'color:rgba(246,240,231,.85)', 'font-size:2rem', 'line-height:1',
    'padding:.2rem .5rem', 'border-radius:4px',
  ].join(';');
  lbClose.textContent = '×';

  lb.appendChild(lbImg);
  lb.appendChild(lbCaption);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = alt || '';
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    lb.style.display = 'none';
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
  lbClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.style.display === 'flex') closeLightbox();
  });

  // Delegated click on any content image (photo-strip, day-hero, day-split)
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.photo-strip img, .day-split__image img, .day-hero img');
    if (!img) return;
    e.stopPropagation();
    openLightbox(img.src, img.alt);
  });

  /* ── Pre-departure checklist with localStorage ── */
  const STORAGE_KEY = 'chinatrip-checklist-v1';
  const checklistEl = document.getElementById('predeparture');

  function loadChecklist() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveChecklist(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  if (checklistEl) {
    const state = loadChecklist();
    checklistEl.querySelectorAll('input[type="checkbox"][data-key]').forEach((cb) => {
      const key = cb.dataset.key;
      if (state[key]) cb.checked = true;
      cb.addEventListener('change', () => {
        state[key] = cb.checked;
        saveChecklist(state);
        if (cb.checked) confettiBurst(cb);
      });
    });
    const resetBtn = document.getElementById('resetChecklist');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!confirm('Reset all checklist items?')) return;
        checklistEl.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        saveChecklist({});
      });
    }
  }

  /* ── Confetti burst on tick ── */
  const CONFETTI_COLORS = ['#c1543e', '#c8a96e', '#4a7c5e', '#6aab85', '#e3c99a', '#ffd166'];
  function confettiBurst(anchor) {
    const rect = anchor.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const N = 22;
    for (let i = 0; i < N; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.left = x + 'px';
      piece.style.top = y + 'px';
      const angle = (Math.random() * 2 - 1) * Math.PI;
      const speed = 80 + Math.random() * 160;
      const dx = Math.cos(angle) * speed;
      const dy = -Math.abs(Math.sin(angle)) * speed - 80;
      const rot = (Math.random() * 360) + 'deg';
      piece.style.transform = `translate(0,0) rotate(0)`;
      piece.style.transition = 'transform 1.1s cubic-bezier(.2,.7,.2,1), opacity 1.1s ease';
      document.body.appendChild(piece);
      // animate next frame
      requestAnimationFrame(() => {
        piece.style.transform = `translate(${dx}px, ${dy + 320}px) rotate(${rot})`;
        piece.style.opacity = '0';
      });
      setTimeout(() => piece.remove(), 1200);
    }
  }

  /* ── Last updated timestamp ── */
  const tsEl = document.getElementById('lastUpdated');
  if (tsEl) {
    const d = new Date(document.lastModified || Date.now());
    tsEl.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ── Optional: live weather widget (Open-Meteo, no API key) ── */
  const wxEl = document.getElementById('weatherWidget');
  if (wxEl && 'fetch' in window) {
    // Beijing 39.9042,116.4074 · Xi'an 34.3416,108.9398 · Shanghai 31.2304,121.4737
    const cities = [
      ['Beijing', 39.9042, 116.4074],
      ['Xi\'an',  34.3416, 108.9398],
      ['Shanghai',31.2304, 121.4737],
    ];
    Promise.all(cities.map(([name, lat, lon]) =>
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`)
        .then(r => r.ok ? r.json() : null)
        .then(j => j && j.current ? `${name} ${Math.round(j.current.temperature_2m)}°C` : null)
        .catch(() => null)
    )).then(arr => {
      const valid = arr.filter(Boolean);
      if (valid.length) wxEl.textContent = `🌡️ Now: ${valid.join(' · ')}`;
    });
  }

})();
