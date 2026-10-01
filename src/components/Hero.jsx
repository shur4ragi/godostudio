import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { siteConfig } from '../data/site';
import styles from './Hero.module.css';

export function Hero({ ready }) {
  const headlineRef = useRef(null);
  const labelsRef = useRef([]);
  const hintRef = useRef(null);

  useEffect(() => {
    if (!ready) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, ...labelsRef.current, hintRef.current], { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)'
      });
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(headlineRef.current, 
      { opacity: 0, y: 60, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
    );

    labelsRef.current.forEach((label) => {
      tl.fromTo(label,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
        `-=${0.6}`
      );
    });

    tl.fromTo(hintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    return () => tl.kill();
  }, [ready]);

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.grid} />
      </div>

      <div className={styles.content}>
        <div className={styles.labels}>
          {siteConfig.hero.labels.map((label, i) => (
            <span 
              key={i} 
              ref={el => labelsRef.current[i] = el}
              className={styles.label}
              style={{ opacity: 0 }}
            >
              {label}
            </span>
          ))}
        </div>

        <h1 
          ref={headlineRef} 
          className={styles.headline}
          style={{ opacity: 0 }}
        >
          {siteConfig.hero.headline}
        </h1>

        <div 
          ref={hintRef} 
          className={styles.hint}
          style={{ opacity: 0 }}
        >
          <span className={styles.hintText}>{siteConfig.hero.scrollHint}</span>
          <div className={styles.hintLine} />
        </div>
      </div>

      <div className={styles.corners}>
        <span className={styles.corner} data-pos="tl" />
        <span className={styles.corner} data-pos="tr" />
        <span className={styles.corner} data-pos="bl" />
        <span className={styles.corner} data-pos="br" />
      </div>
    </section>
  );
}
