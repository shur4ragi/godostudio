import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/site';
import styles from './ProjectsCarousel.module.css';

/*
 * Diagonal 2-step projects carousel.
 * Step 1: list (left) + diagonal 3D deck (right). Cards enter from the top-right,
 *         sit in the centre (active, video plays) and exit down-left into a stack.
 * Step 2: the active card un-tilts and expands (shared element), the left column
 *         turns into the project detail. Close / Esc reverses.
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
// Offsets apertados (v5): o próximo card encosta/sobrepõe um pouco o atual, lendo como uma pilha só.
const GEO = {
  desktop: { k: 0.6, inX: [0.42, 0.86], inY: [-0.6, -1.22], stackX: 0.36, stackY: 0.48, stepX: 0.11, stepY: 0.16, depth: 3 },
  mobile: { k: 0.6, inX: [0.5, 1.02], inY: [-0.34, -0.72], stackX: 0.44, stackY: 0.4, stepX: 0.11, stepY: 0.06, depth: 3 },
};
const TILT = 'rotateX(35deg) rotateZ(20deg)';
const FLAT = 'rotateX(0deg) rotateZ(0deg)';

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

function zFor(p, expanded) {
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

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ProjectsCarousel() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const deckRef = useRef(null);
  const closeRef = useRef(null);
  const cardsRef = useRef([]);
  const videosRef = useRef([]);
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
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

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
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // ---- layout cards (transforms only) ----
  useLayoutEffect(() => {
    cursorRef.current = cursor;
    const geo = isMobile ? GEO.mobile : GEO.desktop;
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
      card.style.transform = cardTransform(p, geo, expanded);
      card.style.zIndex = String(zFor(p, expanded));
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

  // ---- video: only the centre card plays ----
  useEffect(() => {
    const centre = mod(cursor, SLOTS);
    videosRef.current.forEach((video, i) => {
      if (!video) return;
      const shouldPlay = i === centre && !reduced && (inView || expanded);
      if (shouldPlay) {
        if (!video.dataset.loaded) {
          const src = video.canPlayType('video/webm') ? video.dataset.webm : video.dataset.mp4;
          if (src) {
            video.src = src;
            video.dataset.loaded = '1';
          }
        }
        const pr = video.play();
        if (pr && pr.catch) pr.catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, [cursor, reduced, inView, expanded, isMobile]);

  // Reset loaded sources when the breakpoint swaps video files.
  useEffect(() => {
    videosRef.current.forEach((video) => {
      if (video && video.dataset.loaded) {
        delete video.dataset.loaded;
        video.removeAttribute('src');
        video.load();
      }
    });
  }, [isMobile]);

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
          <dt>Segmento</dt>
          <dd>{active.segment}</dd>
        </div>
        <div>
          <dt>O que foi feito</dt>
          <dd>{active.description}</dd>
        </div>
      </dl>
      <div className={styles.detailCtas}>
        {active.url && (
          <a className={styles.ctaGhost} href={active.url} target="_blank" rel="noopener noreferrer">
            Ver site ao vivo <span aria-hidden="true">↗</span>
          </a>
        )}
        <a className={styles.ctaPrimary} href={projectWhatsApp(active)} target="_blank" rel="noopener noreferrer">
          <span className={styles.ctaDot} aria-hidden="true" />
          Quero um site assim
        </a>
      </div>
    </>
  );

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className={`${styles.section} section-muted ${expanded ? styles.isExpanded : ''}`}
      aria-roledescription="carrossel"
      aria-label="Projetos"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      <div className={styles.inner}>
        <div className={styles.side}>
          <div className={styles.panel} inert={expanded} aria-hidden={expanded}>
            <span className={styles.eyebrow}>Projetos</span>
            <h2 className={styles.title}>Trabalhos recentes</h2>
            <ol className={styles.list}>
              {projects.map((project, j) => (
                <li key={project.id}>
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
            aria-label={`Detalhes do projeto ${active.name}`}
          >
            <button type="button" className={styles.back} onClick={close}>
              <span aria-hidden="true">←</span> Todos os projetos
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
            aria-label={sheet ? `Projeto ${active.name}` : undefined}
            data-lenis-prevent={sheet ? '' : undefined}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
          >
            <div ref={deckRef} className={styles.deck}>
              {cards.map((i) => {
                const project = projects[i % N];
                const preview = previewFor(project, isMobile);
                const isCentre = i === centreSlot;
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
                    aria-label={`${project.name}: ver detalhes do projeto`}
                    onClick={() => onCardClick(i)}
                  >
                    <span className={styles.media}>
                      {preview ? (
                        <video
                          ref={(el) => {
                            videosRef.current[i] = el;
                          }}
                          className={styles.video}
                          muted
                          playsInline
                          loop
                          preload="none"
                          poster={preview.poster}
                          data-webm={preview.webm}
                          data-mp4={preview.mp4}
                          aria-hidden="true"
                        />
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
              <button type="button" className={styles.arrow} data-dir="prev" onClick={() => go(-1)} aria-label="Projeto anterior">
                <span className={styles.arrowIcon} aria-hidden="true">←</span>
              </button>
              <button type="button" className={styles.arrow} data-dir="next" onClick={() => go(1)} aria-label="Próximo projeto">
                <span className={styles.arrowIcon} aria-hidden="true">→</span>
              </button>
            </div>

            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Fechar projeto"
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
        {`Projeto ${active.number}: ${active.name}`}
      </p>
    </section>
  );
}
