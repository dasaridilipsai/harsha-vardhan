import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Footer() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll('.footer-reveal');

    // Set initial hidden state via GSAP — not inline style, not ScrollTrigger
    gsap.set(items, { opacity: 0, y: 30 });

    // IntersectionObserver — zero ScrollTrigger, zero scroll interference
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        gsap.to(items, {
          opacity:  1,
          y:        0,
          duration: 0.8,
          stagger:  0.15,
          ease:     'power2.out',
        });

        observer.disconnect();
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const linkStyle = {
    display:        'inline-block',
    padding:        '0.55rem 1.4rem',
    borderRadius:   '9999px',
    border:         '1px solid rgba(255,255,255,0.18)',
    color:          '#ffffff',
    fontSize:       '0.85rem',
    fontWeight:     500,
    textDecoration: 'none',
    backdropFilter: 'blur(8px)',
    transition:     'border-color 0.25s, box-shadow 0.25s',
  };

  const hoverOn  = (e) => { e.currentTarget.style.borderColor = '#22d3ee'; e.currentTarget.style.boxShadow = '0 0 18px rgba(34,211,238,0.3)'; };
  const hoverOff = (e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.boxShadow = 'none'; };

  return (
    <footer
      ref={ref}
      style={{ position: 'relative', zIndex: 10, marginTop: 0, paddingTop: '4rem', paddingBottom: '4rem', background: '#05070A', textAlign: 'center', overflow: 'hidden' }}
    >
      {/* Top gradient line */}
      <div style={{ width: '100%', height: '1px', marginBottom: '3rem', background: 'linear-gradient(to right, transparent, rgba(0,255,170,0.5), rgba(0,168,255,0.5), transparent)', boxShadow: '0 0 12px rgba(0,168,255,0.2)' }} />

      {/* Soft backdrop */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '500px', height: '180px', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(0,168,255,0.07) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>

        <h2 className="footer-reveal" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#cbd5e1', margin: 0 }}>
          Veera Harsha Vardhan Jilludimudi
        </h2>

        <p className="footer-reveal" style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#00FFAA', margin: 0 }}>
          Robotics &amp; Embedded Systems Engineer
        </p>

        <div className="footer-reveal" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://github.com/ashpika40"            target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>GitHub</a>
          <a href="https://linkedin.com/in/harshajilludimudi" target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>LinkedIn</a>
          <a href="mailto:harsha.jilludimudi@gmail.com"     style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Email</a>
        </div>

        <div className="footer-reveal" style={{ width: '6rem', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

        <p className="footer-reveal" style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
          © 2026 Veera Harsha Vardhan Jilludimudi
        </p>
      </div>
    </footer>
  );
}
