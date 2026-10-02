# GodoStudio

Portfólio e landing page da GodoStudio — sites profissionais para negócios locais em Taubaté-SP.

## Stack

- **Vite** + **React** — build rápido e DX moderna
- **CSS Modules** — estilos encapsulados sem dependências externas
- **CSS + IntersectionObserver** — animações leves, sem libs pesadas

## Rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Abrir http://localhost:5173
```

## Build para produção

```bash
npm run build

# Os arquivos ficam na pasta dist/
```

## Deploy na Vercel

1. Conectar o repositório na [Vercel](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

O site é 100% estático e deploya automaticamente a cada push.

## Editar conteúdo

Todo o conteúdo editável está em um único arquivo:

```
src/data/site.js
```

### O que você pode alterar:

- **Textos** — headline, subtítulos, descrições
- **Projetos** — nome, descrição, URL, screenshots
- **Planos** — nome, preço, recursos (features)
- **FAQ** — perguntas e respostas
- **Contato** — WhatsApp, Instagram
- **SEO** — título, descrição, OG image

Linhas marcadas com `// TODO:` precisam de confirmação antes de ir ao ar.

### Adicionar novo projeto

1. Capture screenshots (desktop e mobile) e salve em `public/screenshots/`
2. Adicione a entrada no array `projects` em `src/data/site.js`:

```js
{
  id: 'nome-projeto',
  name: 'Nome do Projeto',
  description: 'Tipo • O que faz',
  url: 'https://url-do-projeto.vercel.app/',
  screenshot: '/screenshots/nome-projeto-desktop.webp',
  screenshotMobile: '/screenshots/nome-projeto-mobile.webp',
}
```

## Estrutura de pastas

```
├── public/
│   ├── screenshots/     # Screenshots dos projetos
│   ├── favicon.svg
│   └── og-image.png
├── src/
│   ├── components/      # Componentes React + CSS Modules
│   ├── data/
│   │   └── site.js      # Conteúdo editável
│   ├── index.css        # Variáveis CSS globais
│   ├── App.jsx          # Componente raiz
│   └── main.jsx         # Entry point
├── scripts/             # Scripts utilitários (captura de screenshots)
└── index.html           # HTML com meta tags SEO
```

## Lint

```bash
npm run lint
```

Usa [oxlint](https://oxc.rs/docs/guide/usage/linter.html) para checagem rápida.

## Licença

Propriedade de Vitor Godo / GodoStudio.
