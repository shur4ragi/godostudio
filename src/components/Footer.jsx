import { useEffect, useState } from 'react';
import { siteConfig } from '../data/site';
import { whatsappUrl } from '../utils/external';
import { Mark } from './Mark';
import styles from './Footer.module.css';

const { contact, brand, nav } = siteConfig;

const fmt = (timeZone) =>
  new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });

function useClock(timeZone) {
  const [time, setTime] = useState(() => fmt(timeZone));
  useEffect(() => {
    const id = setInterval(() => setTime(fmt(timeZone)), 15000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

// Rodapé no formato do Galvão Tattoo (/ Seções, / Redes, local à direita) + wordmark e linha final.
export function Footer() {
  const time = useClock(brand.timezone);
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.cols}>
          <div>
            <h3>
              <Mark /> / Seções
            </h3>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
              <li>
                <a href="#contato">Contato</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>
              <Mark /> / Redes
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
          <a href="#">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  );
}
