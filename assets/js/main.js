/* ============================================================
   China Trip 2026 — main.js
   - IntersectionObserver for sticky nav active state
   - Print handler
   - Last updated timestamp
   ============================================================ */

(function () {
  'use strict';

  /* ── Active nav highlight ── */
  const navBtns = document.querySelectorAll('.day-nav__btn');
  const sections = document.querySelectorAll('.day-section[data-day]');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const day = entry.target.dataset.day;
            navBtns.forEach((btn) => {
              btn.classList.toggle('active', btn.dataset.day === day);
            });
            // scroll active button into view in the nav bar
            const activeBtn = document.querySelector(`.day-nav__btn[data-day="${day}"]`);
            if (activeBtn) {
              activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
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

  /* ── Print button ── */
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  /* ── Last updated timestamp ── */
  const tsEl = document.getElementById('lastUpdated');
  if (tsEl) {
    const d = new Date(document.lastModified || Date.now());
    tsEl.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
})();
