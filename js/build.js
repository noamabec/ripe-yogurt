import { BUILD, FRUITS, MONTHS, inSeason, img, money } from './data.js';
import { initLayout } from './layout.js?v=6';
import { add } from './cart.js';

initLayout();

const $ = s => document.querySelector(s);
const MAX = 8; // the cup photo has room for eight topping spots
// coil ledges of build-cup.webp, lowest first, so toppings pile up from the rim: [left %, top %, width %, tilt]
const SLOTS = [[22, 57, 26, -8], [50, 56, 26, 10], [34, 49, 24, 6], [24, 42, 22, -12], [50, 41, 22, 14], [38, 33, 20, -6], [30, 62, 20, 4], [46, 29, 18, 10]];
const STEPS = [['size', 'גודל'], ['base', 'בסיס'], ['fruits', 'פירות'], ['crunch', 'קראנץ׳'], ['sauce', 'רוטב']];

const blank = () => ({ size: 'm', base: 'natural', fruits: [], crunch: [], sauce: null });
let s = blank();
let step = 0;
const pre = new URLSearchParams(location.search).get('fruits');
if (pre) s.fruits = pre.split(',').filter(id => FRUITS.some(f => f.id === id && inSeason(f))).slice(0, MAX);

const size = () => BUILD.sizes.find(x => x.id === s.size);
const toppings = () => [...s.fruits.map(id => ({ kind: 'fruits', id })), ...s.crunch.map(id => ({ kind: 'crunch', id }))];
const price = () => size().price + Math.max(0, toppings().length - size().included) * BUILD.extra;
const nameOf = t => t.kind === 'fruits' ? FRUITS.find(f => f.id === t.id).name : BUILD.crunch.find(c => c.id === t.id).name;

/* ---------- chef presets ---------- */
$('[data-chefs]').innerHTML = BUILD.chef.map((c, i) => `<button type="button" data-chef="${i}">${c.name}</button>`).join('');

/* ---------- steps ---------- */
$('[data-stepsnav]').innerHTML = STEPS.map(([id, t], i) => `<li><button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === step}" data-step="${i}"><b>${i + 1}</b>${t}</button></li>`).join('');

function panel(id) {
  if (id === 'size') return `<div class="tiles" role="radiogroup" aria-label="גודל">${BUILD.sizes.map(x => `
    <button type="button" role="radio" class="tile tile--size" data-pick="size" data-id="${x.id}" aria-checked="${s.size === x.id}">
      <strong>${x.name}</strong><span><bdi>${x.ml} מ"ל</bdi></span><small>${x.included} תוספות כלולות · <bdi>${money(x.price)}</bdi></small>
    </button>`).join('')}</div>`;
  if (id === 'base') return `<div class="tiles" role="radiogroup" aria-label="בסיס">${BUILD.bases.map(x => `
    <button type="button" role="radio" class="tile tile--text" data-pick="base" data-id="${x.id}" aria-checked="${s.base === x.id}">${x.name}<small>${x.note}</small></button>`).join('')}</div>`;
  if (id === 'fruits') return `<p class="bld__hint" style="margin-block-end:12px">פירות בשלים מהעונה. לחיצה נוספת מסירה.</p><div class="tiles">${FRUITS.map(f => {
    const ok = inSeason(f);
    return `<button type="button" class="tile" data-pick="fruits" data-id="${f.id}" aria-pressed="${s.fruits.includes(f.id)}" ${ok ? '' : 'disabled'}>
      <img src="${img(f.img)}" alt="" width="76" height="76" loading="lazy">${f.name}<small>${ok ? 'מ' + f.origin : 'חוזר ב' + MONTHS[f.from - 1]}</small></button>`;
  }).join('')}</div>`;
  if (id === 'crunch') return `<div class="tiles">${BUILD.crunch.map(c => `
    <button type="button" class="tile" data-pick="crunch" data-id="${c.id}" aria-pressed="${s.crunch.includes(c.id)}"><img src="${img(c.img)}" alt="" width="76" height="76" loading="lazy">${c.name}</button>`).join('')}</div>`;
  return `<p class="bld__hint" style="margin-block-end:12px">רוטב אחד כלול בכל גודל.</p><div class="tiles" role="radiogroup" aria-label="רוטב">
    <button type="button" role="radio" class="tile tile--text" data-pick="sauce" data-id="" aria-checked="${!s.sauce}">בלי רוטב<small>נקי וחמצמץ</small></button>
    ${BUILD.sauces.map(x => `<button type="button" role="radio" class="tile" data-pick="sauce" data-id="${x.id}" aria-checked="${s.sauce === x.id}"><img src="${img(x.img)}" alt="" width="76" height="76" loading="lazy">${x.name}</button>`).join('')}</div>`;
}
function renderPanel() {
  const [id] = STEPS[step];
  $('[data-panels]').innerHTML = `<div role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}">${panel(id)}</div>
    <div class="bld__nav" style="margin-block-start:16px">
      ${step > 0 ? `<button type="button" class="btn btn--ghost btn--sm" data-go="-1">חזרה</button>` : '<span></span>'}
      ${step < STEPS.length - 1 ? `<button type="button" class="btn btn--primary btn--sm" data-go="1">לשלב הבא: ${STEPS[step + 1][1]}</button>` : ''}
    </div>`;
  document.querySelectorAll('[data-step]').forEach((b, i) => {
    b.setAttribute('aria-selected', String(i === step));
    b.classList.toggle('is-done', i < step);
  });
}

/* ---------- the cup ---------- */
let lastCount = 0;
function drawCup() {
  const stack = $('[data-stack]');
  stack.style.setProperty('--scale', size().scale);
  const sp = $('[data-sauce-photo]');
  const sauce = BUILD.sauces.find(x => x.id === s.sauce);
  if (sauce) { if (!sp.src.endsWith(sauce.cup + '.webp')) sp.src = img(sauce.cup); sp.classList.remove('is-hidden'); }
  else sp.classList.add('is-hidden');
  const list = toppings();
  // only the newest piece animates in; the rest stay put
  $('[data-drops]').innerHTML = list.map((t, i) => {
    const [x, y, w, r] = SLOTS[i];
    const src = t.kind === 'fruits' ? `top-${t.id}` : BUILD.crunch.find(c => c.id === t.id).img;
    return `<img class="drop" src="${img(src)}" alt="" style="left:${x}%;top:${y}%;width:${w}%;--r:${r}deg;${i < lastCount ? 'animation:none' : ''}">`;
  }).join('');
  lastCount = list.length;
  $('[data-base-label]').textContent = BUILD.bases.find(b => b.id === s.base).name;
}

function renderSummary() {
  const z = size(), list = toppings(), extra = Math.max(0, list.length - z.included);
  $('[data-sum-line]').textContent = `${z.name} (${z.ml} מ"ל) · ${BUILD.bases.find(b => b.id === s.base).name}${s.sauce ? ' · ' + BUILD.sauces.find(x => x.id === s.sauce).name : ''}`;
  $('[data-sum-chips]').innerHTML = list.length
    ? list.map(t => `<li>${nameOf(t)}<button type="button" data-remove="${t.kind}:${t.id}" aria-label="הסרת ${nameOf(t)}">✕</button></li>`).join('')
    : '<li style="padding-inline-end:12px">עוד לא בחרת תוספות</li>';
  $('[data-price]').textContent = money(price());
  $('[data-sprice]').textContent = money(price());
  $('[data-sum-extra]').textContent = extra ? `${extra} תוספות מעבר לכלול, ${money(BUILD.extra)} כל אחת` : `${z.included - list.length > 0 ? `נשארו עוד ${z.included - list.length} תוספות כלולות` : 'כל התוספות הכלולות נוצלו'}`;
}

const render = () => { renderPanel(); drawCup(); renderSummary(); };
render();

/* ---------- interaction ---------- */
document.addEventListener('click', e => {
  const st = e.target.closest('[data-step]'); if (st) { step = Number(st.dataset.step); renderPanel(); }
  const go = e.target.closest('[data-go]'); if (go) { step += Number(go.dataset.go); renderPanel(); document.querySelector('.steps-nav').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  const pk = e.target.closest('[data-pick]');
  if (pk && !pk.disabled) {
    const { pick, id } = pk.dataset;
    $('[data-msg]').textContent = '';
    if (pick === 'size' || pick === 'base') s[pick] = id;
    else if (pick === 'sauce') s.sauce = id || null;
    else {
      const arr = s[pick], i = arr.indexOf(id);
      if (i > -1) { arr.splice(i, 1); lastCount = 0; }
      else if (toppings().length >= MAX) { $('[data-msg]').textContent = `אפשר עד ${MAX} תוספות בכוס אחת.`; return; }
      else arr.push(id);
    }
    if (pick !== 'fruits' && pick !== 'crunch') lastCount = toppings().length;
    render();
  }
  const rm = e.target.closest('[data-remove]');
  if (rm) { const [k, id] = rm.dataset.remove.split(':'); s[k] = s[k].filter(x => x !== id); lastCount = 0; drawCup(); renderSummary(); renderPanel(); lastCount = toppings().length; }
  const ch = e.target.closest('[data-chef]');
  if (ch) {
    const c = BUILD.chef[ch.dataset.chef];
    s = { size: c.size, base: c.base, fruits: c.fruits.filter(id => inSeason(FRUITS.find(f => f.id === id))), crunch: [...c.crunch], sauce: c.sauce };
    lastCount = 0; step = 2; render();
  }
  if (e.target.closest('[data-reset]')) { s = blank(); lastCount = 0; step = 0; render(); }
  const a = e.target.closest('[data-add], [data-add2]');
  if (a) {
    if (!toppings().length && !s.sauce) { $('[data-msg]').textContent = 'בחרו לפחות תוספת אחת או רוטב, כדי שיהיה מה להכין.'; step = 2; renderPanel(); return; }
    const z = size(), base = BUILD.bases.find(b => b.id === s.base).name;
    const sauce = BUILD.sauces.find(x => x.id === s.sauce);
    const custom = { id: 'build', name: 'יוגורט בהרכבה אישית', img: sauce ? sauce.cup : 'build-cup', variants: [{ label: `${z.name} · ${base}`, price: price() }] };
    add('build', 0, 1, { parts: [...toppings().map(nameOf), ...(sauce ? [sauce.name] : [])] }, custom);
    a.textContent = 'נוסף ✓'; setTimeout(() => { a.textContent = 'הוספה לסל'; }, 1600);
  }
});
// arrow keys move between tabs (RTL: left = next)
$('[data-stepsnav]').addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  step = (step + (e.key === 'ArrowLeft' ? 1 : -1) + STEPS.length) % STEPS.length;
  renderPanel(); document.getElementById(`tab-${STEPS[step][0]}`).focus();
});
