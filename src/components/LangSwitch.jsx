import { DICTS, LANGS, useLang } from '../i18n';
import styles from './LangSwitch.module.css';

// Compact PT / EN / ES segmented switch, always in the header (desktop and mobile).
export function LangSwitch({ className = '', onPick }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className={`${styles.switch} ${className}`} role="group" aria-label={t('header.language')} data-lang-switch>
      {LANGS.map((code) => {
        const { label, name, htmlLang } = DICTS[code].meta;
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={htmlLang}
            className={active ? styles.active : undefined}
            aria-pressed={active}
            aria-label={name}
            title={name}
            onClick={() => {
              setLang(code);
              onPick?.(code);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
