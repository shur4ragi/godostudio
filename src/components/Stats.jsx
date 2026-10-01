import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './Stats.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Stats() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const valuesRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      },
    });

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      tl.fromTo(
        item,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' },
        i * 0.12
      );
    });

    // Só os gatilhos desta seção (matar todos derrubava o pin do Processo).
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} section-muted`}>
      <div className="container">
        <div className={styles.grid}>
          {siteConfig.stats.map((stat, i) => (
            <div
              key={i}
              className={styles.item}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <span className={styles.label}>{stat.label}</span>
              <span className={styles.value} ref={(el) => (valuesRef.current[i] = el)}>
                {stat.value}
                {stat.suffix && <span className={styles.suffix}>{stat.suffix}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
