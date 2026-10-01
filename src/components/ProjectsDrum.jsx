import { useEffect, useRef, useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const projects = siteConfig.projects;
  const n = projects.length * 2;
  const cardHeight = 360;
  const gap = 32;
  const step = 360 / n;
  const radius = (cardHeight + gap) / (2 * Math.tan((step / 2) * Math.PI / 180));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return;
    }

    const drum = drumRef.current;
    let rotation = 0;
    let targetRotation = 0;
    let velocity = 0;
    let isDraggingLocal = false;
    let lastY = 0;

    const updateRotation = (newRot) => {
      rotation = newRot;
      drum.style.setProperty('--rot', `${rotation}deg`);
      
      const normalizedRot = ((rotation % 360) + 360) % 360;
      const newIndex = Math.round(normalizedRot / step) % projects.length;
      setActiveIndex(newIndex);

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const cardAngle = i * step;
        let delta = normalizedRot - cardAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        
        const absDelta = Math.abs(delta);
        const brightness = 1 - Math.min(absDelta, 90) / 90 * 0.7;
        const inner = card.querySelector(`.${styles.cardInner}`);
        if (inner) {
          inner.style.filter = `brightness(${brightness})`;
        }
      });
    };

    const animate = () => {
      if (!isDraggingLocal) {
        velocity *= 0.92;
        rotation += velocity;
        
        if (Math.abs(velocity) < 0.1) {
          const snappedRot = Math.round(rotation / step) * step;
          rotation += (snappedRot - rotation) * 0.15;
        }
        
        updateRotation(rotation);
      }
      requestAnimationFrame(animate);
    };

    const handleWheel = (e) => {
      if (!sectionRef.current.classList.contains('is-pinned')) return;
      e.preventDefault();
      velocity += e.deltaY * 0.05;
    };

    const handlePointerDown = (e) => {
      isDraggingLocal = true;
      setIsDragging(true);
      lastY = e.clientY;
      velocity = 0;
    };

    const handlePointerMove = (e) => {
      if (!isDraggingLocal) return;
      const deltaY = e.clientY - lastY;
      velocity = deltaY * 0.3;
      rotation -= velocity;
      updateRotation(rotation);
      lastY = e.clientY;
    };

    const handlePointerUp = () => {
      isDraggingLocal = false;
      setIsDragging(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        targetRotation = Math.round(rotation / step) * step - step;
        gsap.to({ val: rotation }, {
          val: targetRotation,
          duration: 0.6,
          ease: 'expo.out',
          onUpdate: function() {
            updateRotation(this.targets()[0].val);
          },
          onComplete: () => {
            rotation = targetRotation;
          }
        });
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        targetRotation = Math.round(rotation / step) * step + step;
        gsap.to({ val: rotation }, {
          val: targetRotation,
          duration: 0.6,
          ease: 'expo.out',
          onUpdate: function() {
            updateRotation(this.targets()[0].val);
          },
          onComplete: () => {
            rotation = targetRotation;
          }
        });
      }
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${(n - 1) * 150}px`,
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        if (!isDraggingLocal) {
          const newRot = self.progress * (n - 1) * step;
          updateRotation(newRot);
        }
      },
      onEnter: () => {
        sectionRef.current.classList.add('is-pinned');
      },
      onLeave: () => {
        sectionRef.current.classList.remove('is-pinned');
      },
      onEnterBack: () => {
        sectionRef.current.classList.add('is-pinned');
      },
      onLeaveBack: () => {
        sectionRef.current.classList.remove('is-pinned');
      },
    });

    const stage = stageRef.current;
    stage.addEventListener('wheel', handleWheel, { passive: false });
    stage.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    stage.addEventListener('keydown', handleKeyDown);

    const rafId = requestAnimationFrame(animate);

    return () => {
      st.kill();
      cancelAnimationFrame(rafId);
      stage.removeEventListener('wheel', handleWheel);
      stage.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      stage.removeEventListener('keydown', handleKeyDown);
    };
  }, [n, step, radius, projects.length]);

  const allCards = [...projects, ...projects].map((project, i) => {
    const isTypoCard = i % 3 === 2;
    
    return {
      ...project,
      id: `${project.id}-${i}`,
      originalIndex: i % projects.length,
      isTypoCard,
    };
  });

  return (
    <section 
      id="projetos" 
      ref={sectionRef} 
      className={styles.section}
      aria-roledescription="carousel"
      aria-label="Projetos"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Projetos</span>
        <h2 className={styles.title}>Trabalhos<br/>recentes</h2>
      </div>

      <div 
        ref={stageRef}
        className={`${styles.stage} ${isDragging ? styles.dragging : ''}`}
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
            '--gap': `${gap}px`,
            '--r': `${radius}px`,
            '--rot': '0deg',
          }}
        >
          {allCards.map((card, i) => (
            <article
              key={card.id}
              id={`card-${i}`}
              ref={el => cardsRef.current[i] = el}
              className={styles.card}
              style={{ '--i': i }}
              role="option"
              aria-selected={i === activeIndex}
            >
              <div className={styles.cardInner}>
                {card.isTypoCard ? (
                  <div className={styles.typoCard}>
                    <span className={styles.typoNumber}>{card.number}</span>
                    <span className={styles.typoName}>{card.name}</span>
                    <span className={styles.typoSegment}>{card.segment}</span>
                  </div>
                ) : (
                  <a 
                    href={card.url || '#'} 
                    target={card.url ? '_blank' : undefined}
                    rel={card.url ? 'noopener noreferrer' : undefined}
                    className={styles.imageCard}
                    onClick={e => !card.url && e.preventDefault()}
                  >
                    <img 
                      src={card.screenshot} 
                      alt={card.name}
                      loading="lazy"
                      className={styles.cardImage}
                    />
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardLabel}>{card.name}</span>
                      <span className={styles.cardArrow}>↗</span>
                    </div>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.dragHint}>
          <span>Arraste ↕</span>
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
    </section>
  );
}
