/**
 * GodoStudio v3 — Estrutura do conteúdo (ids, links, preços, mídia, mensagens do WhatsApp).
 * Os TEXTOS do site ficam em src/i18n/{pt,en,es}.json (pt = padrão) e são mesclados aqui por
 * useLang().site — arrays por índice, objetos por chave.
 * As mensagens pré-preenchidas do WhatsApp ficam aqui, sempre em português (negócio brasileiro).
 * Linhas marcadas com TODO: precisam de confirmação do Vitor (o texto correspondente está nos JSON).
 */

export const siteConfig = {
  brand: {
    name: 'GodoStudio',
    location: 'Taubaté, SP',
    timezone: 'America/Sao_Paulo',
  },
  
  hero: {
    headline: 'GodoStudio',
  },

  contact: {
    whatsapp: {
      number: '5512991939876',
      label: '+55 12 99193-9876',
      defaultMessage: 'Olá, Vitor! Vim pelo site da GodoStudio e quero um site para o meu negócio.',
    },
    instagram: {
      handle: '@vitor_godo',
      url: 'https://instagram.com/vitor_godo',
    },
    // TODO: Vitor - confirmar horário de atendimento (content.contact.hours)
    city: 'Taubaté — SP',
  },
  
  nav: [
    { href: '#projetos' },
    { href: '#processo' },
    { href: '#planos' },
    { href: '#faq' },
  ],
  
  // Carousel previews: Vitor's 30 s ads (muted). Desktop/tablet (>768px) uses the 16:9 cut,
  // mobile the 9:16 one. `fit: 'contain'` = the clip's aspect differs from the card (only
  // Galvão on mobile now), so it is centred over a tiny pre-blurred `backdrop` image. Clips are only fetched for the active card (see ProjectsCarousel).
  projects: [
    {
      id: 'fryda',
      name: 'Fryda Café',
      url: 'https://fryda-cafe.vercel.app/',
      number: '01',
      preview: {
        desktop: {
          webm: '/previews/fryda-ad-desktop.webm',
          mp4: '/previews/fryda-ad-desktop.mp4',
          poster: '/previews/fryda-ad-desktop-poster.webp',
          w: 768,
          h: 432,
        },
        mobile: {
          webm: '/previews/fryda-ad.webm',
          mp4: '/previews/fryda-ad.mp4',
          poster: '/previews/fryda-ad-poster.webp',
          w: 432,
          h: 768,
        },
      },
    },
    {
      id: 'leyas',
      name: "Leya's Café",
      url: 'https://leyas-cafe.vercel.app/',
      number: '02',
      preview: {
        desktop: {
          webm: '/previews/leyas-ad-desktop.webm',
          mp4: '/previews/leyas-ad-desktop.mp4',
          poster: '/previews/leyas-ad-desktop-poster.webp',
          w: 768,
          h: 432,
        },
        mobile: {
          webm: '/previews/leyas-ad.webm',
          mp4: '/previews/leyas-ad.mp4',
          poster: '/previews/leyas-ad-poster.webp',
          w: 432,
          h: 768,
        },
      },
    },
    {
      id: 'nanica',
      name: 'Nanica',
      url: 'https://nanica-ten.vercel.app/',
      number: '03',
      preview: {
        desktop: {
          webm: '/previews/nanica-ad-desktop.webm',
          mp4: '/previews/nanica-ad-desktop.mp4',
          poster: '/previews/nanica-ad-desktop-poster.webp',
          w: 768,
          h: 432,
        },
        mobile: {
          webm: '/previews/nanica-ad-mobile.webm',
          mp4: '/previews/nanica-ad-mobile.mp4',
          poster: '/previews/nanica-ad-mobile-poster.webp',
          w: 432,
          h: 768,
        },
      },
    },
    {
      id: 'galvao',
      name: 'Galvão Tattoo',
      url: 'https://galvao-tattoo.vercel.app',
      number: '04',
      preview: {
        desktop: {
          webm: '/previews/galvao-ad.webm',
          mp4: '/previews/galvao-ad.mp4',
          poster: '/previews/galvao-ad-poster.webp',
          w: 768,
          h: 432,
        },
        mobile: {
          webm: '/previews/galvao-ad.webm',
          mp4: '/previews/galvao-ad.mp4',
          poster: '/previews/galvao-ad-poster.webp',
          backdrop: '/previews/galvao-ad-backdrop.webp',
          fit: 'contain',
          w: 768,
          h: 432,
        },
      },
    },
  ],
  
  // Processo — "A escada". Durações, entregáveis e rodadas são SUGESTÕES da pesquisa.
  // TODO: Vitor - confirmar durações, entregáveis ("Você recebe") e nº de rodadas de ajustes.
  // TODO: Vitor - confirmar prazo total (content.processIntro.total; a soma das durações dá ≈ 6–9 dias)
  // rulerWeight = tamanho do trecho do passo na régua de tempo (proporcional à duração).
  processIntro: {
    ctaMessage: 'Oi, Vitor! Quero começar o meu site. Meu negócio é ',
  },

  process: [
    { number: '01', rulerWeight: 2, art: 'chat' },
    { number: '02', rulerWeight: 3, art: 'wireframe' },
    { number: '03', rulerWeight: 5, art: 'code' },
    { number: '04', rulerWeight: 1, art: 'browser', live: true },
  ],

  // Planos — cards (Resumo) e tabela (Comparar tudo) saem daqui.
  // TODO: Vitor - confirmar a data de vigência dos preços (content.pricing.validFrom)
  // TODO: Vitor - confirmar "o domínio é seu", o aviso de 30 dias antes de reajuste e a nota ³
  pricing: {
    // {plan} vira o nome do plano (em português) na mensagem do WhatsApp
    planMessage: 'Olá, Vitor! Vim pelo site da GodoStudio e tenho interesse no plano {plan}.',
    trust: [{ icon: 'unlock' }, { icon: 'key' }, { icon: 'bell' }],
    // Notas de rodapé (as marcas ¹ ² ³ nos cards e na tabela apontam para cá).
    footnotes: [{ mark: '¹' }, { mark: '²' }, { mark: '³' }],
  },

  // Recursos dos planos. icon = nome do ícone em PlanIcon.jsx; label/tip ficam nos JSON.
  planFeatures: {
    landing: { icon: 'page' },
    whatsapp: { icon: 'whatsapp' },
    map: { icon: 'pin' },
    hosting: { icon: 'globe', note: '³' },
    tweaks: { icon: 'wrench' },
    catalog: { icon: 'menu' },
    gallery: { icon: 'image' },
    form: { icon: 'form' },
    updates: { icon: 'refresh' },
    cart: { icon: 'cart' },
    tour: { icon: 'compass' },
    priority: { icon: 'bolt' },
    custom: { icon: 'spark' },
  },

  // TODO: Vitor - confirmar "sem taxa de adesão" e os recursos de cada plano
  plans: [
    { id: 'basico', name: 'Básico', price: 100, highlighted: false, features: ['landing', 'whatsapp', 'map', 'hosting', 'tweaks'] },
    // Tudo do plano indicado em `includes` + os recursos abaixo.
    { id: 'medio', name: 'Médio', price: 175, highlighted: true, anchorNote: '¹', includes: 'basico', features: ['catalog', 'gallery', 'form', 'updates'] },
    { id: 'premium', name: 'Premium', price: 250, highlighted: false, includes: 'medio', features: ['cart', 'tour', 'priority', 'custom'] },
  ],

  // Tabela "Comparar tudo": grupos com os recursos acima (só o que já está nos planos).
  compare: {
    groups: [
      { rows: ['landing', 'catalog', 'gallery', 'tour'] },
      { rows: ['whatsapp', 'map', 'form', 'cart'] },
      { rows: ['hosting', 'tweaks', 'updates', 'priority', 'custom'] },
    ],
    conditions: {
      rows: [{}, { note: '¹' }, { note: '²' }],
    },
  },

  // TODO: Vitor - confirmar prazo médio de entrega e detalhes do mês grátis (content.faq)

  seo: {
    ogImage: '/og-image.png',
  },
};

// planName: nome do plano em português (siteConfig.plans[].name), a mensagem é sempre em pt.
export const getWhatsAppLink = (planName = null) => {
  const { whatsapp } = siteConfig.contact;
  const message = planName
    ? siteConfig.pricing.planMessage.replace('{plan}', planName)
    : whatsapp.defaultMessage;
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
};

// Recursos de um plano, incluindo os herdados ("Tudo do plano Básico").
export const planFeatureIds = (planId) => {
  const plan = siteConfig.plans.find((p) => p.id === planId);
  if (!plan) return [];
  return [...(plan.includes ? planFeatureIds(plan.includes) : []), ...plan.features];
};
