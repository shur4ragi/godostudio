import { avulso, AVULSO_MESSAGE, waLink } from '../data/avulso';
import { useLang } from '../i18n';
import { PlanIcon } from './PlanIcon';
import styles from './Avulso.module.css';

// Projeto avulso: a alternativa de compra única logo depois dos planos (sem preço; valor sob proposta).
export function Avulso() {
  const { lang } = useLang();
  const c = avulso[lang] || avulso.pt;
  return (
    <section id="avulso" className={`section-light ${styles.section}`}>
      <div className="container">
        <header className={styles.head}>
          <p className={styles.kicker}>{c.kicker}</p>
          <h2 className={styles.title}>{c.title} <em>{c.titleB}</em></h2>
          <p className={styles.lead}>{c.lead}</p>
        </header>
        <div className={styles.choice}>
          <div className={styles.opt}><strong>{c.compareSub}</strong><p>{c.compareSubText}</p><a href="#planos">↑ {c.compareSub}</a></div>
          <div className={`${styles.opt} ${styles.optOn}`}><strong>{c.compareOne}</strong><p>{c.compareOneText}</p></div>
        </div>
        <div className={styles.card}>
          <div className={styles.priceCol}>
            <p className={styles.price}>{c.price}</p>
            <p className={styles.priceNote}>{c.priceNote}</p>
            <a className={styles.cta} href={waLink(AVULSO_MESSAGE)} target="_blank" rel="noopener noreferrer">{c.cta}</a>
            <a className={styles.link} href="/cardapio-digital">{c.cardapioLink} →</a>
          </div>
          <div>
            <h3 className={styles.listTitle}>{c.incTitle}</h3>
            <ul className={styles.list}>{c.inc.map((x) => <li key={x}><PlanIcon name="plus" size={14} />{x}</li>)}</ul>
          </div>
          <div>
            <h3 className={styles.listTitle}>{c.excTitle}</h3>
            <ul className={`${styles.list} ${styles.no}`}>{c.exc.map((x) => <li key={x}><span aria-hidden="true">—</span>{x}</li>)}</ul>
            <p className={styles.excNote}>{c.excNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
