// Light is the default theme. Dark mode is opt-in from the header toggle and the choice
// is saved in localStorage (index.html applies it before first paint to avoid a flash).
export const THEME_KEY = 'godostudio-theme';
const META = { light: '#eef2f4', dark: '#1f2226' };

export function getTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme, { animate = false, persist = true } = {}) {
  const root = document.documentElement;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (animate && !reduce) {
    root.classList.add('theme-anim');
    window.clearTimeout(applyTheme.t);
    applyTheme.t = window.setTimeout(() => root.classList.remove('theme-anim'), 450);
  }
  if (theme === 'dark') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[theme] || META.light);
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode: theme just isn't remembered */
    }
  }
  window.dispatchEvent(new CustomEvent('godostudio:theme', { detail: theme }));
}
