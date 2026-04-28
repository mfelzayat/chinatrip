/* ============================================================
   China Trip 2026 — main.js
   - IntersectionObserver for sticky nav active state
   - Smooth scroll on nav click
   - Lightbox on photo click
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

  /* ── Lightbox ── */
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
    'max-width:90vw', 'max-height:90vh',
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
    'color:rgba(246,240,231,.8)',
    'font-family:var(--ff-ui,sans-serif)',
    'font-size:.82rem',
    'text-align:center',
    'max-width:70vw',
    'pointer-events:none',
  ].join(';');

  const lbClose = document.createElement('button');
  lbClose.setAttribute('aria-label', 'Close lightbox');
  lbClose.style.cssText = [
    'position:absolute', 'top:1.2rem', 'right:1.5rem',
    'background:none', 'border:none', 'cursor:pointer',
    'color:rgba(246,240,231,.8)', 'font-size:2rem', 'line-height:1',
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

  lb.addEventListener('click', (e) => {
    if (e.target !== lbImg) closeLightbox();
  });
  lbClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.style.display === 'flex') closeLightbox();
  });

  // Make all content images clickable (exclude hero bg and tiny thumbnails)
  document.querySelectorAll(
    '.day-split__image img, .day-hero img, .day-content img, .day-section img'
  ).forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
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
