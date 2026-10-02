import { useEffect, useState } from 'react';
import { siteConfig } from '../data/site';
import { useLang } from '../i18n';
import { whatsappUrl } from '../utils/external';
import { Mark } from './Mark';
import styles from './Footer.module.css';

const { contact, brand } = siteConfig;

const fmt = (timeZone, locale) =>
  new Date().toLocaleTimeString(locale, { timeZone, hour: '2-digit', minute: '2-digit', hour12: false });

function useClock(timeZone, locale) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(id);
  }, []);
  return fmt(timeZone, locale);
}

// Rodapé no formato do Galvão Tattoo (/ Seções, / Redes, local à direita) + wordmark e linha final.
export function Footer() {
  const { t, site, meta } = useLang();
  const time = useClock(brand.timezone, meta.locale);
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className={`${styles.footer} tone-flip`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.cols}>
          <div>
            <h3>
              <Mark /> {t('footer.sections')}
            </h3>
            <ul>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
              <li>
                <a href="#contato">{t('common.contact')}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>
              <Mark /> {t('footer.social')}
            </h3>
            <ul>
              <li>
                <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={whatsappUrl(contact.whatsapp.number, contact.whatsapp.defaultMessage)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <p className={styles.place}>
            {brand.name}
            <br />
            {contact.city}
          </p>
        </div>

        <p className={styles.word} aria-hidden="true">
          {brand.name}
        </p>

        <div className={styles.row}>
          <span>
            © {year} {brand.name}
          </span>
          <span className={styles.hud}>
            <b>SP</b> {time}
          </span>
          <a href="#">{t('footer.top')}</a>
        </div>
      </div>
    </footer>
  );
}
