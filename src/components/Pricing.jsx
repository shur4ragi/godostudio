import { useEffect, useRef } from 'react';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Pricing.module.css';

export function Pricing() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll(`.${styles.card}`);
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="planos" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Planos</span>
          <h2 className={styles.title}>Escolha o plano ideal para seu negócio</h2>
          <p className={styles.description}>
            Assinatura mensal sem contrato. Cancele quando quiser.
          </p>
        </div>

        <div className={styles.grid}>
          {siteConfig.plans.map((plan, index) => (
            <article
              key={plan.id}
              className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
              style={{ '--delay': `${index * 100}ms` }}
            >
              {plan.badge && (
                <div className={styles.badge}>{plan.badge}</div>
              )}
              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceWrapper}>
                  <span className={styles.price}>{formatPrice(plan.price)}</span>
                  <span className={styles.period}>/mês</span>
                </div>
              </div>

              <ul className={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i} className={styles.feature}>
                    <svg
                      className={styles.checkIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={getWhatsAppLink(plan.name)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.cta} ${plan.highlighted ? styles.ctaHighlighted : ''}`}
              >
                Quero o {plan.name}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
