import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import { applyTheme, getTheme } from '../theme';
import styles from './ThemeToggle.module.css';

// Sun / moon button next to the language switch. Light is the default.
export function ThemeToggle({ className = '' }) {
  const { t } = useLang();
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const sync = (e) => setTheme(e.detail);
    window.addEventListener('godostudio:theme', sync);
    return () => window.removeEventListener('godostudio:theme', sync);
  }, []);

  const dark = theme === 'dark';
  const label = dark ? t('header.themeLight') : t('header.themeDark');
  return (
    <button
      type="button"
      className={`${styles.toggle} ${className}`}
      aria-pressed={dark}
      aria-label={label}
      title={label}
      data-theme-toggle
      onClick={() => applyTheme(dark ? 'light' : 'dark', { animate: true })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        <g className={styles.sun}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.55 1.55M17.15 17.15l1.55 1.55M5.3 18.7l1.55-1.55M17.15 6.85l1.55-1.55" />
        </g>
        <path className={styles.moon} d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" />
      </svg>
    </button>
  );
}
