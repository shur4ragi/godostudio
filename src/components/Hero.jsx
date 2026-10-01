import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { siteConfig, getWhatsAppLink } from '../data/site';
import { HeroPhone } from './HeroPhone';
import styles from './Hero.module.css';

// Entrance timeline (ms), modelled on the Nanica opening:
// letters rise in -> letters blur out -> framed panel opens from a centre line
// -> copy and phone stagger in.
const OUT_AT = 1900;
const OPEN_AT = 2500;
const DONE_AFTER_OPEN = 2600;
const VISITED_KEY = 'godostudio-visited';

const LABELS = ['Sites', 'Negócios locais', siteConfig.brand.location];

function initialPhase() {
  if (typeof window === 'undefined') return 'done';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'done';
  try {
    if (sessionStorage.getItem(VISITED_KEY)) return 'open';
  } catch {
    /* storage unavailable */
  }
  return 'intro';
}

function splitTitle(text, highlight) {
  const words = text.split(' ');
  const hi = highlight && text.endsWith(highlight) ? highlight.split(' ').length : 0;
  return words.map((w, i) => ({ w, accent: i >= words.length - hi }));
}

export function Hero() {
  const [phase, setPhase] = useState(initialPhase);
  const [withIntro] = useState(() => phase === 'intro');
  const { headline, subtitle, highlight, lead } = siteConfig.hero;
  const letters = headline.split('');
  const words = splitTitle(subtitle, highlight);
  const loading = phase === 'intro' || phase === 'out';

  const skip = useCallback(() => {
    setPhase((p) => (p === 'intro' || p === 'out' ? 'open' : p));
  }, []);

  // Header + scroll state on <html>, set before paint to avoid a header flash.
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (loading) html.dataset.entrance = 'loading';
    else if (phase === 'open') html.dataset.entrance = 'reveal';
    else delete html.dataset.entrance;
  }, [phase, loading]);

  useEffect(() => () => delete document.documentElement.dataset.entrance, []);

  // Intro timers
  useEffect(() => {
    if (phase !== 'intro') return undefined;
    try {
      sessionStorage.setItem(VISITED_KEY, '1');
    } catch {
      /* ignore */
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const t = setTimeout(() => setPhase((p) => (p === 'intro' ? 'out' : p)), OUT_AT);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'out') return undefined;
    const t = setTimeout(() => setPhase((p) => (p === 'out' ? 'open' : p)), OPEN_AT - OUT_AT);
    return () => clearTimeout(t);
  }, [phase]);

  // Lock scrolling (incl. Lenis) while loading; any wheel/touch/key/click skips ahead.
  useEffect(() => {
    if (!loading) return undefined;
    const block = (e) => {
      e.stopImmediatePropagation();
      if (e.cancelable) e.preventDefault();
      skip();
    };
    const opts = { capture: true, passive: false };
    const evs = ['wheel', 'touchmove', 'keydown', 'pointerdown'];
    evs.forEach((ev) => window.addEventListener(ev, block, opts));
    return () => evs.forEach((ev) => window.removeEventListener(ev, block, opts));
  }, [loading, skip]);

  useEffect(() => {
    if (phase !== 'open') return undefined;
    const t = setTimeout(() => setPhase('done'), DONE_AFTER_OPEN);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section className={styles.hero} data-phase={phase} aria-label="Início">
      {withIntro && phase !== 'done' && (
        <div className={styles.intro} aria-hidden="true">
          <p className={styles.word}>
            {letters.map((l, i) => (
              <span key={i} className={styles.letter} style={{ '--i': i }}>
                {l}
              </span>
            ))}
          </p>
          <p className={styles.introTag}>{siteConfig.brand.tagline}</p>
        </div>
      )}

      <div className={styles.panel}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <ul className={styles.labels} data-in="eyebrow">
              {LABELS.map((l) => (
                <li key={l} className={styles.label}>
                  {l}
                </li>
              ))}
            </ul>

            <h1 className={styles.title} aria-label={subtitle}>
              {words.map(({ w, accent }, i) => (
                <span key={i} className={styles.mask} aria-hidden="true">
                  <span className={`${styles.wordIn} ${accent ? styles.accent : ''}`} style={{ '--w': i }}>
                    {w}
                  </span>
                </span>
              ))}
            </h1>

            <p className={styles.lead} data-in="lead">
              {lead}
            </p>

            <div className={styles.actions} data-in="actions">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                <span className={styles.ctaDot} aria-hidden="true" />
                Quero meu site
              </a>
              <a href="#projetos" className={styles.scroll}>
                <span aria-hidden="true">///</span> Role para explorar
              </a>
            </div>
          </div>

          <div className={styles.visual} data-in="phone">
            <HeroPhone />
          </div>
        </div>

        <div className={styles.meta} data-in="meta" aria-hidden="true">
          <span>{headline}</span>
          <span>{siteConfig.brand.tagline}</span>
        </div>
      </div>
    </section>
  );
}
