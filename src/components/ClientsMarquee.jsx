import { siteConfig } from '../data/site';
import styles from './ClientsMarquee.module.css';

export function ClientsMarquee() {
  const clients = [...siteConfig.clients, ...siteConfig.clients, ...siteConfig.clients];

  return (
    <section className={styles.section}>
      <div className={styles.label}>Negócios que confiam na GodoStudio</div>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marquee}>
          {clients.map((client, i) => (
            <span key={i} className={styles.client}>
              {client}
            </span>
          ))}
        </div>
        <div className={styles.marquee} aria-hidden="true">
          {clients.map((client, i) => (
            <span key={i} className={styles.client}>
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
