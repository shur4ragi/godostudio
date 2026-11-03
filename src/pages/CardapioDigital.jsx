import { useEffect } from 'react';
import { cardapio, CARDAPIO_MESSAGE, waLink } from '../data/avulso';
import { useLang } from '../i18n';
import { LangSwitch } from '../components/LangSwitch';
import { ThemeToggle } from '../components/ThemeToggle';
import { PlanIcon } from '../components/PlanIcon';
import { siteConfig } from '../data/site';
import styles from './CardapioDigital.module.css';

const EXAMPLES = ['fryda', 'leyas', 'nanica'];

// Página compartilhável /cardapio-digital (cafés, restaurantes, lojas).
export default function CardapioDigital() {
  const { lang } = useLang();
  const c = cardapio[lang] || cardapio.pt;
  const projects = Object.fromEntries(siteConfig.projects.map((p) => [p.id, p]));

  useEffect(() => {
    document.title = c.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.desc);
    window.scrollTo(0, 0);
  }, [c]);

  const cta = <a className={styles.cta} href={waLink(CARDAPIO_MESSAGE)} target="_blank" rel="noopener noreferrer">{c.cta}</a>;
  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <a href="/" className={styles.back}>{c.back}</a>
        <div className={styles.tools}><LangSwitch /><ThemeToggle /></div>
      </header>
      <main>
        <section className={`container ${styles.hero}`}>
          <p className={styles.kicker}>{c.kicker}</p>
          <h1 className={styles.h1}>{c.h1} <em>{c.h1b}</em></h1>
          <p className={styles.lead}>{c.lead}</p>
          {cta}
          <ul className={styles.feats}>{c.feats.map((f) => <li key={f}><PlanIcon name="plus" size={14} />{f}</li>)}</ul>
        </section>
        <section className={`container ${styles.examples}`}>
          <h2 className={styles.h2}>{c.exTitle}</h2>
          <div className={styles.grid}>
            {EXAMPLES.map((id) => (
              <figure key={id} className={styles.ex}>
                <div className={styles.shots}>
                  <img src={`/screenshots/cardapio/${id}-desktop.webp`} alt={`${projects[id]?.name || id} — desktop`} loading="lazy" className={styles.desk} />
                  <img src={`/screenshots/cardapio/${id}-mobile.webp`} alt={`${projects[id]?.name || id} — mobile`} loading="lazy" className={styles.mob} />
                </div>
                <figcaption>
                  <strong>{projects[id]?.name}</strong>
                  <span>{c.examples[id]}</span>
                  {projects[id]?.url && <a href={projects[id].url} target="_blank" rel="noopener noreferrer">{c.visit} ↗</a>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className={`container ${styles.how}`}>
          <h2 className={styles.h2}>{c.howTitle}</h2>
          <div className={styles.opts}>
            <div className={`${styles.opt} ${styles.optOn}`}><h3>{c.one}</h3><p>{c.oneText}</p>{cta}</div>
            <div className={styles.opt}><h3>{c.sub}</h3><p>{c.subText}</p><a className={styles.ghost} href="/#planos">{c.seePlans} →</a></div>
          </div>
        </section>
      </main>
    </div>
  );
}
