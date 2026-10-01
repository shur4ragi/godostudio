/**
 * GodoStudio v3 — Configuração de conteúdo
 * Edite este arquivo para atualizar textos, projetos, planos e contato.
 * Linhas marcadas com TODO: precisam de confirmação do Vitor.
 */

export const siteConfig = {
  brand: {
    name: 'GodoStudio',
    tagline: 'Sites que vendem.',
    location: 'Taubaté, SP',
    timezone: 'America/Sao_Paulo',
  },
  
  hero: {
    headline: 'GodoStudio',
    subtitle: 'Sites profissionais para negócios locais',
    highlight: 'negócios locais',
    lead: 'Landing pages para cafés, estúdios e comércios locais, com foco em conversão. Assinatura mensal a partir de R$ 100.',
  },
  
  manifesto: {
    text: 'Criamos sites que transformam visitantes em clientes. Landing pages para cafés, estúdios e comércios — com foco em conversão.',
    highlight: 'transformam',
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
    // TODO: Vitor - confirmar horário de atendimento
    hours: 'Pelo WhatsApp, com hora marcada',
    city: 'Taubaté — SP',
  },
  
  contactForm: {
    businessTypes: [
      'Cafeteria',
      'Doceria / Confeitaria',
      'Restaurante / Lanchonete',
      'Estúdio / Tattoo',
      'Salão / Barbearia',
      'Loja / Comércio',
      'Serviços',
      'Outro',
    ],
    plans: ['Básico', 'Médio', 'Premium', 'Ainda não sei'],
  },

  nav: [
    { label: 'Projetos', href: '#projetos' },
    { label: 'Processo', href: '#processo' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
  ],
  
  projects: [
    {
      id: 'fryda',
      name: 'Fryda Café',
      segment: 'Cafeteria',
      description: 'Cardápio e encomenda pelo WhatsApp',
      url: 'https://fryda-cafe.vercel.app/',
      number: '01',
      preview: {
        desktop: {
          webm: '/previews/fryda-desktop.webm',
          mp4: '/previews/fryda-desktop.mp4',
          poster: '/previews/fryda-desktop-poster.webp',
        },
        mobile: {
          webm: '/previews/fryda-mobile.webm',
          mp4: '/previews/fryda-mobile.mp4',
          poster: '/previews/fryda-mobile-poster.webp',
        },
      },
    },
    {
      id: 'leyas',
      name: "Leya's Café",
      segment: 'Cafeteria',
      description: 'Cardápio, carrinho e pedido pelo WhatsApp',
      url: 'https://leyas-cafe.vercel.app/',
      number: '02',
      preview: {
        desktop: {
          webm: '/previews/leyas-desktop.webm',
          mp4: '/previews/leyas-desktop.mp4',
          poster: '/previews/leyas-desktop-poster.webp',
        },
        mobile: {
          webm: '/previews/leyas-mobile.webm',
          mp4: '/previews/leyas-mobile.mp4',
          poster: '/previews/leyas-mobile-poster.webp',
        },
      },
    },
    {
      id: 'nanica',
      name: 'Nanica',
      segment: 'Doceria',
      description: 'Cardápio, carrinho e pedido',
      url: 'https://nanica-ten.vercel.app/',
      number: '03',
      preview: {
        desktop: {
          webm: '/previews/nanica-desktop.webm',
          mp4: '/previews/nanica-desktop.mp4',
          poster: '/previews/nanica-desktop-poster.webp',
        },
        mobile: {
          webm: '/previews/nanica-mobile.webm',
          mp4: '/previews/nanica-mobile.mp4',
          poster: '/previews/nanica-mobile-poster.webp',
        },
      },
    },
    {
      id: 'galvao',
      name: 'Galvão Tattoo',
      segment: 'Estúdio',
      description: 'Portfólio e orçamento',
      url: 'https://galvao-tattoo.vercel.app',
      number: '04',
      preview: {
        desktop: {
          webm: '/previews/galvao-desktop.webm',
          mp4: '/previews/galvao-desktop.mp4',
          poster: '/previews/galvao-desktop-poster.webp',
        },
        mobile: null, // No mobile version - use desktop with object-fit
      },
    },
  ],
  
  // Processo — "A escada". Durações, entregáveis e rodadas são SUGESTÕES da pesquisa.
  // TODO: Vitor - confirmar durações, entregáveis ("Você recebe") e nº de rodadas de ajustes.
  // rulerWeight = tamanho do trecho do passo na régua de tempo (proporcional à duração).
  processIntro: {
    title: 'Como funciona',
    subtitle: 'do primeiro oi ao site no ar',
    // TODO: Vitor - confirmar prazo total (a soma das durações abaixo dá ≈ 6–9 dias)
    total: '≈ 7–10 dias',
    rulerLabel: 'Do primeiro oi ao site no ar',
    closing: 'Do primeiro oi ao site no ar em cerca de 7 a 10 dias.',
    cta: 'Começar pelo passo 01',
    ctaMessage: 'Oi, Vitor! Quero começar o meu site. Meu negócio é ',
  },

  process: [
    {
      number: '01',
      title: 'Descobrir',
      duration: '≈ 1 dia',
      rulerWeight: 2,
      art: 'chat',
      headline: 'Um papo sobre o seu negócio',
      description: 'Conversamos pelo WhatsApp sobre o que você vende e quem é o seu cliente. No fim, você sabe qual plano faz sentido.',
      deliverables: ['Resumo do projeto', 'Plano recomendado'],
      youDo: 'Me manda logo, fotos e cardápio — o que já tiver.',
    },
    {
      number: '02',
      title: 'Prototipar',
      duration: '≈ 2–3 dias',
      rulerWeight: 3,
      art: 'wireframe',
      headline: 'Você vê o site antes',
      description: 'Monto uma prévia com as suas cores, textos e fotos. Você navega pelo celular como se já estivesse no ar.',
      deliverables: ['Link da prévia', '2 rodadas de ajustes'],
      youDo: 'Me diz o que mudar — pode ser por áudio.',
    },
    {
      number: '03',
      title: 'Construir',
      duration: '≈ 3–5 dias',
      rulerWeight: 5,
      art: 'code',
      headline: 'Código leve e rápido',
      description: 'Desenvolvo o site de verdade: rápido no 4G, com WhatsApp, mapa e o que o seu plano incluir.',
      deliverables: ['Versão final', 'Teste de velocidade', 'SEO básico'],
      youDo: 'Só uma última olhada e o ok.',
    },
    {
      number: '04',
      title: 'Lançar',
      duration: 'Contínuo',
      live: true,
      rulerWeight: 1,
      art: 'browser',
      headline: 'No ar, com o seu domínio',
      description: 'Publico com domínio próprio e cadeado de segurança (HTTPS). Depois, a manutenção mensal está inclusa.',
      deliverables: ['Site publicado', 'Domínio e hospedagem', 'Manutenção mensal'],
      youDo: 'Compartilha o link no Instagram e no Google. Pronto! 🎉',
    },
  ],

  // Planos — cards (Resumo) e tabela (Comparar tudo) saem daqui.
  pricing: {
    subtitle: 'Assinatura mensal, sem fidelidade. Cancele quando quiser.',
    // TODO: Vitor - confirmar a data de vigência dos preços
    validFrom: 'Preços válidos desde 10/2026',
    // {plan} vira o nome do plano na mensagem do WhatsApp
    planMessage: 'Olá, Vitor! Vim pelo site da GodoStudio e tenho interesse no plano {plan}.',
    // Faixa de confiança abaixo da tabela.
    trust: [
      { icon: 'unlock', text: 'Sem fidelidade' },
      // TODO: Vitor - confirmar "o domínio é seu" (registrado no nome do cliente)
      { icon: 'key', text: 'O domínio é seu' },
      // TODO: Vitor - confirmar o aviso de 30 dias antes de reajuste
      { icon: 'bell', text: 'Aviso com 30 dias se o preço mudar' },
    ],
    // Notas de rodapé (as marcas ¹ ² ³ nos cards e na tabela apontam para cá).
    footnotes: [
      { mark: '¹', text: 'Plano Médio: você usa o site completo durante 30 dias sem pagar nada. A cobrança começa no segundo mês. Sem compromisso.' },
      { mark: '²', text: 'Sem fidelidade nem multa. Para pausar ou cancelar, é só avisar.' },
      // TODO: Vitor - confirmar (sugestão da pesquisa)
      { mark: '³', text: 'Domínio próprio (seunegocio.com.br) registrado no seu nome.' },
    ],
  },

  // Recursos dos planos. icon = nome do ícone em PlanIcon.jsx; tip = explicação no "?" da tabela.
  planFeatures: {
    landing: { label: 'Landing page de uma página', icon: 'page', tip: 'Um site de uma página só, com tudo o que o seu cliente precisa ver antes de chamar no WhatsApp.' },
    whatsapp: { label: 'Botão WhatsApp flutuante', icon: 'whatsapp' },
    map: { label: 'Mapa e localização', icon: 'pin' },
    hosting: { label: 'Hospedagem e domínio inclusos', icon: 'globe', note: '³', tip: 'O endereço seunegocio.com.br e o servidor onde o site fica no ar.' },
    tweaks: { label: 'Ajustes simples sob demanda', icon: 'wrench' },
    catalog: { label: 'Cardápio ou catálogo completo', icon: 'menu' },
    gallery: { label: 'Galeria de fotos/portfólio', icon: 'image' },
    form: { label: 'Formulário de orçamento/contato', icon: 'form' },
    updates: { label: 'Atualizações mensais inclusas', icon: 'refresh' },
    cart: { label: 'Carrinho com pedido pelo WhatsApp', icon: 'cart' },
    tour: { label: 'Tour guiado interativo', icon: 'compass' },
    priority: { label: 'Prioridade em alterações', icon: 'bolt' },
    custom: { label: 'Recursos sob medida', icon: 'spark' },
  },

  plans: [
    {
      id: 'basico',
      name: 'Básico',
      price: 100,
      highlighted: false,
      badge: null,
      persona: 'Pra quem precisa existir no Google e no WhatsApp.',
      // TODO: Vitor - confirmar "sem taxa de adesão"
      anchor: 'Sem taxa de adesão',
      // TODO: Vitor - confirmar recursos do plano Básico
      features: ['landing', 'whatsapp', 'map', 'hosting', 'tweaks'],
    },
    {
      id: 'medio',
      name: 'Médio',
      price: 175,
      highlighted: true,
      badge: 'Mais escolhido',
      persona: 'Pra quem quer mostrar o cardápio/catálogo e receber pedidos de orçamento.',
      anchor: '1º mês: R$ 0 · você economiza R$ 175',
      anchorNote: '¹',
      barNote: '1º mês grátis',
      // Tudo do plano indicado + os recursos abaixo.
      includes: 'basico',
      // TODO: Vitor - confirmar recursos do plano Médio
      features: ['catalog', 'gallery', 'form', 'updates'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 250,
      highlighted: false,
      badge: null,
      persona: 'Pra quem quer vender pelo site e ter prioridade.',
      // TODO: Vitor - confirmar "sem taxa de adesão"
      anchor: 'Sem taxa de adesão',
      includes: 'medio',
      // TODO: Vitor - confirmar recursos do plano Premium
      features: ['cart', 'tour', 'priority', 'custom'],
    },
  ],

  // Tabela "Comparar tudo": grupos com os recursos acima (só o que já está nos planos).
  compare: {
    title: 'Compare todos os recursos',
    groups: [
      { title: 'O site', rows: ['landing', 'catalog', 'gallery', 'tour'] },
      { title: 'Contato e vendas', rows: ['whatsapp', 'map', 'form', 'cart'] },
      { title: 'Hospedagem e manutenção', rows: ['hosting', 'tweaks', 'updates', 'priority', 'custom'] },
    ],
    // Linhas de texto (valor por plano). {price} = preço do plano.
    conditions: {
      title: 'Condições',
      rows: [
        { label: 'Mensalidade', values: { basico: 'R$ 100', medio: 'R$ 175', premium: 'R$ 250' } },
        { label: 'Primeiro mês', note: '¹', values: { basico: 'R$ 100', medio: 'R$ 0', premium: 'R$ 250' } },
        { label: 'Fidelidade', note: '²', values: { basico: 'Nenhuma', medio: 'Nenhuma', premium: 'Nenhuma' } },
      ],
    },
  },

  faq: [
    {
      question: 'Qual o prazo de entrega do site?',
      // TODO: Vitor - confirmar prazo médio de entrega
      answer: 'Sites simples ficam prontos em até 7 dias úteis. Projetos maiores podem levar de 2 a 3 semanas, dependendo da complexidade.',
    },
    {
      question: 'Posso usar meu próprio domínio?',
      answer: 'Sim! Se você já tem um domínio, configuramos tudo pra você. Se não tem, ajudo a registrar um novo.',
    },
    {
      question: 'Posso cancelar quando quiser?',
      answer: 'Pode sim. Não tem fidelidade nem multa. Se quiser pausar ou cancelar, é só avisar.',
    },
    {
      question: 'Quem atualiza o conteúdo do site?',
      answer: 'Eu cuido das atualizações pra você. Basta mandar as alterações por WhatsApp e faço a mudança.',
    },
    {
      question: 'Como funciona o mês grátis do plano Médio?',
      // TODO: Vitor - confirmar detalhes da promoção do mês grátis
      answer: 'Você usa o site completo durante 30 dias sem pagar nada. Se gostar, a cobrança começa no segundo mês. Sem compromisso.',
    },
    {
      question: 'O site fica hospedado onde?',
      answer: 'Na Vercel, uma das melhores plataformas do mundo. Seu site carrega rápido e fica no ar 24 horas.',
    },
  ],

  seo: {
    title: 'GodoStudio — Sites para Negócios Locais em Taubaté',
    description: 'Landing pages profissionais para cafés, estúdios e comércios locais. Assinatura mensal a partir de R$ 100. Sem complicação.',
    ogImage: '/og-image.png',
  },
};

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
