import { PRODUCTS, BRANCHES, FREE_SHIPPING, isOpen, img, money } from './data.js';
import { initLayout } from './layout.js?v=6';
import { productCard, wireCards } from './cards.js';
import { lines, setQty, remove, getFulfil, setFulfil } from './cart.js';
import { totals, COUPONS, getCoupon, setCoupon } from './order.js';

initLayout();

const root = document.querySelector('[data-cart-page]');
const meta = l => [l.variant, ...(l.extras.flavours || []), ...(l.extras.parts || [])].join(' · ');

function render() {
  const ls = lines();
  if (!ls.length) {
    root.innerHTML = `<div class="empty"><img src="${img('build-cup')}" alt="" width="525" height="1100" style="width:110px">
      <h2>הסל עדיין ריק</h2><p>אולי מארז גלידה לערב, או יוגורט עם פירות העונה?</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn--primary" href="ice-cream.html">לגלידות</a><a class="btn btn--ghost" href="build.html">ליוגורט בהרכבה</a></div></div>`;
    return;
  }
  const t = totals();
  const f = getFulfil();
  const left = Math.max(0, FREE_SHIPPING - t.sub);
  root.innerHTML = `
    <div class="cartp">
      <div>
        <div class="cartp__lines">
          ${ls.map(l => `
          <article class="line">
            <img src="${img(l.img)}" alt="" width="96" height="96" class="line__img">
            <div class="line__info">
              <h3 class="line__name">${l.name}</h3>
              <p class="line__meta">${meta(l)}</p>
              ${l.pickupOnly ? '<p class="line__note">רק באיסוף עצמי</p>' : ''}
              <div class="line__row">
                <div class="qty" role="group" aria-label="כמות של ${l.name}"><button data-qty="1" data-key="${l.key}" aria-label="הוספת יחידה">+</button><span>${l.qty}</span><button data-qty="-1" data-key="${l.key}" aria-label="הורדת יחידה">−</button></div>
                <bdi class="line__price">${money(l.qty * l.price)}</bdi>
              </div>
            </div>
            <button class="line__remove" data-remove="${l.key}" aria-label="הסרת ${l.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
          </article>`).join('')}
        </div>
      </div>
      <aside class="side">
        <div class="box">
          <h2>איך מקבלים?</h2>
          <div class="choice" role="radiogroup" aria-label="דרך קבלה">
            <button type="button" role="radio" data-mode="delivery" aria-checked="${t.delivery}" ${t.pickupOnly ? 'disabled' : ''}>משלוח מהיר<small>30–45 דקות · ${t.sub >= FREE_SHIPPING ? 'חינם' : money(25)}</small></button>
            <button type="button" role="radio" data-mode="pickup" aria-checked="${!t.delivery}">איסוף עצמי<small>מוכן תוך 15 דקות · חינם</small></button>
          </div>
          ${t.pickupOnly ? '<p class="warn">יש בסל כוס או גביע, ולכן ההזמנה כולה באיסוף עצמי.</p>' : ''}
          ${!t.delivery ? `<label class="sr-only" for="br">סניף לאיסוף</label><select id="br" class="select" data-branch>${BRANCHES.map(b => `<option value="${b.id}" ${b.id === f.branch ? 'selected' : ''}>סניף ${b.name} · ${isOpen(b) ? 'פתוח עכשיו' : 'סגור עכשיו'}</option>`).join('')}</select>` : `
          <div class="ship-meter"><p>${left ? `עוד <bdi>${money(left)}</bdi> למשלוח חינם` : 'יש לך משלוח חינם'}</p><div class="ship-meter__bar"><span style="inline-size:${Math.min(100, t.sub / FREE_SHIPPING * 100)}%"></span></div></div>`}
        </div>
        <div class="box">
          <h2>סיכום</h2>
          <form class="coupon" data-coupon novalidate>
            <label class="sr-only" for="cc">קוד קופון</label>
            <input id="cc" class="select" placeholder="קוד קופון" value="${getCoupon()}" autocomplete="off">
            <button class="btn btn--ghost btn--sm" type="submit">החלה</button>
          </form>
          <p class="fpick__msg" data-cmsg role="status" style="${t.coupon ? 'color:var(--leaf)' : ''}">${t.coupon ? `הקופון הופעל: ${t.coupon.label}` : ''}</p>
          <dl class="sumrows">
            <div><dt>סכום ביניים</dt><dd><bdi>${money(t.sub)}</bdi></dd></div>
            <div><dt>${t.delivery ? 'משלוח' : 'איסוף עצמי'}</dt><dd><bdi>${t.ship ? money(t.ship) : 'חינם'}</bdi></dd></div>
            ${t.discount ? `<div><dt>הנחה</dt><dd><bdi dir="ltr">−${money(t.discount)}</bdi></dd></div>` : ''}
            <div class="total"><dt>סה"כ</dt><dd><bdi>${money(t.total)}</bdi></dd></div>
          </dl>
          <a class="btn btn--primary btn--block" href="checkout.html">לתשלום</a>
          <p class="paylogos"><span>VISA</span><span>Mastercard</span><span>bit</span> קנייה מאובטחת</p>
        </div>
      </aside>
    </div>`;
}

root.addEventListener('click', e => {
  const q = e.target.closest('[data-qty]');
  if (q) { const l = lines().find(x => x.key === q.dataset.key); setQty(l.key, l.qty + Number(q.dataset.qty)); }
  const r = e.target.closest('[data-remove]'); if (r) remove(r.dataset.remove);
  const m = e.target.closest('[data-mode]'); if (m && !m.disabled) { setFulfil({ mode: m.dataset.mode }); render(); }
});
root.addEventListener('change', e => { if (e.target.matches('[data-branch]')) setFulfil({ branch: e.target.value }); });
root.addEventListener('submit', e => {
  if (!e.target.matches('[data-coupon]')) return;
  e.preventDefault();
  const code = e.target.querySelector('input').value.trim().toUpperCase();
  if (!code) { setCoupon(''); render(); return; }
  if (!COUPONS[code]) { root.querySelector('[data-cmsg]').textContent = 'הקוד הזה לא תקף. בדקו שהוא הוקלד נכון.'; return; }
  setCoupon(code); render();
});
document.addEventListener('cart:change', render);
render();

const xs = document.querySelector('[data-xs]');
xs.innerHTML = PRODUCTS.filter(p => ['season-pack', 'pops', 'cake', 'chef-ripe'].includes(p.id)).map(productCard).join('');
wireCards(xs, PRODUCTS);
