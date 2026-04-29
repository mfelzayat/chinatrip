/* ============================================================
   China Trip 2026 — REDESIGN v6.0 JS
   - Mobile bottom-tab nav (city-based)
   - Extras tab switcher
   - Robust click-to-jump (overrides earlier handlers)
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────
     1. INJECT MOBILE BOTTOM TAB BAR
     ───────────────────────────────────────────────────── */
  function buildMobileTabs() {
    if (document.querySelector('.mobile-tabs')) return;

    const tabs = document.createElement('nav');
    tabs.className = 'mobile-tabs';
    tabs.setAttribute('aria-label', 'Mobile city navigation');
    tabs.innerHTML = `
      <div class="mobile-tabs__inner">
        <button class="mobile-tab" data-target="top" aria-label="Top of trip">
          <span class="mobile-tab__icon">🏠</span>
          <span class="mobile-tab__label">Home</span>
        </button>
        <button class="mobile-tab" data-target="beijing" data-jump="2" aria-label="Beijing days">
          <span class="mobile-tab__icon">🏯</span>
          <span class="mobile-tab__label">Beijing</span>
        </button>
        <button class="mobile-tab" data-target="xian" data-jump="6" aria-label="Xi'an days">
          <span class="mobile-tab__icon">🗿</span>
          <span class="mobile-tab__label">Xi'an</span>
        </button>
        <button class="mobile-tab" data-target="shanghai" data-jump="10" aria-label="Shanghai days">
          <span class="mobile-tab__icon">🏰</span>
          <span class="mobile-tab__label">Disney</span>
        </button>
        <button class="mobile-tab" data-target="extras" aria-label="Extras (costs, bookings, apps)">
          <span class="mobile-tab__icon">🧰</span>
          <span class="mobile-tab__label">Plan</span>
        </button>
      </div>
    `;
    document.body.appendChild(tabs);

    // Click handlers
    tabs.querySelectorAll('.mobile-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.target;
        if (target === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (target === 'extras') {
          const ex = document.querySelector('.extras');
          if (ex) ex.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          const day = btn.dataset.jump;
          const sec = document.querySelector(`.day-section[data-day="${day}"]`);
          if (sec) {
            const y = sec.getBoundingClientRect().top + window.pageYOffset - 16;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          }
        }
        // Active state on click
        tabs.querySelectorAll('.mobile-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Auto-update active tab based on scroll position
    const dayToCity = (d) => {
      const n = parseInt(d, 10);
      if (n >= 2 && n <= 5) return 'beijing';
      if (n >= 6 && n <= 9) return 'xian';
      if (n >= 10 && n <= 13) return 'shanghai';
      return 'top';
    };

    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('.day-section[data-day]');
      const cityObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const city = dayToCity(entry.target.dataset.day);
            tabs.querySelectorAll('.mobile-tab').forEach(b => {
              b.classList.toggle('active', b.dataset.target === city);
            });
          }
        });
      }, { rootMargin: '-30% 0px -55% 0px' });
      sections.forEach((s) => cityObs.observe(s));

      // Top tab when scrolled near top
      window.addEventListener('scroll', () => {
        if (window.scrollY < 200) {
          tabs.querySelectorAll('.mobile-tab').forEach(b => b.classList.remove('active'));
          tabs.querySelector('[data-target="top"]').classList.add('active');
        }
      }, { passive: true });
    }
  }

  /* ─────────────────────────────────────────────────────
     2. CONVERT EXTRAS GRID INTO TABBED PANELS
     ───────────────────────────────────────────────────── */
  function buildExtrasTabs() {
    const extrasInner = document.querySelector('.extras__inner');
    const grid = document.querySelector('.extras__grid');
    if (!extrasInner || !grid) return;

    document.querySelector('.extras').classList.add('extras--tabbed');

    const panels = Array.from(grid.children);
    if (!panels.length) return;

    // Read first <h2> from each panel for tab label
    const tabData = panels.map((panel, i) => {
      const h2 = panel.querySelector('h2');
      const labelText = h2 ? h2.textContent.split('·')[0].trim() : `Section ${i + 1}`;
      // Short version
      const shortMap = {
        'Mandarin Phrasebook': 'Phrases',
        'Practical Tips': 'Tips',
        'Emergency Contacts': 'Emergency',
        'Before Leaving Cairo': 'Checklist',
        'Estimated Costs': 'Costs',
        'Apps to Install': 'Apps',
        'Getting Around': 'Transport',
        'Plan B': 'Plan B',
      };
      let short = labelText;
      Object.keys(shortMap).forEach(k => { if (labelText.indexOf(k) === 0) short = shortMap[k]; });
      return { panel, label: short, full: labelText, idx: i };
    });

    // Find the bookings block (it's a div before extras__grid, sibling)
    const bookingsBlock = extrasInner.querySelector(':scope > div[style*="margin-bottom: 3.5rem"], :scope > div:first-child');
    if (bookingsBlock && bookingsBlock !== grid && !bookingsBlock.classList.contains('extras-tabs')) {
      // Treat bookings as a panel too
      tabData.unshift({ panel: bookingsBlock, label: 'Bookings', full: 'Confirmed Bookings', idx: -1, isBookings: true });
    }

    // Build tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'extras-tabs';
    tabBar.setAttribute('role', 'tablist');
    tabData.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.className = 'extras-tab' + (i === 0 ? ' active' : '');
      btn.textContent = t.label;
      btn.dataset.target = String(i);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tabBar.appendChild(btn);
    });

    // Wrap each panel
    tabData.forEach((t, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'extras-panel' + (i === 0 ? ' active' : '');
      wrap.dataset.idx = String(i);
      wrap.setAttribute('role', 'tabpanel');
      t.panel.parentNode.insertBefore(wrap, t.panel);
      wrap.appendChild(t.panel);
      // Make sure the wrapped div is visible (extras__grid > div was display:none in tabbed mode)
      t.panel.style.display = 'block';
    });

    // Insert tab bar at top of extras__inner
    extrasInner.insertBefore(tabBar, extrasInner.firstChild);

    // Tab switching
    tabBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.extras-tab');
      if (!btn) return;
      const idx = btn.dataset.target;
      tabBar.querySelectorAll('.extras-tab').forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      document.querySelectorAll('.extras-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.idx === idx);
      });
    });

    // Hash-link support (#extras-costs etc.)
    const hash = window.location.hash;
    if (hash.startsWith('#extras-')) {
      const want = hash.replace('#extras-', '').toLowerCase();
      const matchIdx = tabData.findIndex(t => t.label.toLowerCase().replace(/\s+/g, '-') === want);
      if (matchIdx >= 0) {
        tabBar.querySelectorAll('.extras-tab')[matchIdx].click();
      }
    }
  }

  /* ─────────────────────────────────────────────────────
     3. Run on DOM ready
     ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildMobileTabs();
      buildExtrasTabs();
    });
  } else {
    buildMobileTabs();
    buildExtrasTabs();
  }

})();
