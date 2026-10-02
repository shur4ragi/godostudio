import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerLenis } from './scrollLock';

gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll driven by the GSAP ticker (loaded after first paint).
export function initSmoothScroll() {
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
  registerLenis(lenis);
  const onTick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(onTick);
    registerLenis(null);
    lenis.destroy();
  };
}
