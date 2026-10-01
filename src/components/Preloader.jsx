import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { siteConfig } from '../data/site';
import styles from './Preloader.module.css';

export function Preloader({ onComplete }) {
  const [show, setShow] = useState(true);
  const containerRef = useRef(null);
  // Keep the latest callback without re-running the timeline when the parent re-renders.
  const onCompleteRef = useRef(onComplete);
  const innerRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const digit1Ref = useRef(null);
  const digit2Ref = useRef(null);
  const digit3Ref = useRef(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const onComplete = () => onCompleteRef.current?.();
    const hasVisited = sessionStorage.getItem('godostudio-visited');
    
    if (hasVisited) {
      setShow(false);
      onComplete();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      sessionStorage.setItem('godostudio-visited', 'true');
      setShow(false);
      onComplete();
      return;
    }

    document.body.classList.add('is-loading');

    // Polygon with an even-odd hole: the "window" in the middle grows from a
    // point to beyond the viewport, so we zoom *through* the preloader into
    // the hero that is already rendering underneath.
    const hole = { s: 0 };
    const setHole = () => {
      const a = 50 - hole.s * 56;
      const b = 50 + hole.s * 56;
      containerRef.current.style.clipPath = `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${a}% ${a}%, ${b}% ${a}%, ${b}% ${b}%, ${a}% ${b}%, ${a}% ${a}%)`;
    };

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      sessionStorage.setItem('godostudio-visited', 'true');
      document.body.classList.remove('is-loading');
      onComplete();
    };

    const tl = gsap.timeline({
      onComplete: () => {
        reveal();
        setShow(false);
      },
    });

    const digits = [digit1Ref.current, digit2Ref.current, digit3Ref.current];
    digits.forEach((digit) => {
      gsap.set(digit.querySelectorAll('span'), { yPercent: 0 });
    });

    tl.to(digit3Ref.current.querySelectorAll('span'), { yPercent: -1000, duration: 1.0, ease: 'power2.inOut' }, 0);
    tl.to(digit2Ref.current.querySelectorAll('span'), { yPercent: -1000, duration: 1.1, ease: 'power2.inOut' }, 0);
    tl.to(digit1Ref.current.querySelectorAll('span'), { yPercent: -100, duration: 1.2, ease: 'power2.inOut' }, 0);
    tl.to(barRef.current, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0);

    // Exit: zoom through into the hero (~1.1s)
    tl.add(reveal, 1.3);
    tl.to(counterRef.current, { yPercent: -120, opacity: 0, duration: 0.5, ease: 'power3.in' }, 1.25);
    tl.to(barRef.current, { yPercent: 100, opacity: 0, duration: 0.4, ease: 'power3.in' }, 1.25);
    tl.to(logoRef.current, { scale: 2.2, opacity: 0, duration: 0.7, ease: 'power3.in' }, 1.3);
    tl.to(innerRef.current, { scale: 1.35, duration: 1.1, ease: 'expo.inOut' }, 1.3);
    tl.to(hole, { s: 1, duration: 1.1, ease: 'expo.inOut', onUpdate: setHole }, 1.3);

    return () => {
      tl.kill();
      document.body.classList.remove('is-loading');
    };
  }, []);

  if (!show) return null;

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div ref={innerRef} className={styles.inner}>
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
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i % 10}</span>
            ))}
          </div>
          <div ref={digit3Ref} className={styles.digit}>
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i % 10}</span>
            ))}
          </div>
        </div>

        <div className={styles.barWrapper}>
          <div ref={barRef} className={styles.bar} />
        </div>
      </div>
    </div>
  );
}
