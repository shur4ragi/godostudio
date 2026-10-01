/**
 * GodoStudio v2 — Configuração de conteúdo
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
    labels: ['Engenharia', 'Interfaces', 'Resultados'],
    scrollHint: '/// role para explorar',
  },
  
  manifesto: {
    text: 'Criamos sites que transformam visitantes em clientes. Landing pages profissionais para negócios locais — cafés, estúdios, comércios — com foco em conversão e simplicidade.',
    highlight: 'transformam',
  },
  
  stats: [
    { label: 'Projetos entregues', value: '10+', suffix: '' },
    { label: 'Clientes ativos', value: '4', suffix: '' },
    { label: 'Desde', value: '2024', suffix: '' },
  ],
  
  contact: {
    whatsapp: {
      number: '5512991939876',
      defaultMessage: 'Olá, Vitor! Vim pelo site da GodoStudio e quero um site para o meu negócio.',
    },
    instagram: {
      handle: '@vitor_godo',
      url: 'https://instagram.com/vitor_godo',
    },
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
      screenshot: '/screenshots/fryda-desktop.webp',
      screenshotMobile: '/screenshots/fryda-mobile.webp',
      number: '01',
    },
    {
      id: 'leyas',
      name: "Leya's Café",
      segment: 'Cafeteria',
      description: 'Cardápio, carrinho e pedido pelo WhatsApp',
      url: 'https://leyas-cafe.vercel.app/',
      screenshot: '/screenshots/leyas-desktop.webp',
      screenshotMobile: '/screenshots/leyas-mobile.webp',
      number: '02',
    },
    {
      id: 'nanica',
      name: 'Nanica',
      segment: 'Doceria',
      description: 'Cardápio, carrinho e pedido',
      url: 'https://nanica-ten.vercel.app/',
      screenshot: '/screenshots/nanica-desktop.webp',
      screenshotMobile: '/screenshots/nanica-mobile.webp',
      number: '03',
    },
    {
      id: 'galvao',
      name: 'Galvão Tattoo',
      segment: 'Estúdio',
      description: 'Portfólio e orçamento',
      // TODO: Vitor - confirmar URL live do projeto Galvão Tattoo (repo: github.com/shur4ragi/galvao-tattoo)
      url: null,
      screenshot: '/screenshots/galvao-desktop.webp',
      screenshotMobile: '/screenshots/galvao-mobile.webp',
      number: '04',
    },
  ],
  
  process: [
    {
      number: '01',
      title: 'Descobrir',
      description: 'Entendo seu negócio, público e objetivos numa conversa rápida pelo WhatsApp.',
    },
    {
      number: '02',
      title: 'Prototipar',
      description: 'Em poucos dias você recebe um preview do site para aprovar ou pedir ajustes.',
    },
    {
      number: '03',
      title: 'Construir',
      description: 'Desenvolvo o site com código otimizado, rápido e pronto para conversão.',
    },
    {
      number: '04',
      title: 'Lançar',
      description: 'Site no ar com domínio próprio. Manutenção e atualizações inclusas no plano.',
    },
  ],
  
  plans: [
    {
      id: 'basico',
      name: 'Básico',
      price: 100,
      highlighted: false,
      badge: null,
      // TODO: Vitor - confirmar recursos do plano Básico
      features: [
        'Landing page de uma página',
        'Botão WhatsApp flutuante',
        'Mapa e localização',
        'Hospedagem e domínio inclusos',
        'Ajustes simples sob demanda',
      ],
    },
    {
      id: 'medio',
      name: 'Médio',
      price: 175,
      highlighted: true,
      badge: 'Primeiro mês grátis',
      // TODO: Vitor - confirmar recursos do plano Médio
      features: [
        'Tudo do plano Básico',
        'Cardápio ou catálogo completo',
        'Galeria de fotos/portfólio',
        'Formulário de orçamento/contato',
        'Atualizações mensais inclusas',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 250,
      highlighted: false,
      badge: null,
      // TODO: Vitor - confirmar recursos do plano Premium
      features: [
        'Tudo do plano Médio',
        'Carrinho com pedido pelo WhatsApp',
        'Tour guiado interativo',
        'Prioridade em alterações',
        'Recursos sob medida',
      ],
    },
  ],
  
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
  let message = whatsapp.defaultMessage;
  
  if (planName) {
    message = `Olá, Vitor! Vim pelo site da GodoStudio e tenho interesse no plano ${planName}.`;
  }
  
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
};
