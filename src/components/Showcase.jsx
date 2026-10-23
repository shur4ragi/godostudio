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

const SHOTS = ['/screenshots/olmo/olmo-desktop.webp', '/screenshots/olmo/olmo-catalogo.webp', '/screenshots/olmo/olmo-mobile.webp'];

export function Ecommerce() {
  const { eco } = useCopy();
  return (
    <section id="ecommerce" className={`section-muted ${styles.section}`}>
      <div className="container">
        <Head {...eco} />
        <div className={styles.shots}>
          <figure className={styles.desk}><img src={SHOTS[0]} alt={eco.alt[0]} loading="lazy" width="1200" height="750" /></figure>
          <figure className={styles.desk}><img src={SHOTS[1]} alt={eco.alt[1]} loading="lazy" width="1200" height="750" /></figure>
          <figure className={styles.mob}><img src={SHOTS[2]} alt={eco.alt[2]} loading="lazy" width="390" height="1014" /></figure>
        </div>
        <ul className={styles.feats}>
          {eco.feats.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </section>
  );
}

const ICONS = ['✉', '✦', '◈', '⇄'];

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
            <div className={styles.chatBody}>
              <p className={styles.bot}>{c.hi}</p>
              <p className={styles.me}>{c.q}</p>
              <div className={styles.chips}>{c.chips.map((x) => <span key={x}>{x}</span>)}</div>
            </div>
            <div className={styles.chatInput}>{c.ph}</div>
            <figcaption>{c.cap}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
