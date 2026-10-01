import { createContext, useContext } from 'react';
import pt from './pt.json';
import en from './en.json';
import es from './es.json';

// Tiny i18n: one JSON per language ({ meta, content, ui }) + a context. pt-BR is the default.
// `site` = siteConfig (structure) deep-merged with the language's `content`.
export const DICTS = { pt, en, es };
export const LANGS = Object.keys(DICTS);
export const STORAGE_KEY = 'godostudio-lang';

export function merge(base, over) {
  if (over === undefined) return base;
  if (base === undefined || base === null) return over;
  if (Array.isArray(base) && Array.isArray(over)) {
    const n = Math.max(base.length, over.length);
    return Array.from({ length: n }, (_, i) => merge(base[i], over[i]));
  }
  if (typeof base === 'object' && typeof over === 'object' && over !== null && !Array.isArray(base)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over === null ? base : over;
}

export function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && DICTS[saved]) return saved;
  } catch {
    /* storage unavailable */
  }
  const prefs = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];
  for (const tag of prefs) {
    const code = String(tag || '').toLowerCase().slice(0, 2);
    if (DICTS[code]) return code;
  }
  return 'pt';
}

export const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

export const LangContext = createContext(null);

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
