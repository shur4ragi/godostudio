import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <span className={styles.logoIcon}>G</span>
              <span className={styles.logoText}>{siteConfig.brand.name}</span>
            </a>
            <p className={styles.tagline}>{siteConfig.brand.tagline}</p>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navGroup}>
              <h4 className={styles.navTitle}>Navegação</h4>
              <ul className={styles.navList}>
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={styles.navLink}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navTitle}>Contato</h4>
              <ul className={styles.navList}>
                <li>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navLink}
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.contact.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navLink}
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{siteConfig.footer.copyright}</p>
          <p className={styles.location}>{siteConfig.footer.location}</p>
        </div>
      </div>
    </footer>
  );
}
