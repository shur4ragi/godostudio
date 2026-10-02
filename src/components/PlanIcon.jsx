// Ícones de linha (24×24, traço 1.6) dos benefícios dos planos — um por recurso, como o Itaú
// faz nos cards de conta, em vez do ✓ genérico.
const PATHS = {
  page: 'M6 3h9l3 3v15H6zM15 3v3h3M9 11h6M9 15h6',
  whatsapp: 'M4.5 19.5l1.2-3.9A8 8 0 1 1 8.6 18.4zM9.2 8.6c0 3.3 2.9 6.2 6.2 6.2l1-1.5-2-1-1 .8a4.4 4.4 0 0 1-2.4-2.4l.8-1-1-2z',
  pin: 'M12 21s-6-5.7-6-11a6 6 0 0 1 12 0c0 5.3-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.7 3.6 5.7 3.6 9s-1.1 6.3-3.6 9c-2.5-2.7-3.6-5.7-3.6-9S9.5 5.7 12 3z',
  wrench: 'M14.5 5.5a4 4 0 0 0 4.9 4.9L11 18.8a2.1 2.1 0 0 1-3-3l8.4-8.4a4 4 0 0 1-1.9-1.9zM14.5 5.5 17 3l1.6 3.4L22 8l-2.6 2.4',
  menu: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
  image: 'M4 5h16v14H4zM4 16l4.5-4.5 3.5 3.5 2.5-2.5L20 18M15.5 9.5a1 1 0 1 0 0-.1',
  form: 'M5 4h14v16H5zM8 8h8M8 11.5h8M8 15h4M14 15.5l1.3 1.3L18 14',
  refresh: 'M19 8a7.5 7.5 0 0 0-13.5 1M5 16a7.5 7.5 0 0 0 13.5-1M19 4v4h-4M5 20v-4h4',
  cart: 'M3 4h2.5l2.2 10.5h10L20 7H6.4M9.5 19.5a1 1 0 1 0 0-.1M16.5 19.5a1 1 0 1 0 0-.1',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6z',
  spark: 'M12 3c.6 4.7 4.3 8.4 9 9-4.7.6-8.4 4.3-9 9-.6-4.7-4.3-8.4-9-9 4.7-.6 8.4-4.3 9-9z',
  unlock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 6.8-1.2M12 15v2',
  key: 'M8 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM11.5 12H21M18 12v3M15 12v2',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  plus: 'M12 5v14M5 12h14',
};

export function PlanIcon({ name, size = 18, className = '' }) {
  const d = PATHS[name] || PATHS.spark;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
