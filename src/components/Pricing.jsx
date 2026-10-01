import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, getWhatsAppLink } from '../data/site';
import styles from './Pricing.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Pricing() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      },
    });

    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
    );

    cardsRef.current.forEach((card) => {
      if (!card) return;
      tl.fromTo(
        card,
        { opacity: 0, y: 50, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'expo.out' },
        `-=${0.4}`
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
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
    <section id="planos" ref={sectionRef} className={`${styles.section} section-dark`}>
      <div className="container">
        <div ref={headerRef} className={styles.header} style={{ opacity: 0 }}>
          <span className={styles.eyebrow}>Planos</span>
          <h2 className={styles.title}>Escolha seu plano</h2>
          <p className={styles.subtitle}>
            Assinatura mensal sem contrato. Cancele quando quiser.
          </p>
        </div>

        <div className={styles.grid}>
          {siteConfig.plans.map((plan, i) => (
            <article
              key={plan.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
              style={{ opacity: 0 }}
            >
              {plan.badge && <span className={styles.badge}>{plan.badge}</span>}

              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatPrice(plan.price)}</span>
                  <span className={styles.period}>/mês</span>
                </div>
              </div>

              <ul className={styles.features}>
                {plan.features.map((feature, j) => (
                  <li key={j} className={styles.feature}>
                    <span className={styles.featureCheck}>✓</span>
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
