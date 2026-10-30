// Product card with variant pills on the card. Packs send you to pick flavours; the rest add directly.
import { money, img } from './data.js';
import { add } from './cart.js';

const firstInStock = p => Math.max(0, p.variants.findIndex(v => v.stock !== false));
const tagClass = t => ({ 'עונתי': 'season', 'טבעוני': 'leaf', 'רק באיסוף': 'pickup', 'חדש': 'new' }[t] || '');

export function productCard(p) {
  const v0 = firstInStock(p);
  const soldOut = p.variants.every(v => v.stock === false);
  return `
  <article class="pcard tint-${p.tint}" data-id="${p.id}" data-reveal>
    <a class="pcard__media" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true">
      <img src="${img(p.img)}" alt="" width="600" height="600" loading="lazy">
    </a>
    ${p.tags.length ? `<ul class="pcard__tags">${p.tags.map(t => `<li class="sticker sticker--${tagClass(t)}">${t}</li>`).join('')}</ul>` : ''}
    <div class="pcard__body">
      <h3 class="pcard__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="pcard__desc">${p.desc}</p>
      <div class="pills" role="radiogroup" aria-label="בחירת ${p.type === 'pack' ? 'גודל' : 'אפשרות'} ל${p.name}">
        ${p.variants.map((v, i) => `<button type="button" role="radio" class="pill" data-i="${i}" aria-checked="${i === v0}" ${v.stock === false ? 'disabled aria-disabled="true" title="אזל היום"' : ''}>${v.label}${v.stock === false ? ' <small>אזל</small>' : ''}</button>`).join('')}
      </div>
      <div class="pcard__foot">
        <bdi class="pcard__price" aria-live="polite">${money(p.variants[v0].price)}</bdi>
        ${soldOut ? '<button class="btn btn--primary btn--sm" disabled>אזל היום</button>'
          : p.type === 'pack'
            ? `<a class="btn btn--primary btn--sm" data-pick href="product.html?id=${p.id}&size=${v0}">בחירת טעמים</a>`
            : '<button type="button" class="btn btn--primary btn--sm" data-add>הוספה לסל</button>'}
      </div>
      ${p.variants[v0].note ? `<p class="pcard__note">${p.variants[v0].note}</p>` : ''}
    </div>
  </article>`;
}

// One delegated listener per container: pick a variant, add to cart.
export function wireCards(container, products) {
  container.addEventListener('click', e => {
    const card = e.target.closest('.pcard'); if (!card) return;
    const p = products.find(x => x.id === card.dataset.id);
    const pill = e.target.closest('.pill');
    if (pill && !pill.disabled) {
      card.querySelectorAll('.pill').forEach(b => b.setAttribute('aria-checked', String(b === pill)));
      const v = p.variants[pill.dataset.i];
      card.querySelector('.pcard__price').textContent = money(v.price);
      const note = card.querySelector('.pcard__note'); if (note) note.textContent = v.note || '';
      const pick = card.querySelector('[data-pick]'); if (pick) pick.href = `product.html?id=${p.id}&size=${pill.dataset.i}`;
    }
    const btn = e.target.closest('[data-add]');
    if (btn) {
      const i = Number(card.querySelector('.pill[aria-checked="true"]').dataset.i);
      if (add(p.id, i)) { btn.textContent = 'נוסף ✓'; setTimeout(() => { btn.textContent = 'הוספה לסל'; }, 1600); }
    }
  });
  // arrow keys inside a radiogroup (RTL: left = next)
  container.addEventListener('keydown', e => {
    const pill = e.target.closest('.pill'); if (!pill || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const all = [...pill.parentElement.querySelectorAll('.pill:not([disabled])')];
    const dir = e.key === 'ArrowLeft' ? 1 : -1;
    const next = all[(all.indexOf(pill) + dir + all.length) % all.length];
    next.focus(); next.click(); e.preventDefault();
  });
}
