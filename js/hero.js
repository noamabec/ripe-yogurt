// Hero fruit scatter: three depth layers (near = big and blurred, mid = in focus, far = small and soft).
// Positions are physical % of the hero (decorative, so they don't mirror); w is in vw.
// m = [x, y, w] on phones, or false to drop that piece on small screens.
import { img } from './data.js';

const FRUIT = [
  // near: hang off the edges, in front of everything
  { src: 'fruit-pomegranate', d: 'near', x: -5, y: 58, w: 21, r: -14, m: [-20, 38, 34] },
  { src: 'top-kiwi', d: 'near', x: 85, y: -6, w: 17, r: 24, m: [80, 28, 30] },
  { src: 'deco-persimmon', d: 'near', x: 86, y: 66, w: 15, r: -24, m: false },
  { src: 'deco-mint-sprig', d: 'near', x: -2, y: -8, w: 13, r: 30, m: [-12, -7, 20] },
  // mid: in focus, framing the cup
  { src: 'fruit-date', d: 'mid', x: 10, y: 20, w: 10, r: 8, m: false },
  { src: 'fruit-persimmon', d: 'mid', x: 79, y: 30, w: 10, r: -6, m: false },
  { src: 'top-pomegranate', d: 'mid', x: 28, y: 45, w: 7, r: -4, m: [5, 31, 18] },
  { src: 'top-persimmon', d: 'mid', x: 66, y: 48, w: 8, r: 16, m: false },
  { src: 'deco-granola', d: 'mid', x: 9, y: 84, w: 6.5, r: 0, m: false },
  { src: 'fruit-grapes', d: 'mid', x: 74, y: 83, w: 7, r: -10, m: false },
  { src: 'deco-mint-leaf', d: 'mid', x: 21, y: 37, w: 4.2, r: -34, m: false },
  // far: small, soft, behind the text
  { src: 'deco-aril', d: 'far', x: 21, y: 9, w: 1.8, r: 0, m: [5, 12, 5] },
  { src: 'deco-aril', d: 'far', x: 80, y: 17, w: 1.5, r: 40, m: false },
  { src: 'deco-mint-leaf', d: 'far', x: 68, y: 3, w: 2.6, r: 60, m: false },
  { src: 'top-grapes', d: 'far', x: 3, y: 42, w: 4.5, r: 0, m: false },
  { src: 'deco-aril', d: 'far', x: 94, y: 47, w: 2, r: -20, m: false },
  { src: 'top-date', d: 'far', x: 91, y: 91, w: 4, r: 12, m: false },
  { src: 'deco-aril', d: 'far', x: 27, y: 90, w: 1.6, r: 0, m: [62, 95, 5] },
];

// how fast each layer travels on scroll: near rushes past, far lags behind like the ghost word
const PARALLAX = { near: -0.45, mid: -0.18, far: 0.06, ghost: 0.22 };
const ENTER = { far: 0.1, mid: 0.3, near: 0.55 };

export function initHero(root = document.querySelector('.hero')) {
  if (!root) return;
  const layer = root.querySelector('[data-hero-fruits]');
  layer.innerHTML = FRUIT.map((f, i) => {
    const amp = f.d === 'near' ? -22 : f.d === 'mid' ? -14 : -8;
    const vars = [
      `--x:${f.x}%`, `--y:${f.y}%`, `--w:${f.w}vw`, `--r:${f.r}deg`,
      f.m ? `--mx:${f.m[0]}%;--my:${f.m[1]}%;--mw:${f.m[2]}vw` : '',
      `--in:${(ENTER[f.d] + i * 0.05).toFixed(2)}s`,
      `--dur:${(6 + (i * 1.7) % 5).toFixed(1)}s`, `--delay:${(-(i * 1.3) % 6).toFixed(1)}s`,
      `--amp:${amp}px`, `--spin:${(i % 2 ? -1 : 1) * (3 + i % 5)}deg`,
    ].filter(Boolean).join(';');
    return `<span class="fx fx--${f.d}${f.m ? '' : ' no-m'}" data-depth="${f.d}" style="${vars}"><span class="fx__bob"><img src="${img(f.src)}" alt="" draggable="false"></span></span>`;
  }).join('');

  // touch screens have no hover: a tap gives the same little reaction for a moment
  layer.addEventListener('click', e => {
    const fx = e.target.closest('.fx'); if (!fx) return;
    fx.classList.add('is-poked');
    setTimeout(() => fx.classList.remove('is-poked'), 1100);
  });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const movers = [...root.querySelectorAll('[data-depth]')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = Math.min(scrollY, root.offsetHeight);
    movers.forEach(el => el.style.setProperty('--py', `${(y * PARALLAX[el.dataset.depth]).toFixed(1)}px`));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
