import { BRANCHES, WHATSAPP, isOpen, img, money } from './data.js';
import { initLayout } from './layout.js?v=6';
import { lines, getFulfil, setFulfil } from './cart.js';
import { totals } from './order.js';

initLayout();

const root = document.querySelector('[data-co]');
// cities inside the 8 km delivery radius of a branch
const CITIES = ['תל אביב', 'רמת גן', 'גבעתיים', 'בני ברק', 'הרצליה', 'רמת השרון', 'כפר שמריהו', 'רעננה', 'ירושלים', 'מבשרת ציון'];
const form = { name: '', phone: '', email: '', city: '', street: '', apt: '', note: '', slot: 'asap', terms: false, news: false };

function slots() {
  const out = [['asap', getFulfil().mode === 'pickup' ? 'בהקדם · 15 דק׳' : 'בהקדם · 30–45 דק׳']];
  const now = new Date(); const h = now.getHours() + (now.getMinutes() > 30 ? 2 : 1);
  for (let i = 0; i < 4; i++) { const hh = (h + i) % 24; out.push([`${hh}:00`, `${String(hh).padStart(2, '0')}:00–${String(hh).padStart(2, '0')}:30`]); }
  return out;
}

function render() {
  const ls = lines();
  if (!ls.length) {
    root.innerHTML = `<div class="empty"><img src="${img('build-cup')}" alt="" width="525" height="1100" style="width:100px"><h2>אין מה לשלם עליו</h2><p>הסל ריק. כשתבחרו משהו, נחזור לכאן.</p><a class="btn btn--primary" href="ice-cream.html">לגלידות</a></div>`;
    return;
  }
  const t = totals(), f = getFulfil();
  root.innerHTML = `
    <form class="co" novalidate data-form>
      <div>
        <ol class="stepper" aria-label="שלבי ההזמנה" style="margin-block-end:14px"><li class="is-done"><b>✓</b><a href="cart.html">סל</a></li><li class="is-on"><b>2</b>פרטים וקבלה</li><li><b>3</b>סיכום ותשלום</li></ol>
        <h1>כמעט סיימנו</h1>
        <section aria-labelledby="s1"><h2 id="s1"><b>1</b>הפרטים שלך</h2>
          <div class="fields">
            <div class="field full"><label for="f-name">שם מלא</label><input id="f-name" name="name" autocomplete="name" value="${form.name}" required><span class="err"></span></div>
            <div class="field"><label for="f-phone">טלפון</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="050-0000000" value="${form.phone}" required><span class="err"></span></div>
            <div class="field"><label for="f-email">מייל (לקבלה)</label><input id="f-email" name="email" type="email" autocomplete="email" dir="ltr" value="${form.email}" required><span class="err"></span></div>
          </div>
        </section>
        <section aria-labelledby="s2"><h2 id="s2"><b>2</b>איך מקבלים</h2>
          <div class="choice" role="radiogroup" aria-label="דרך קבלה">
            <button type="button" role="radio" data-mode="delivery" aria-checked="${t.delivery}" ${t.pickupOnly ? 'disabled' : ''}>משלוח מהיר<small>עד 8 ק"מ מהסניף</small></button>
            <button type="button" role="radio" data-mode="pickup" aria-checked="${!t.delivery}">איסוף עצמי<small>חינם, מוכן תוך 15 דקות</small></button>
          </div>
          ${t.pickupOnly ? '<p class="warn">יש בסל כוס או גביע, ולכן ההזמנה כולה באיסוף עצמי.</p>' : ''}
          ${t.delivery ? `
          <div class="fields">
            <div class="field"><label for="f-city">עיר</label><input id="f-city" name="city" list="cities" autocomplete="address-level2" value="${form.city}" required><datalist id="cities">${CITIES.map(c => `<option value="${c}">`).join('')}</datalist><span class="err"></span></div>
            <div class="field"><label for="f-street">רחוב ומספר</label><input id="f-street" name="street" autocomplete="street-address" value="${form.street}" required><span class="err"></span></div>
            <div class="field"><label for="f-apt">קומה ודירה</label><input id="f-apt" name="apt" value="${form.apt}"><span class="err"></span></div>
            <div class="field"><label for="f-note">הערה לשליח</label><input id="f-note" name="note" placeholder="קוד לבניין, לדפוק חזק…" value="${form.note}"><span class="err"></span></div>
          </div>` : `
          <div class="branchpick" role="radiogroup" aria-label="סניף לאיסוף">
            ${BRANCHES.map(b => `<button type="button" role="radio" data-branch="${b.id}" aria-checked="${b.id === f.branch}">סניף ${b.name}<small>${b.address}</small><small>${isOpen(b) ? 'פתוח עכשיו' : 'סגור עכשיו, נכין לפתיחה'}</small></button>`).join('')}
          </div>`}
          <div><p class="field" style="font-weight:500;margin-block-end:8px">מתי?</p>
            <div class="slots" role="radiogroup" aria-label="שעה">${slots().map(([v, l]) => `<button type="button" role="radio" data-slot="${v}" aria-checked="${form.slot === v}"><bdi>${l}</bdi></button>`).join('')}</div>
          </div>
        </section>
      </div>
      <aside class="side">
        <section aria-labelledby="s3" style="margin:0"><h2 id="s3"><b>3</b>סיכום</h2>
          <div class="minilines">${ls.map(l => `<div><img src="${img(l.img)}" alt="" width="52" height="52"><span>${l.qty > 1 ? l.qty + ' × ' : ''}${l.name}<small>${[l.variant, ...(l.extras.flavours || []), ...(l.extras.parts || [])].join(' · ')}</small></span><bdi>${money(l.qty * l.price)}</bdi></div>`).join('')}</div>
          <dl class="sumrows">
            <div><dt>סכום ביניים</dt><dd><bdi>${money(t.sub)}</bdi></dd></div>
            <div><dt>${t.delivery ? 'משלוח' : 'איסוף עצמי'}</dt><dd><bdi>${t.ship ? money(t.ship) : 'חינם'}</bdi></dd></div>
            ${t.discount ? `<div><dt>הנחה</dt><dd><bdi dir="ltr">−${money(t.discount)}</bdi></dd></div>` : ''}
            <div class="total"><dt>סה"כ לתשלום</dt><dd><bdi>${money(t.total)}</bdi></dd></div>
          </dl>
          <label class="check"><input type="checkbox" name="terms" ${form.terms ? 'checked' : ''} required> <span>קראתי ואני מסכים/ה ל<a href="terms.html" target="_blank">תקנון</a> ול<a href="privacy.html" target="_blank">מדיניות הפרטיות</a></span></label>
          <p class="err" data-terms-err style="font-size:13px;color:#9B1C3A;min-height:1.2em"></p>
          <label class="check"><input type="checkbox" name="news" ${form.news ? 'checked' : ''}> <span>אשמח לקבל טעמים חדשים ומבצעים למייל</span></label>
          <button class="btn btn--primary btn--block" type="submit" style="min-height:56px;font-size:17px">לתשלום <bdi>${money(t.total)}</bdi></button>
          <p class="paylogos"><span>VISA</span><span>Mastercard</span><span>bit</span> תשלום מאובטח</p>
        </section>
      </aside>
    </form>`;
}

const keep = () => root.querySelectorAll('input[name]').forEach(i => { form[i.name] = i.type === 'checkbox' ? i.checked : i.value; });
const RULES = {
  name: v => v.trim().split(/\s+/).length >= 2 || 'כתבו שם פרטי ושם משפחה',
  phone: v => /^0\d{1,2}-?\d{7}$/.test(v.replace(/\s/g, '')) || 'מספר טלפון ישראלי, למשל 050-1234567',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'כתובת מייל תקינה, למשל name@mail.com',
  city: v => CITIES.includes(v.trim()) || (v.trim() ? 'העיר הזאת מחוץ לטווח המשלוחים שלנו. אפשר לבחור איסוף עצמי.' : 'באיזו עיר?'),
  street: v => v.trim().length > 2 || 'רחוב ומספר בית',
};
function validate() {
  let first = null;
  root.querySelectorAll('.field input[name]').forEach(i => {
    const rule = RULES[i.name]; if (!rule) return;
    const res = rule(i.value);
    const field = i.closest('.field');
    field.classList.toggle('is-bad', res !== true);
    field.querySelector('.err').textContent = res === true ? '' : res;
    if (res !== true && !first) first = i;
  });
  const terms = root.querySelector('[name="terms"]');
  root.querySelector('[data-terms-err]').textContent = terms.checked ? '' : 'צריך לאשר את התקנון כדי להמשיך';
  if (!terms.checked && !first) first = terms;
  if (first) first.focus();
  return !first;
}

root.addEventListener('click', e => {
  const m = e.target.closest('[data-mode]'); if (m && !m.disabled) { keep(); setFulfil({ mode: m.dataset.mode }); render(); }
  const b = e.target.closest('[data-branch]'); if (b) { keep(); setFulfil({ branch: b.dataset.branch }); render(); }
  const s = e.target.closest('[data-slot]'); if (s) { keep(); form.slot = s.dataset.slot; render(); }
});
root.addEventListener('input', e => { const f = e.target.closest('.field'); if (f?.classList.contains('is-bad')) { f.classList.remove('is-bad'); f.querySelector('.err').textContent = ''; } });
root.addEventListener('submit', e => {
  e.preventDefault(); keep();
  if (!validate()) return;
  // no live payment provider on this site: hand the whole order to WhatsApp instead of a card form
  const t = totals(), f = getFulfil();
  const br = BRANCHES.find(x => x.id === f.branch);
  const text = [
    'שלום RIPE, אני רוצה להשלים הזמנה:',
    ...lines().map(l => `• ${l.qty} × ${l.name} (${[l.variant, ...(l.extras.flavours || []), ...(l.extras.parts || [])].join(', ')}) ${money(l.qty * l.price)}`),
    t.delivery ? `משלוח ל: ${form.street}, ${form.city}${form.apt ? ', ' + form.apt : ''}` : `איסוף מסניף ${br.name}`,
    `מתי: ${form.slot === 'asap' ? 'בהקדם' : form.slot}`,
    `סה"כ: ${money(t.total)}`,
    `${form.name} · ${form.phone}`,
  ].join('\n');
  document.querySelector('[data-wa]').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  document.querySelector('[data-paydlg]').showModal();
});
document.querySelector('[data-payclose]').addEventListener('click', () => document.querySelector('[data-paydlg]').close());
render();
