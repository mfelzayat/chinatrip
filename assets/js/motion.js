/* ============================================================
   China Trip 2026 — Motion Layer (v4.0)
   Loads AFTER main.js, adds:
   - Scroll progress bar
   - Journey rail (sticky desktop)
   - SVG route path animation
   - Stat counter animation on view
   - Generic [data-reveal] reveal observer
   - Magnetic hover on .city-card
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Scroll progress bar ── */
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    let ticking = false;
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.width = Math.min(100, Math.max(0, pct)) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* ── 2. Journey rail — active dot syncs with day section ── */
  const railDots = document.querySelectorAll('.rail-dot');
  const sections = document.querySelectorAll('.day-section[data-day]');

  if (railDots.length && sections.length && 'IntersectionObserver' in window) {
    const railObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const day = entry.target.dataset.day;
            railDots.forEach((d) => {
              d.classList.toggle('active', d.dataset.day === day);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => railObserver.observe(s));

    railDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const day = dot.dataset.day;
        const target = document.querySelector(`.day-section[data-day="${day}"]`);
        if (target) {
          const navH = (document.querySelector('.day-nav')?.offsetHeight || 56) + 12;
          const y = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── 3. SVG route — animate dasharray flow ── */
  const routePaths = document.querySelectorAll('.route-path');
  routePaths.forEach((p) => p.classList.add('animate'));

  // Plane glide along route on view
  const routeMap = document.querySelector('.route-map');
  const plane = document.getElementById('routePlane');
  const fullPath = document.getElementById('routeFullPath');

  if (routeMap && plane && fullPath && 'IntersectionObserver' in window) {
    let started = false;
    const planeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            animatePlane();
          }
        });
      },
      { threshold: 0.3 }
    );
    planeObs.observe(routeMap);

    function animatePlane() {
      const length = fullPath.getTotalLength();
      const start = performance.now();
      const duration = 6000;
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const pt = fullPath.getPointAtLength(length * ease);
        // Find tangent angle
        const next = fullPath.getPointAtLength(Math.min(length, length * ease + 1));
        const angle = Math.atan2(next.y - pt.y, next.x - pt.x) * 180 / Math.PI;
        plane.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${angle})`);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  /* ── 4. Stat counter animation ── */
  const counters = document.querySelectorAll('.stat-cell__num[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counterObs.unobserve(entry.target);
            countTo(entry.target, parseFloat(entry.target.dataset.target), entry.target.dataset.suffix || '');
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => counterObs.observe(c));

    function countTo(el, target, suffix) {
      const duration = 1200;
      const start = performance.now();
      const isInt = Number.isInteger(target);
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        const value = target * ease;
        el.textContent = (isInt ? Math.round(value) : value.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  /* ── 5. Generic reveal observer for [data-reveal] ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ── 6. Magnetic-ish hover on city cards (subtle parallax) ── */
  const cityCards = document.querySelectorAll('.city-card');
  cityCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    card.addEventListener('click', (e) => {
      // jump to first day of that city
      const map = { beijing: '2', xian: '6', shanghai: '10' };
      const day = map[card.dataset.city];
      if (!day) return;
      const target = document.querySelector(`.day-section[data-day="${day}"]`);
      if (target) {
        const navH = (document.querySelector('.day-nav')?.offsetHeight || 56) + 12;
        const y = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── 7. "Days into the trip" countdown for events ── */
  const eventDateEls = document.querySelectorAll('[data-event-date]');
  const TRIP_START = new Date('2026-06-18T00:00:00+08:00');
  eventDateEls.forEach((el) => {
    const target = new Date(el.dataset.eventDate);
    const now = new Date();
    const days = Math.ceil((target - now) / 86400000);
    if (days > 0) {
      const span = document.createElement('span');
      span.textContent = ` · ${days}d away`;
      span.style.cssText = 'opacity:.6;font-size:.78em;font-weight:500;';
      el.appendChild(span);
    }
  });

})();
