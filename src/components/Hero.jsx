import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { siteConfig, getWhatsAppLink } from '../data/site';
import { HeroGlobe } from './HeroGlobe';
import styles from './Hero.module.css';

const LABELS = ['Sites', 'Negócios locais', siteConfig.brand.location];

function splitHeadline(text) {
  // "GodoStudio" -> ["Godo", "Studio"]; otherwise split on the first space.
  const m = text.match(/^([A-ZÀ-Ý][a-zà-ÿ]+)([A-ZÀ-Ý].*)$/);
  if (m) return [m[1], m[2]];
  const i = text.indexOf(' ');
  return i > 0 ? [text.slice(0, i), text.slice(i + 1)] : [text];
}

export function Hero({ ready }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const lines = splitHeadline(siteConfig.hero.headline);

  useEffect(() => {
    if (!ready) return undefined;
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      gsap.set(q('[data-line]'), { y: 0, yPercent: 0 });
      gsap.set(stageRef.current, { scale: 1 });
      const t = gsap.fromTo(
        q('[data-fade]'),
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power1.out' }
      );
      return () => t.kill();
    }

    const tl = gsap.timeline();
    tl.fromTo(stageRef.current, { scale: 1.14 }, { scale: 1, duration: 1.7, ease: 'expo.out' }, 0)
      .fromTo(
        q('[data-line]'),
        { y: 0, yPercent: 110 },
        { y: 0, yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12 },
        0.25
      )
      .fromTo(
        q('[data-fade]'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 },
        0.45
      );
    return () => tl.kill();
  }, [ready]);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Início">
      <div ref={stageRef} className={styles.stage}>
        <HeroGlobe ready={ready} />

        <div className={styles.content}>
          <ul className={styles.labels}>
            {LABELS.map((l) => (
              <li key={l} data-fade>
                <span className={styles.label}>{l}</span>
              </li>
            ))}
          </ul>

          <h1 className={styles.headline} aria-label={siteConfig.hero.headline}>
            {lines.map((l) => (
              <span key={l} className={styles.line} aria-hidden="true">
                <span data-line className={styles.lineInner}>
                  {l}
                </span>
              </span>
            ))}
          </h1>

          <div className={styles.bottom}>
            <p className={styles.subtitle} data-fade>
              {siteConfig.hero.subtitle}
            </p>
            <div className={styles.actions} data-fade>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                Quero meu site
              </a>
              <a href="#projetos" className={styles.scroll}>
                <span aria-hidden="true">///</span> Role para explorar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
