document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', e => { e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', e => { if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Active nav link via IntersectionObserver
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + en.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

  // Toast + copy email
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let timer;
  const showToast = msg => {
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 3000);
  };
  const copyBtn = document.getElementById('copy-email-btn');
  copyBtn.addEventListener('click', async () => {
    const email = 'michaelbassey808@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email address copied');
    } catch {
      showToast(email);
    }
  });

  // Scroll animations
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.section .kicker, .section h2, .card, .timeline > li, .toolkit > div, .contact-box, .note');
  targets.forEach(el => {
    el.classList.add('reveal');
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal') || c === el);
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4) * 0.09 + 's');
  });
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => revealIO.observe(el));

  // Count-up stats
  document.querySelectorAll('.stats dt').forEach(dt => {
    const m = dt.textContent.match(/^(\d+)(.*)$/);
    if (!m || reduce) return;
    const end = +m[1], suffix = m[2], t0 = performance.now() + 700;
    const tick = now => {
      const p = Math.min(Math.max((now - t0) / 1200, 0), 1);
      dt.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    dt.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  });

  // Scroll progress + header shadow
  const bar = document.getElementById('progress');
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    header.classList.toggle('scrolled', scrollY > 10);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('current-year').textContent = new Date().getFullYear();
});