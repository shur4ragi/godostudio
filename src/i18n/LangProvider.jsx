import { useCallback, useEffect, useMemo, useState } from 'react';
import { siteConfig } from '../data/site';
import { DICTS, LangContext, STORAGE_KEY, detect, get, merge } from './context';
import pt from './pt.json';

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detect);
  const dict = DICTS[lang];

  const site = useMemo(() => merge(siteConfig, dict.content), [dict]);

  const t = useCallback(
    (key, vars) => {
      let str = get(dict.ui, key);
      if (typeof str !== 'string') {
        if (import.meta.env.DEV) console.warn(`[i18n] missing "${key}" for ${lang}`);
        str = get(pt.ui, key) ?? key;
      }
      return vars ? str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : str;
    },
    [dict, lang]
  );

  const setLang = useCallback((next) => {
    if (!DICTS[next]) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  // <html lang>, title and meta follow the language.
  useEffect(() => {
    const { meta } = dict;
    const { title, description } = dict.content.seo;
    document.documentElement.lang = meta.htmlLang;
    document.title = title;
    const setMeta = (sel, value) => document.querySelector(sel)?.setAttribute('content', value);
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', meta.ogLocale);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [dict]);

  const value = useMemo(() => ({ lang, setLang, t, site, meta: dict.meta }), [lang, setLang, t, site, dict]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

