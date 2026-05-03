import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor        from './components/CustomCursor';
import Hero                from './components/Hero';
import About               from './components/About';
import EngineeringImpact   from './components/EngineeringImpact';
import Capabilities        from './components/Capabilities';
import TechStackPhilosophy from './components/TechStackPhilosophy';
import Experience          from './components/Experience';
import Projects            from './components/Projects';
import Contact             from './components/Contact';
import Footer              from './components/Footer';
import SectionDivider      from './components/SectionDivider';

// Register once — GSAP deduplicates internally, safe at module level
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const progressRef = useRef(null);

  useEffect(() => {
    // ── Lenis smooth scroll ──────────────────────────────────────────────────
    const lenis = new Lenis({
      duration:         1.2,
      easing:           (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureDirection: 'vertical',
      smooth:           true,
      mouseMultiplier:  1,
      smoothTouch:      false,
      touchMultiplier:  2,
      infinite:         false,
    });

    // ── FIX: Store arrow fn reference so cleanup removes the EXACT same fn ──
    // Previously: gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    // Problem:    anonymous fn was added but lenis.raf (different ref) was removed
    // Result:     dead ticker listeners accumulated on every HMR reload
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // Feed lenis scroll position into ScrollTrigger so Hero scrub stays in sync
    lenis.on('scroll', ScrollTrigger.update);

    // ── Progress bar driven by Lenis scroll event (NO ScrollTrigger scrub) ──
    // Previously used scrollTrigger: { scrub: 0.3 } which created a competing
    // animation loop running alongside Hero's scrub — causing micro-stutters.
    const progressEl = progressRef.current;
    if (progressEl) {
      lenis.on('scroll', ({ progress }) => {
        // progress is 0–1, scaleX maps that directly to the bar width
        gsap.set(progressEl, { scaleX: progress });
      });
    }

    // ── Mouse depth tracking ────────────────────────────────────────────────
    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    // CRITICAL: NO overflow-hidden on root div — breaks Hero's ScrollTrigger pin
    // GSAP pin spacer needs unrestricted scroll height measurement on the root
    <div className="relative w-full bg-[#05070A] text-white selection:bg-[#00A8FF] selection:text-black">
      
      {/* Cinematic Noise Overlay */}
      <div className="noise-overlay" />

      {/* Ambient background blobs — CSS-only, GPU compositor, no JS scroll dependency */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0" style={{ overflow: 'hidden' }}>
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(0,255,170,0.055) 0%, transparent 70%)', animation: 'blobDrift1 18s ease-in-out infinite alternate' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ bottom: '5%', right: '-8%', background: 'radial-gradient(circle, rgba(0,168,255,0.05) 0%, transparent 70%)', animation: 'blobDrift2 22s ease-in-out infinite alternate' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ top: '40%', left: '45%', background: 'radial-gradient(circle, rgba(168,85,247,0.035) 0%, transparent 70%)', animation: 'blobDrift3 26s ease-in-out infinite alternate' }} />
      </div>

      <style>{`
        @keyframes blobDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,80px) scale(1.1); } }
        @keyframes blobDrift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-70px,-50px) scale(1.15); } }
        @keyframes blobDrift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-60px) scale(0.9); } }
      `}</style>

      <CustomCursor />

      {/* Scroll progress bar — driven by lenis.on('scroll') not ScrollTrigger */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 w-full h-[2px] z-50 origin-left"
        style={{
          background:  'linear-gradient(to right, #00FFAA, #00A8FF)',
          boxShadow:   '0 0 12px rgba(0,255,170,0.5)',
          transform:   'scaleX(0)',   // initial state — no GSAP needed, plain CSS
        }}
      />

      <main className="relative z-10">
        <Hero />
        
        <SectionDivider label="PROFILE" />
        <About />

        <SectionDivider label="PHILOSOPHY" />
        <TechStackPhilosophy />

        <SectionDivider label="IMPACT" />
        <EngineeringImpact />

        <SectionDivider label="STACK" />
        <Capabilities />

        <SectionDivider label="JOURNEY" />
        <Experience />

        <SectionDivider label="PROJECTS" />
        <Projects />

        <SectionDivider label="CONTACT" />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
