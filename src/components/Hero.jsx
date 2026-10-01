import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Hero.module.css';

export function Hero({ ready }) {
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!ready) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, subtitleRef.current, ctaRef.current], { 
        opacity: 1, 
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)'
      });
      return;
    }

    const tl = gsap.timeline({ delay: 0.1 });

    tl.fromTo(headlineRef.current, 
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out' }
    );

    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
      '-=0.5'
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
      '-=0.4'
    );

    return () => tl.kill();
  }, [ready]);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 ref={headlineRef} className={styles.headline}>
          {siteConfig.hero.headline}
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          {siteConfig.hero.subtitle}
        </p>

        <a
          ref={ctaRef}
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Quero meu site
        </a>
      </div>
    </section>
  );
}
