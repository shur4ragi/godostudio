// Saídas do site (WhatsApp, Instagram, sites de clientes) passam pela tela de
// carregamento do ExternalLoader — mesmo padrão do site do Galvão Tattoo.

export const EXTERNAL_EVENT = 'godostudio:external';

export function whatsappUrl(phone, message = '') {
  const base = `https://wa.me/${String(phone).replace(/\D/g, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Tipo do destino, ou null quando o link é interno.
export function kindOf(href = '') {
  if (href.includes('wa.me') || href.includes('api.whatsapp.com')) return 'whatsapp';
  if (href.includes('instagram.com') || href.includes('instagr.am')) return 'instagram';
  try {
    const url = new URL(href, window.location.href);
    if (/^https?:$/.test(url.protocol) && url.origin !== window.location.origin) return 'site';
  } catch {
    // href inválido: deixa o navegador lidar
  }
  return null;
}

// Pede a tela de carregamento quando não há um <a> clicado (ex.: o formulário de contato).
export function openWithLoader(href) {
  window.dispatchEvent(new CustomEvent(EXTERNAL_EVENT, { detail: { href } }));
}

// Abre o destino depois da espera. Passado o tempo, o clique já não conta como gesto do
// usuário e o navegador pode bloquear a nova aba (Safari/iOS, navegadores de apps): aí segue
// na mesma aba.
export function openExternal(href) {
  const win = window.open(href, '_blank');
  if (win) {
    try {
      win.opener = null;
    } catch {
      // sem acesso ao opener: a aba já abriu
    }
    return;
  }
  window.location.assign(href);
}
