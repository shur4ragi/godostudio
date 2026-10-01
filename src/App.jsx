import { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ExternalLoader } from './components/ExternalLoader';

const BelowFold = lazy(() => import('./BelowFold'));
const Footer = lazy(() => import('./BelowFold').then((m) => ({ default: m.Footer })));

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let cleanup = null;
    let alive = true;
    import('./smooth').then(({ initSmoothScroll }) => {
      if (alive) cleanup = initSmoothScroll();
    });
    return () => {
      alive = false;
      cleanup?.();
    };
  }, []);

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
