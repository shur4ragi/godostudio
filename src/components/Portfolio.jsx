import { useEffect, useRef } from 'react';
import { siteConfig } from '../data/site';
import styles from './Portfolio.module.css';

export function Portfolio() {
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

  return (
    <section id="portfolio" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Portfólio</span>
          <h2 className={styles.title}>Projetos que geram resultados</h2>
          <p className={styles.description}>
            Conheça alguns dos negócios que já estão vendendo mais com sites profissionais.
          </p>
        </div>

        <div className={styles.grid}>
          {siteConfig.projects.map((project, index) => (
            <article
              key={project.id}
              className={styles.card}
              style={{ '--delay': `${index * 100}ms` }}
            >
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardLink}
                >
                  <CardContent project={project} />
                </a>
              ) : (
                <div className={styles.cardLink}>
                  <CardContent project={project} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardContent({ project }) {
  return (
    <>
      <div className={styles.imageWrapper}>
        <img
          src={project.screenshot}
          alt={`Screenshot de ${project.name}`}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <span className={styles.viewText}>
            {project.url ? 'Ver projeto →' : 'Em breve'}
          </span>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>
    </>
  );
}
