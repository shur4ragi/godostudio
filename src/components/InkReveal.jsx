import { useEffect, useRef, useState } from 'react';
import styles from './InkReveal.module.css';

// Porta da animação "Mentorias para tatuadores" do site do Galvão Tattoo:
// uma faixa com borda de gotas (máscara SVG) desce sobre o bloco; dentro da mesma máscara vai
// uma cópia do conteúdo já na cor da tinta, contra-transladada para ficar parada, então as
// letras são "pintadas" exatamente na borda que escorre. Terminada a descida, o conteúdo real
// troca de cor e a cópia sai do DOM.
//   variant="band"    → a tinta também pinta o fundo (faixa cheia, como Mentorias)
//   variant="letters" → só as letras recebem a tinta (fundo intacto)
const POUR_MS = 2600;
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function InkReveal({ as: Tag = 'div', variant = 'letters', className = '', contentClassName = '', children }) {
  const ref = useRef(null);
  const [poured, setPoured] = useState(reducedMotion);
  const [done, setDone] = useState(reducedMotion);

  useEffect(() => {
    if (poured) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPoured(true);
        io.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px -32% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [poured]);

  useEffect(() => {
    if (!poured || done) return undefined;
    const timer = setTimeout(() => setDone(true), POUR_MS + 100);
    return () => clearTimeout(timer);
  }, [poured, done]);

  const cls = [styles.ink, styles[variant], poured && styles.poured, done && styles.done, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={cls} data-ink={done ? 'done' : poured ? 'pouring' : 'idle'}>
      <div className={`${styles.base} ${contentClassName}`}>{children}</div>
      {!done && (
        <div className={styles.paint} aria-hidden="true">
          <div className={styles.paintFill}>
            <div className={styles.paintInner} inert>
              <div className={contentClassName}>{children}</div>
            </div>
          </div>
        </div>
      )}
    </Tag>
  );
}
