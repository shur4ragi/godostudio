import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './FinalCTA.module.css';

gsap.registerPlugin(ScrollTrigger);

export function FinalCTA() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} section-light`}>
      <div className="container">
        <div ref={contentRef} className={styles.content} style={{ opacity: 0 }}>
          <span className={styles.eyebrow}>Vamos começar?</span>
          <h2 className={styles.title}>
            Seu site <span className={styles.highlight}>está aqui.</span>
          </h2>

          <div className={styles.ctas}>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
            >
              <span className={styles.ctaDot} />
              Falar pelo WhatsApp
            </a>
            <a
              href={siteConfig.contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaSecondary}
            >
              {siteConfig.contact.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
