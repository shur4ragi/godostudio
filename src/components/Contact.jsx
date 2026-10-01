import { useState } from 'react';
import { siteConfig } from '../data/site';
import { openWithLoader, whatsappUrl } from '../utils/external';
import { Mark } from './Mark';
import styles from './Contact.module.css';

const { contact, contactForm } = siteConfig;

// (12) 99193-9876 enquanto digita.
function maskPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function buildMessage({ name, phone, business, plan, idea }) {
  return [
    'Olá, Vitor! Vim pelo site da GodoStudio e quero um site para o meu negócio.',
    `Nome: ${name}`,
    phone && `WhatsApp: ${phone}`,
    business && `Tipo de negócio: ${business}`,
    plan && `Plano: ${plan}`,
    `Ideia: ${idea}`,
  ]
    .filter(Boolean)
    .join('\n');
}

const EMPTY = { name: '', phone: '', business: '', plan: '', idea: '' };

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

// Contato + orçamento no layout do Galvão Tattoo: dados à esquerda, formulário à direita.
// O envio monta a mensagem e abre o WhatsApp pela tela de carregamento (ExternalLoader).
export function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    const value = field === 'phone' ? maskPhone(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Conte como podemos te chamar.';
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) next.phone = 'Confira o número com DDD.';
    if (form.idea.trim().length < 8) next.idea = 'Escreva um pouco sobre o seu negócio e o site.';
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`contato-${first}`)?.focus();
      return;
    }
    const message = buildMessage({ ...form, name: form.name.trim(), idea: form.idea.trim() });
    openWithLoader(whatsappUrl(contact.whatsapp.number, message));
  };

  const errorProps = (field) => ({
    id: `contato-${field}`,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `erro-${field}` : undefined,
  });

  return (
    <section id="contato" className={styles.section}>
      <div className="container">
        <p className={styles.kicker}>
          <Mark /> <span>/ Contato</span>
          <span className={styles.kickerIndex}>06</span>
        </p>

        <div className={styles.grid}>
          <div className={styles.side}>
            <h2 className={styles.title}>
              Vamos criar seu site <span className={styles.sign}>agora</span>
            </h2>
            <p className={styles.lead}>
              Conte o que o seu negócio faz e o que precisa no site. O Vitor responde pelo WhatsApp com a
              proposta e o plano ideal.
            </p>

            <dl className={styles.info}>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={whatsappUrl(contact.whatsapp.number, contact.whatsapp.defaultMessage)} target="_blank" rel="noopener noreferrer">
                    {contact.whatsapp.label}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a className={styles.social} href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon /> {contact.instagram.handle}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Atendimento</dt>
                <dd>{contact.hours}</dd>
              </div>
              <div>
                <dt>Local</dt>
                <dd>{contact.city}</dd>
              </div>
            </dl>
          </div>

          <form className={styles.form} onSubmit={submit} noValidate aria-labelledby="orcamento-titulo">
            <p id="orcamento-titulo" className={styles.formTitle}>
              Pedir orçamento
            </p>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Nome *</span>
                <input {...errorProps('name')} value={form.name} onChange={set('name')} autoComplete="name" placeholder="Como te chamamos" required />
                {errors.name && <em id="erro-name">{errors.name}</em>}
              </label>
              <label className={styles.field}>
                <span>WhatsApp</span>
                <input
                  {...errorProps('phone')}
                  value={form.phone}
                  onChange={set('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(12) 99999-9999"
                />
                {errors.phone && <em id="erro-phone">{errors.phone}</em>}
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Tipo de negócio</span>
                <select value={form.business} onChange={set('business')} className={form.business ? '' : styles.placeholder}>
                  <option value="">Escolha</option>
                  {contactForm.businessTypes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>Plano</span>
                <select value={form.plan} onChange={set('plan')} className={form.plan ? '' : styles.placeholder}>
                  <option value="">Escolha</option>
                  {contactForm.plans.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Sua ideia *</span>
              <textarea
                {...errorProps('idea')}
                value={form.idea}
                onChange={set('idea')}
                rows={4}
                placeholder="O que o seu negócio faz e o que o site precisa ter."
                required
              />
              {errors.idea && <em id="erro-idea">{errors.idea}</em>}
            </label>

            <button type="submit" className={styles.submit}>
              <WhatsAppIcon />
              Enviar pelo WhatsApp
            </button>
            <p className={styles.hint}>A mensagem abre pronta no WhatsApp. Fotos e referências você manda por lá.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
