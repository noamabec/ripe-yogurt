import { BRANCHES, isOpen, img } from './data.js';
import { initLayout, reveal } from './layout.js?v=6';

initLayout();

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'מוצאי שבת'];
const today = new Date().getDay();
const fmt = t => t === '24:00' ? '00:00' : t === '24:30' ? '00:30' : t;

document.querySelector('[data-brs]').innerHTML = BRANCHES.map(b => {
  const open = isOpen(b);
  return `
  <article class="br" id="${b.id}" data-reveal>
    <div class="br__media"><img src="${img(b.img)}" alt="החזית של סניף ${b.name}" width="1000" height="747" loading="lazy"></div>
    <div class="br__body">
      <h2>${b.name} <span class="open ${open ? '' : 'is-closed'}">${open ? 'פתוח עכשיו' : 'סגור עכשיו'}</span></h2>
      <p>${b.address} · <a href="tel:${b.phone}"><bdi>${b.phone}</bdi></a></p>
      <dl class="hours">${b.hours.map((h, i) => `<div class="${i === today ? 'is-today' : ''}"><dt>${DAYS[i]}</dt><dd><bdi>${fmt(h[0])}–${fmt(h[1])}</bdi></dd></div>`).join('')}</dl>
      <div class="br__actions">
        <a class="btn btn--primary btn--sm" href="ice-cream.html?branch=${b.id}">הזמנה לאיסוף מכאן</a>
        <a class="btn btn--ghost btn--sm" href="https://waze.com/ul?q=${encodeURIComponent(b.address)}" target="_blank" rel="noopener">ניווט ב-Waze</a>
        <a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}" target="_blank" rel="noopener">Google Maps</a>
      </div>
    </div>
  </article>`;
}).join('');

const form = document.querySelector('[data-next]');
form.addEventListener('submit', e => {
  e.preventDefault();
  const [city, mail] = form.querySelectorAll('input');
  const msg = form.querySelector('.msg');
  if (!city.value.trim()) { msg.textContent = 'באיזו עיר?'; city.focus(); return; }
  if (!mail.checkValidity() || !mail.value) { msg.textContent = 'צריך מייל תקין כדי לעדכן אתכם'; mail.focus(); return; }
  msg.textContent = `רשמנו: ${city.value.trim()}. נעדכן כשנגיע.`;
  form.reset();
});
reveal();
