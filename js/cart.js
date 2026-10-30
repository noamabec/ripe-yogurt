// Cart state in localStorage + the side drawer. Same product+variant+extras merge into one line.
import { PRODUCTS, FREE_SHIPPING, money, img } from './data.js';

const KEY = 'ripe-cart-v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const write = lines => {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode: cart lives for this page only */ }
  memory = lines;
  document.dispatchEvent(new CustomEvent('cart:change'));
};
let memory = read();

export const lines = () => memory;
export const count = () => memory.reduce((s, l) => s + l.qty, 0);
export const subtotal = () => memory.reduce((s, l) => s + l.qty * l.price, 0);

// extras: { flavours?: string[], parts?: string[] } for packs and the yogurt builder
export function add(productId, variantIndex, qty = 1, extras = {}, custom = null) {
  const p = custom || PRODUCTS.find(x => x.id === productId);
  const v = p.variants[variantIndex];
  if (!v || v.stock === false) return false;
  const key = [p.id, variantIndex, JSON.stringify(extras)].join('|');
  const next = [...memory];
  const hit = next.find(l => l.key === key);
  if (hit) hit.qty += qty;
  else next.push({ key, id: p.id, name: p.name, variant: v.label, img: p.img, price: v.price, qty, extras, pickupOnly: !!p.pickupOnly });
  write(next);
  openDrawer();
  return true;
}
// how the order is received: { mode: 'delivery' | 'pickup', branch: 'tlv' | 'herzliya' | 'jlm' }
const FKEY = 'ripe-fulfil-v1';
export function getFulfil() {
  try { return { mode: 'delivery', branch: 'tlv', ...JSON.parse(localStorage.getItem(FKEY)) }; } catch { return { mode: 'delivery', branch: 'tlv' }; }
}
export function setFulfil(patch) {
  const next = { ...getFulfil(), ...patch };
  try { localStorage.setItem(FKEY, JSON.stringify(next)); } catch { /* private mode */ }
  document.dispatchEvent(new CustomEvent('fulfil:change', { detail: next }));
  return next;
}
export const clear = () => write([]);

export const setQty = (key, qty) => write(memory.map(l => l.key === key ? { ...l, qty } : l).filter(l => l.qty > 0));
export const remove = key => write(memory.filter(l => l.key !== key));

/* ---------- drawer ---------- */
let drawer, lastFocus;
function ensureDrawer() {
  if (drawer) return drawer;
  drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.hidden = true;
  drawer.innerHTML = `
    <div class="drawer__scrim" data-close></div>
    <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <header class="drawer__head">
        <h2 id="drawer-title" class="drawer__title">הסל שלי</h2>
        <button class="icon-btn" data-close aria-label="סגירת הסל"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </header>
      <div class="drawer__body"></div>
      <footer class="drawer__foot"></footer>
    </aside>`;
  document.body.append(drawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeDrawer();
    const btn = e.target.closest('[data-qty]');
    if (btn) { const l = memory.find(x => x.key === btn.dataset.key); setQty(l.key, l.qty + Number(btn.dataset.qty)); }
    const rm = e.target.closest('[data-remove]');
    if (rm) remove(rm.dataset.key);
  });
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  document.addEventListener('cart:change', renderDrawer);
  renderDrawer();
  return drawer;
}

function renderDrawer() {
  if (!drawer) return;
  const body = drawer.querySelector('.drawer__body');
  const foot = drawer.querySelector('.drawer__foot');
  if (!memory.length) {
    body.innerHTML = `<div class="drawer__empty"><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M18 30h44l-6 40H24z"/><path d="M26 30c0-10 6-16 14-16s14 6 14 16"/></svg><p>הסל עדיין ריק</p><a class="btn btn--primary" href="ice-cream.html">לגלידות</a><a class="btn btn--ghost" href="build.html">ליוגורט בהרכבה</a></div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = memory.map(l => `
    <article class="line">
      <img src="${img(l.img)}" alt="" width="72" height="72" class="line__img">
      <div class="line__info">
        <h3 class="line__name">${l.name}</h3>
        <p class="line__meta">${l.variant}${l.extras.flavours ? ' · ' + l.extras.flavours.join(', ') : ''}${l.extras.parts ? ' · ' + l.extras.parts.join(', ') : ''}</p>
        ${l.pickupOnly ? '<p class="line__note">רק באיסוף עצמי</p>' : ''}
        <div class="line__row">
          <div class="qty" role="group" aria-label="כמות של ${l.name}">
            <button data-qty="1" data-key="${l.key}" aria-label="הוספת יחידה">+</button>
            <span aria-live="polite">${l.qty}</span>
            <button data-qty="-1" data-key="${l.key}" aria-label="הורדת יחידה">−</button>
          </div>
          <bdi class="line__price">${money(l.qty * l.price)}</bdi>
        </div>
      </div>
      <button class="line__remove" data-remove data-key="${l.key}" aria-label="הסרת ${l.name} מהסל"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </article>`).join('');
  const sub = subtotal();
  const left = Math.max(0, FREE_SHIPPING - sub);
  foot.innerHTML = `
    <div class="ship-meter">
      <p>${left ? `עוד <bdi>${money(left)}</bdi> למשלוח חינם` : 'יש לך משלוח חינם'}</p>
      <div class="ship-meter__bar"><span style="inline-size:${Math.min(100, sub / FREE_SHIPPING * 100)}%"></span></div>
    </div>
    <div class="drawer__sum"><span>סכום ביניים</span><bdi>${money(sub)}</bdi></div>
    <a class="btn btn--primary btn--block" href="checkout.html">לתשלום</a>
    <a class="btn btn--ghost btn--block" href="cart.html">לסל המלא</a>`;
}

export function openDrawer() {
  ensureDrawer();
  lastFocus = document.activeElement;
  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add('is-open'));
  document.documentElement.classList.add('no-scroll');
  drawer.querySelector('.drawer__head .icon-btn').focus();
}
export function closeDrawer() {
  drawer.classList.remove('is-open');
  document.documentElement.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; }, 350);
  lastFocus?.focus();
}
export const initCart = ensureDrawer;
