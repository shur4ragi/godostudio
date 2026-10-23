import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { showcase } from '../data/showcase';
import styles from './Showcase.module.css';

const useCopy = () => {
  const { lang } = useLang();
  return showcase[lang] || showcase.pt;
};

function Head({ kicker, title, titleB, lead }) {
  return (
    <header className={styles.head}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 className={styles.title}>{title} <em>{titleB}</em></h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
}

export function Onboarding() {
  const { onb } = useCopy();
  return (
    <section id="onboarding" className={`section-light ${styles.section}`}>
      <div className="container">
        <Head {...onb} />
        <ol className={styles.steps}>
          {onb.steps.map(([name, desc, out], i) => (
            <li key={name} className={styles.step}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{name}</h3>
              <p>{desc}</p>
              <span className={styles.out}>→ {out}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SLIDES = [
  { src: '/screenshots/olmo/olmo-desktop.webp' },
  { src: '/screenshots/olmo/olmo-admin.webp' },
  { src: '/screenshots/olmo/olmo-checkout.webp' },
  { src: '/screenshots/olmo/olmo-produto.webp' },
  { src: '/screenshots/olmo/olmo-mobile.webp', mobile: true },
];

function Carousel({ eco }) {
  const track = useRef(null);
  const [at, setAt] = useState(0);
  const go = (i) => {
    const el = track.current;
    if (!el) return;
    const n = (i + SLIDES.length) % SLIDES.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };
  const atRef = useRef(0);
  useEffect(() => { atRef.current = at; }, [at]);
  // Ao redimensionar, mantém o slide atual no lugar (o scroll é em px).
  useEffect(() => {
    const el = track.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => { el.scrollLeft = atRef.current * el.clientWidth; });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const onScroll = () => {
    const el = track.current;
    if (el) setAt(Math.round(el.scrollLeft / el.clientWidth));
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); }
  };
  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label={eco.name} onKeyDown={onKey}>
      <div className={styles.track} ref={track} onScroll={onScroll} tabIndex={0}>
        {SLIDES.map((s, i) => (
          <figure key={s.src} className={`${styles.slide} ${s.mobile ? styles.slideMobile : ''}`} aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`} aria-hidden={i !== at}>
            <div className={styles.frame}>
              <img src={s.src} alt={`${eco.name} — ${eco.alt[i]}`} loading={i ? 'lazy' : undefined} width={s.mobile ? 390 : 1200} height={s.mobile ? 1014 : 750} draggable="false" />
            </div>
          </figure>
        ))}
      </div>
      <div className={styles.controls}>
        <p className={styles.caption} aria-live="polite"><span>{String(at + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span> {eco.alt[at]}</p>
        <div className={styles.dots}>
          {SLIDES.map((s, i) => (
            <button key={s.src} type="button" className={i === at ? styles.dotOn : styles.dot} aria-label={`${eco.goto} ${i + 1}`} aria-current={i === at} onClick={() => go(i)} />
          ))}
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} aria-label={eco.prev} onClick={() => go(at - 1)}>←</button>
          <button type="button" className={styles.arrow} aria-label={eco.next} onClick={() => go(at + 1)}>→</button>
        </div>
      </div>
    </div>
  );
}

export function Ecommerce() {
  const { eco } = useCopy();
  return (
    <section id="ecommerce" className={`section-muted ${styles.section}`}>
      <div className="container">
        <Head {...eco} />
        <Carousel eco={eco} />
        <ul className={styles.feats}>
          {eco.feats.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </section>
  );
}

const ICONS = ['✉', '✦', '◈', '⇄'];

// Demo do chat: boas-vindas da assistente, a cliente digita a pergunta sobre o plano, envia,
// "digitando…" e a resposta com os preços do Clube; repete com pausa. Só anima visível na tela;
// com prefers-reduced-motion mostra a conversa completa parada.
const FINAL = 99;
function ChatDemo({ c }) {
  const ref = useRef(null);
  // 0 pontinhos (boas-vindas) · 1 boas-vindas · 2 digitando no campo · 3 enviada · 4 pontinhos · FINAL resposta
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !visible) return undefined;
    let t;
    if (step === 0) t = setTimeout(() => setStep(1), 1400);
    else if (step === 1) t = setTimeout(() => { setChars(0); setStep(2); }, 1600);
    else if (step === 2) t = chars < c.q.length ? setTimeout(() => setChars((n) => n + 1), 45 + Math.random() * 55) : setTimeout(() => setStep(3), 450);
    else if (step === 3) t = setTimeout(() => setStep(4), 600);
    else if (step === 4) t = setTimeout(() => setStep(FINAL), 1800);
    else t = setTimeout(() => { setStep(0); setChars(0); }, 6500);
    return () => clearTimeout(t);
  }, [step, chars, visible, reduced, c.q.length]);

  const s = reduced ? FINAL : step;
  const typed = s === 2 ? c.q.slice(0, chars) : '';
  return (
    <>
      <div className={styles.chatBody} ref={ref} aria-live="off">
        {s === 0 && <p className={`${styles.bot} ${styles.dots} ${styles.pop}`} aria-label={c.typing}><i /><i /><i /></p>}
        {s >= 1 && <p className={`${styles.bot} ${styles.pop}`}>{c.hi}</p>}
        {s >= 3 && <p className={`${styles.me} ${styles.pop}`}>{c.q}</p>}
        {s === 4 && <p className={`${styles.bot} ${styles.dots} ${styles.pop}`} aria-label={c.typing}><i /><i /><i /></p>}
        {s === FINAL && <p className={`${styles.bot} ${styles.pop}`}>{c.a}</p>}
        {(s === 1 || s === 2) && <div className={`${styles.chips} ${styles.pop}`}>{c.chips.map((x) => <span key={x}>{x}</span>)}</div>}
      </div>
      <div className={`${styles.chatInput} ${typed ? styles.typing : ''}`} aria-hidden="true">
        <span>{typed || c.ph}{s === 2 && <b className={styles.caret} />}</span>
        <span className={`${styles.send} ${s === 2 && typed.length === c.q.length ? styles.sendOn : ''}`}>↑</span>
      </div>
    </>
  );
}

export function Integrations() {
  const { int } = useCopy();
  const c = int.chat;
  return (
    <section id="integracoes" className={`section-light ${styles.section}`}>
      <div className="container">
        <Head {...int} />
        <div className={styles.intGrid}>
          <ul className={styles.cards}>
            {int.items.map(([name, desc], i) => (
              <li key={name} className={styles.card}>
                <span className={styles.icon} aria-hidden="true">{ICONS[i]}</span>
                <h3>{name}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ul>
          <figure className={styles.chat}>
            <div className={styles.chatHead}>
              <span className={styles.avatar} aria-hidden="true">✿</span>
              <div><strong>{c.head}</strong><small>{c.status}</small></div>
            </div>
            <ChatDemo key={c.q} c={c} />
            <figcaption>{c.cap}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
