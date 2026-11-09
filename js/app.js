/* Wesley Telles portfolio: app window shell, SPA-style navigation with logo transition, per-page accent colour,
   smooth scroll, scroll-driven motion and i18n (PT default / EN toggle). */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r => setTimeout(r, ms));

const html = document.documentElement;
const frame = $('#frame');
const scroller = $('#scroller');
const content = $('#content');
const loader = $('#loader');
const EMAIL = 'wesleytellesbr@gmail.com';

let lang = html.getAttribute('data-lang') === 'en' ? 'en' : 'pt';
let lenis = null;
let sceneHandle = null;
let observers = [];
let navigating = false;
let covered = true;            /* the logo curtain is up: page-entrance animations wait for it to lift */
const onReveal = [];

const gsapOK = () => typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const whenRevealed = fn => (covered ? onReveal.push(fn) : fn());

/* ---------------------------------------------------------------- i18n */
const MSG = {
  pt: { req: 'Preencha nome, e-mail e mensagem e aceite o termo para enviar.', mail: 'E-mail inválido.', ok: 'Abrindo o seu aplicativo de e-mail…', subj: 'Contato pelo portfólio', loc: 'pt-BR' },
  en: { req: 'Please fill in name, email and message and accept the terms to send.', mail: 'Invalid email.', ok: 'Opening your email app…', subj: 'Message from the portfolio', loc: 'en-GB' }
};

function applyIA() {
  $$('[data-ia]').forEach(el => {
    el.dataset.ia.split(',').forEach(a => {
      const v = el.getAttribute(`data-ia-${a}-${lang}`);
      if (v != null) el.setAttribute(a, v);
    });
  });
}
function pageTitle() {
  const pg = $('.page', content);
  if (pg) document.title = pg.getAttribute(`data-title-${lang}`) || document.title;
}
function setLang(next, persist = true) {
  lang = next;
  html.setAttribute('data-lang', lang);
  html.lang = lang === 'en' ? 'en' : 'pt-BR';
  if (persist) { try { localStorage.setItem('wt-lang', lang); } catch (e) {} }
  applyIA(); pageTitle(); tickClock();
  if (gsapOK()) requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* ---------------------------------------------------------------- helpers */
const setInner = () => html.style.setProperty('--inner-h', scroller.clientHeight + 'px');
const setAccent = () => { document.body.dataset.accent = $('.page', content)?.dataset.accent || 'green'; };

function splitWords(root) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
          w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
    });
  };
  walk(root);
}
/* both language versions live in the DOM, so every word effect runs per language span */
const langGroups = el => { const g = $$('[data-l]', el); return g.length ? g : [el]; };

function tickClock() {
  const t = $('#clock');
  if (!t) return;
  try { t.textContent = new Intl.DateTimeFormat(MSG[lang].loc, { timeZone: 'America/Recife', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); }
  catch (e) { t.textContent = new Date().toTimeString().slice(0, 5); }
}

/* ---------------------------------------------------------------- smooth scroll + custom scrollbar */
function initScroll() {
  if (gsapOK()) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.defaults({ scroller }); }
  if (typeof Lenis !== 'undefined' && !reduce) {
    lenis = new Lenis({ wrapper: scroller, content, duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (gsapOK()) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const thumb = $('.sb .thumb');
  const upd = () => {
    const sh = scroller.scrollHeight, ch = scroller.clientHeight, trackTop = 18, trackH = ch - 36;
    if (sh <= ch + 2) { thumb.style.opacity = 0; return; }
    thumb.style.opacity = 1;
    const th = Math.max(28, trackH * ch / sh);
    thumb.style.height = th + 'px';
    thumb.style.top = (trackTop + (trackH - th) * (scroller.scrollTop / (sh - ch))) + 'px';
  };
  scroller.addEventListener('scroll', upd, { passive: true });
  new ResizeObserver(() => { setInner(); upd(); }).observe(scroller);
  new ResizeObserver(upd).observe(content);
  upd();
}

/* ---------------------------------------------------------------- reusable scroll motion */
const st = cfg => cfg;   /* ScrollTrigger configs are passed straight through; teardown() kills every instance */

/* One-shot entrance. ScrollTrigger's own "once" can be consumed without playing when a fast scroll jumps past the
   whole element, leaving it hidden; here the trigger stays armed (end far below) so being past the start is enough. */
function revealFrom(targets, vars, trigger, start) {
  /* a paused timeline (not a paused tween): with "stagger", paused would be applied to the children and they would never run */
  const tl = gsap.timeline({ paused: true });
  /* fromTo with explicit end values: if an earlier init already left inline styles (opacity 0), a plain from() would read them as the end state */
  const to = { overwrite: 'auto' }, from = {};
  for (const k in vars) {
    if (k in { opacity: 1, x: 1, y: 1, scale: 1, scaleX: 1, scaleY: 1, xPercent: 1, yPercent: 1 }) { from[k] = vars[k]; to[k] = (k === 'opacity' || k.startsWith('scale')) ? 1 : 0; }
    else to[k] = vars[k];
  }
  tl.fromTo(targets, from, to);
  gsap.set(targets, from);
  let played = false;
  const go = () => { if (!played) { played = true; tl.play(); } };
  ScrollTrigger.create({ trigger, start, end: '+=999999', onEnter: go, onUpdate: self => { if (self.progress > 0) go(); } });
  return tl;
}

/* words go from dim to full as the heading scrolls into place (reference: "Some of the techs I like to work with") */
function wordsIn(el) {
  langGroups(el).forEach(g => {
    splitWords(g);
    const ws = $$('.wi', g);
    gsap.set(ws, { opacity: .16 });
    gsap.to(ws, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: st({ trigger: el, start: 'top 90%', end: 'top 36%', scrub: true }) });
  });
}

/* a composition of windows that drift past one another */
function parallaxCollage(col, speeds) {
  $$('.slot', col).forEach((slot, i) => {
    const sp = speeds[i % speeds.length];
    gsap.fromTo(slot, { yPercent: sp }, { yPercent: -sp, ease: 'none', scrollTrigger: st({ trigger: col, start: 'top bottom', end: 'bottom top', scrub: .8 }) });
  });
  revealFrom($$('.win', col), { opacity: 0, y: 40, scale: .96, duration: 1, stagger: .12, ease: 'power3.out' }, col, 'top 96%');
  revealFrom($$('.code li', col), { opacity: 0, x: -14, duration: .6, stagger: .06, delay: .4, ease: 'power2.out' }, col, 'top 96%');
}

function revealCommon() {
  if (!gsapOK() || reduce) { $$('[data-reveal]').forEach(e => { e.style.opacity = 1; }); return; }
  $$('[data-reveal]').forEach(el => {
    revealFrom(el, { opacity: 0, y: 40, duration: 1, ease: 'power3.out' }, el, 'top 92%');
    const lines = $$('.code li', el);
    if (lines.length) revealFrom(lines, { opacity: 0, x: -14, duration: .6, stagger: .09, delay: .25, ease: 'power2.out' }, el, 'top 92%');
  });
  $$('[data-split]').forEach(h => {
    splitWords(h);
    revealFrom($$('.wi', h), { yPercent: 115, duration: 1, stagger: .045, ease: 'power4.out' }, h, 'top 88%');
  });
  $$('[data-words]').forEach(wordsIn);
  $$('.vline:not(.hero-line)').forEach(v => gsap.fromTo(v, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st({ trigger: v, start: 'top 92%', end: 'bottom 55%', scrub: true }) }));
  const head = $('.phead');
  if (head) {
    const h = $('h1', head); splitWords(h);
    whenRevealed(() => {
      gsap.from($$('.wi', h), { yPercent: 115, duration: 1.1, stagger: .05, ease: 'power4.out', delay: .1 });
      gsap.from([$('.eyebrow', head), $('p', head)], { opacity: 0, y: 16, duration: .9, stagger: .15, delay: .3, ease: 'power3.out' });
    });
  }
}

function mountScene(set) {
  const canvas = $('#scene');
  if (!canvas) return;
  const go = (tries = 2) => import('/js/scene.js').then(m => m.mountScene(canvas, scroller, set)).then(h => {
    if ($('#scene') !== canvas) { h && h.destroy(); return; }   /* page changed while loading */
    sceneHandle = h;
  }).catch(e => { console.warn('3D scene failed', e); if (tries > 1) setTimeout(() => go(tries - 1), 1500); });
  go();
}

/* ---------------------------------------------------------------- pages */
function initHome() {
  const hero = $('[data-hero]');
  if (!hero) return;
  mountScene('home');
  if (!gsapOK() || reduce) return;
  const h1 = $('.hero-a h1'); splitWords(h1);
  gsap.set('.hero-a .eyebrow,.hero-a p', { opacity: 0, y: 16 });
  whenRevealed(() => {
    gsap.timeline({ delay: .1 })
      .from($$('.wi', h1), { yPercent: 115, duration: 1.2, stagger: .06, ease: 'power4.out' })
      .to('.hero-a .eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, .1)
      .to('.hero-a p', { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, .6);
  });
  /* A fades out, B ("Seu desenvolvedor de software") rises into place and stays up top while the windows slide in underneath */
  gsap.timeline({ scrollTrigger: st({ trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .6 }) })
    .to('.hero-a', { opacity: 0, y: -70, filter: 'blur(8px)', ease: 'none', duration: .3 })
    .fromTo('.hero-b', { opacity: 0, y: 70, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none', duration: .28 }, .25)
    .to('.hero-b', { y: () => -scroller.clientHeight * .24, ease: 'none', duration: .4 }, .55)
    .to('.hero-b', { opacity: 0, ease: 'none', duration: .14 }, .9);
  const col = $('.collage');
  if (col) parallaxCollage(col, [12, 20, 32, 36, 18]);
  initRows();
}

function initAbout() {
  const hero = $('[data-ahero]');
  if (!hero) return;
  mountScene('about');
  if (!gsapOK() || reduce) return;
  const hl = $('.hero-line');
  const h1 = $('h1', hero), p = $('p', hero);
  [h1, p].forEach(splitWords);
  whenRevealed(() => {
    gsap.from($$('.wi', h1), { yPercent: 115, filter: 'blur(14px)', duration: 1.2, stagger: .06, ease: 'power4.out', clearProps: 'filter' });
    gsap.from([$('.eyebrow', hero), p], { opacity: 0, y: 16, duration: .9, stagger: .18, delay: .35, ease: 'power3.out' });
    gsap.from(hl, { scaleY: 0, transformOrigin: 'top', duration: 1.2, delay: .8, ease: 'power3.out' });
  });
  /* the headline and lead dissolve word by word as you scroll (reference behaviour) */
  const tl = gsap.timeline({ scrollTrigger: st({ trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .6 }) });
  ['pt', 'en'].forEach(L => {
    const ws = $$(`[data-l="${L}"] .wi`, hero);
    tl.to(ws, { opacity: 0, y: -22, stagger: .06, ease: 'none', duration: .35 }, .08);
  });
  tl.to('.eyebrow', { opacity: 0, ease: 'none', duration: .2 }, .05).to(hl, { opacity: 0, ease: 'none', duration: .2 }, .1);
  const col = $('.collage');
  if (col) parallaxCollage(col, [10, 26, 34, 18, 30]);
  $$('.narrow .win').forEach(w => {
    revealFrom(w, { opacity: 0, y: 50, duration: 1, ease: 'power3.out' }, w, 'top 88%');
    const chips = $$('.chips li, .logos li', w);
    if (chips.length) revealFrom(chips, { opacity: 0, y: 14, duration: .6, stagger: .035, ease: 'power2.out' }, w, 'top 80%');
  });
}

/* the background word is a marquee driven by scroll (reference): it travels one word-width over the page */
function initGhost() {
  const gm = $('.gm');
  if (!gm || !gsapOK() || reduce) return;
  gsap.to(gm, { x: () => -$('span', gm).getBoundingClientRect().width, ease: 'none',
    scrollTrigger: st({ trigger: content, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }) });
}

/* project rows: each enters in turn, its tags appear one after another, and the preview window pops in and follows the cursor */
function initRows() {
  if (!gsapOK() || reduce) return;
  const fine = matchMedia('(hover:hover)').matches;
  $$('.prow').forEach(row => {
    revealFrom(row, { opacity: 0, y: 50, duration: .9, ease: 'power3.out' }, row, 'top 94%');
    revealFrom($$('.chips li', row), { opacity: 0, y: 8, duration: .5, stagger: .08, ease: 'power2.out', delay: .25 }, row, 'top 90%');
    const prev = $('.prev', row), win = $('.pwin', row);
    if (!prev || !fine) return;
    gsap.set(prev, { yPercent: -50, opacity: 0 });
    const qx = gsap.quickTo(win, 'x', { duration: .6, ease: 'power3.out' });
    const qy = gsap.quickTo(win, 'y', { duration: .6, ease: 'power3.out' });
    const qr = gsap.quickTo(win, 'rotation', { duration: .8, ease: 'power3.out' });
    row.addEventListener('mouseenter', () => {
      gsap.fromTo(prev, { opacity: 0 }, { opacity: 1, duration: .35, ease: 'power2.out', overwrite: 'auto' });
      gsap.fromTo(win, { scale: .82, clipPath: 'inset(0 0 100% 0)' }, { scale: 1, clipPath: 'inset(0 0 0% 0)', duration: .75, ease: 'expo.out', overwrite: 'auto' });
    });
    row.addEventListener('mousemove', e => {
      const r = row.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width * .75)) * .06);
      qy((e.clientY - (r.top + r.height / 2)) * .35);
      qr((e.clientX - (r.left + r.width * .75)) * .012);
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(prev, { opacity: 0, duration: .3, ease: 'power2.in', overwrite: 'auto' });
      gsap.to(win, { scale: .94, duration: .45, ease: 'power3.in', overwrite: 'auto' });
      qx(0); qy(0); qr(0);
    });
  });
}

/* pinned showcase: every screen slides up over the previous one while the scroll keeps going down */
function initSeq() {
  const sec = $('[data-seq]');
  if (!sec || !gsapOK() || reduce) return;
  const fr = $$('.seq-f', sec);
  gsap.set(fr.slice(1), { yPercent: 100 });
  const tl = gsap.timeline({ scrollTrigger: st({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .6 }), defaults: { ease: 'none' } });
  fr.slice(1).forEach((f, i) => {
    tl.to(f, { yPercent: 0, duration: 1 }, i * 1.25);
    tl.to(fr[i], { scale: .93, opacity: .55, duration: 1 }, i * 1.25);
    tl.fromTo($('.seq-i', f), { yPercent: 16 }, { yPercent: 0, duration: 1 }, i * 1.25);
  });
}

function initProject() {
  if (!gsapOK() || reduce) return;
  const h1 = $('.phero h1');
  if (!h1) return;
  splitWords(h1);
  whenRevealed(() => {
    gsap.from($$('.wi', h1), { yPercent: 115, duration: 1.2, stagger: .06, ease: 'power4.out' });
    gsap.from([$('.phero .eyebrow'), $('.phero .chips')], { opacity: 0, y: 14, duration: .9, stagger: .15, delay: .35, ease: 'power3.out' });
    gsap.from('.phero .hero-line', { scaleY: 0, transformOrigin: 'top', duration: 1.2, delay: .8, ease: 'power3.out' });
  });
  /* the project image rises into place as it is scrolled to */
  const shot = $('[data-hshot]');
  if (shot) gsap.fromTo(shot, { y: 160, opacity: .35 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: st({ trigger: shot, start: 'top 108%', end: 'top 50%', scrub: .7 }) });
  initSeq();
  initRows();
  const fields = $$('.pi-f');
  if (fields.length) revealFrom(fields, { opacity: 0, y: 24, duration: .8, stagger: .1, ease: 'power3.out' }, $('.pinfo'), 'top 85%');
}

function initVideos() {
  const vids = $$('.portrait-video');
  if (!vids.length || reduce) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  }), { root: scroller, threshold: .25 });
  vids.forEach(v => io.observe(v));
  observers.push(io);
}

function initAchievements() {
  const chips = $$('.filters .chip');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.toggle('on', x === c));
    const f = c.dataset.filter;
    $$('.ach').forEach(a => { a.hidden = f !== 'all' && a.dataset.type !== f; });
  }));
}

function initContact() {
  const form = $('#contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const m = MSG[lang], err = $('#ferr');
    const v = n => form.elements[n].value.trim();
    err.classList.remove('ok');
    if (!v('name') || !v('email') || !v('message') || !form.elements.agree.checked) { err.textContent = m.req; err.hidden = false; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) { err.textContent = m.mail; err.hidden = false; return; }
    const body = [v('message'), '', `— ${v('name')}`, v('company') && `(${v('company')})`, v('website'), v('email')].filter(Boolean).join('\n');
    err.textContent = m.ok; err.classList.add('ok'); err.hidden = false;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(m.subj)}&body=${encodeURIComponent(body)}`;
  });
}

function teardown() {
  observers.forEach(o => o.disconnect()); observers = [];
  if (gsapOK()) { ScrollTrigger.getAll().forEach(t => t.kill()); }
  if (sceneHandle) { sceneHandle.destroy(); sceneHandle = null; }
  $$('video', content).forEach(v => v.pause());
}

function initPage() {
  setInner(); setAccent(); applyIA(); pageTitle();
  const name = $('.page', content)?.dataset.page;
  revealCommon();
  initGhost();
  if (name === 'home') initHome();
  if (name === 'about') initAbout();
  if (name === 'project') initProject();
  if (name === 'work') initRows();
  if (name === 'achievements') initAchievements();
  if (name === 'contact') initContact();
  initVideos();
  if (gsapOK()) requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* ---------------------------------------------------------------- navigation: the window stays, a logo curtain covers the swap */
function activeKey(path) {
  if (path === '/' || path === '/index.html') return 'home';
  const m = path.match(/^\/(about|work|achievements|contact)/);
  return m ? m[1] : 'home';
}
function markNav(path) {
  const k = activeKey(path);
  $$('.sidebar .nl').forEach(a => a.classList.toggle('on', a.dataset.nav === k));
}
function liftCurtain() {
  loader.classList.remove('on');
  covered = false;
  onReveal.splice(0).forEach(fn => fn());
}

async function go(url, push = true) {
  if (navigating) return;
  navigating = true;
  closeOverlays();
  covered = true;
  const t0 = performance.now();
  loader.classList.add('on');
  try {
    const [res] = await Promise.all([fetch(url, { cache: 'no-cache' }), wait(reduce ? 0 : 560)]);
    if (!res.ok) throw new Error(res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const next = $('#content > .page', doc);
    if (!next) throw new Error('no page');
    teardown();
    content.replaceChildren(next);
    scroller.scrollTop = 0;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    const path = new URL(url, location.href).pathname;
    if (push) history.pushState({}, '', url);
    markNav(path);
    initPage();
  } catch (e) {
    console.error('navigation fallback', e);
    location.href = url; return;
  }
  await wait(reduce ? 0 : Math.max(0, 1750 - (performance.now() - t0)));
  liftCurtain();
  navigating = false;
}

document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || /\.(webm|webp|png|jpg|pdf)$/i.test(u.pathname)) return;
  e.preventDefault();
  if (u.pathname === location.pathname) { if (lenis) lenis.scrollTo(0); else scroller.scrollTo({ top: 0, behavior: 'smooth' }); closeOverlays(); return; }
  go(u.pathname);
});
window.addEventListener('popstate', () => go(location.pathname, false));

/* ---------------------------------------------------------------- window controls, search, menu */
const toast = $('#toast');
const palette = $('#palette');
const pin = $('#pal-input');
const mmenu = $('#mmenu');
let toastTimer;

function closeOverlays() {
  closeSearch();
  mmenu.hidden = true;
  $('.menu-btn').setAttribute('aria-expanded', 'false');
}
function openSearch() {
  palette.hidden = false;
  requestAnimationFrame(() => palette.classList.add('show'));
  pin.value = ''; filterPal('');
  setTimeout(() => pin.focus(), 60);
}
function closeSearch() {
  if (palette.hidden) return;
  palette.classList.remove('show');
  setTimeout(() => { palette.hidden = true; }, 350);
}
function filterPal(q) {
  q = q.trim().toLowerCase();
  $$('.pal-card', palette).forEach(c => { c.hidden = q && !c.dataset.q.toLowerCase().includes(q) && !c.textContent.toLowerCase().includes(q); });
}
pin.addEventListener('input', () => filterPal(pin.value));
pin.addEventListener('keydown', e => { if (e.key === 'Enter') { const c = $$('.pal-card', palette).find(x => !x.hidden); if (c) c.click(); } });
palette.addEventListener('click', e => { if (e.target.closest('.pal-card')) closeSearch(); });

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openSearch() : closeSearch(); }
  if (e.key === 'Escape') { closeOverlays(); toast.classList.remove('show'); }
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'lang') setLang(lang === 'pt' ? 'en' : 'pt');
  if (act === 'resize') frame.classList.toggle('shrunk');
  if (act === 'full') {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else html.requestFullscreen?.().catch(() => {});
  }
  if (act === 'close') {
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); setTimeout(() => { toast.hidden = true; }, 500); }, 7000);
  }
  if (act === 'search') openSearch();
  if (act === 'closesearch') closeSearch();
});
$('.menu-btn').addEventListener('click', () => {
  const open = mmenu.hidden;
  mmenu.hidden = !open;
  $('.menu-btn').setAttribute('aria-expanded', String(open));
});

/* logo: the halves spin into place on hover, and again when the pointer leaves */
const logoCell = $('.logo-cell');
['mouseenter', 'mouseleave'].forEach(ev => logoCell.addEventListener(ev, () => {
  logoCell.classList.remove('spin'); void logoCell.offsetWidth; logoCell.classList.add('spin');
}));

/* ---------------------------------------------------------------- boot: intro = the same logo curtain */
async function boot() {
  initScroll();
  setLang(lang, false);
  markNav(location.pathname);
  tickClock(); setInterval(tickClock, 15000);
  initPage();
  document.body.classList.remove('loading');
  await wait(reduce ? 0 : 1750);
  liftCurtain();
}
const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady, wait(1200)]).then(() => (document.readyState === 'loading' ? addEventListener('DOMContentLoaded', boot) : boot()));
