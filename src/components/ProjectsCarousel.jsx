import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/site';
import { prefersAv1, shouldLimitData } from '../utils/media';
import { useLang } from '../i18n';
import styles from './ProjectsCarousel.module.css';

/*
 * "Reel" projects carousel.
 * Desktop: film-strip rail of posters (left) · big framed stage playing the active ad (centre)
 *          · stylised spec card describing the landing (right).
 * Mobile:  stage (9:16) on top, horizontal snap strip of posters, spec card below.
 * Only the active project mounts a <video>; the rest are posters. The ad plays to the end and
 * the reel advances; a progress bar on the rail shows how much of the clip is left.
 */

const N = siteConfig.projects.length;
const AUTO_DELAY = 5000; // poster-only states (data saver, video not started)
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

// "Cardápio, carrinho e pedido pelo WhatsApp" -> ["Cardápio", "Carrinho", "Pedido pelo WhatsApp"]
function deliverables(description = '') {
  return description
    .split(/,\s*|\s+(?:e|and|y)\s+/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

const domain = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

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
      className={`${styles.media} ${styles.videoLayer} ${shown ? styles.videoShown : ''}`}
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
  const railRef = useRef(null);
  const thumbRefs = useRef([]);
  const swipeRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false
  );
  const [reduced, setReduced] = useState(prefersReduced);
  const [inView, setInView] = useState(false);
  const [limitData] = useState(shouldLimitData);
  const [paused, setPaused] = useState(false); // hover / focus
  const [manualPlay, setManualPlay] = useState(false); // data saver: user asked to play
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const { t, site } = useLang();
  const projects = site.projects;
  const active = projects[index];
  const preview = previewFor(active, isMobile);

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

  const goTo = useCallback((j, d) => {
    setIndex((i) => {
      const next = mod(j, N);
      if (next !== i) setDir(d ?? (next > i ? 1 : -1));
      return next;
    });
    setPlaying(false);
    setProgress(0);
  }, []);
  const step = useCallback((d) => setIndex((i) => {
    setDir(d);
    setPlaying(false);
    setProgress(0);
    return mod(i + d, N);
  }), []);

  // keep the active thumb visible in the rail (scroll only the rail, never the page)
  useEffect(() => {
    const rail = railRef.current;
    const el = thumbRefs.current[index];
    if (!rail || !el) return;
    if (isMobile) {
      rail.scrollTo({ left: el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
    } else {
      rail.scrollTo({ top: el.offsetTop - rail.clientHeight / 2 + el.clientHeight / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [index, isMobile, reduced]);

  const autoOn = !reduced && inView && !paused;
  const autoOnRef = useRef(autoOn);
  useEffect(() => {
    autoOnRef.current = autoOn;
  }, [autoOn]);

  // poster-only fallback timer
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

  const playVideo = !!preview && !reduced && inView && (!limitData || manualPlay);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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

  const tags = deliverables(active.description);

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
        <header className={styles.head}>
          <div>
            <span className={styles.eyebrow} data-reveal>
              {t('carousel.eyebrow')}
            </span>
            <h2 className={styles.title} data-reveal>
              {t('carousel.title')}
            </h2>
          </div>
          <div className={styles.controls} data-reveal>
            <span className={styles.counter} aria-hidden="true">
              <b>{active.number}</b> / {String(N).padStart(2, '0')}
            </span>
            <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label={t('carousel.prev')}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label={t('carousel.next')} data-carousel-next>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </header>

        <div className={styles.reel}>
          {/* Film strip */}
          <ol ref={railRef} className={styles.rail} data-reveal data-lenis-prevent aria-label={t('carousel.sectionAria')}>
            {projects.map((project, j) => {
              const p = previewFor(project, false);
              const isActive = j === index;
              return (
                <li key={project.id}>
                  <button
                    type="button"
                    ref={(el) => {
                      thumbRefs.current[j] = el;
                    }}
                    className={`${styles.thumb} ${isActive ? styles.thumbActive : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={t('carousel.cardAria', { name: project.name })}
                    onClick={() => goTo(j)}
                  >
                    <span className={styles.thumbImg}>
                      {p && <img src={p.poster} alt="" loading="lazy" decoding="async" draggable="false" />}
                    </span>
                    <span className={styles.thumbMeta}>
                      <span className={styles.thumbNum}>{project.number}</span>
                      <span className={styles.thumbName}>{project.name}</span>
                    </span>
                    {isActive && (
                      <span className={styles.thumbBar} aria-hidden="true">
                        <i style={{ transform: `scaleX(${playing ? progress : 0})` }} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Stage */}
          <div
            className={styles.stage}
            data-reveal
            style={{ '--reveal-y': '40px' }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
          >
            <div className={styles.frame}>
              <div className={styles.frameBar} aria-hidden="true">
                <span className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.addr}>{domain(active.url)}</span>
                <span className={`${styles.live} ${playing ? styles.liveOn : ''}`}>
                  <i /> {t('carousel.playing')}
                </span>
              </div>
              <div className={styles.screen}>
                <div key={active.id} className={`${styles.slide} ${dir > 0 ? styles.fromRight : styles.fromLeft}`}>
                  {preview ? (
                    <>
                      <img className={styles.media} src={preview.poster} alt="" decoding="async" draggable="false" />
                      {playVideo && (
                        <PreviewVideo
                          key={preview.mp4}
                          preview={preview}
                          allowSoftwareAv1={!isMobile}
                          onPlaying={() => setPlaying(true)}
                          onProgress={setProgress}
                          onEnded={onEnded}
                        />
                      )}
                    </>
                  ) : (
                    <span className={styles.typo}>{active.name}</span>
                  )}
                </div>
                {limitData && !manualPlay && preview && (
                  <button type="button" className={styles.playBtn} onClick={() => setManualPlay(true)} aria-label={active.name}>
                    ▶
                  </button>
                )}
              </div>
            </div>
            <span className={styles.bigNum} aria-hidden="true">
              {active.number}
            </span>
          </div>

          {/* Spec card */}
          <article key={`card-${active.id}`} className={styles.card} data-reveal aria-live="polite">
            <div className={styles.cardTop}>
              <span className={styles.cardKicker}>
                {t('carousel.project')} {active.number}
              </span>
              <span className={styles.chip}>{active.segment}</span>
            </div>
            <h3 className={styles.cardTitle}>{active.name}</h3>
            <p className={styles.cardDesc}>{active.description}</p>

            <div className={styles.perf} aria-hidden="true" />

            <dl className={styles.spec}>
              <div>
                <dt>{t('carousel.segment')}</dt>
                <dd>{active.segment}</dd>
              </div>
              <div>
                <dt>{t('carousel.address')}</dt>
                <dd className={styles.mono}>{domain(active.url)}</dd>
              </div>
            </dl>

            <div className={styles.deliver}>
              <span className={styles.deliverLabel}>{t('carousel.deliverables')}</span>
              <ul>
                {tags.map((tg, k) => (
                  <li key={tg} style={{ '--k': k }}>
                    <span aria-hidden="true">✓</span> {tg}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.ctas}>
              {active.url && (
                <a className={styles.ctaGhost} href={active.url} target="_blank" rel="noopener noreferrer">
                  {t('carousel.live')} <span aria-hidden="true">↗</span>
                </a>
              )}
              <a className={styles.ctaPrimary} href={projectWhatsApp(active)} target="_blank" rel="noopener noreferrer">
                <span className={styles.ctaDot} aria-hidden="true" />
                {t('carousel.wantLike')}
              </a>
            </div>
          </article>
        </div>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {t('carousel.announce', { number: active.number, name: active.name })}
      </p>
    </section>
  );
}
