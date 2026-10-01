import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Header,
  Hero,
  Manifesto,
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
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return undefined;

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

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
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
