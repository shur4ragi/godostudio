import { useEffect, useRef, useState } from 'react';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Hero.module.css';

export function Hero() {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const mockupRef = useRef(null);

  const projectsWithScreenshots = siteConfig.projects.filter(p => p.screenshot);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (projectsWithScreenshots.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % projectsWithScreenshots.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [projectsWithScreenshots.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mockupRef.current) {
          if (entry.isIntersecting) {
            mockupRef.current.classList.add(styles.mockupVisible);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (mockupRef.current) {
      observer.observe(mockupRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.gradient} />
        <div className={styles.glow} />
      </div>

      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <h1 className={styles.headline}>
          {siteConfig.brand.headline.map((line, i) => (
            <span key={i} className={styles.headlineLine}>{line}</span>
          ))}
        </h1>

        <p className={styles.subtitle}>{siteConfig.brand.subtitle}</p>

        <div className={styles.ctas}>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            {siteConfig.cta.primary}
          </a>
          <a href="#portfolio" className={styles.ctaSecondary}>
            {siteConfig.cta.secondary}
          </a>
        </div>
      </div>

      <div ref={mockupRef} className={styles.mockup}>
        <div className={styles.mockupGlow} />
        <div className={styles.browserFrame}>
          <div className={styles.browserHeader}>
            <div className={styles.browserDots}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.browserUrl}>
              {projectsWithScreenshots[currentSlide]?.url?.replace('https://', '') || 'exemplo.com'}
            </div>
          </div>
          <div className={styles.browserContent}>
            {projectsWithScreenshots.map((project, index) => (
              <img
                key={project.id}
                src={project.screenshot}
                alt={`Preview ${project.name}`}
                className={`${styles.screenshot} ${index === currentSlide ? styles.active : ''}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
            {projectsWithScreenshots.length === 0 && (
              <div className={styles.placeholderScreen}>
                <span>Carregando projetos...</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.slideIndicators}>
          {projectsWithScreenshots.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ver projeto ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
