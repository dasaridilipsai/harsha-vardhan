import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = container.querySelectorAll('.animate-line');
    const highlights = container.querySelectorAll('.highlight-text');
    const stats = container.querySelectorAll('.stat-block');

    // Set initial states via GSAP (not ScrollTrigger)
    gsap.set(lines, { opacity: 0, y: 45 });
    gsap.set(highlights, { filter: 'brightness(0.55)' });
    gsap.set(stats, { opacity: 0, y: 30 });

    // ── IntersectionObserver for the whole About section ──────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Sentences: cascade fade-up
          lines.forEach((line, i) => {
            gsap.to(line, {
              opacity: 1,
              y: 0,
              duration: 1.0,
              delay: i * 0.14,
              ease: 'power3.out',
            });
          });

          // Highlights: gentle brightness lift
          gsap.to(highlights, {
            filter: 'brightness(1)',
            duration: 1.3,
            delay: 0.2,
            ease: 'power2.out',
            stagger: 0.18,
          });

          // Stats: float up
          stats.forEach((block, i) => {
            gsap.to(block, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.6 + i * 0.1,
              ease: 'power3.out',
            });
          });

          // Fire once, then disconnect
          observer.disconnect();
        });
      },
      { threshold: 0.12 }  // triggers when 12% of section is visible
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full py-24 px-6 bg-[#05070A] overflow-hidden"
    >
      {/* Background watermark */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 text-[20vw] font-black text-white/[0.015] whitespace-nowrap pointer-events-none select-none leading-none"
        aria-hidden="true"
      >
        ENGINEER
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00FFAA]/30" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]">About</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00FFAA]/30" />
        </div>

        {/* ── Four editorial sentences ─────────────────────────────────────── */}
        <div className="flex flex-col gap-10 text-2xl md:text-4xl lg:text-[2.6rem] font-medium leading-[1.25] text-[#8892B0] tracking-tight">

          <p className="animate-line text-white font-semibold">
            I build systems that operate at the intersection of hardware and intelligence.
          </p>

          <p className="animate-line">
            With{' '}
            <span className="highlight-text inline-block font-bold text-[#00FFAA]">
              4+ years of engineering
            </span>
            {' '}across automotive, robotics, and industrial automation — I specialize in
            turning hardware constraints into elegant software solutions.
          </p>

          <p className="animate-line">
            From{' '}
            <span className="highlight-text inline-block font-bold text-[#00FFAA]">
              AUTOSAR ECU stacks
            </span>
            {' '}at Caterpillar to{' '}
            <span className="highlight-text inline-block font-bold text-[#00A8FF]">
              AI-driven autonomous systems
            </span>
            {' '}on Jetson Nano — I operate at every layer of the stack.
          </p>

          <p className="animate-line">
            The goal is always the same:{' '}
            <span className="highlight-text inline-block font-bold text-white">
              systems that are deterministic, reliable, and production-grade.
            </span>
          </p>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────────── */}
        <div className="about-stats grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/8">
          {[
            { value: '4+', label: 'Years Engineering', color: '#00FFAA' },
            { value: '3', label: 'Industries Shipped', color: '#00A8FF' },
            { value: '10+', label: 'ECU Modules Written', color: '#A855F7' },
            { value: '4×', label: 'AI Inference Speedup', color: '#F59E0B' },
          ].map((stat) => (
            <div key={stat.label} className="stat-block flex flex-col gap-2">
              <span
                className="text-4xl md:text-5xl font-black"
                style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}60` }}
              >
                {stat.value}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
