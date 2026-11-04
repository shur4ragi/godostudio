import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/site';
import { prefersAv1, shouldLimitData } from '../utils/media';
import { useLang } from '../i18n';
import styles from './ProjectsCarousel.module.css';

/*
 * Projects carousel: list (left) + flat card stack (right).
 * The active card sits in front and plays its ad; the next two peek behind it.
 * Mobile: stack on top (9:16 cards), compact list below.
 * Only the active project mounts a <video>; the rest are posters. The ad plays to the end and
 * the reel advances; a progress bar on the rail shows how much of the clip is left.
 */

const N = siteConfig.projects.length;
const AUTO_DELAY = 4000; // poster-only states (data saver, video not started)
const MOBILE_QUERY = '(max-width: 768px)';

const mod = (a, b) => ((a % b) + b) % b;

function previewFor(project, isMobile) {
  if (!project.preview) return null;
  if (isMobile) return project.preview.mobile || project.preview.desktop;
  return project.preview.desktop;
}

function projectWhatsApp(project) {
  const { number } = siteConfig.contact.whatsapp;
  const msg = `Olá, Vitor! Vi o projeto ${project.name} no site da GodoStudio e quero um site assim para o meu negócio.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

function PreviewVideo({ preview, allowSoftwareAv1, onPlaying, onProgress, onEnded }) {
  const ref = useRef(null);
  const [src, setSrc] = useState(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let alive = true;
    prefersAv1(allowSoftwareAv1).then((av1) => {
      if (alive) setSrc(av1 ? preview.webm : preview.mp4);
    });
    return () => {
      alive = false;
    };
  }, [preview, allowSoftwareAv1]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return undefined;
    const sync = () => {
      if (document.hidden) video.pause();
      else {
        const pr = video.play();
        if (pr && pr.catch) pr.catch(() => {});
      }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      video.pause();
      video.removeAttribute('src');
      video.load(); // release the decoder
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={`${styles.video} ${styles.videoLayer} ${shown ? styles.videoShown : ''}`}
      src={src || undefined}
      muted
      playsInline
      preload="none"
      onPlaying={() => {
        setShown(true);
        onPlaying?.();
      }}
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (v.duration) onProgress?.(v.currentTime / v.duration);
      }}
      onEnded={(e) => {
        if (onEnded?.()) return;
        const v = e.currentTarget;
        v.currentTime = 0;
        const pr = v.play();
        if (pr && pr.catch) pr.catch(() => {});
      }}
      aria-hidden="true"
    />
  );
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ProjectsCarousel() {
  const sectionRef = useRef(null);
  const swipeRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false
  );
  const [reduced, setReduced] = useState(prefersReduced);
  const [inView, setInView] = useState(false);
  const [limitData] = useState(shouldLimitData);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  const { t, site } = useLang();
  const projects = site.projects;
  const active = projects[index];

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const rq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setIsMobile(mq.matches);
    const onRq = () => setReduced(rq.matches);
    mq.addEventListener('change', onMq);
    rq.addEventListener('change', onRq);
    return () => {
      mq.removeEventListener('change', onMq);
      rq.removeEventListener('change', onRq);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((j) => {
    setIndex(mod(j, N));
    setPlaying(false);
  }, []);
  const step = useCallback((d) => {
    setIndex((i) => mod(i + d, N));
    setPlaying(false);
  }, []);

  const autoOn = !reduced && inView && !paused;
  const autoOnRef = useRef(autoOn);
  useEffect(() => {
    autoOnRef.current = autoOn;
  }, [autoOn]);
  useEffect(() => {
    if (!autoOn || playing) return undefined;
    const tm = setTimeout(() => step(1), AUTO_DELAY);
    return () => clearTimeout(tm);
  }, [index, autoOn, playing, step]);
  const onEnded = useCallback(() => {
    if (!autoOnRef.current) return false;
    step(1);
    return true;
  }, [step]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };
  const onPointerDown = (e) => {
    swipeRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  };

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className={`${styles.section} section-muted`}
      aria-roledescription={t('carousel.roledesc')}
      aria-label={t('carousel.sectionAria')}
      onKeyDown={onKeyDown}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!sectionRef.current?.contains(e.relatedTarget)) setPaused(false);
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
    >
      <div className={styles.inner}>
        <div className={styles.side}>
          <span className={styles.eyebrow} data-reveal>
            {t('carousel.eyebrow')}
          </span>
          <h2 className={styles.title} data-reveal>
            {t('carousel.title')}
          </h2>
          <ol className={styles.list}>
            {projects.map((project, j) => {
              const on = j === index;
              return (
                <li key={project.id} data-reveal>
                  <button
                    type="button"
                    className={`${styles.item} ${on ? styles.itemActive : ''}`}
                    aria-current={on ? 'true' : undefined}
                    aria-expanded={on}
                    onClick={() => goTo(j)}
                  >
                    <span className={styles.itemNum}>{project.number}</span>
                    <span className={styles.itemName}>{project.name}</span>
                    <span className={styles.itemSeg}>{project.segment}</span>
                  </button>
                  <div className={`${styles.more} ${on ? styles.moreOn : ''}`} inert={!on}>
                    <div>
                      <p className={styles.itemDesc}>{project.description}</p>
                      <div className={styles.ctas}>
                        {project.url && (
                          <a className={styles.ctaGhost} href={project.url} target="_blank" rel="noopener noreferrer">
                            {t('carousel.live')} <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        <a className={styles.ctaPrimary} href={projectWhatsApp(project)} target="_blank" rel="noopener noreferrer">
                          <span className={styles.ctaDot} aria-hidden="true" />
                          {t('carousel.wantLike')}
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={styles.stageWrap} data-reveal style={{ '--reveal-y': '40px' }}>
          <div
            className={styles.stack}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
          >
            {projects.map((project, j) => {
              let p = mod(j - index, N); // 0 = front, 1..2 behind, last = just left
              if (p === N - 1) p = -1;
              const visible = p >= -1 && p <= 2;
              const preview = previewFor(project, isMobile);
              const front = p === 0;
              return (
                <button
                  key={project.id}
                  type="button"
                  className={styles.card}
                  data-pos={visible ? p : 'hidden'}
                  tabIndex={front ? 0 : -1}
                  aria-hidden={!front}
                  aria-label={t('carousel.cardAria', { name: project.name })}
                  onClick={() => (front ? window.open(project.url, '_blank', 'noopener') : goTo(j))}
                >
                  <span className={styles.media}>
                    {preview && (
                      <img className={styles.video} src={preview.poster} alt="" loading="lazy" decoding="async" draggable="false" />
                    )}
                    {front && preview && !reduced && inView && !limitData && (
                      <PreviewVideo
                        key={preview.mp4}
                        preview={preview}
                        allowSoftwareAv1={!isMobile}
                        onPlaying={() => setPlaying(true)}
                        onEnded={onEnded}
                      />
                    )}
                  </span>
                  <span className={styles.label} aria-hidden="true">
                    <span className={styles.labelNum}>{project.number}</span>
                    <span className={styles.labelName}>{project.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.controls}>
            <span className={styles.counter} aria-hidden="true">
              {active.number} <span>/ {String(N).padStart(2, '0')}</span>
            </span>
            <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label={t('carousel.prev')}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label={t('carousel.next')} data-carousel-next>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {t('carousel.announce', { number: active.number, name: active.name })}
      </p>
    </section>
  );
}
