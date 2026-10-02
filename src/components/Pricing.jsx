import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, getWhatsAppLink, planFeatureIds } from '../data/site';
import { useLang } from '../i18n';
import { InkReveal } from './InkReveal';
import { Mark } from './Mark';
import { PlanIcon } from './PlanIcon';
import styles from './Pricing.module.css';

gsap.registerPlugin(ScrollTrigger);

// Planos — "Cards + Comparar tudo": 3 cards com persona (Itaú contas) e uma tabela completa
// com ✓ / — / texto e cabeçalho fixo com CTA (Bradesco "Compare os cartões").
// Mobile: carrossel com snap abrindo no Médio, tabela de 2 planos com seletor e barra fixa.
// Structure comes from siteConfig; copy comes from the active language (useLang().site).
// WhatsApp links always use the Portuguese plan name (waName).
const MOBILE_QUERY = '(max-width: 899px)';
const featureSets = Object.fromEntries(siteConfig.plans.map((p) => [p.id, new Set(planFeatureIds(p.id))]));
const waName = Object.fromEntries(siteConfig.plans.map((p) => [p.id, p.name]));
const planLink = (plan) => getWhatsAppLink(waName[plan.id]);
function usePlans() {
  const { t, site } = useLang();
  const { plans, planFeatures, pricing, compare } = site;
  const byId = Object.fromEntries(plans.map((p) => [p.id, p]));
  return { t, plans, planFeatures, pricing, compare, byId };
}
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = () => (reduceMotion() ? 'auto' : 'smooth');

const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

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

function Note({ mark }) {
  const { t } = useLang();
  if (!mark) return null;
  return (
    <a className={styles.note} href="#planos-notas" aria-label={t('pricing.noteAria', { mark })}>
      {mark}
    </a>
  );
}

function Tip({ text, label }) {
  const id = useId();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.tipWrap}>
      <button
        type="button"
        className={styles.tipBtn}
        aria-label={t('pricing.tipAria', { label })}
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      >
        ?
      </button>
      <span id={id} role="tooltip" className={styles.tip} hidden={!open}>
        {text}
      </span>
    </span>
  );
}

function Cell({ has }) {
  const { t } = useLang();
  return has ? (
    <span className={styles.yes}>
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <circle cx="10" cy="10" r="10" />
        <path d="M5.8 10.4l2.7 2.7 5.7-5.9" />
      </svg>
      <span className="sr-only">{t('pricing.included')}</span>
    </span>
  ) : (
    <span className={styles.no}>
      <span aria-hidden="true">—</span>
      <span className="sr-only">{t('pricing.notIncluded')}</span>
    </span>
  );
}

function PlanCard({ plan, onSeeAll, cardRef }) {
  const { t, planFeatures, byId } = usePlans();
  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
      data-plan={plan.id}
      aria-label={t('pricing.planAria', { name: plan.name })}
    >
      {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
      <div className={styles.cardDim}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <p className={styles.persona}>{plan.persona}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(plan.price)}</span>
          <span className={styles.period}>{t('pricing.perMonth')}</span>
        </div>
        <p className={styles.anchor}>
          {plan.anchor}
          <Note mark={plan.anchorNote} />
        </p>
        <ul className={styles.features}>
          {plan.includes && (
            <li className={styles.includes}>
              <PlanIcon name="plus" size={14} /> {t('pricing.allOf', { name: byId[plan.includes].name })}
            </li>
          )}
          {plan.features.map((id) => (
            <li key={id} className={styles.feature}>
              <PlanIcon name={planFeatures[id].icon} className={styles.featureIcon} />
              <span>
                {planFeatures[id].label}
                <Note mark={planFeatures[id].note} />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <a
        href={planLink(plan)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.cta} ${plan.highlighted ? styles.ctaHighlighted : ''}`}
      >
        {t('pricing.want', { name: plan.name })}
      </a>
      <a href="#planos-comparar" className={styles.seeAll} onClick={(e) => onSeeAll(e, plan.id)}>
        {t('pricing.seeAll')} <span aria-hidden="true">↓</span>
      </a>
    </article>
  );
}

function CompareTable({ mobile, pair, setPair, compareRef }) {
  const { t, plans, planFeatures, compare, byId } = usePlans();
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(() => compare.groups.map((_, i) => !mobile || i === 0));
  const cols = mobile ? pair.map((id) => byId[id]) : plans;

  // Ao trocar entre mobile e desktop, volta ao padrão (mobile: só o 1º grupo aberto).
  const [openFor, setOpenFor] = useState(mobile);
  if (openFor !== mobile) {
    setOpenFor(mobile);
    setOpen(compare.groups.map((_, i) => !mobile || i === 0));
  }

  // Cabeçalho "compacto" quando a tabela passa por baixo do menu.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return undefined;
    const header = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < header),
      { rootMargin: `-${header}px 0px 0px 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (slot, id) => {
    setPair((cur) => {
      const next = [...cur];
      const other = 1 - slot;
      if (cur[other] === id) next[other] = cur[slot];
      next[slot] = id;
      return next;
    });
  };

  const toggle = (i) => setOpen((cur) => cur.map((v, j) => (j === i ? !v : v)));

  return (
    <div ref={compareRef} id="planos-comparar" className={styles.compare} data-cols={cols.length}>
      <div className={styles.compareHead}>
        <h3 className={styles.compareTitle}>{compare.title}</h3>
        {mobile && (
          <div className={styles.picker}>
            <span>{t('pricing.compareLabel')}</span>
            <label className="sr-only" htmlFor="cmp-a">{t('pricing.firstPlan')}</label>
            <select id="cmp-a" value={pair[0]} onChange={(e) => pick(0, e.target.value)}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <span>{t('pricing.with')}</span>
            <label className="sr-only" htmlFor="cmp-b">{t('pricing.secondPlan')}</label>
            <select id="cmp-b" value={pair[1]} onChange={(e) => pick(1, e.target.value)}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
      <table className={`${styles.table} ${stuck ? styles.stuck : ''}`}>
        <caption className="sr-only">{t('pricing.caption')}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.corner}>
              <span>{t('pricing.features')}</span>
            </th>
            {cols.map((p) => (
              <th key={p.id} scope="col" data-plan={p.id} className={p.highlighted ? styles.colHot : undefined}>
                <span className={styles.thName}>{p.name}</span>
                <span className={styles.thPrice}>
                  {formatPrice(p.price)}
                  <small>{t('pricing.perMonth')}</small>
                </span>
                <a
                  className={`${styles.mini} ${p.highlighted ? styles.miniHot : ''}`}
                  href={planLink(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('pricing.wantPlanAria', { name: p.name })}
                >
                  {t('pricing.wantShort')}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        {compare.groups.map((g, gi) => (
          <tbody key={gi} className={open[gi] ? undefined : styles.closed}>
            <tr className={styles.groupRow}>
              <th scope="colgroup" colSpan={cols.length + 1}>
                <button type="button" aria-expanded={open[gi]} onClick={() => toggle(gi)}>
                  {g.title}
                  <span className={styles.groupIcon} aria-hidden="true" />
                </button>
              </th>
            </tr>
            {g.rows.map((id) => {
              const f = planFeatures[id];
              return (
                <tr key={id} className={styles.featureRow}>
                  <th scope="row">
                    <span className={styles.rowLabel}>
                      <PlanIcon name={f.icon} size={16} className={styles.rowIcon} />
                      <span>
                        {f.label}
                        <Note mark={f.note} />
                      </span>
                      {f.tip && <Tip text={f.tip} label={f.label} />}
                    </span>
                  </th>
                  {cols.map((p) => (
                    <td key={p.id} className={p.highlighted ? styles.colHot : undefined}>
                      <Cell has={featureSets[p.id].has(id)} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        ))}
        <tbody>
          <tr className={styles.groupRow}>
            <th scope="colgroup" colSpan={cols.length + 1}>
              <span className={styles.groupStatic}>{compare.conditions.title}</span>
            </th>
          </tr>
          {compare.conditions.rows.map((r) => (
            <tr key={r.label + r.values.basico} className={styles.featureRow}>
              <th scope="row">
                <span className={styles.rowLabel}>
                  <span>
                    {r.label}
                    <Note mark={r.note} />
                  </span>
                </span>
              </th>
              {cols.map((p) => (
                <td key={p.id} className={`${styles.textCell} ${p.highlighted ? styles.colHot : ''}`}>
                  {r.values[p.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pricing() {
  const { t, plans, pricing } = usePlans();
  const mobile = useMedia(MOBILE_QUERY);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const compareRef = useRef(null);
  const resumoRef = useRef(null);
  const startIndex = Math.max(0, plans.findIndex((p) => p.highlighted));
  const [current, setCurrent] = useState(startIndex);
  const [view, setView] = useState('resumo');
  const [barOn, setBarOn] = useState(false);
  const [settled, setSettled] = useState(false);
  const [pair, setPair] = useState(() => [plans[0].id, plans[startIndex === 0 ? 1 : startIndex].id]);

  // Entrada dos cards em stagger.
  useEffect(() => {
    if (reduceMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current.filter(Boolean), {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.08,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: trackRef.current, start: 'top 80%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Mobile: o carrossel abre no Médio.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const card = cardsRef.current[startIndex];
    if (!mobile || !track || !card) return;
    track.scrollLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    setCurrent(startIndex);
  }, [mobile, startIndex]);

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setCurrent(best);
  };

  const goCard = (i) => {
    const track = trackRef.current;
    const card = cardsRef.current[i];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: scrollBehavior() });
  };

  // A barra fixa (mobile) só aparece dentro da seção.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const res = resumoRef.current?.getBoundingClientRect();
      const sec = sectionRef.current?.getBoundingClientRect();
      if (res && sec) setBarOn(res.top < vh * 0.75 && sec.bottom > vh * 0.6);
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
  }, []);

  // Resumo / Comparar tudo: a tabela fica fechada e só abre (animada) em "Comparar tudo".
  const jump = (target) => {
    if (target === 'comparar') {
      setView('comparar');
      // espera a abertura começar e rola até o início da tabela
      requestAnimationFrame(() =>
        requestAnimationFrame(() => compareRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }))
      );
      return;
    }
    setSettled(false);
    const res = resumoRef.current;
    if (res && res.getBoundingClientRect().top < 0) res.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    setView('resumo');
  };

  const onSeeAll = (e, planId) => {
    e.preventDefault();
    if (mobile && !pair.includes(planId)) {
      setPair((cur) => (planId === plans[0].id ? [planId, cur[1]] : [cur[0], planId]));
    }
    jump('comparar');
  };

  const barPlan = plans[current] || plans[startIndex];

  return (
    <section id="planos" ref={sectionRef} className={`${styles.section} section-dark tone-flip`}>
      <InkReveal variant="band" className={styles.band} contentClassName={`container ${styles.bandLayout}`}>
        <p className={styles.kicker}>
          <Mark /> <span>{t('pricing.kicker')}</span>
          <span className={styles.kickerIndex}>04</span>
        </p>
        <h2 className={styles.bandTitle}>
          <span className={styles.titleA}>{t('pricing.titleA')}</span>
          <br />
          <span className={styles.titleB}>{t('pricing.titleB')}</span>
        </h2>
        <div className={styles.bandSide}>
          <p className={styles.bandText}>{pricing.subtitle}</p>
          <p className={styles.validFrom}>{pricing.validFrom}</p>
        </div>
      </InkReveal>

      <div className="container">
        <div className={styles.switch} data-reveal role="group" aria-label={t('pricing.viewAria')}>
          {[
            ['resumo', t('pricing.summary')],
            ['comparar', t('pricing.compareAll')],
          ].map(([key, label]) => (
            <button key={key} type="button" aria-pressed={view === key} onClick={() => jump(key)}>
              {label}
            </button>
          ))}
          <span className={styles.switchThumb} data-pos={view} aria-hidden="true" />
        </div>

        <div ref={resumoRef} id="planos-resumo" className={styles.resumo}>
          <div ref={trackRef} className={styles.track} onScroll={mobile ? onTrackScroll : undefined}>
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} onSeeAll={onSeeAll} cardRef={(el) => (cardsRef.current[i] = el)} />
            ))}
          </div>
          {mobile && (
            <div className={styles.pager}>
              <button type="button" onClick={() => goCard(current - 1)} disabled={current === 0} aria-label={t('pricing.prevPlan')}>
                ‹
              </button>
              <span aria-live="polite">
                {String(current + 1).padStart(2, '0')} / {String(plans.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => goCard(current + 1)}
                disabled={current === plans.length - 1}
                aria-label={t('pricing.nextPlan')}
              >
                ›
              </button>
            </div>
          )}
        </div>

        <div
          className={`${styles.compareWrap} ${view === 'comparar' ? styles.compareOpen : ''} ${settled ? styles.compareSettled : ''}`}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === 'grid-template-rows') setSettled(view === 'comparar');
          }}
          inert={view !== 'comparar'}
        >
          <div className={styles.compareClip}>
            <CompareTable mobile={mobile} pair={pair} setPair={setPair} compareRef={compareRef} />
          </div>
        </div>

        <ul className={styles.trust}>
          {pricing.trust.map((item) => (
            <li key={item.icon}>
              <PlanIcon name={item.icon} size={16} /> {item.text}
            </li>
          ))}
          <li>
            <a href="#faq">{t('pricing.faqLink')}</a>
          </li>
        </ul>

        <ol id="planos-notas" className={styles.footnotes}>
          {pricing.footnotes.map((n) => (
            <li key={n.mark}>
              <span>{n.mark}</span> {n.text}
            </li>
          ))}
        </ol>
      </div>

      {mobile && (
        <div className={`${styles.bar} ${barOn ? styles.barOn : ''}`} inert={!barOn} data-plan-bar={barPlan.id}>
          <p>
            <strong>{barPlan.name}</strong> · {formatPrice(barPlan.price)}
            {t('pricing.perMonth')}
            {barPlan.barNote && <span> · {barPlan.barNote}</span>}
          </p>
          <a href={planLink(barPlan)} target="_blank" rel="noopener noreferrer">
            {t('pricing.wantThis')}
          </a>
        </div>
      )}
    </section>
  );
}
