import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Contact() {
  const containerRef = useRef(null);
  const textRef      = useRef(null);
  const labelRef     = useRef(null);
  const subRef       = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial hidden state via GSAP (not inline style)
    gsap.set([labelRef.current, textRef.current, subRef.current], {
      opacity: 0,
      y: 30,
    });

    // IntersectionObserver — no ScrollTrigger, no scroll interference
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Staggered reveal: label → heading → subtitle
          gsap.to(labelRef.current, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          });
          gsap.to(textRef.current, {
            opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.2,
          });
          gsap.to(subRef.current, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.45,
          });

          observer.disconnect();
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden px-6 w-full bg-[#05070A] flex items-center justify-center py-20"
    >
      {/* Green blob */}
      <div
        className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,170,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Blue blob */}
      <div
        className="absolute bottom-10 right-10 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,168,255,0.09) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Centre radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,255,170,0.035) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">

        <span
          ref={labelRef}
          className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]"
        >
          Get in Touch
        </span>

        <h2
          ref={textRef}
          className="text-4xl md:text-6xl xl:text-7xl font-black text-white leading-tight"
        >
          Let&apos;s engineer the{' '}
          <span style={{ color: '#00FFAA', filter: 'drop-shadow(0 0 22px rgba(0,255,170,0.5))' }}>
            future
          </span>{' '}
          of intelligent machines.
        </h2>

        <p
          ref={subRef}
          className="text-[#8892B0] text-base md:text-lg max-w-xl leading-relaxed"
        >
          Open to embedded systems roles, robotics research, and high-stakes engineering challenges.
        </p>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #05070A)' }}
      />
    </section>
  );
}
