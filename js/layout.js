// Shared chrome for every page: strip, header, mobile menu, search, footer, floating buttons.
import { PRODUCTS, FLAVOURS, BRANCHES, WHATSAPP, PHONE, FREE_SHIPPING, img, money } from './data.js';
import { count, initCart, openDrawer, setFulfil } from './cart.js';

const NAV = [
  ['ice-cream.html', 'גלידות'], ['build.html', 'יוגורט בהרכבה'],
  ['branches.html', 'סניפים'], ['about.html', 'הסיפור שלנו'], ['faq.html', 'שאלות נפוצות'],
];
const here = location.pathname.split('/').pop() || 'index.html';

const icon = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

export const logo = (cls = '') => `
  <a href="index.html" class="logo ${cls}" aria-label="RIPE Yogurt, לדף הבית">
    <span class="logo__word" dir="ltr">RIPE<svg class="logo__leaf" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 17C3 8 9 3 18 3c0 9-5 14-14 14z"/><path d="M4 16L13 7" /></svg></span>
    <span class="logo__sub" dir="ltr">YOGURT · GELATO</span>
  </a>`;

function header() {
  const el = document.createElement('div');
  el.innerHTML = `
    <a class="skip" href="#main">דילוג לתוכן</a>
    <div class="strip"><p>משלוח חינם מעל <bdi>${money(FREE_SHIPPING)}</bdi> · איסוף עצמי תוך 15 דקות</p></div>
    <header class="header" id="top">
      <div class="header__in">
        ${logo()}
        <nav class="nav" aria-label="ראשי">
          ${NAV.map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
        </nav>
        <div class="header__actions">
          <button class="icon-btn" data-search aria-label="חיפוש">${icon.search}</button>
          <button class="icon-btn cart-btn" data-cart aria-label="הסל שלי">${icon.bag}<span class="cart-btn__count" data-count hidden></span></button>
          <a class="btn btn--primary btn--sm header__cta" href="ice-cream.html">להזמנה</a>
          <button class="icon-btn header__burger" data-menu aria-label="פתיחת התפריט" aria-expanded="false" aria-controls="mmenu">${icon.menu}</button>
        </div>
      </div>
    </header>
    <div class="mmenu" id="mmenu" hidden>
      <nav aria-label="תפריט נייד">
        ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
        <a href="contact.html">צור קשר</a>
      </nav>
      <a class="btn btn--primary btn--block" href="ice-cream.html">להזמנה</a>
      <p class="mmenu__phone">שאלה? <a href="tel:${PHONE}"><bdi>${PHONE}</bdi></a></p>
    </div>`;
  document.body.prepend(...el.children);
}

function footer() {
  const f = document.createElement('footer');
  f.className = 'footer';
  f.innerHTML = `
    <div class="wrap">
      <section class="club" aria-labelledby="club-t">
        <div>
          <h2 id="club-t" class="club__title">מצטרפים למועדון ומקבלים כדור מתנה.</h2>
          <p>טעמים חדשים, הפרי של החודש ומבצעים לחברים בלבד. בלי ספאם, מבטיחים.</p>
        </div>
        <form class="club__form" novalidate>
          <label class="sr-only" for="club-mail">כתובת מייל</label>
          <input id="club-mail" type="email" placeholder="כתובת המייל שלך" autocomplete="email" required>
          <button class="btn btn--lime" type="submit">הצטרפות</button>
          <p class="club__msg" role="status"></p>
        </form>
      </section>
      <div class="footer__cols">
        <div class="footer__brand">${logo('logo--light')}<p>יוגורט קפוא עם הפרי של העונה, וגלידה מחומרי הגלם הכי טובים שיש. כשר חלבי.</p></div>
        <nav aria-label="להזמנה"><h3>להזמנה</h3><a href="ice-cream.html#flavours">הטעמים שלנו</a><a href="ice-cream.html#packs">מארזים לבית</a><a href="ice-cream.html#cups">כוסות וגביעים</a><a href="ice-cream.html#cakes">עוגות וארטיקים</a><a href="ice-cream.html#gift">כרטיס מתנה</a></nav>
        <nav aria-label="RIPE"><h3 dir="ltr">RIPE</h3><a href="about.html">הסיפור שלנו</a><a href="build.html">יוגורט בהרכבה</a><a href="branches.html">סניפים</a><a href="contact.html">אירועים ועסקים</a></nav>
        <nav aria-label="עזרה"><h3>עזרה</h3><a href="faq.html">שאלות נפוצות</a><a href="terms.html#delivery">משלוחים ואיסוף</a><a href="contact.html">צור קשר</a><a href="tel:${PHONE}"><bdi>${PHONE}</bdi></a></nav>
        <div><h3>סניפים</h3>${BRANCHES.map(b => `<p class="footer__branch"><strong>${b.name}</strong><span>${b.address}</span></p>`).join('')}<p class="footer__hours">א׳–ה׳ <bdi>12:00–24:00</bdi> · ו׳ <bdi>11:00–16:00</bdi> · מוצ״ש עד <bdi>00:30</bdi></p></div>
      </div>
      <div class="footer__bottom">
        <div class="social">
          <a href="#" aria-label="אינסטגרם"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg></a>
          <a href="#" aria-label="טיקטוק"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 3 2.5 5 5.5 5"/></svg></a>
          <a href="#" aria-label="פייסבוק"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.8 1.8-1.8h1.8V2.6A22 22 0 0 0 15 2.5c-2.6 0-4.4 1.6-4.4 4.5v2.5H7.7V13h2.9v8"/></svg></a>
        </div>
        <p class="legal">© <bdi>2026</bdi> RIPE Yogurt · <a href="terms.html">תקנון</a> · <a href="privacy.html">פרטיות</a> · <a href="accessibility.html">הצהרת נגישות</a> · <a href="https://www.abecweb.com" target="_blank" rel="noopener">האתר נבנה ע"י נועם אבקסיס · <bdi>www.abecweb.com</bdi></a></p>
      </div>
    </div>`;
  document.body.append(f);
  const form = f.querySelector('.club__form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const msg = form.querySelector('.club__msg');
    if (!input.checkValidity() || !input.value) { msg.textContent = 'צריך כתובת מייל תקינה, למשל name@mail.com'; input.focus(); return; }
    msg.textContent = 'נרשמת! קוד לכדור מתנה מחכה לך במייל.';
    input.value = '';
  });
}

function floaters() {
  const d = document.createElement('div');
  d.innerHTML = `
    <a class="fab fab--wa" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" aria-label="שליחת הודעה ב-WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c.3 2 2.6 4.4 5 5l1-1.2 1.6.8c-.2 1-1 1.6-2 1.6-3 0-6.6-3.6-6.6-6.6 0-1 .6-1.8 1.6-2l.8 1.6z" class="fill"/></svg>
    </a>
    <button class="fab fab--a11y" aria-label="אפשרויות נגישות" aria-expanded="false" aria-controls="a11y">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8" class="fill"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3 6M12 14.5l3 6"/></svg>
    </button>
    <div class="a11y" id="a11y" hidden role="group" aria-label="נגישות">
      <button data-a11y="big">הגדלת טקסט</button>
      <button data-a11y="contrast">ניגודיות גבוהה</button>
      <button data-a11y="links">הדגשת קישורים</button>
      <button data-a11y="still">עצירת אנימציות</button>
      <a href="accessibility.html">הצהרת נגישות</a>
    </div>`;
  document.body.append(...d.children);
  const btn = document.querySelector('.fab--a11y');
  const panel = document.getElementById('a11y');
  btn.addEventListener('click', () => { panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', String(!panel.hidden)); });
  const saved = (() => { try { return JSON.parse(localStorage.getItem('ripe-a11y')) || []; } catch { return []; } })();
  saved.forEach(k => document.documentElement.classList.add('a11y-' + k));
  panel.addEventListener('click', e => {
    const k = e.target.dataset.a11y; if (!k) return;
    const on = document.documentElement.classList.toggle('a11y-' + k);
    e.target.setAttribute('aria-pressed', String(on));
    const list = [...document.documentElement.classList].filter(c => c.startsWith('a11y-')).map(c => c.slice(5));
    try { localStorage.setItem('ripe-a11y', JSON.stringify(list)); } catch { /* ignore */ }
  });
}

function search() {
  const s = document.createElement('div');
  s.className = 'search';
  s.hidden = true;
  s.innerHTML = `
    <div class="search__box" role="dialog" aria-modal="true" aria-label="חיפוש">
      <div class="search__row">
        ${icon.search}
        <label class="sr-only" for="q">חיפוש מוצר או טעם</label>
        <input id="q" type="search" placeholder="מה בא לך? פיסטוק, יוגורט, עוגה…" autocomplete="off">
        <button class="icon-btn" data-close aria-label="סגירת החיפוש">${icon.close}</button>
      </div>
      <div class="search__results" aria-live="polite"></div>
    </div>`;
  document.body.append(s);
  const input = s.querySelector('input');
  const out = s.querySelector('.search__results');
  const items = [
    ...PRODUCTS.map(p => ({ t: p.name, sub: 'מוצר', href: `product.html?id=${p.id}`, img: p.img })),
    ...FLAVOURS.map(f => ({ t: f.name, sub: 'טעם', href: `ice-cream.html#f-${f.id}`, img: f.img })),
  ];
  const render = () => {
    const q = input.value.trim();
    const list = q ? items.filter(i => i.t.includes(q)) : items.slice(0, 6);
    out.innerHTML = list.length
      ? list.map(i => `<a href="${i.href}" class="search__item"><img src="${img(i.img)}" alt="" width="48" height="48"><span>${i.t}<small>${i.sub}</small></span></a>`).join('')
      : `<p class="search__empty">לא מצאנו "${q.replace(/</g, '')}". אולי <a href="ice-cream.html#flavours">כל הטעמים</a>?</p>`;
  };
  input.addEventListener('input', render);
  const close = () => { s.hidden = true; document.documentElement.classList.remove('no-scroll'); };
  s.addEventListener('click', e => { if (e.target === s || e.target.closest('[data-close]')) close(); });
  s.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-search]')) { s.hidden = false; document.documentElement.classList.add('no-scroll'); render(); input.focus(); }
  });
}

function wire() {
  const updateCount = () => document.querySelectorAll('[data-count]').forEach(c => { const n = count(); c.textContent = n; c.hidden = !n; });
  updateCount();
  document.addEventListener('cart:change', updateCount);
  document.addEventListener('click', e => { if (e.target.closest('[data-cart]')) openDrawer(); });

  const burger = document.querySelector('[data-menu]');
  const menu = document.getElementById('mmenu');
  burger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'סגירת התפריט' : 'פתיחת התפריט');
    burger.innerHTML = open ? icon.close : icon.menu;
    document.documentElement.classList.toggle('no-scroll', open);
  });

  const head = document.querySelector('.header');
  const onScroll = () => head.classList.toggle('is-stuck', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
}

// Reveal-on-enter, once. Elements with [data-reveal] fade up; respects reduced motion via CSS.
export function reveal(root = document) {
  const els = root.querySelectorAll('[data-reveal]:not(.is-in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}

// Checkout keeps the shopper focused: logo, a trust line and a phone for help. No menu, cart or WhatsApp.
function checkoutChrome() {
  const el = document.createElement('div');
  el.innerHTML = `
    <a class="skip" href="#main">דילוג לתוכן</a>
    <header class="header header--lean">
      <div class="header__in">
        ${logo()}
        <p class="lean__secure"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>קנייה מאובטחת</p>
        <a class="lean__help" href="tel:${PHONE}">צריכים עזרה? <bdi>${PHONE}</bdi></a>
      </div>
    </header>`;
  document.body.prepend(...el.children);
  const f = document.createElement('footer');
  f.className = 'footer footer--lean';
  f.innerHTML = `<div class="wrap"><p class="legal">© <bdi>2026</bdi> RIPE Yogurt · <a href="terms.html">תקנון</a> · <a href="privacy.html">פרטיות</a> · <a href="accessibility.html">הצהרת נגישות</a> · <a href="https://www.abecweb.com" target="_blank" rel="noopener">האתר נבנה ע"י נועם אבקסיס · <bdi>www.abecweb.com</bdi></a></p></div>`;
  document.body.append(f);
}

export function initLayout() {
  // "order for pickup from this branch" links carry ?branch=… and preset the checkout
  const branch = new URLSearchParams(location.search).get('branch');
  if (branch && BRANCHES.some(b => b.id === branch)) setFulfil({ mode: 'pickup', branch });

  if (document.body.dataset.layout === 'checkout') { checkoutChrome(); floaters(); document.querySelector('.fab--wa')?.remove(); reveal(); return; }
  header(); footer(); floaters(); search(); wire(); initCart(); reveal();
}
