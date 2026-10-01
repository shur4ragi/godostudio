import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './Stats.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Stats() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const linesRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      }
    });

    itemsRef.current.forEach((item, i) => {
      tl.fromTo(item,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
        i * 0.15
      );
    });

    linesRef.current.forEach((line, i) => {
      tl.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'expo.out' },
        i * 0.15
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {siteConfig.stats.map((stat, i) => (
            <div 
              key={i}
              className={styles.item}
              ref={el => itemsRef.current[i] = el}
              style={{ opacity: 0 }}
            >
              <span className={styles.label}>{stat.label}</span>
              <span className={styles.value}>
                {stat.value}
                {stat.suffix && <span className={styles.suffix}>{stat.suffix}</span>}
              </span>
              {i < siteConfig.stats.length - 1 && (
                <div 
                  className={styles.line}
                  ref={el => linesRef.current[i] = el}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
