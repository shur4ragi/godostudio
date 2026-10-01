import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n';
import styles from './Manifesto.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const { lang, site } = useLang();
  const { text: copy, highlight } = site.manifesto;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const text = textRef.current;
    const words = copy.split(' ');
    
    text.innerHTML = words.map(word => {
      const isHighlight = word.toLowerCase().includes(highlight.toLowerCase());
      return `<span class="${styles.word} ${isHighlight ? styles.highlight : ''}"><span class="${styles.wordInner}">${word}</span></span>`;
    }).join(' ');

    const wordInners = text.querySelectorAll(`.${styles.wordInner}`);

    const tween = gsap.fromTo(wordInners,
      { 
        opacity: 0.2,
      },
      {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.03,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [copy, highlight]);

  return (
    <section ref={sectionRef} className={`${styles.section} section-dark`}>
      <div className="container">
        {/* key: React must not reconcile into the words injected below on a language switch */}
        <p key={lang} ref={textRef} className={styles.text}>
          {copy}
        </p>
      </div>
    </section>
  );
}
