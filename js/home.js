import { CATEGORIES, PRODUCTS, FLAVOURS, FRUITS, INGREDIENTS, REVIEWS, BRANCHES, MONTHS, inSeason, isOpen, img, money } from './data.js';
import { initLayout, reveal } from './layout.js?v=6';
import { productCard, wireCards } from './cards.js';
import { add } from './cart.js';
import { initHero } from './hero.js?v=8';

initLayout();
initHero();

const $ = s => document.querySelector(s);
const month = new Date().getMonth() + 1;
const monthName = MONTHS[month - 1];
// year-round fruit (banana) isn't news, so it never headlines the season
const seasonal = FRUITS.filter(f => inSeason(f, month) && !(f.from === 1 && f.to === 12));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

/* hero: the dial follows the calendar */
$('[data-month]').textContent = monthName;
$('[data-dial-text]').textContent = `בעונה עכשיו · ${monthName} · בעונה עכשיו · ${monthName} · `;

/* categories */
const CAT_LINK = { home: 'ice-cream.html#packs', yogurt: 'build.html', cups: 'ice-cream.html#cups', cakes: 'ice-cream.html#cakes', gift: 'ice-cream.html#gift' };
$('[data-cats]').innerHTML = CATEGORIES.map(c => `
  <a class="cat tint-${c.tint}" href="${CAT_LINK[c.id]}" data-reveal>
    <span class="cat__media">${c.img ? `<img src="${img(c.img)}" alt="" width="1000" height="1000" loading="lazy">` : '<span class="gift-art"><span dir="ltr">RIPE</span></span>'}</span>
    <span class="cat__name">${c.name}</span>
    <span class="cat__from">החל מ-<bdi>${money(c.from)}</bdi></span>
    <span class="cat__go" aria-hidden="true">${arrow}</span>
  </a>`).join('');

/* mini builder */
const MINI_BASE = 34, INCLUDED = 3, EXTRA = 4;
const picked = [];
// coil ledges of build-cup.webp, lowest first, so toppings pile up from the rim: [left %, top %, width %, tilt]
const slots = [[22, 57, 26, -8], [50, 56, 26, 10], [34, 49, 24, 6], [24, 42, 22, -12], [50, 41, 22, 14], [38, 33, 20, -6]];
const picker = $('[data-picker]');
picker.innerHTML = FRUITS.filter(f => f.featured).map(f => {
  const ok = inSeason(f, month);
  return `<li><button type="button" class="fruit-btn" data-fruit="${f.id}" aria-pressed="false" ${ok ? '' : `disabled title="חוזר ב${MONTHS[f.from - 1]}"`}>
    <img src="${img(f.img)}" alt="" width="1000" height="1000" loading="lazy">${f.name}${ok ? '' : `<small>חוזר ב${MONTHS[f.from - 1]}</small>`}</button></li>`;
}).join('');
const miniPrice = () => MINI_BASE + Math.max(0, picked.length - INCLUDED) * EXTRA;
function drawCup() {
  $('[data-drops]').innerHTML = picked.map((id, i) => {
    const [x, y, w, r] = slots[i % slots.length];
    return `<img class="drop" src="${img('top-' + id)}" alt="" style="left:${x}%;top:${y}%;width:${w}%;--r:${r}deg">`;
  }).join('');
  const n = picked.length;
  $('[data-picked]').innerHTML = !n ? 'עוד לא בחרת פירות'
    : n <= INCLUDED ? `נבחרו <strong>${n}</strong> · נשארו עוד ${INCLUDED - n} כלולות`
    : `נבחרו <strong>${n}</strong> · ${n - INCLUDED} בתוספת תשלום`;
  $('[data-mini-price]').textContent = money(miniPrice());
  $('[data-mini-full]').href = `build.html${n ? '?fruits=' + picked.join(',') : ''}`;
}
picker.addEventListener('click', e => {
  const b = e.target.closest('[data-fruit]'); if (!b || b.disabled) return;
  const id = b.dataset.fruit; const i = picked.indexOf(id);
  if (i > -1) picked.splice(i, 1); else picked.push(id);
  b.setAttribute('aria-pressed', String(i === -1));
  drawCup();
});
$('[data-mini-add]').addEventListener('click', e => {
  if (!picked.length) { $('[data-picked]').innerHTML = '<strong>בחרו לפחות פרי אחד</strong> כדי להוסיף לסל'; return; }
  const custom = { id: 'build', name: 'יוגורט בהרכבה אישית', img: 'p-yog-berry', variants: [{ label: 'בינוני · יוגורט טבעי', price: miniPrice() }] };
  add('build', 0, 1, { parts: picked.map(id => FRUITS.find(f => f.id === id).name) }, custom);
  e.target.textContent = 'נוסף ✓'; setTimeout(() => { e.target.textContent = 'הוספה לסל'; }, 1600);
});
drawCup();

/* in season */
const shown = seasonal.filter(f => f.id !== 'banana').slice(0, 3);
$('[data-season-title]').textContent = `${monthName}: ${shown.map(f => f.name).join(', ')}`;
const fruitsRow = $('[data-fruits]');
fruitsRow.innerHTML = shown.map((f, i) => `
  <article class="fruit-card tint-${f.tint}" data-reveal style="transition-delay:${i * 80}ms">
    <span class="sticker sticker--season"><b>${4120 + i}</b> בעונה</span>
    <div class="fruit-card__media"><img src="${img(f.img)}" alt="${f.name}" width="640" height="640" loading="lazy"></div>
    <h3>${f.name}</h3>
    <p>מ${f.origin} · עד סוף ${MONTHS[f.to - 1]}</p>
    <a class="fruit-card__more" href="build.html?fruits=${f.id}">ליוגורט עם ${f.name}</a>
  </article>`).join('');
// touch screens have no hover: a tap opens a card (and its link), a second tap closes it
fruitsRow.addEventListener('click', e => {
  const card = e.target.closest('.fruit-card'); if (!card || e.target.closest('a')) return;
  const open = !card.classList.contains('is-active');
  fruitsRow.querySelectorAll('.fruit-card').forEach(c => c.classList.toggle('is-active', open && c === card));
  fruitsRow.classList.toggle('has-active', open);
});

const sp = PRODUCTS.find(p => p.id === 'season-pack');
const feat = $('[data-feature]');
feat.innerHTML = `
  <span class="sticker sticker--season"><b>4131</b> הטעם העונתי</span>
  <div class="feature__img-wrap"><img src="${img(sp.img)}" alt="${sp.name} במארז" width="1000" height="1000" loading="lazy"></div>
  <h3>${sp.name}</h3>
  <p>${sp.desc}. סורבה טבעוני, חמוץ-מתוק ורענן.</p>
  <div class="pills" role="radiogroup" aria-label="בחירת גודל">${sp.variants.map((v, i) => `<button type="button" role="radio" class="pill" data-i="${i}" aria-checked="${i === 0}">${v.label}</button>`).join('')}</div>
  <div class="feature__row"><bdi class="feature__price">${money(sp.variants[0].price)}</bdi><button type="button" class="btn btn--lime" data-feat-add>הוספה לסל</button></div>`;
let featV = 0;
feat.addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (pill) { featV = Number(pill.dataset.i); feat.querySelectorAll('.pill').forEach(b => b.setAttribute('aria-checked', String(b === pill))); feat.querySelector('.feature__price').textContent = money(sp.variants[featV].price); }
  const b = e.target.closest('[data-feat-add]');
  if (b && add(sp.id, featV)) { b.textContent = 'נוסף ✓'; setTimeout(() => { b.textContent = 'הוספה לסל'; }, 1600); }
});

/* best sellers */
const best = $('[data-best]');
const bestList = ['pack', 'chef-ripe', 'cake', 'chef-choco', 'pops', 'cone', 'chef-tropic', 'season-pack'].map(id => PRODUCTS.find(p => p.id === id));
best.innerHTML = bestList.map(productCard).join('');
wireCards(best, PRODUCTS);

/* flavours */
const scoops = $('[data-scoops]');
scoops.innerHTML = FLAVOURS.filter(f => f.featured).map(f => `
  <li class="scoop" data-type="${f.type}" data-tags="${f.tags.join(',')}" data-reveal>
    <a href="ice-cream.html#f-${f.id}">
      <span class="scoop__ball"><img src="${img(f.img)}" alt="" width="1000" height="1000" loading="lazy"></span>
      <h3>${f.name}</h3><small>${f.type === 'sorbet' ? 'סורבה' : 'חלבי'}${f.tags.length ? ' · ' + f.tags.join(' · ') : ''}</small>
    </a>
  </li>`).join('');
$('[data-chips]').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('[data-chips] .chip').forEach(x => x.setAttribute('aria-pressed', String(x === c)));
  const f = c.dataset.f;
  scoops.querySelectorAll('.scoop').forEach(s => {
    const show = f === 'all' || s.dataset.type === f || s.dataset.tags.split(',').includes(f);
    s.classList.toggle('is-hidden', !show);
  });
});

/* ingredients */
$('[data-ing]').innerHTML = INGREDIENTS.map(i => `
  <article class="ing" data-reveal>
    <div class="ing__media"><img src="${img(i.img)}" alt="${i.name}" width="806" height="1000" loading="lazy"></div>
    <div class="ing__body"><p class="ing__origin">${i.origin}</p><h3>${i.name}</h3><p>${i.text}</p></div>
  </article>`).join('');

/* reviews */
$('[data-reviews]').innerHTML = REVIEWS.map(r => `
  <figure class="review" data-reveal>
    <p class="stars" aria-label="${r.stars} מתוך 5 כוכבים">${'★'.repeat(r.stars)}</p>
    <blockquote>"${r.text}"</blockquote>
    <figcaption><strong>${r.name}</strong> · סניף ${r.branch}</figcaption>
  </figure>`).join('');

/* branches */
$('[data-branches]').innerHTML = BRANCHES.map(b => {
  const open = isOpen(b);
  return `
  <article class="branch" data-reveal>
    <div class="branch__media"><img src="${img(b.img)}" alt="החזית של סניף ${b.name}" width="1000" height="747" loading="lazy"></div>
    <div class="branch__body">
      <h3>${b.name} <span class="open ${open ? '' : 'is-closed'}">${open ? 'פתוח עכשיו' : 'סגור עכשיו'}</span></h3>
      <p>${b.address}</p>
      <p>א׳–ה׳ <bdi>12:00–24:00</bdi> · ו׳ <bdi>11:00–16:00</bdi> · מוצ״ש <bdi>19:30–00:30</bdi></p>
      <div class="branch__actions">
        <a class="btn btn--primary btn--sm" href="ice-cream.html?branch=${b.id}">הזמנה לאיסוף מכאן</a>
        <a class="btn btn--ghost btn--sm" href="https://waze.com/ul?q=${encodeURIComponent(b.address)}" target="_blank" rel="noopener">ניווט ב-Waze</a>
      </div>
    </div>
  </article>`;
}).join('');

reveal();
