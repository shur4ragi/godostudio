import { useCallback, useEffect, useRef, useState } from 'react';
import { EXTERNAL_EVENT, kindOf, openExternal } from '../utils/external';
import styles from './ExternalLoader.module.css';

const WAIT_MS = 1600;

function hostOf(href) {
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return href;
  }
}

const COPY = {
  whatsapp: () => ({ title: 'Abrindo o WhatsApp', text: 'Sua mensagem já vai pronta, é só enviar.' }),
  instagram: () => ({ title: 'Abrindo o Instagram', text: 'O perfil do Vitor no @vitor_godo.' }),
  site: (href) => ({ title: 'Abrindo o site ao vivo', text: hostOf(href) }),
};

// Tela de carregamento antes de sair do site. Intercepta cliques em qualquer link externo da
// página (sem mexer em cada botão) e também pedidos via evento (formulário). Ctrl/Cmd/Shift +
// clique continua abrindo direto. Esc ou "Cancelar" desistem.
export function ExternalLoader() {
  const [pending, setPending] = useState(null); // { href, kind }
  const cancelRef = useRef(null);
  const lastFocus = useRef(null);

  const show = useCallback((href) => {
    const kind = kindOf(href);
    if (!kind) {
      openExternal(href);
      return;
    }
    lastFocus.current = document.activeElement;
    setPending({ href, kind });
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href]');
      if (!link || link.hasAttribute('download') || !kindOf(link.href)) return;
      e.preventDefault();
      show(link.href);
    };
    const onRequest = (e) => show(e.detail.href);
    document.addEventListener('click', onClick);
    window.addEventListener(EXTERNAL_EVENT, onRequest);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener(EXTERNAL_EVENT, onRequest);
    };
  }, [show]);

  useEffect(() => {
    if (!pending) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus({ preventScroll: true });
    const timer = setTimeout(() => {
      openExternal(pending.href);
      setPending(null);
    }, WAIT_MS);
    const onKey = (e) => {
      if (e.key === 'Escape') setPending(null);
      if (e.key === 'Tab') {
        e.preventDefault(); // único foco: o botão Cancelar
        cancelRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [pending]);

  if (!pending) return null;
  const copy = COPY[pending.kind](pending.href);

  return (
    <div
      className={styles.overlay}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="saida-titulo"
      aria-describedby="saida-texto"
      data-lenis-prevent=""
      data-external-loader={pending.kind}
      data-href={pending.href}
    >
      <div className={styles.card}>
        <div className={styles.skeleton} aria-hidden="true">
          {pending.kind === 'whatsapp' && <WhatsAppArt />}
          {pending.kind === 'instagram' && <InstagramArt />}
          {pending.kind === 'site' && <SiteArt />}
        </div>
        <p id="saida-titulo" className={styles.title}>
          {copy.title}
        </p>
        <p id="saida-texto" className={styles.text}>
          {copy.text}
        </p>
        <span className={styles.bar} aria-hidden="true">
          <i style={{ animationDuration: `${WAIT_MS}ms` }} />
        </span>
        <button ref={cancelRef} type="button" className={styles.cancel} onClick={() => setPending(null)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Skeleton de conversa: o balão se desenha e as mensagens aparecem como blocos de carregamento.
function WhatsAppArt() {
  return (
    <svg className={styles.art} viewBox="0 0 220 150" focusable="false">
      <path
        className={styles.draw}
        d="M40 34 Q40 16 58 16 H162 Q180 16 180 34 V82 Q180 100 162 100 H90 L64 122 L69 100 H58 Q40 100 40 82 Z"
        pathLength="1"
      />
      <rect className={styles.line} x="58" y="36" width="96" height="9" rx="4.5" />
      <rect className={styles.line} x="58" y="53" width="70" height="9" rx="4.5" style={{ animationDelay: '0.12s' }} />
      <circle className={styles.dot} cx="66" cy="80" r="4.5" />
      <circle className={styles.dot} cx="80" cy="80" r="4.5" style={{ animationDelay: '0.15s' }} />
      <circle className={styles.dot} cx="94" cy="80" r="4.5" style={{ animationDelay: '0.3s' }} />
    </svg>
  );
}

// Moldura do Instagram se desenhando, com a grade de posts em skeleton.
function InstagramArt() {
  return (
    <svg className={styles.art} viewBox="0 0 220 150" focusable="false">
      <rect className={styles.draw} x="62" y="10" width="96" height="96" rx="28" pathLength="1" />
      <circle className={styles.draw} cx="110" cy="58" r="24" pathLength="1" style={{ animationDelay: '0.2s' }} />
      <circle className={styles.accentDot} cx="140" cy="29" r="5" />
      {[0, 1, 2].map((i) => (
        <rect key={i} className={styles.line} x={66 + i * 31} y="116" width="26" height="26" rx="6" style={{ animationDelay: `${0.1 * i}s` }} />
      ))}
    </svg>
  );
}

// Janela de navegador com o layout do site em skeleton.
function SiteArt() {
  return (
    <svg className={styles.art} viewBox="0 0 220 150" focusable="false">
      <rect className={styles.draw} x="22" y="10" width="176" height="128" rx="14" pathLength="1" />
      <circle className={styles.accentDot} cx="38" cy="25" r="3.5" />
      <circle className={styles.dot} cx="50" cy="25" r="3.5" />
      <circle className={styles.dot} cx="62" cy="25" r="3.5" />
      <rect className={styles.line} x="36" y="44" width="148" height="34" rx="7" />
      <rect className={styles.line} x="36" y="88" width="90" height="9" rx="4.5" style={{ animationDelay: '0.1s' }} />
      <rect className={styles.line} x="36" y="104" width="64" height="9" rx="4.5" style={{ animationDelay: '0.2s' }} />
      <rect className={styles.line} x="140" y="88" width="44" height="34" rx="7" style={{ animationDelay: '0.3s' }} />
    </svg>
  );
}
