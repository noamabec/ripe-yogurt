import { PRODUCTS, FLAVOURS, img, money } from './data.js';
import { initLayout, reveal } from './layout.js?v=6';
import { productCard, wireCards } from './cards.js';
import { add } from './cart.js';

initLayout();

const params = new URLSearchParams(location.search);
const p = PRODUCTS.find(x => x.id === params.get('id'));
const root = document.querySelector('[data-pdp]');

// extra shots per product, and the facts block under the buy box
const GALLERY = {
  pack: ['p-tub', 's-pistachio', 's-chocolate', 's-mango'], 'season-pack': ['p-tub-season', 's-pomegranate-blood', 'fruit-pomegranate'],
  'chef-ripe': ['hero-ripe', 'fruit-pomegranate', 'fruit-persimmon', 'fruit-date'], 'chef-choco': ['p-yog-choco', 'crunch-brownie', 'sauce-chocolate'],
  'chef-tropic': ['p-yog-tropic', 'fruit-mango', 'fruit-pineapple', 'crunch-coconut'], cone: ['p-cone', 's-strawberry', 's-chocolate'],
  cake: ['p-cake', 's-pistachio', 's-strawberry-field'], pops: ['p-popsicles'], gift: ['gift-card'],
};
const FACTS = {
  pack: ['מה בפנים', 'הטעמים שבחרת, ממולאים טרי באותו בוקר. רכיבים ואלרגנים מפורטים בכל טעם בעמוד הגלידות.'],
  'season-pack': ['מה בפנים', 'מיץ רימון (30%), מיץ תפוז דם (15%), מים, סוכר. טבעוני וללא אלרגנים עיקריים.'],
  'chef-ripe': ['מה בפנים', 'יוגורט טבעי 3%, רימון, אפרסמון, תמר טרי, גרנולה ביתית (שיבולת שועל, שקדים) וסילאן. מכיל: חלב, גלוטן, אגוזים.'],
  'chef-choco': ['מה בפנים', 'יוגורט טבעי 3%, ממרח לוז, אגוזי לוז קלויים, בראוניז ופצפוצי שוקולד. מכיל: חלב, אגוזים, גלוטן, ביצים, סויה.'],
  'chef-tropic': ['מה בפנים', 'יוגורט טבעי 3%, מנגו, אננס, פסיפלורה וקוקוס קלוי. מכיל: חלב.'],
  cone: ['מה בפנים', 'בוחרים טעמים בסניף מתוך 24. גביע וופל מכיל גלוטן וביצים; כוס ללא תוספות.'],
  cake: ['מה בפנים', 'גלידת פיסטוק, סורבה פטל, בסיס בצק פריך ופיסטוק קלוי. מכיל: חלב, אגוזים, גלוטן, ביצים.'],
  pops: ['מה בפנים', 'ארטיקים מגלידה שלנו בציפוי שוקולד או פירות. כל טעם והאלרגנים שלו מופיעים על העטיפה.'],
  gift: ['איך זה עובד', 'אחרי התשלום שולחים את הכרטיס במייל או ב-WhatsApp עם ברכה. מממשים בסניף או באתר, בכמה הזמנות עד שנגמר הסכום.'],
};
const KEEP = p?.cat === 'gift'
  ? ['תוקף', 'שנה מיום הרכישה. אפשר לממש בכל הסניפים ובאתר.']
  : ['איך לשמור', p?.cat === 'yogurt' || p?.id === 'cone' ? 'הכי טעים מיד. יוגורט קפוא מחזיק כשעה במקפיא אם צריך לחכות.' : 'במקפיא עד 30 יום. להוציא 5 דקות לפני ההגשה, כדי שיהיה קל לגרוף.'];
const GET = p?.pickupOnly
  ? ['איך מקבלים', 'רק באיסוף עצמי מהסניף, מוכן תוך 15 דקות. כדורים בגביע לא שורדים נסיעה.']
  : ['איך מקבלים', 'משלוח מהיר בתיק תרמי עד 8 ק"מ מהסניף (30–45 דקות), או איסוף עצמי תוך 15 דקות. משלוח חינם מעל 150 ₪.'];

if (!p) {
  root.insertAdjacentHTML('beforeend', `<div class="empty"><img src="${img('s-strawberry')}" alt="" width="640" height="640"><h2>לא מצאנו את המוצר הזה</h2><p>אולי הוא כבר לא בתפריט. כל המוצרים מחכים בעמוד הגלידות.</p><a class="btn btn--primary" href="ice-cream.html">לגלידות</a></div>`);
} else render();

function render() {
  document.title = `${p.name} · RIPE Yogurt`;
  root.querySelector('[data-crumbs]').insertAdjacentHTML('beforeend', `<li aria-current="page">${p.name}</li>`);
  const isPack = p.type === 'pack';
  const pick = new Set();
  const want = new URLSearchParams(location.search).get('flavour');
  if (isPack && FLAVOURS.some(f => f.id === want)) pick.add(want);
  const start = Number(params.get('size'));
  let v = p.variants[start]?.stock !== false && p.variants[start] ? start : Math.max(0, p.variants.findIndex(x => x.stock !== false));
  let qty = 1;
  const shots = GALLERY[p.id] || [p.img];
  const limit = () => isPack ? Number((p.variants[v].note || '').match(/\d+/)?.[0] || 1) : 0;

  root.insertAdjacentHTML('beforeend', `
    <div class="pdp">
      <div class="pdp__gallery">
        <div class="pdp__stage tint-${p.tint}">
          ${p.tags.length ? `<ul class="pcard__tags">${p.tags.map(t => `<li class="sticker">${t}</li>`).join('')}</ul>` : ''}
          <img src="${img(shots[0])}" alt="${p.name}" width="640" height="640" data-main>
        </div>
        ${shots.length > 1 ? `<ul class="pdp__thumbs">${shots.map((s, i) => `<li><button type="button" data-shot="${s}" aria-current="${i === 0}" aria-label="תמונה ${i + 1}"><img src="${img(s)}" alt="" width="64" height="64"></button></li>`).join('')}</ul>` : ''}
      </div>
      <div class="pdp__info">
        <h1>${p.name}</h1>
        <p class="pdp__desc">${p.desc}.</p>
        <div class="pdp__price"><bdi data-price></bdi><small data-note></small></div>
        <div class="opt">
          <h2>${p.cat === 'gift' ? 'סכום' : p.type === 'pack' || p.cat === 'yogurt' || p.cat === 'cakes' ? 'גודל' : 'אפשרות'}</h2>
          <div class="sizes" role="radiogroup" aria-label="בחירת אפשרות">
            ${p.variants.map((x, i) => `<button type="button" role="radio" class="size" data-v="${i}" aria-checked="${i === v}" ${x.stock === false ? 'disabled' : ''}>${x.label}<small>${x.stock === false ? 'אזל היום' : x.note || money(x.price)}</small></button>`).join('')}
          </div>
        </div>
        ${isPack ? `
        <div class="opt">
          <h2>בחירת טעמים <span data-count></span></h2>
          <div class="fpick" data-fpick>${FLAVOURS.map(f => `<button type="button" data-f="${f.id}" aria-pressed="${pick.has(f.id)}"><img src="${img(f.img)}" alt="" width="64" height="64" loading="lazy">${f.name}</button>`).join('')}</div>
          <p class="fpick__msg" data-msg role="status"></p>
        </div>` : ''}
        <div class="buy">
          <div class="qty" role="group" aria-label="כמות"><button type="button" data-q="1" aria-label="הוספת יחידה">+</button><span data-qty aria-live="polite">1</span><button type="button" data-q="-1" aria-label="הורדת יחידה">−</button></div>
          <button type="button" class="btn btn--primary" data-add>הוספה לסל</button>
        </div>
        <ul class="perks">
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16V7h12v9M15 11h4l2 3v2h-6"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>${p.pickupOnly ? 'רק באיסוף' : 'משלוח 30–45 דק׳'}</li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>איסוף תוך 15 דק׳</li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>כשר חלבי</li>
        </ul>
      </div>
    </div>
    <section class="block" aria-label="פרטים על המוצר" style="padding-block-start:0">
      <div class="facts">
        ${[FACTS[p.id], KEEP, GET].filter(Boolean).map(([h, t]) => `<article class="fact" data-reveal><h3>${h}</h3><p>${t}</p></article>`).join('')}
      </div>
    </section>
    <section class="block" aria-labelledby="rel-t">
      <div class="block__head"><h2 id="rel-t">הולך טוב עם</h2></div>
      <div class="grid-products" data-related></div>
    </section>
    <div class="stickybuy" data-sticky aria-hidden="true">
      <img src="${img(p.img)}" alt="" width="48" height="48">
      <div><strong>${p.name}</strong><bdi data-sprice></bdi></div>
      <button type="button" class="btn btn--primary btn--sm" data-add2 tabindex="-1">הוספה לסל</button>
    </div>`);

  const $ = s => root.querySelector(s);
  const refresh = () => {
    const x = p.variants[v];
    $('[data-price]').textContent = money(x.price * qty);
    $('[data-sprice]').textContent = money(x.price * qty);
    $('[data-note]').textContent = qty > 1 ? `${qty} × ${money(x.price)}` : x.note || '';
    $('[data-qty]').textContent = qty;
    if (isPack) {
      const n = limit();
      while (pick.size > n) pick.delete([...pick].pop());
      root.querySelectorAll('[data-f]').forEach(b => b.setAttribute('aria-pressed', String(pick.has(b.dataset.f))));
      $('[data-count]').textContent = `נבחרו ${pick.size} מתוך ${n}`;
    }
  };
  refresh();

  root.addEventListener('click', e => {
    const s = e.target.closest('[data-v]');
    if (s && !s.disabled) { v = Number(s.dataset.v); root.querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-checked', String(b === s))); refresh(); }
    const q = e.target.closest('[data-q]');
    if (q) { qty = Math.max(1, Math.min(20, qty + Number(q.dataset.q))); refresh(); }
    const t = e.target.closest('[data-shot]');
    if (t) {
      const main = $('[data-main]'); main.style.opacity = 0;
      setTimeout(() => { main.src = img(t.dataset.shot); main.style.opacity = 1; }, 180);
      root.querySelectorAll('[data-shot]').forEach(b => b.setAttribute('aria-current', String(b === t)));
    }
    const f = e.target.closest('[data-f]');
    if (f) {
      const id = f.dataset.f;
      if (pick.has(id)) pick.delete(id);
      else if (pick.size < limit()) pick.add(id);
      else { $('[data-msg]').textContent = `במארז הזה יש מקום ל-${limit()} טעמים. הסירו טעם או בחרו מארז גדול יותר.`; return; }
      $('[data-msg]').textContent = '';
      refresh();
    }
    const a = e.target.closest('[data-add], [data-add2]');
    if (a) {
      if (isPack && pick.size !== limit()) {
        $('[data-msg]').textContent = `בחרו עוד ${limit() - pick.size} ${limit() - pick.size === 1 ? 'טעם' : 'טעמים'} כדי להוסיף לסל.`;
        root.querySelector('[data-fpick]').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const extras = isPack ? { flavours: [...pick].map(id => FLAVOURS.find(x => x.id === id).name) } : {};
      if (add(p.id, v, qty, extras)) { a.textContent = 'נוסף ✓'; setTimeout(() => { a.textContent = 'הוספה לסל'; }, 1600); }
    }
  });

  // the sticky bar shows once the real buy button scrolls away
  const sticky = $('[data-sticky]');
  new IntersectionObserver(([en]) => { sticky.classList.toggle('is-on', !en.isIntersecting && en.boundingClientRect.top < 0); sticky.setAttribute('aria-hidden', String(en.isIntersecting)); })
    .observe($('[data-add]'));

  const rel = $('[data-related]');
  const pool = PRODUCTS.filter(x => x.id !== p.id && x.cat !== 'gift');
  const picks = [...pool.filter(x => x.cat !== p.cat), ...pool.filter(x => x.cat === p.cat)].slice(0, 4);
  rel.innerHTML = picks.map(productCard).join('');
  wireCards(rel, PRODUCTS);
  reveal();
}
