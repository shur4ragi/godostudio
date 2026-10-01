import { useState } from 'react';
import { siteConfig } from '../data/site';
import styles from './FAQ.module.css';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2 className={styles.title}>Perguntas frequentes</h2>
          <p className={styles.description}>
            Tudo o que você precisa saber antes de começar.
          </p>
        </div>

        <div className={styles.list}>
          {siteConfig.faq.map((item, index) => (
            <article
              key={index}
              className={`${styles.item} ${openIndex === index ? styles.open : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span>{item.question}</span>
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <div className={styles.answerWrapper}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
