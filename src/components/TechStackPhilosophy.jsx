import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const tools = [
  { name: 'AUTOSAR',      category: 'Standard',    color: '#00FFAA' },
  { name: 'CAN J1939',    category: 'Protocol',    color: '#00FFAA' },
  { name: 'Jetson Nano',  category: 'Hardware',    color: '#00A8FF' },
  { name: 'Raspberry Pi', category: 'Hardware',    color: '#00A8FF' },
  { name: 'FPGA',         category: 'Digital HW',  color: '#A855F7' },
  { name: 'MATLAB',       category: 'Toolchain',   color: '#A855F7' },
  { name: 'LabVIEW',      category: 'Test & Meas', color: '#F59E0B' },
  { name: 'KiCad',        category: 'EDA',         color: '#F59E0B' },
  { name: 'Altium',       category: 'EDA',         color: '#00FFAA' },
  { name: 'dSPACE',       category: 'HIL',         color: '#00A8FF' },
  { name: 'TensorRT',     category: 'Inference',   color: '#A855F7' },
  { name: 'OpenCV',       category: 'Vision',      color: '#F59E0B' },
];

const philosophies = [
  { text: 'Deterministic systems over guesswork',                                 accent: '#00FFAA' },
  { text: 'Hardware-aware software always wins',                                  accent: '#00A8FF' },
  { text: 'Real-time reliability over theoretical perfection',                    accent: '#A855F7' },
  { text: 'From PCB design to AI systems — full-stack engineering mindset',       accent: '#F59E0B' },
  { text: 'Build systems that work in real-world conditions',                     accent: '#00FFAA' },
];

export default function TechStackPhilosophy() {
  const containerRef    = useRef(null);
  const pillsRef        = useRef(null);
  const philosophyRef   = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Tech pills via IntersectionObserver ───────────────────────────────────
    const pillsEl = pillsRef.current;
    if (pillsEl) {
      const pills = pillsEl.querySelectorAll('.tech-pill');
      gsap.set(pills, { opacity: 0, y: 30, scale: 0.92 });

      const pillsObs = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          gsap.to(pills, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, stagger: 0.05, ease: 'power3.out',
          });
          pillsObs.disconnect();
        },
        { threshold: 0.1 }
      );
      pillsObs.observe(pillsEl);
    }

    // ── Philosophy lines via IntersectionObserver ─────────────────────────────
    const philEl = philosophyRef.current;
    if (philEl) {
      const lines      = philEl.querySelectorAll('.philosophy-line');
      const indicators = philEl.querySelectorAll('.line-grow');

      // Initial state — set by GSAP so it can animate them
      gsap.set(lines,      { opacity: 0, x: -40 });
      gsap.set(indicators, { scaleX: 0, transformOrigin: 'left' });

      const philObs = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;

          lines.forEach((line, i) => {
            gsap.to(line, {
              opacity: 1, x: 0,
              duration: 0.9, delay: i * 0.1, ease: 'power3.out',
            });
          });
          gsap.to(indicators, {
            scaleX: 1,
            duration: 0.8, stagger: 0.1, ease: 'power3.out',
          });

          philObs.disconnect();
        },
        { threshold: 0.08 }
      );
      philObs.observe(philEl);
    }

    return () => {};   // observers self-disconnect after firing
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 px-6 w-full bg-[#05070A] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-20">

        {/* ── SYSTEMS I WORK WITH ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,170,0.35))' }} />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]">Systems I Work With</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(0,255,170,0.35))' }} />
          </div>

          <div ref={pillsRef} className="tech-grid flex flex-wrap gap-3 justify-center">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="tech-pill flex flex-col items-center gap-0.5 px-5 py-3.5 rounded-xl"
                style={{
                  background:  `${tool.color}0C`,
                  border:      `1px solid ${tool.color}28`,
                  transition:  'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  cursor:      'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${tool.color}70`;
                  e.currentTarget.style.boxShadow   = `0 0 18px ${tool.color}30`;
                  e.currentTarget.style.transform   = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${tool.color}28`;
                  e.currentTarget.style.boxShadow   = 'none';
                  e.currentTarget.style.transform   = 'scale(1)';
                }}
              >
                <span className="text-sm font-bold" style={{ color: tool.color }}>{tool.name}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/25">{tool.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Watermark word */}
        <div className="relative h-10 flex items-center justify-center overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <span className="text-[8vw] font-black text-white/[0.022] whitespace-nowrap tracking-widest">EMBEDDED SYSTEMS</span>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #05070A, transparent 12%, transparent 88%, #05070A)' }} />
        </div>

        {/* ── ENGINEERING PHILOSOPHY ──────────────────────────────────── */}
        <div ref={philosophyRef}>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(0,168,255,0.35))' }} />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00A8FF]">Engineering Philosophy</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(0,168,255,0.35))' }} />
          </div>

          <div className="flex flex-col gap-0">
            {philosophies.map((p, i) => (
              <div key={i} className="philosophy-line group">
                {/* Growing indicator line */}
                <div
                  className="line-grow h-px mb-4 mt-8"
                  style={{ background: `linear-gradient(to right, ${p.accent}50, transparent 50%)` }}
                />
                <div className="flex items-start gap-5 pb-2">
                  <span
                    className="shrink-0 text-[10px] font-mono pt-1 w-5 text-right"
                    style={{ color: `${p.accent}45` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    className="text-2xl md:text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white flex-1"
                    style={{ cursor: 'default' }}
                  >
                    {p.text}
                  </p>
                  <div
                    className="shrink-0 mt-3 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }}
                  />
                </div>
              </div>
            ))}
            <div className="h-px mt-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>

      </div>
    </section>
  );
}
