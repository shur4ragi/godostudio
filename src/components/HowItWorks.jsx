import { useEffect, useRef } from 'react';
import { siteConfig } from '../data/site';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const steps = sectionRef.current?.querySelectorAll(`.${styles.step}`);
    steps?.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Como funciona</span>
          <h2 className={styles.title}>Do primeiro contato ao site no ar</h2>
          <p className={styles.description}>
            Um processo simples e transparente, sem burocracia.
          </p>
        </div>

        <div className={styles.steps}>
          {siteConfig.steps.map((step, index) => (
            <article
              key={step.number}
              className={styles.step}
              style={{ '--delay': `${index * 100}ms` }}
            >
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < siteConfig.steps.length - 1 && (
                <div className={styles.connector} />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
