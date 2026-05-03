import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function EndingTransition() {
  const ref     = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    gsap.set(textRef.current, { opacity: 0, y: 30 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'center' });

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 2.0,
        ease: 'power2.out',
      });

      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 1.6,
        ease: 'power3.out',
        delay: 0.4,
      });

      observer.disconnect();
    }, { threshold: 0.1 });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full bg-[#05070A] overflow-hidden pointer-events-none select-none py-12"
      aria-hidden="true"
    >
      <div
        ref={textRef}
        className="flex items-center justify-center"
      >
        <span
          className="text-[6vw] md:text-[5vw] font-black tracking-[0.18em] uppercase whitespace-nowrap"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.05)',
          }}
        >
          LET&apos;S BUILD SYSTEMS
        </span>
      </div>

      <div
        ref={lineRef}
        className="mx-auto mt-6"
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(0,255,170,0.5), rgba(0,168,255,0.5), transparent)',
          boxShadow: '0 0 10px rgba(0,168,255,0.2)',
        }}
      />
    </div>
  );
}
