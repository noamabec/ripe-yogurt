import { PRODUCTS, FLAVOURS, ALLERGENS, img, money } from './data.js';
import { initLayout, reveal } from './layout.js?v=6';
import { productCard, wireCards } from './cards.js';
import { add } from './cart.js';

initLayout();

const $ = s => document.querySelector(s);
// a soft background per flavour, picked from its colour family
const TINT = { pistachio: 'mint', 'mint-choc': 'mint', lemon: 'lemon', passion: 'lemon', mango: 'peach', 'cashew-caramel': 'peach', dulce: 'peach', pretzel: 'peach',
  strawberry: 'pink', 'strawberry-field': 'pink', grapefruit: 'pink', 'pomegranate-blood': 'pink', 'meringue-berries': 'lilac', berries: 'lilac', bubblegum: 'lilac', 'cherry-choc': 'pink' };
const tint = f => TINT[f.id] || (f.type === 'sorbet' ? 'pink' : 'peach');
const tagClass = t => ({ 'עונתי': 'season', 'טבעוני': 'leaf' }[t] || '');

/* ---------- flavours ---------- */
const grid = $('[data-fgrid]');
grid.innerHTML = FLAVOURS.map(f => `
  <li data-type="${f.type}" data-tags="${f.tags.join(',')}" data-name="${f.name}">
    <button type="button" class="fcard tint-${tint(f)}" data-flavour="${f.id}" aria-haspopup="dialog">
      <span class="fcard__ball"><img src="${img(f.img)}" alt="" width="640" height="640" loading="lazy"></span>
      <h3>${f.name}</h3>
      <small>${f.type === 'sorbet' ? 'סורבה' : 'חלבי'}</small>
      ${f.tags.includes('עונתי') ? '<span class="sticker sticker--season">עונתי</span>' : ''}
    </button>
  </li>`).join('');

let filter = 'all';
const q = $('#fq');
function applyFilter() {
  const term = q.value.trim();
  let n = 0;
  grid.querySelectorAll('li').forEach(li => {
    const okF = filter === 'all' || li.dataset.type === filter || li.dataset.tags.split(',').includes(filter);
    const okQ = !term || li.dataset.name.includes(term);
    li.hidden = !(okF && okQ);
    if (!li.hidden) n++;
  });
  $('[data-fcount]').textContent = n ? `מוצגים ${n} טעמים` : '';
  document.querySelector('.fempty')?.remove();
  if (!n) grid.insertAdjacentHTML('afterend', `<p class="fempty">לא מצאנו טעם כזה. נסו מילה אחרת, או <button type="button" class="link-arrow" data-reset style="background:none;border:0;border-bottom:2px solid">הציגו את כל הטעמים</button>.</p>`);
}
$('[data-filters]').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  filter = c.dataset.f;
  document.querySelectorAll('[data-filters] .chip').forEach(x => x.setAttribute('aria-pressed', String(x === c)));
  applyFilter();
});
q.addEventListener('input', applyFilter);
document.addEventListener('click', e => {
  if (!e.target.closest('[data-reset]')) return;
  q.value = ''; filter = 'all';
  document.querySelectorAll('[data-filters] .chip').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.f === 'all')));
  applyFilter();
});
applyFilter();

/* flavour dialog, also opened from links like ice-cream.html#f-pistachio */
const dlg = $('[data-dlg]');
function openFlavour(id) {
  const f = FLAVOURS.find(x => x.id === id); if (!f) return;
  dlg.querySelector('.dlg__media').className = `dlg__media tint-${tint(f)}`;
  const im = $('[data-dlg-img]'); im.src = img(f.img); im.alt = f.name;
  $('[data-dlg-name]').textContent = f.name;
  $('[data-dlg-tags]').innerHTML = [f.type === 'sorbet' ? 'סורבה' : 'חלבי', ...f.tags].map(t => `<li class="sticker sticker--${tagClass(t)}">${t}</li>`).join('');
  $('[data-dlg-desc]').textContent = f.desc;
  $('[data-dlg-ing]').textContent = f.ingredients;
  $('[data-dlg-all]').innerHTML = f.allergens.length ? f.allergens.map(a => `<li>${ALLERGENS[a]}</li>`).join('') : '<li class="is-free">ללא אלרגנים עיקריים</li>';
  $('[data-dlg-cta]').href = `product.html?id=pack&flavour=${f.id}`;
  dlg.showModal();
}
grid.addEventListener('click', e => { const b = e.target.closest('[data-flavour]'); if (b) openFlavour(b.dataset.flavour); });
$('[data-dlg-close]').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
if (location.hash.startsWith('#f-')) {
  document.getElementById('flavours').scrollIntoView();
  openFlavour(location.hash.slice(3));
}

/* ---------- product rows ---------- */
document.querySelectorAll('[data-cat]').forEach(row => {
  const list = PRODUCTS.filter(p => p.cat === row.dataset.cat);
  row.innerHTML = list.map(productCard).join('');
  wireCards(row, PRODUCTS);
});

/* ---------- gift card ---------- */
const gift = PRODUCTS.find(p => p.id === 'gift');
const giftBox = $('[data-gift]');
let gv = 1;
giftBox.querySelector('.pills').innerHTML = gift.variants.map((v, i) => `<button type="button" role="radio" class="pill" data-i="${i}" aria-checked="${i === gv}">${v.label}</button>`).join('');
const giftPrice = () => { $('[data-gift-price]').textContent = money(gift.variants[gv].price); };
giftPrice();
giftBox.addEventListener('click', e => {
  const p = e.target.closest('.pill');
  if (p) { gv = Number(p.dataset.i); giftBox.querySelectorAll('.pill').forEach(b => b.setAttribute('aria-checked', String(b === p))); giftPrice(); }
  const b = e.target.closest('[data-gift-add]');
  if (b && add('gift', gv)) { b.textContent = 'נוסף ✓'; setTimeout(() => { b.textContent = 'הוספה לסל'; }, 1600); }
});

/* ---------- jump chips follow the section in view ---------- */
const chips = [...document.querySelectorAll('[data-jump] a')];
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  chips.forEach(c => c.classList.toggle('is-current', c.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('.block[id]').forEach(s => io.observe(s));

reveal();
