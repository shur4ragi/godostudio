import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import styles from './ProjectsDrum.module.css';

gsap.registerPlugin(ScrollTrigger);

export function ProjectsDrum() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const drumRef = useRef(null);
  const cardsRef = useRef([]);
  const videosRef = useRef([]);
  const rotationRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const projects = siteConfig.projects;
  const n = projects.length;
  const cardHeight = 320;
  const gap = 40;
  const step = 360 / n;
  const radius = (cardHeight + gap) / (2 * Math.tan((step / 2) * Math.PI / 180));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateActiveVideo = useCallback((newIndex) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    videosRef.current.forEach((video, i) => {
      if (!video) return;
      
      if (i === newIndex && !prefersReducedMotion) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, []);

  const updateRotation = useCallback((newRot) => {
    rotationRef.current = newRot;
    
    if (drumRef.current) {
      drumRef.current.style.transform = `translateZ(${-radius}px) rotateX(${newRot}deg)`;
    }
    
    const normalizedRot = ((newRot % 360) + 360) % 360;
    const newIndex = Math.round(normalizedRot / step) % n;
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      updateActiveVideo(newIndex);
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardAngle = i * step;
      let delta = normalizedRot - cardAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      
      const absDelta = Math.abs(delta);
      const opacity = 1 - Math.min(absDelta, 90) / 90 * 0.6;
      card.style.opacity = opacity;
    });
  }, [step, n, radius, activeIndex, updateActiveVideo]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const scrollDistance = n * 200;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => {
        const newRot = self.progress * (n - 1) * step;
        updateRotation(newRot);
      },
    });

    updateActiveVideo(0);

    return () => {
      st.kill();
    };
  }, [n, step, updateRotation, updateActiveVideo]);

  const getPreviewSrc = (project) => {
    if (!project.preview) return null;
    
    if (isMobile) {
      return project.preview.mobile || project.preview.desktop;
    }
    return project.preview.desktop;
  };

  return (
    <section 
      id="projetos" 
      ref={sectionRef} 
      className={`${styles.section} section-muted`}
      aria-roledescription="carousel"
      aria-label="Projetos"
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Projetos</span>
          <h2 className={styles.title}>Trabalhos recentes</h2>
        </div>

        <div 
          ref={stageRef}
          className={styles.stage}
          tabIndex={0}
          role="listbox"
          aria-activedescendant={`card-${activeIndex}`}
        >
          <div 
            ref={drumRef}
            className={styles.drum}
            style={{
              '--n': n,
              '--h': `${cardHeight}px`,
              '--r': `${radius}px`,
            }}
          >
            {projects.map((project, i) => {
              const previewSrc = getPreviewSrc(project);
              const isActive = i === activeIndex;
              const noMobilePreview = isMobile && !project.preview?.mobile;
              
              return (
                <article
                  key={project.id}
                  id={`card-${i}`}
                  ref={el => cardsRef.current[i] = el}
                  className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                  style={{ 
                    '--i': i,
                    '--step': `${step}deg`,
                    '--r': `${radius}px`,
                  }}
                  role="option"
                  aria-selected={isActive}
                >
                  <a 
                    href={project.url || '#'} 
                    target={project.url ? '_blank' : undefined}
                    rel={project.url ? 'noopener noreferrer' : undefined}
                    className={styles.cardLink}
                    onClick={e => !project.url && e.preventDefault()}
                  >
                    {previewSrc ? (
                      <video
                        ref={el => videosRef.current[i] = el}
                        className={`${styles.video} ${noMobilePreview ? styles.videoFit : ''}`}
                        muted
                        playsInline
                        loop
                        preload="none"
                        poster={previewSrc.poster}
                      >
                        <source src={previewSrc.webm} type="video/webm" />
                        <source src={previewSrc.mp4} type="video/mp4" />
                      </video>
                    ) : (
                      <div className={styles.placeholder}>
                        <span>{project.name}</span>
                      </div>
                    )}
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardNumber}>{project.number}</span>
                      <div className={styles.cardInfo}>
                        <span className={styles.cardName}>{project.name}</span>
                        <span className={styles.cardSegment}>{project.segment}</span>
                      </div>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoCurrent}>
            <span className={styles.infoNumber}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className={styles.infoDivider}>/</span>
            <span className={styles.infoTotal}>
              {String(projects.length).padStart(2, '0')}
            </span>
          </div>
          <p className={styles.infoDesc}>
            {projects[activeIndex]?.description}
          </p>
        </div>
      </div>
    </section>
  );
}
