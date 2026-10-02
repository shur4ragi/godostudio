import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/site';
import { prefersAv1, shouldLimitData } from '../utils/media';
import { useLang } from '../i18n';
import styles from './ProjectsCarousel.module.css';

/*
 * Diagonal 2-step projects carousel.
 * Step 1: list (left) + diagonal 3D deck (right). Cards enter from the top-right,
 *         sit in the centre (active, video plays) and exit down-left into a stack.
 * Step 2: the active card un-tilts and expands (shared element), the left column
 *         turns into the project detail. Close / Esc reverses.
 * Mobile (<= 768px) uses a flat row instead of the diagonal deck (see rowState).
 * Motion is CSS transforms only (compositor-friendly); no per-frame layout reads.
 */

const projects = siteConfig.projects;
const N = projects.length;
const COPIES = Math.max(2, Math.ceil(8 / N));
const SLOTS = N * COPIES; // 8 cards for 4 projects
const MAX_P = 2; // incoming positions (top-right)
const STEP_GAP = 220; // ms between queued steps (multi-step jumps)
const AUTO_DELAY = 3500;
const MOBILE_QUERY = '(max-width: 768px)';
const TINTS = ['#d9cfc4', '#c9d3cf', '#e2c9bd', '#cdd0d8'];

const mod = (a, b) => ((a % b) + b) % b;
const relPos = (i, c) => {
  let p = mod(i - c, SLOTS);
  if (p > MAX_P) p -= SLOTS;
  return p;
};

// Geometry per breakpoint. x in card widths, y in card heights (of the *scaled* card).
const GEO = {
  desktop: { k: 0.6, inX: [0.66, 1.5], inY: [-0.95, -2.1], stackX: 0.52, stackY: 0.68, stepX: 0.15, stepY: 0.22, depth: 3 },
};
const TILT = 'rotateX(35deg) rotateZ(20deg)';
const FLAT = 'rotateX(0deg) rotateZ(0deg)';

// Mobile: the diagonal deck cannot fit tall portrait cards without them crossing, so the
// cards line up in a flat row instead: the active one in front, one neighbour peeking on
// each side (smaller, turned slightly toward the centre, always behind), the rest parked
// off-stage and invisible. Neighbours are spaced wider than the cards, and every card is its
// own flat plane (no preserve-3d), so no two cards ever overlap or cut through each other,
// even mid-transition (they move in lock-step along the same line).
const ROW = { side: 0.8, hidden: 0.62, gap: 0.12, park: 0.45, turn: 16, lift: -4 };
const rowX = (n) => {
  // centre-to-centre distance (in active-card widths) for |p| = n. Parked cards (|p| >= 2)
  // each get their own off-stage slot, so cards never converge on one spot during fast steps.
  const d1 = 0.5 + ROW.side / 2 + ROW.gap;
  if (n === 1) return d1;
  return d1 + ROW.side / 2 + ROW.hidden / 2 + ROW.park + (n - 2) * (ROW.hidden + ROW.park);
};

function rowState(p, expanded) {
  const a = Math.abs(p);
  const dir = Math.sign(p);
  if (p === 0) {
    const s = expanded ? 1.12 : 1;
    return { transform: `translate3d(-50%, ${expanded ? -50 : -50 + ROW.lift}%, 0) scale(${s})`, opacity: 1 };
  }
  const n = a;
  const s = n === 1 ? ROW.side : ROW.hidden;
  const x = dir * rowX(n) * (expanded ? 1.6 : 1);
  return {
    transform: `translate3d(${(-50 + x * 100).toFixed(2)}%, ${-50 + ROW.lift}%, 0) scale(${s}) rotateY(${-dir * ROW.turn}deg)`,
    opacity: n === 1 && !expanded ? 1 : 0,
  };
}

function cardTransform(p, geo, expanded) {
  if (p === 0 && expanded) return `translate3d(-50%, -50%, 0) scale3d(1, 1, 1) ${FLAT}`;
  let x = 0;
  let y = 0;
  let s = 1;
  if (p > 0) {
    x = geo.inX[p - 1];
    y = geo.inY[p - 1];
    s = p === 1 ? 0.8 : 0.66;
  } else if (p < 0) {
    // Cards deeper than `depth` hide exactly behind the last visible one,
    // so the wrap-around teleport (deepest -> top-right) is never seen.
    const n = Math.min(-p - 1, geo.depth);
    x = -(geo.stackX + geo.stepX * n);
    y = geo.stackY + geo.stepY * n;
  }
  if (expanded) {
    // Everything else slides further out along the diagonal.
    x *= 3.2;
    y *= 3.2;
  }
  const k = geo.k;
  return `translate3d(${(-50 + x * k * 100).toFixed(2)}%, ${(-50 + y * k * 100).toFixed(2)}%, 0) scale3d(${(s * k).toFixed(3)}, ${(s * k).toFixed(3)}, ${(s * k).toFixed(3)}) ${TILT}`;
}

function zFor(p, expanded, row) {
  if (row) return p === 0 ? (expanded ? 40 : 30) : 20 - Math.min(Math.abs(p), 5);
  if (p === 0) return expanded ? 40 : 10;
  if (p > 0) return 10 - p;
  return 30 + p; // newest stack card (p=-1) highest
}

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

// Only the centre card ever has a <video>; every card shows its poster <img> underneath.
// Mounting a single decoder at a time keeps memory and decode work flat while stepping.
function PreviewVideo({ preview, allowSoftwareAv1 }) {
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
      loop
      preload="none"
      onPlaying={() => setShown(true)}
      aria-hidden="true"
    />
  );
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ProjectsCarousel() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const deckRef = useRef(null);
  const closeRef = useRef(null);
  const cardsRef = useRef([]);
  const prevPosRef = useRef([]);
  const cursorRef = useRef(0);
  const queueRef = useRef(null);
  const openTimerRef = useRef(null);
  const swipeRef = useRef(null);
  const suppressClickRef = useRef(false);
  const restoreFocusRef = useRef(false);

  const [cursor, setCursor] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sheet, setSheet] = useState(false); // mobile full-screen sheet mounted
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false
  );
  const [reduced, setReduced] = useState(prefersReduced);
  const [inView, setInView] = useState(false);
  const [limitData] = useState(shouldLimitData);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const { t, site } = useLang();
  const projects = site.projects; // localized segment/description
  const activeIndex = mod(cursor, N);
  const active = projects[activeIndex];

  // ---- media queries ----
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const rq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) {
        // Leaving mobile while the sheet is open: drop the sheet.
        document.documentElement.style.overflow = '';
        setSheet(false);
      }
    };
    const onRq = () => setReduced(rq.matches);
    mq.addEventListener('change', onMq);
    rq.addEventListener('change', onRq);
    return () => {
      mq.removeEventListener('change', onMq);
      rq.removeEventListener('change', onRq);
    };
  }, []);

  // ---- in-view ----
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // ---- layout cards (transforms only) ----
  useLayoutEffect(() => {
    cursorRef.current = cursor;
    const geo = GEO.desktop;
    const teleported = [];
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const p = relPos(i, cursor);
      const prev = prevPosRef.current[i];
      const wrap = prev === undefined || Math.abs(p - prev) > 1;
      if (wrap) {
        card.style.transition = 'none';
        teleported.push(card);
      }
      if (isMobile) {
        const st = rowState(p, expanded);
        card.style.transform = st.transform;
        card.style.opacity = String(st.opacity);
      } else {
        card.style.transform = cardTransform(p, geo, expanded);
        card.style.opacity = '';
      }
      card.style.zIndex = String(zFor(p, expanded, isMobile));
      prevPosRef.current[i] = p;
    });
    if (!teleported.length) return undefined;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        teleported.forEach((card) => {
          card.style.transition = '';
        });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      teleported.forEach((card) => {
        card.style.transition = '';
      });
    };
  }, [cursor, expanded, isMobile]);

  // ---- navigation ----
  const go = useCallback((delta) => {
    clearTimeout(queueRef.current);
    if (!delta) return;
    const dir = Math.sign(delta);
    let remaining = Math.abs(delta);
    const tick = () => {
      setCursor((c) => c + dir);
      remaining -= 1;
      if (remaining > 0) queueRef.current = setTimeout(tick, STEP_GAP);
    };
    tick();
  }, []);

  const selectProject = useCallback(
    (j) => {
      let delta = mod(j - mod(cursorRef.current, N), N);
      if (delta > N / 2) delta -= N;
      go(delta);
    },
    [go]
  );

  // ---- auto-advance ----
  useEffect(() => {
    if (reduced || expanded || !inView || hovered || focusWithin) return undefined;
    const t = setTimeout(() => setCursor((c) => c + 1), AUTO_DELAY);
    return () => clearTimeout(t);
  }, [cursor, reduced, expanded, inView, hovered, focusWithin]);

  // ---- expand / close ----
  const open = useCallback(() => {
    clearTimeout(queueRef.current);
    if (window.matchMedia(MOBILE_QUERY).matches) setSheet(true);
    setExpanded(true);
  }, []);

  const close = useCallback(() => {
    restoreFocusRef.current = true;
    setExpanded(false);
  }, []);

  // Mobile sheet FLIP: stage goes fixed; clip + deck offset animate from the in-flow rect.
  useLayoutEffect(() => {
    if (!sheet) return undefined;
    const stage = stageRef.current;
    const deck = deckRef.current;
    const wrap = wrapRef.current;
    if (!stage || !deck || !wrap) return undefined;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = wrap.getBoundingClientRect();
    const d = deck.getBoundingClientRect();
    const dx = w.left + w.width / 2 - (d.left + d.width / 2);
    const dy = w.top + w.height / 2 - (d.top + d.height / 2);
    const fromClip = `inset(${w.top}px ${vw - w.right}px ${vh - w.bottom}px ${w.left}px round 0px)`;
    const toClip = 'inset(0px 0px 0px 0px round 0px)';
    const opts = { duration: reduced ? 1 : 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' };

    if (expanded) {
      document.documentElement.style.overflow = 'hidden';
      const a1 = stage.animate([{ clipPath: fromClip }, { clipPath: toClip }], opts);
      const a2 = deck.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0px, 0px)' }],
        opts
      );
      return () => {
        a1.cancel();
        a2.cancel();
        stage.style.clipPath = '';
      };
    }
    // closing
    const a1 = stage.animate([{ clipPath: toClip }, { clipPath: fromClip }], opts);
    const a2 = deck.animate(
      [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${dx}px, ${dy}px)` }],
      opts
    );
    let done = false;
    a1.onfinish = () => {
      done = true;
      document.documentElement.style.overflow = '';
      setSheet(false);
    };
    return () => {
      if (!done) document.documentElement.style.overflow = '';
      a1.cancel();
      a2.cancel();
    };
  }, [sheet, expanded, reduced]);

  // Focus management + Esc
  useEffect(() => {
    if (expanded) {
      const id = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
      const onKey = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => {
        cancelAnimationFrame(id);
        document.removeEventListener('keydown', onKey);
      };
    }
    if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      cardsRef.current[mod(cursorRef.current, SLOTS)]?.focus({ preventScroll: true });
    }
    return undefined;
  }, [expanded, close]);

  useEffect(
    () => () => {
      clearTimeout(queueRef.current);
      clearTimeout(openTimerRef.current);
      document.documentElement.style.overflow = '';
    },
    []
  );

  const onCardClick = (i) => {
    if (suppressClickRef.current) return;
    const p = relPos(i, cursorRef.current);
    if (expanded) return;
    if (p === 0) {
      open();
      return;
    }
    go(p);
    clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(open, (Math.abs(p) - 1) * STEP_GAP + 520);
  };

  // ---- keyboard / swipe ----
  const onKeyDown = (e) => {
    if (expanded) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const onPointerDown = (e) => {
    if (expanded) return;
    swipeRef.current = { x: e.clientX, y: e.clientY };
    suppressClickRef.current = false;
  };
  const onPointerUp = (e) => {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s || expanded) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClickRef.current = true;
      go(dx < 0 ? 1 : -1);
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 50);
    }
  };

  const onFocus = () => setFocusWithin(true);
  const onBlur = (e) => {
    if (!sectionRef.current?.contains(e.relatedTarget)) setFocusWithin(false);
  };

  const cards = Array.from({ length: SLOTS }, (_, i) => i);
  const centreSlot = mod(cursor, SLOTS);

  const detail = (
    <>
      <span className={styles.detailEyebrow}>
        {active.number} — {active.segment}
      </span>
      <h3 className={styles.detailTitle}>{active.name}</h3>
      <dl className={styles.detailList}>
        <div>
          <dt>{t('carousel.segment')}</dt>
          <dd>{active.segment}</dd>
        </div>
        <div>
          <dt>{t('carousel.whatDone')}</dt>
          <dd>{active.description}</dd>
        </div>
      </dl>
      <div className={styles.detailCtas}>
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
    </>
  );

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className={`${styles.section} section-muted ${expanded ? styles.isExpanded : ''}`}
      aria-roledescription={t('carousel.roledesc')}
      aria-label={t('carousel.sectionAria')}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      <div className={styles.inner}>
        <div className={styles.side}>
          <div className={styles.panel} inert={expanded} aria-hidden={expanded}>
            <span className={styles.eyebrow} data-reveal>
              {t('carousel.eyebrow')}
            </span>
            <h2 className={styles.title} data-reveal>
              {t('carousel.title')}
            </h2>
            <ol className={styles.list}>
              {projects.map((project, j) => (
                <li key={project.id} data-reveal>
                  <button
                    type="button"
                    className={`${styles.item} ${j === activeIndex ? styles.itemActive : ''}`}
                    aria-current={j === activeIndex ? 'true' : undefined}
                    onClick={() => selectProject(j)}
                  >
                    <span className={styles.itemNum}>{project.number}</span>
                    <span className={styles.itemText}>
                      <span className={styles.itemName}>{project.name}</span>
                      <span className={styles.itemDesc}>{project.description}</span>
                    </span>
                    <span className={styles.itemSeg}>{project.segment}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div
            className={`${styles.panel} ${styles.detail}`}
            inert={!expanded}
            aria-hidden={!expanded}
            role="region"
            aria-label={t('carousel.detailsAria', { name: active.name })}
          >
            <button type="button" className={styles.back} onClick={close}>
              <span aria-hidden="true">←</span> {t('carousel.back')}
            </button>
            {detail}
          </div>
        </div>

        <div ref={wrapRef} className={styles.stageWrap}>
          <div
            ref={stageRef}
            className={`${styles.stage} ${sheet ? styles.sheet : ''}`}
            role={sheet ? 'dialog' : undefined}
            aria-modal={sheet ? 'true' : undefined}
            aria-label={sheet ? t('carousel.sheetAria', { name: active.name }) : undefined}
            data-lenis-prevent={sheet ? '' : undefined}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
          >
            {/* Entrance lives on the deck, never on an ancestor of the fixed mobile sheet. */}
            <div ref={deckRef} className={styles.deck} data-reveal style={{ '--reveal-y': '40px' }}>
              {cards.map((i) => {
                const project = projects[i % N];
                const preview = previewFor(project, isMobile);
                const isCentre = i === centreSlot;
                // Data saver / 2G: posters only until the project is opened (tap).
                const playVideo = isCentre && !reduced && (expanded || (inView && !limitData));
                return (
                  <button
                    key={i}
                    type="button"
                    ref={(el) => {
                      cardsRef.current[i] = el;
                    }}
                    className={`${styles.card} ${isCentre ? styles.cardActive : ''}`}
                    style={{ '--tint': TINTS[i % TINTS.length] }}
                    tabIndex={isCentre && !expanded ? 0 : -1}
                    aria-hidden={!isCentre}
                    aria-label={t('carousel.cardAria', { name: project.name })}
                    onClick={() => onCardClick(i)}
                  >
                    <span className={styles.media}>
                      {preview ? (
                        <>
                          <img
                            className={styles.video}
                            src={preview.poster}
                            alt=""
                            width={isMobile ? 432 : 768}
                            height={isMobile ? 936 : 432}
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                          />
                          {playVideo && <PreviewVideo key={preview.mp4} preview={preview} allowSoftwareAv1={!isMobile} />}
                        </>
                      ) : (
                        <span className={styles.typo}>{project.name}</span>
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

            <div className={styles.controls} inert={expanded}>
              <span className={styles.counter} aria-hidden="true">
                {active.number} <span>/ {String(N).padStart(2, '0')}</span>
              </span>
              <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label={t('carousel.prev')}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label={t('carousel.next')} data-carousel-next>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={close}
              aria-label={t('carousel.close')}
              tabIndex={expanded ? 0 : -1}
              aria-hidden={!expanded}
            >
              <span aria-hidden="true">×</span>
            </button>

            {sheet && (
              <div className={styles.sheetDetail} inert={!expanded}>
                {detail}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {t('carousel.announce', { number: active.number, name: active.name })}
      </p>
    </section>
  );
}
