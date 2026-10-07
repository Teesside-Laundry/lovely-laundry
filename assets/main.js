// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

// Top bar ticker (mobile): wrap the contact items in a track and clone them so
// the marquee loops seamlessly. On desktop the clones are hidden via CSS and the
// bar lays out as before; if this script doesn't run, the original items still
// show normally.
const topWrap = document.querySelector('.topbar .wrap');
if (topWrap && !topWrap.querySelector('.topbar-track')) {
  const track = document.createElement('div');
  track.className = 'topbar-track';
  while (topWrap.firstChild) track.appendChild(topWrap.firstChild);
  [...track.children].forEach((node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    track.appendChild(clone);
  });
  topWrap.appendChild(track);
}

// Scroll reveal (respects reduced-motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (prefersReduced || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// October promo banner: 15% off dry cleaning with code DRYCLEAN15. Injected
// above the top bar on every page and removes itself automatically once the
// offer ends (midnight UK time, 1 Nov 2026). To end it early, delete this block.
const PROMO_END = new Date('2026-11-01T00:00:00Z');
const topbar = document.querySelector('.topbar');
if (topbar && new Date() < PROMO_END && !document.querySelector('.promo')) {
  const spark = '<svg class="promo-spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10Z" fill="currentColor"/></svg>';
  const group = (hidden) => `
    <div class="promo-group"${hidden ? ' aria-hidden="true"' : ''}>
      <span class="promo-item">${spark}<b>15% off</b>&nbsp;all dry cleaning this October</span>
      <span class="promo-item">${spark}Use code <button type="button" class="promo-code"${hidden ? ' tabindex="-1"' : ''} title="Copy code">DRYCLEAN15</button></span>
      <span class="promo-item">${spark}Offer ends 31&nbsp;October</span>
    </div>`;
  const promo = document.createElement('aside');
  promo.className = 'promo';
  promo.setAttribute('aria-label', 'October offer: 15% off all dry cleaning with code DRYCLEAN15, until 31 October');
  promo.innerHTML = `
    <div class="promo-viewport">
      <div class="promo-track">${group(false)}${group(true)}${group(true)}${group(true)}</div>
    </div>
    <span class="promo-toast" role="status" aria-live="polite"></span>`;
  topbar.before(promo);

  // Tap the code to copy it.
  const toast = promo.querySelector('.promo-toast');
  let toastTimer;
  promo.querySelectorAll('.promo-code').forEach((btn) =>
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('DRYCLEAN15'); toast.textContent = 'Code DRYCLEAN15 copied'; }
      catch { toast.textContent = 'Use code DRYCLEAN15'; }
      promo.classList.add('show-toast');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => promo.classList.remove('show-toast'), 1800);
    })
  );
}
