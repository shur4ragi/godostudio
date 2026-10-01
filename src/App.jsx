import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Preloader,
  Header,
  Hero,
  Manifesto,
  Stats,
  ProjectsCarousel,
  Process,
  Pricing,
  FAQ,
  Contact,
  ExternalLoader,
  Footer,
} from './components';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const handlePreloaderComplete = () => {
    setReady(true);
  };

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <Header />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Stats />
        <ProjectsCarousel />
        <Process />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ExternalLoader />
    </>
  );
}

export default App;
