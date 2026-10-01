import { useEffect, useState } from 'react';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Footer.module.css';

export function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', {
        timeZone: siteConfig.brand.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
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
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <span className={styles.logoIcon}>G</span>
              <span className={styles.logoText}>{siteConfig.brand.name}</span>
            </a>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <span className={styles.linkLabel}>Navegação</span>
              <nav className={styles.nav}>
                {siteConfig.nav.map((item) => (
                  <a key={item.href} href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className={styles.linkGroup}>
              <span className={styles.linkLabel}>Contato</span>
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
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <span>© {year} {siteConfig.brand.name}</span>
            <span className={styles.divider}>·</span>
            <span>{siteConfig.brand.location}</span>
          </div>

          <div className={styles.hud}>
            <span className={styles.hudLabel}>SP</span>
            <span className={styles.hudTime}>{time}</span>
          </div>
        </div>
      </div>

      <div className={styles.corners}>
        <span className={styles.corner} data-pos="bl" />
        <span className={styles.corner} data-pos="br" />
      </div>
    </footer>
  );
}
