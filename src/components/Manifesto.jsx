import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './Manifesto.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const text = textRef.current;
    const words = siteConfig.manifesto.text.split(' ');
    
    text.innerHTML = words.map(word => {
      const isHighlight = word.toLowerCase().includes(siteConfig.manifesto.highlight.toLowerCase());
      return `<span class="${styles.word} ${isHighlight ? styles.highlight : ''}"><span class="${styles.wordInner}">${word}</span></span>`;
    }).join(' ');

    const wordInners = text.querySelectorAll(`.${styles.wordInner}`);

    gsap.fromTo(wordInners,
      { 
        yPercent: 100,
        opacity: 0,
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.02,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container">
        <p ref={textRef} className={styles.text}>
          {siteConfig.manifesto.text}
        </p>
      </div>
    </section>
  );
}
