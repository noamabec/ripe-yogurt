// Order maths shared by the cart page and the checkout: delivery fee, coupon, totals.
import { FREE_SHIPPING, DELIVERY_FEE } from './data.js';
import { lines, subtotal, getFulfil } from './cart.js';

const CKEY = 'ripe-coupon-v1';
// demo codes the club e-mail would hand out
export const COUPONS = { RIPE10: { pct: 10, label: '10% הנחה' }, SCOOP: { pct: 5, label: '5% הנחה לחברי מועדון' } };

export function getCoupon() { try { return localStorage.getItem(CKEY) || ''; } catch { return ''; } }
export function setCoupon(code) { try { code ? localStorage.setItem(CKEY, code) : localStorage.removeItem(CKEY); } catch { /* ignore */ } }

export function totals() {
  const sub = subtotal();
  const f = getFulfil();
  const pickupOnly = lines().some(l => l.pickupOnly);
  const delivery = f.mode === 'delivery' && !pickupOnly;
  const ship = delivery ? (sub >= FREE_SHIPPING ? 0 : DELIVERY_FEE) : 0;
  const c = COUPONS[getCoupon()];
  const discount = c ? Math.round(sub * c.pct / 100) : 0;
  return { sub, ship, discount, total: sub + ship - discount, delivery, pickupOnly, coupon: c, mode: f.mode, branch: f.branch };
}
