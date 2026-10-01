import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './FAQ.module.css';

gsap.registerPlugin(ScrollTrigger);

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
          delay: i * 0.05,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2 className={styles.title}>Perguntas<br/>frequentes</h2>
        </div>

        <div className={styles.list}>
          {siteConfig.faq.map((item, i) => (
            <article
              key={i}
              ref={el => itemsRef.current[i] = el}
              className={`${styles.item} ${openIndex === i ? styles.open : ''}`}
              style={{ opacity: 0 }}
            >
              <button
                className={styles.question}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className={styles.questionNumber}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.questionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div className={styles.answerWrapper}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
