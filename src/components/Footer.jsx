import { useEffect, useState } from 'react';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Footer.module.css';

function Star({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  );
}

export function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', {
        timeZone: siteConfig.brand.timezone,
        hour: '2-digit',
        minute: '2-digit',
      });
      setTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.column}>
            <span className={styles.label}>Seções</span>
            <nav className={styles.nav}>
              {siteConfig.nav.map((item) => (
                <a key={item.href} href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.column}>
            <span className={styles.label}>Redes</span>
            <div className={styles.nav}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Instagram
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <span className={styles.label}>Local</span>
            <div className={styles.place}>
              <Star className={styles.star} />
              <span>{siteConfig.brand.location}</span>
            </div>
          </div>
        </div>

        <div className={styles.wordmarkWrap}>
          <a href="#" className={styles.wordmark}>
            {siteConfig.brand.name}
          </a>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {year} {siteConfig.brand.name}
          </span>
          <div className={styles.hud}>
            <span className={styles.hudLabel}>SP</span>
            <span className={styles.hudTime}>{time}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
