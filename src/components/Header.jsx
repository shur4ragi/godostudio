import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { siteConfig, getWhatsAppLink } from '../data/site';
import { useLang } from '../i18n';
import { lockScroll, unlockScroll } from '../scrollLock';
import { LangSwitch } from './LangSwitch';
import styles from './Header.module.css';

const MOBILE_QUERY = '(max-width: 768px)';
const FOCUSABLE = 'a[href], button:not([disabled])';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, site } = useLang();
  const headerRef = useRef(null);
  const sheetRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  // Open: lock page scroll (native + Lenis), focus the first link, Esc closes, Tab stays
  // inside header + sheet. Leaving the mobile breakpoint closes it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    lockScroll();
    const first = sheetRef.current?.querySelector('a[href]');
    const id = requestAnimationFrame(() => first?.focus({ preventScroll: true }));
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = [
        ...(headerRef.current?.querySelectorAll(FOCUSABLE) || []),
        ...(sheetRef.current?.querySelectorAll(FOCUSABLE) || []),
      ].filter((n) => n.offsetParent !== null || n === toggleRef.current);
      if (!nodes.length) return;
      const i = nodes.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? nodes.length - 1 : i - 1) : (i + 1) % nodes.length;
      e.preventDefault();
      nodes[next].focus();
    };
    const mq = window.matchMedia(MOBILE_QUERY);
    const onMq = () => !mq.matches && closeMenu(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      unlockScroll();
    };
  }, [menuOpen, closeMenu]);

  // In-page links: close first (unlocks scroll), then scroll to the section.
  const onSheetLink = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    e.preventDefault();
    closeMenu(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      history.replaceState(null, '', href);
    });
  };

  const sheet = (
    <div
      ref={sheetRef}
      id="site-menu"
      className={`${styles.sheet} ${menuOpen ? styles.sheetOpen : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('header.menu')}
      inert={!menuOpen}
      aria-hidden={!menuOpen}
      data-lenis-prevent=""
    >
      <nav className={styles.sheetNav} aria-label={t('header.menu')}>
        {site.nav.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.sheetLink}
            style={{ '--i': i }}
            onClick={onSheetLink}
          >
            <span className={styles.sheetIndex} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className={styles.sheetFoot} style={{ '--i': site.nav.length }}>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sheetCta}
          onClick={() => closeMenu(false)}
        >
          {t('common.wantSite')} <span aria-hidden="true">→</span>
        </a>
        <p className={styles.sheetMeta}>
          {siteConfig.brand.name} · {siteConfig.brand.location}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <header
        ref={headerRef}
        data-site-header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.headerMenu : ''}`}
      >
        <div className={styles.inner}>
          <a href="#" className={styles.logo} onClick={() => menuOpen && closeMenu(false)}>
            <span className={styles.logoIcon}>G</span>
            <span className={styles.logoText}>{siteConfig.brand.name}</span>
          </a>

          <nav className={styles.nav}>
            <div className={styles.navLinks}>
              {site.nav.map((item) => (
                <a key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div className={styles.actions}>
            <LangSwitch className={styles.lang} />
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              {t('common.contact')}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ''}`}
              onClick={() => (menuOpen ? closeMenu(false) : setMenuOpen(true))}
              aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
            </button>
          </div>
        </div>
      </header>
      {typeof document !== 'undefined' && createPortal(sheet, document.body)}
    </>
  );
}
