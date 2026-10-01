import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../data/site';
import { whatsappUrl } from '../utils/external';
import { Mark } from './Mark';
import styles from './Process.module.css';

gsap.registerPlugin(ScrollTrigger);

// Processo — "A escada". Desktop: os 4 verbos em escada (120px, Lugano), seção pinada; cada
// degrau acende por vez e o painel com cantos de visor (DG Cinema) troca de canto no passo 03.
// Uma linha coral em ângulo reto (Dialed) liga o verbo ativo ao painel. Mobile, telas baixas e
// prefers-reduced-motion: trilho vertical sem pin.
const STAIR_QUERY = '(min-width: 1200px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';
const steps = siteConfig.process;
const intro = siteConfig.processIntro;
const ctaHref = () => whatsappUrl(siteConfig.contact.whatsapp.number, intro.ctaMessage);

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return match;
}

const stateOf = (i, active) => (i < active ? 'done' : i === active ? 'active' : 'next');
const STATUS = { done: '✓ Feito', active: '● Em andamento', next: '· A seguir' };

function Corners() {
  return (
    <span className={styles.corners} aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

function StepBody({ step }) {
  return (
    <>
      <h3 className={styles.headline}>{step.headline}</h3>
      <p className={styles.label}>O que acontece</p>
      <p className={styles.desc}>{step.description}</p>
      <p className={styles.label}>Você recebe</p>
      <ul className={styles.chips}>
        {step.deliverables.map((d, i) => (
          <li key={d} style={{ '--i': i }}>{d}</li>
        ))}
      </ul>
      <p className={styles.youDo}>
        <span className={styles.label}>Você faz</span> {step.youDo}
      </p>
    </>
  );
}

function Stair() {
  const stageRef = useRef(null);
  const stairsRef = useRef(null);
  const panelRef = useRef(null);
  const rulerRef = useRef(null);
  const wordRefs = useRef([]);
  const triggerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [moving, setMoving] = useState(false);
  const [wire, setWire] = useState(null);
  const slot = active < 2 ? 'a' : 'b';
  const step = steps[active];

  useEffect(() => {
    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        pin: true,
        anticipatePin: 1,
        snap: { snapTo: 1 / 3, duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power2.inOut' },
        onUpdate: (self) => {
          rulerRef.current?.style.setProperty('--p', self.progress.toFixed(4));
          setActive(Math.min(3, Math.round(self.progress * 3)));
        },
      });
      // Entrada: verbos sobem por trás de uma máscara de linha e as hairlines crescem.
      gsap.from(stairsRef.current.querySelectorAll('[data-word]'), {
        yPercent: 110,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: stageRef.current, start: 'top 75%', once: true },
      });
      gsap.from(stairsRef.current.querySelectorAll('[data-rule]'), {
        scaleX: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: stageRef.current, start: 'top 75%', once: true },
      });
    }, stageRef);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      ctx.revert();
      triggerRef.current = null;
    };
  }, []);

  // Painel muda de canto entre os passos 02 e 03: os cantos de visor "fecham" durante o voo.
  const lastSlot = useRef(slot);
  useEffect(() => {
    if (lastSlot.current === slot) return undefined;
    lastSlot.current = slot;
    setMoving(true);
    const t = setTimeout(() => setMoving(false), 820);
    return () => clearTimeout(t);
  }, [slot]);

  // Fio coral: do verbo ativo até o canto mais próximo do painel, na posição final do painel.
  const measure = useCallback(() => {
    const box = stairsRef.current;
    const word = wordRefs.current[active];
    const button = word?.closest('button');
    const panel = panelRef.current;
    if (!box || !word || !panel) return;
    const b = box.getBoundingClientRect();
    const w = word.getBoundingClientRect();
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const vx = w.left - b.left;
    const vy = w.top - b.top + w.height * 0.55;
    let d;
    if (slot === 'a') {
      const ex = b.width - pw;
      const ey = ph;
      const sx = vx + w.width + 14;
      d = `M${sx} ${vy} H${Math.max(sx + 8, ex - 18)} V${ey} H${ex}`;
    } else {
      const ex = pw;
      const ey = b.height - ph;
      const sx = button.getBoundingClientRect().left - b.left - 10;
      d = `M${sx} ${vy} H${Math.min(sx - 8, ex + 18)} V${ey} H${ex}`;
    }
    setWire({ d, w: b.width, h: b.height });
  }, [active, slot]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const goTo = (i) => {
    const st = triggerRef.current;
    if (!st) return;
    window.scrollTo({ top: st.start + ((st.end - st.start) * i) / 3, behavior: 'smooth' });
  };

  return (
    // Wrapper do React: o GSAP envolve o palco num pin-spacer, então o React nunca remove o
    // palco diretamente (evita erro de removeChild ao trocar para o trilho).
    <div className={styles.stairWrap}>
    <div ref={stageRef} className={styles.stage} data-process="stair" data-step={active + 1}>
      <div className={`container ${styles.stageInner}`}>
        <div ref={stairsRef} className={styles.stairs}>
          {steps.map((s, i) => {
            const st = stateOf(i, active);
            return (
              <div key={s.number} className={styles.row} data-state={st} style={{ '--i': i }}>
                <span className={styles.rule} data-rule aria-hidden="true" />
                <button
                  type="button"
                  className={styles.verb}
                  aria-controls="processo-painel"
                  aria-current={st === 'active' ? 'step' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className={styles.index}>
                    {s.number}
                    {st === 'done' && <span className={styles.tick}>✓</span>}
                    <span className="sr-only"> — {STATUS[st]}</span>
                  </span>
                  <span className={styles.wordMask}>
                    <span ref={(el) => (wordRefs.current[i] = el)} className={styles.word} data-word>
                      {s.title}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}

          {wire && (
            <svg className={styles.wire} viewBox={`0 0 ${wire.w} ${wire.h}`} aria-hidden="true">
              <path key={wire.d} d={wire.d} pathLength="1" className={styles.wirePath} />
              <circle key={`dot-${wire.d}`} r="3" className={styles.wireDot} style={{ offsetPath: `path('${wire.d}')` }} />
            </svg>
          )}

          <aside
            id="processo-painel"
            ref={panelRef}
            className={`${styles.panel} ${slot === 'b' ? styles.slotB : ''} ${moving ? styles.moving : ''}`}
            aria-live="polite"
          >
            <Corners />
            <p className={styles.hud}>
              <span>
                Passo{' '}
                <span className={styles.roll} aria-hidden="true">
                  <span style={{ transform: `translateY(${-active * 1.3}em)` }}>
                    {steps.map((s) => (
                      <span key={s.number}>{s.number}</span>
                    ))}
                  </span>
                </span>
                <span className="sr-only">{step.number}</span>/0{steps.length}
              </span>
              <span className={step.live ? styles.live : styles.status}>
                {step.live ? '● Ao vivo' : '● Em andamento'}
              </span>
              <span className={styles.hudRight}>Duração {step.duration}</span>
            </p>
            <div key={step.number} className={styles.panelBody}>
              <StepBody step={step} />
            </div>
          </aside>
        </div>

        <Ruler ref={rulerRef} active={active} />
      </div>
    </div>
    </div>
  );
}

function Ruler({ ref, active }) {
  return (
    <div ref={ref} className={styles.ruler}>
      <ol className={styles.segments} aria-label="Tempo de cada passo">
        {steps.map((s, i) => (
          <li
            key={s.number}
            className={styles.segment}
            data-state={active == null ? 'done' : stateOf(i, active)}
            style={{ flexGrow: s.rulerWeight }}
          >
            <span className={styles.segNum}>{s.number}</span>
            <span className={styles.segBar} aria-hidden="true" />
            <span className={styles.segTime}>{s.duration}</span>
          </li>
        ))}
      </ol>
      <div className={styles.rulerFoot}>
        <p className={styles.total}>
          {intro.rulerLabel}: <strong>{intro.total}</strong>
        </p>
        <a className={styles.cta} href={ctaHref()} target="_blank" rel="noopener noreferrer">
          {intro.cta} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

// Mobile / reduced motion: trilho vertical; a linha coral "enche" até o passo que está na tela.
function Rail() {
  const listRef = useRef(null);
  const [fill, setFill] = useState(0);
  const [reached, setReached] = useState(-1);
  const reduce = useMedia('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (reduce) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const list = listRef.current;
      if (!list) return;
      const r = list.getBoundingClientRect();
      const line = window.innerHeight * 0.55 - r.top;
      setFill(Math.max(0, Math.min(r.height, line)));
      const nodes = list.querySelectorAll('[data-node]');
      let n = -1;
      nodes.forEach((node, i) => {
        if (node.getBoundingClientRect().top < window.innerHeight * 0.55) n = i;
      });
      setReached(n);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduce]);

  return (
    <div className={`container ${styles.railWrap}`} data-process="rail">
      <ol ref={listRef} className={styles.rail} style={{ '--fill': reduce ? '100%' : `${fill}px` }}>
        {steps.map((s, i) => (
          <li
            key={s.number}
            className={styles.railStep}
            data-state={reduce || i <= reached ? 'lit' : 'dim'}
            style={{ '--indent': `${Math.min(i * 16, 48)}px` }}
          >
            <span className={styles.node} data-node aria-hidden="true" />
            <h3 className={styles.railVerb}>
              <span className={styles.index}>{s.number}</span> {s.title}
            </h3>
            <div className={styles.block}>
              <Corners />
              <p className={styles.hud}>
                <span>{s.number}/0{steps.length}</span>
                {s.live && <span className={styles.live}>● Ao vivo</span>}
                <span className={styles.hudRight}>{s.duration}</span>
              </p>
              <StepBody step={s} />
            </div>
          </li>
        ))}
      </ol>
      <div className={styles.railFoot}>
        <p className={styles.total}>
          Total <strong>{intro.total}</strong>
        </p>
        <p className={styles.closing}>{intro.closing}</p>
        <a className={styles.cta} href={ctaHref()} target="_blank" rel="noopener noreferrer">
          {intro.cta} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

export function Process() {
  const stair = useMedia(STAIR_QUERY);
  return (
    <section id="processo" className={`${styles.section} section-light`}>
      <div className={`container ${styles.header}`}>
        <p className={styles.kicker}>
          <Mark /> <span>/ Processo</span>
          <span className={styles.kickerIndex}>03</span>
        </p>
        <h2 className={styles.title}>
          {intro.title} <span>— {intro.subtitle}</span>
        </h2>
      </div>
      {stair ? <Stair /> : <Rail />}
    </section>
  );
}
