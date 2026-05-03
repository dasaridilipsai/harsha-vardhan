import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function SectionDivider({ label = 'SYSTEMS' }) {
  const ref     = useRef(null);
  const lineRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    gsap.set(lineRef.current, { scaleX: 0, opacity: 0, transformOrigin: 'center' });
    gsap.set(textRef.current, { opacity: 0, y: 15 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        
        gsap.to(lineRef.current, {
          scaleX: 1, opacity: 1,
          duration: 1.6, ease: 'power3.out'
        });
        
        gsap.to(textRef.current, {
          opacity: 1, y: 0,
          duration: 1.2, ease: 'power2.out',
          delay: 0.3
        });
        
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full py-16 flex flex-col items-center justify-center overflow-hidden bg-transparent select-none pointer-events-none"
      aria-hidden="true"
    >
      <span
        ref={textRef}
        className="parallax-subtle text-[8vw] md:text-[6vw] font-black tracking-[0.3em] uppercase absolute z-0"
        style={{
          color: 'rgba(255, 255, 255, 0.03)', // text-white/5 approx
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      <div
        ref={lineRef}
        className="relative z-10 w-full max-w-5xl h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>
  );
}
