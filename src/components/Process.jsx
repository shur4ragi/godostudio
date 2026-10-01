import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './Process.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      
      gsap.fromTo(item,
        { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="processo" ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Processo</span>
          <h2 className={styles.title}>Como<br/>funciona</h2>
        </div>

        <div className={styles.list}>
          {siteConfig.process.map((step, i) => (
            <article
              key={step.number}
              ref={el => itemsRef.current[i] = el}
              className={styles.item}
              style={{ 
                opacity: 0,
                '--offset': i % 2 === 0 ? '0%' : '20%',
              }}
            >
              <div className={styles.itemLine} />
              <div className={styles.itemContent}>
                <span className={styles.itemNumber}>{step.number}</span>
                <h3 className={styles.itemTitle}>{step.title}</h3>
                <p className={styles.itemDesc}>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
