import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Utility: split text into char spans for stagger ─────────────────────────
function splitChars(text) {
  return text.split('').map((char, i) => (
    <span
      key={i}
      className="char inline-block"
      style={{ willChange: 'transform, opacity' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

export default function Hero() {
  const containerRef  = useRef(null);
  const canvasRef     = useRef(null);
  const textRef       = useRef(null);
  const overlayRef    = useRef(null);
  const imagesRef     = useRef([]);

  useEffect(() => {
    let isCancelled  = false;
    let loaded       = 0;
    let failed       = 0;
    const frameCount = 60;
    const imgs       = [];

    /* ── Canvas setup ────────────────────────────────────────────────────── */
    const canvas = canvasRef.current;
    if (!canvas) return;

    // desynchronized = GPU path, bypasses JS thread for compositing
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

    const resizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imagesRef.current.length > 0) renderFrame(0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ── Cover-fit render ────────────────────────────────────────────────── */
    function renderFrame(index) {
      if (isCancelled || !imagesRef.current.length) return;
      const img = imagesRef.current[Math.floor(index)];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const dx = (canvas.width  - img.width  * scale) / 2;
      const dy = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, img.width * scale, img.height * scale);
    }

    /* ── Char-level entrance animation ───────────────────────────────────── */
    function runTextEntrance() {
      if (!textRef.current) return;
      const chars = textRef.current.querySelectorAll('.char');
      gsap.fromTo(chars,
        { opacity: 0, y: 40, rotateX: -60 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.025,
          delay: 0.3,
          transformOrigin: 'center bottom',
          perspective: 600,
        }
      );
      // Subtitle fade-up after chars
      const subtitle = textRef.current.querySelector('.hero-subtitle');
      const tags      = textRef.current.querySelector('.hero-tags');
      gsap.fromTo([subtitle, tags],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.9 }
      );
    }

    /* ── Scroll-based text fade + parallax ───────────────────────────────── */
    function addScrollParallax() {
      if (!textRef.current || !containerRef.current) return;
      gsap.to(textRef.current, {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=40%',
          scrub: 0.8,
        }
      });
    }

    /* ── Canvas scroll + zoom ─────────────────────────────────────────────── */
    function startCanvasAnimation() {
      if (isCancelled || !containerRef.current) return;
      const existing = ScrollTrigger.getById('hero-scroll');
      if (existing) existing.kill();

      const frame = { value: 0 };

      gsap.to(frame, {
        value: imagesRef.current.length - 1,
        ease: 'none',
        scrollTrigger: {
          id: 'hero-scroll',
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
        onUpdate: () => {
          requestAnimationFrame(() => renderFrame(frame.value));
        }
      });

      // Subtle canvas zoom driven by scroll progress
      gsap.to(canvas, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: true,
        }
      });

      // Dynamic overlay brightens as sequence progresses
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: true,
          }
        });
      }
    }

    /* ── Image preloading ─────────────────────────────────────────────────── */
    function onImageSettled() {
      if (loaded + failed < frameCount) return;
      console.log(`📊 Hero frames: ${loaded} loaded / ${failed} failed`);
      if (loaded === 0) {
        console.error('⛔ No frames loaded – animation aborted.');
        return;
      }
      imagesRef.current = imgs;
      renderFrame(0);
      runTextEntrance();
      startCanvasAnimation();
      addScrollParallax();
    }

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(3, '0')}.jpg`;
      img.onload  = () => { if (!isCancelled) { loaded++; onImageSettled(); } };
      img.onerror = () => { if (!isCancelled) { failed++; console.warn(`⚠️ Missing: ${img.src}`); onImageSettled(); } };
      imgs.push(img);
    }

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resizeCanvas);
      ScrollTrigger.getById('hero-scroll')?.kill();
    };
  }, []);

  return (
    <>
      <style>{`
        .hero-text { pointer-events: none; }
        .char { display: inline-block; will-change: transform, opacity; }
        canvas { transform-origin: center center; }
      `}</style>

      <section
        ref={containerRef}
        className="relative overflow-hidden w-full h-screen bg-[#05070A] flex items-center justify-center"
      >
        {/* ── LAYER 1: Canvas (z-0) ────────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
          style={{ background: '#05070A' }}
        />

        {/* ── LAYER 2: Cinematic lighting overlay (z-10) ─────────────────── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            opacity: 0.5,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%,   rgba(0,168,255,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.9)      0%, transparent 70%),
              linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 40%, rgba(5,7,10,0.88) 100%)
            `
          }}
        />

        {/* ── LAYER 3: Text (z-30) ─────────────────────────────────────────── */}
        <div
          ref={textRef}
          className="hero-text absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 text-center px-6"
        >
          {/* Name — character stagger */}
          <h1
            className="text-5xl md:text-[4.5rem] xl:text-8xl font-black tracking-tight text-white leading-none"
            style={{ textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,168,255,0.12)' }}
          >
            {splitChars('Veera Harsha Vardhan')}
            <br />
            {splitChars('Jilludimudi')}
          </h1>

          {/* Role – gradient */}
          <h2
            className="hero-subtitle text-2xl md:text-4xl xl:text-5xl font-bold text-[#E0E0E0]"
            style={{
              opacity: 0,
              filter: 'drop-shadow(0 0 20px rgba(0,168,255,0.45))',
              letterSpacing: '-0.01em',
            }}
          >
            Robotics &amp; Embedded Systems Engineer
          </h2>

          {/* Specializations */}
          <div
            className="hero-tags flex flex-wrap justify-center gap-3"
            style={{ opacity: 0 }}
          >
            {['Embedded SW', 'AUTOSAR / CAN', 'PCB Design', 'Edge AI', 'FPGA'].map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono uppercase tracking-widest text-[#FFFFFF] border border-blue-500/20 rounded-full px-4 py-1.5 bg-white/5 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/50">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}
