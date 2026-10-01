import { useState } from 'react';
import { siteConfig } from '../data/site';
import { InkReveal } from './InkReveal';
import { Mark } from './Mark';
import styles from './FAQ.module.css';

// FAQ no layout do Galvão: coluna esquerda com tag + título empilhado (pintado pela tinta),
// coluna direita com acordeão de linhas finas e ícone +. Uma pergunta aberta por vez.
export function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className={`${styles.section} section-muted`}>
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <p className={styles.tag}>
            <Mark /> <span>/ Dúvidas</span>
            <span className={styles.index}>05</span>
          </p>
          <InkReveal as="h2" variant="letters" className={styles.titleInk} contentClassName={styles.title}>
            <b>Antes</b>
            <span>de</span>
            <span>começar.</span>
          </InkReveal>
        </header>

        <div className={styles.list}>
          {siteConfig.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question} className={styles.item} data-open={isOpen}>
                <h3 className={styles.heading}>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.question}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={styles.panel}
                  inert={!isOpen}
                >
                  <div className={styles.inner}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
