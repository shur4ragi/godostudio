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
  },
  
  manifesto: {
    text: 'Criamos sites que transformam visitantes em clientes. Landing pages para cafés, estúdios e comércios — com foco em conversão.',
    highlight: 'transformam',
  },
  
  stats: [
    { label: 'Projetos', value: '10', suffix: '+' },
    { label: 'Clientes', value: '4', suffix: '' },
    { label: 'Desde', value: '2024', suffix: '' },
  ],
  
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
  
  process: [
    {
      number: '01',
      title: 'Descobrir',
      description: 'Entendo seu negócio numa conversa rápida pelo WhatsApp.',
    },
    {
      number: '02',
      title: 'Prototipar',
      description: 'Você recebe um preview para aprovar ou ajustar.',
    },
    {
      number: '03',
      title: 'Construir',
      description: 'Desenvolvo com código otimizado e rápido.',
    },
    {
      number: '04',
      title: 'Lançar',
      description: 'Site no ar com domínio próprio e manutenção inclusa.',
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
