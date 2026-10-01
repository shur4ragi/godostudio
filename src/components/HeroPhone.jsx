import { useEffect, useRef } from 'react';
import styles from './HeroPhone.module.css';

// Mobile render of the site, 600w and 400w (AVIF with WebP fallback). Screen is ~0.915 x phone width.
const SIZES = '(max-width: 899px) 184px, 275px';
const srcset = (ext) => `/hero/site-mobile-400.${ext} 400w, /hero/site-mobile-600.${ext} 600w`;

// CSS-built iPhone, tilted in 3D, floating, with a light pointer parallax on desktop.
export function HeroPhone({ cta }) {
  const sceneRef = useRef(null);

  // Pause float/scroll animations while the hero is offscreen (or the tab is hidden).
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    let visible = true;
    const apply = () => {
      if (visible && !document.hidden) delete scene.dataset.paused;
      else scene.dataset.paused = '';
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      apply();
    });
    io.observe(scene);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

  // Pointer parallax (desktop, fine pointer): one rAF-throttled lerp, idle when settled or offscreen.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches || reduced.matches) return undefined;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      scene.style.setProperty('--px', x.toFixed(3));
      scene.style.setProperty('--py', y.toFixed(3));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf && !('paused' in scene.dataset)) raf = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene} aria-hidden="true">
      <span data-shape className={`${styles.shape} ${styles.dotCoral}`} />
      <span data-shape className={`${styles.shape} ${styles.dotSoft}`} />
      <span data-shape className={`${styles.shape} ${styles.ring}`} />
      <svg data-shape className={`${styles.shape} ${styles.tri}`} viewBox="0 0 20 18">
        <path d="M10 1.5 18.5 16.5H1.5Z" />
      </svg>
      <span data-shape className={`${styles.shape} ${styles.dotTiny}`} />

      <div className={styles.float}>
        <div className={styles.device}>
          <span className={styles.back} />
          <span className={`${styles.btn} ${styles.btnAction}`} />
          <span className={`${styles.btn} ${styles.btnVolUp}`} />
          <span className={`${styles.btn} ${styles.btnVolDown}`} />
          <span className={`${styles.btn} ${styles.btnPower}`} />
          <div className={styles.frame}>
            <div className={styles.screen}>
              <div className={styles.feed}>
                <picture>
                  <source type="image/avif" srcSet={srcset('avif')} sizes={SIZES} />
                  <img
                    src="/hero/site-mobile-600.webp"
                    srcSet={srcset('webp')}
                    sizes={SIZES}
                    alt=""
                    width="600"
                    height="6346"
                    decoding="async"
                    fetchPriority="low"
                    draggable="false"
                  />
                </picture>
              </div>
              <div className={styles.status}>
                <span className={styles.time}>9:41</span>
                <span className={styles.island} />
                <span className={styles.icons}>
                  <svg viewBox="0 0 18 12"><path d="M1 11h2.5V8H1zM5.5 11H8V6H5.5zM10 11h2.5V3.5H10zM14.5 11H17V1h-2.5z" /></svg>
                  <svg viewBox="0 0 16 12"><path d="M8 11.2 5.6 8.8a3.4 3.4 0 0 1 4.8 0zM3.4 6.6a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0zM1.2 4.4a9.6 9.6 0 0 1 13.6 0l-1.4 1.4a7.6 7.6 0 0 0-10.8 0z" /></svg>
                  <span className={styles.battery}><i /></span>
                </span>
              </div>
              <div className={styles.appbar}>
                <span className={styles.logo}>GodoStudio</span>
                <span className={styles.pill}>{cta}</span>
              </div>
              <span className={styles.homebar} />
              <span className={styles.glare} />
            </div>
          </div>
        </div>
      </div>
      <span className={styles.shadow} />
    </div>
  );
}
