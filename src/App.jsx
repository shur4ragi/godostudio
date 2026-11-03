import { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ExternalLoader } from './components/ExternalLoader';

const BelowFold = lazy(() => import('./BelowFold'));
const CardapioDigital = lazy(() => import('./pages/CardapioDigital'));
const isCardapio = () => /^\/cardapio-digital\/?$/.test(window.location.pathname);
const Footer = lazy(() => import('./BelowFold').then((m) => ({ default: m.Footer })));

function App() {
  const cardapio = isCardapio();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let cleanup = null;
    let alive = true;
    if (cardapio) return undefined;
    import('./smooth').then(({ initSmoothScroll }) => {
      if (alive) cleanup = initSmoothScroll();
    });
    return () => {
      alive = false;
      cleanup?.();
    };
  }, [cardapio]);

  if (cardapio) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <CardapioDigital />
        <ExternalLoader />
      </Suspense>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <BelowFold />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <ExternalLoader />
    </>
  );
}

export default App;
