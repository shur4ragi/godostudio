import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { siteConfig } from '../data/site';
import styles from './Preloader.module.css';

export function Preloader({ onComplete }) {
  const [show, setShow] = useState(true);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const digit1Ref = useRef(null);
  const digit2Ref = useRef(null);
  const digit3Ref = useRef(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('godostudio-visited');
    
    if (hasVisited) {
      setShow(false);
      onComplete?.();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      sessionStorage.setItem('godostudio-visited', 'true');
      setShow(false);
      onComplete?.();
      return;
    }

    document.body.classList.add('is-loading');

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('godostudio-visited', 'true');
        setShow(false);
        document.body.classList.remove('is-loading');
        onComplete?.();
      }
    });

    const digits = [digit1Ref.current, digit2Ref.current, digit3Ref.current];
    
    digits.forEach((digit) => {
      const numbers = digit.querySelectorAll('span');
      gsap.set(numbers, { yPercent: 0 });
    });

    tl.to(digit3Ref.current.querySelectorAll('span'), {
      yPercent: -900,
      duration: 2,
      ease: 'power2.inOut',
    }, 0);

    tl.to(digit2Ref.current.querySelectorAll('span'), {
      yPercent: -900,
      duration: 2.2,
      ease: 'power2.inOut',
    }, 0);

    tl.to(digit1Ref.current.querySelectorAll('span'), {
      yPercent: -100,
      duration: 2.4,
      ease: 'power2.inOut',
    }, 0);

    tl.to(barRef.current, {
      scaleX: 1,
      duration: 2.5,
      ease: 'power2.inOut',
    }, 0);

    tl.to(counterRef.current, {
      yPercent: -120,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.inOut',
    }, 2.5);

    tl.to(barRef.current, {
      yPercent: 100,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut',
    }, 2.5);

    tl.to(logoRef.current, {
      scale: 3.5,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
    }, 2.6);

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, 3.2);

    return () => {
      tl.kill();
      document.body.classList.remove('is-loading');
    };
  }, [onComplete]);

  if (!show) return null;

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div ref={logoRef} className={styles.logo}>
        <span className={styles.logoIcon}>G</span>
        <span className={styles.logoText}>{siteConfig.brand.name}</span>
      </div>

      <div ref={counterRef} className={styles.counter}>
        <div ref={digit1Ref} className={styles.digit}>
          <span>0</span>
          <span>1</span>
        </div>
        <div ref={digit2Ref} className={styles.digit}>
          {[...Array(10)].map((_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        <div ref={digit3Ref} className={styles.digit}>
          {[...Array(10)].map((_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>

      <div className={styles.barWrapper}>
        <div ref={barRef} className={styles.bar} />
      </div>
    </div>
  );
}
