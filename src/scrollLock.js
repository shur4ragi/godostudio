// Shared page scroll lock (mobile menu, project sheet). Locks the root element and pauses
// Lenis when it is running, so neither native nor smooth wheel/touch scrolling moves the page.
let lenis = null;
let count = 0;

export function registerLenis(instance) {
  lenis = instance;
  if (count > 0) lenis?.stop();
}

export function lockScroll() {
  count += 1;
  if (count > 1) return;
  document.documentElement.style.overflow = 'hidden';
  lenis?.stop();
}

export function unlockScroll() {
  if (count === 0) return;
  count -= 1;
  if (count > 0) return;
  document.documentElement.style.overflow = '';
  lenis?.start();
}
