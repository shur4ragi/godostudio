import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './Process.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
    );

    itemsRef.current.forEach((item) => {
      if (!item) return;
      tl.fromTo(
        item,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
        `-=${0.35}`
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="processo" ref={sectionRef} className={`${styles.section} section-light`}>
      <div className="container">
        <div ref={headerRef} className={styles.header} style={{ opacity: 0 }}>
          <span className={styles.eyebrow}>Processo</span>
          <h2 className={styles.title}>Como funciona</h2>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {siteConfig.process.map((step, i) => (
            <article
              key={step.number}
              ref={(el) => (itemsRef.current[i] = el)}
              className={styles.item}
              style={{ opacity: 0 }}
            >
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.itemTitle}>{step.title}</h3>
              <p className={styles.itemDesc}>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
