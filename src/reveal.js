// Scroll entrance (fade + rise) for anything marked `data-reveal`, on every viewport.
// IntersectionObserver + CSS (opacity / `translate` only, so it stays on the compositor and
// never fights an element's own `transform`). A MutationObserver picks up sections that are
// lazy-mounted later (BelowFold) or swapped in on a language / view change, so nothing
// depends on ScrollTrigger positions being refreshed. Elements that enter together are staggered.
// State lives in `data-in` (not className) so React re-renders never reset it.
const DONE_MS = 1500; // > longest delay + duration; then the element's own transitions return

export function initReveal(root = document.body) {
  const html = document.documentElement;
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {};
  }

  const timers = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      // Elements entering together are staggered in DOM order; one entering alone has no delay.
      const batch = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      batch.forEach((el, k) => {
        io.unobserve(el);
        el.style.setProperty('--rv-d', `${Math.min(k, 5) * 80}ms`);
        el.setAttribute('data-in', '');
        const t = setTimeout(() => {
          timers.delete(t);
          el.setAttribute('data-in', 'done');
        }, DONE_MS);
        timers.add(t);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 }
  );

  const scan = (node) => {
    if (node.nodeType !== 1) return;
    if (node.hasAttribute('data-reveal') && !node.hasAttribute('data-in')) io.observe(node);
    node.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));
  };

  html.classList.add('reveal-on');
  scan(root);
  const mo = new MutationObserver((records) => {
    records.forEach((r) => r.addedNodes.forEach(scan));
  });
  mo.observe(root, { childList: true, subtree: true });

  return () => {
    mo.disconnect();
    io.disconnect();
    timers.forEach(clearTimeout);
    html.classList.remove('reveal-on');
  };
}
