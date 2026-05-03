import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const impacts = [
  { metric: '120ms → 38ms', label: 'Sensor Latency',      description: 'Interrupt-driven firmware rewrite on Raspberry Pi 4 cut end-to-end sensor pipeline latency by 68%.', color: '#00FFAA', icon: '⚡' },
  { metric: '5 → 20 FPS',   label: 'Autonomous Inference', description: 'TensorRT optimization + quantization on Jetson Nano achieved a 4× realtime improvement for lane detection.', color: '#00A8FF', icon: '🤖' },
  { metric: '30% Faster',   label: 'ECU Integration',      description: 'Modular AUTOSAR SWC architecture at Caterpillar reduced cross-team integration cycles by nearly a third.', color: '#A855F7', icon: '🔧' },
  { metric: '18 dB',        label: 'Noise Attenuation',    description: 'FxLMS adaptive algorithm on bare-metal Cortex-M4, achieving broadband attenuation across 200–1500 Hz.', color: '#F59E0B', icon: '📡' },
  { metric: '80% Less',     label: 'Manual Monitoring',    description: 'MQTT-based IoT telemetry with automated alerting eliminated manual site-checks across 12 aquafarm sites.', color: '#00FFAA', icon: '📊' },
  { metric: '< 2ms',        label: 'DSP Latency',          description: 'Real-time signal processing pipeline with CMSIS-DSP intrinsics running deterministically on ARM core.', color: '#00A8FF', icon: '🎛️' },
];

export default function EngineeringImpact() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const label   = container.querySelector('.impact-label');
    const cards   = container.querySelectorAll('.impact-card');

    gsap.set(label, { opacity: 0, y: 30 });
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.96 });

    // Label
    const labelObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      gsap.to(label, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      labelObs.disconnect();
    }, { threshold: 0.3 });
    if (label) labelObs.observe(label);

    // Cards — each individually
    const cardObservers = [];
    cards.forEach((card, i) => {
      const metric = card.querySelector('.impact-metric');
      if (metric) gsap.set(metric, { opacity: 0, scale: 0.75, y: 20 });

      const obs = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        gsap.to(card, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75, delay: (i % 3) * 0.08, ease: 'power3.out',
        });
        if (metric) {
          gsap.to(metric, {
            opacity: 1, scale: 1, y: 0,
            duration: 0.6, delay: (i % 3) * 0.08 + 0.15, ease: 'back.out(1.4)',
          });
        }
        obs.disconnect();
      }, { threshold: 0.15 });
      obs.observe(card);
      cardObservers.push(obs);
    });

    return () => {
      labelObs.disconnect();
      cardObservers.forEach(o => o.disconnect());
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 w-full bg-[#05070A] relative overflow-hidden">

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[18vw] font-black text-white/[0.018] whitespace-nowrap leading-none">IMPACT</span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="impact-label flex items-center gap-4 mb-20">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00FFAA]/30" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]">Engineering Impact</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00FFAA]/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impacts.map((item, i) => (
            <div
              key={i}
              className="impact-card group glass glass-hover rounded-2xl p-8 flex flex-col gap-4 relative overflow-hidden cursor-none interactive transition-all duration-300 hover:-translate-y-2"
              style={{ border: `1px solid ${item.color}18` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }} />
              <span className="text-2xl parallax-subtle">{item.icon}</span>
              <div className="impact-metric flex flex-col gap-1">
                <span className="text-4xl md:text-5xl font-black tracking-tight transition-all duration-300 hover:drop-shadow-[0_0_15px_currentColor] cursor-default"
                  style={{ color: item.color, textShadow: `0 0 30px ${item.color}50` }}>
                  {item.metric}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: `${item.color}90` }}>
                  {item.label}
                </span>
              </div>
              <p className="text-[#8892B0] text-sm leading-relaxed mt-auto">{item.description}</p>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}10 0%, transparent 70%)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
