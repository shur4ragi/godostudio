import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReveal } from './reveal';
import { Manifesto } from './components/Manifesto';
import { ProjectsCarousel } from './components/ProjectsCarousel';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';

export { Footer } from './components/Footer';

// Everything below the hero lives in its own chunk and mounts one section per idle slot,
// top to bottom, so first paint and the hero entrance are not blocked by one long
// style/layout task. Each section's ScrollTriggers are created after the content above it.
const SECTIONS = [Manifesto, ProjectsCarousel, Process, Pricing, FAQ, Contact];

const idle = (fn) =>
  'requestIdleCallback' in window
    ? window.requestIdleCallback(fn, { timeout: 350 })
    : window.setTimeout(fn, 32);
const cancelIdle = (id) =>
  'cancelIdleCallback' in window ? window.cancelIdleCallback(id) : window.clearTimeout(id);

export default function BelowFold() {
  const [count, setCount] = useState(1);

  useEffect(() => initReveal(document.body), []);

  useEffect(() => {
    if (count < SECTIONS.length) {
      const id = idle(() => setCount((c) => c + 1));
      return () => cancelIdle(id);
    }
    ScrollTrigger.refresh();
    const { hash } = window.location;
    if (hash.length > 1) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView();
    }
    return undefined;
  }, [count]);

  return SECTIONS.slice(0, count).map((Section) => <Section key={Section.name} />);
}
