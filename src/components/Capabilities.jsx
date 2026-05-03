import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const capabilities = [
  { id: 'CAP_01', title: 'Systems Programming',      subtitle: 'Low-level · Application · Scripting', skills: ['C', 'C++', 'Embedded C', 'Python', 'MATLAB', 'Bash'],                              color: '#00FFAA', bar: 95, symbol: '</>' },
  { id: 'CAP_02', title: 'Hardware Design',           subtitle: 'Schematic · Layout · Production',      skills: ['KiCad', 'Altium Designer', 'PCB Layout', 'Fusion 360', 'Signal Integrity'],        color: '#00A8FF', bar: 88, symbol: '◈' },
  { id: 'CAP_03', title: 'Embedded Platforms',        subtitle: 'MCU · SBC · FPGA',                    skills: ['STM32 / Cortex-M', 'Jetson Orin Nano', 'Raspberry Pi 4', 'ESP32', 'FPGA (Cyclone V)'], color: '#A855F7', bar: 85, symbol: '◉' },
  { id: 'CAP_04', title: 'Communication Protocols',   subtitle: 'Bus · Serial · Network',               skills: ['CAN (SAE J1939)', 'SPI', 'I2C', 'UART', 'USB', 'MQTT'],                            color: '#F59E0B', bar: 92, symbol: '⌁' },
  { id: 'CAP_05', title: 'Test & Measurement',        subtitle: 'Lab · HIL · Diagnostics',              skills: ['LabVIEW', 'dSPACE', 'CANape', 'CAPL Scripting', 'Oscilloscope', 'Multimeter'],     color: '#00FFAA', bar: 84, symbol: '⚙' },
  { id: 'CAP_06', title: 'AI & Computer Vision',      subtitle: 'Inference · Vision · Edge',            skills: ['TensorFlow Lite', 'TensorRT', 'OpenCV', 'ROS2', 'PilotNet / SSD'],                  color: '#00A8FF', bar: 80, symbol: '◬' },
];

export default function Capabilities() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const heading = container.querySelector('.cap-heading');
    const cards   = container.querySelectorAll('.cap-card');

    gsap.set(heading, { opacity: 0, y: 30 });
    gsap.set(cards,   { opacity: 0, y: 40 });

    // Heading observer
    const headingObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      gsap.to(heading, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      headingObs.disconnect();
    }, { threshold: 0.3 });
    if (heading) headingObs.observe(heading);

    // Per-card observers
    const cardObservers = [];
    cards.forEach((card, i) => {
      const bar = card.querySelector('.prof-fill');
      if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: 'left' });

      const obs = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        gsap.to(card, {
          opacity: 1, y: 0,
          duration: 0.65, delay: (i % 3) * 0.09, ease: 'power3.out',
        });
        if (bar) {
          gsap.to(bar, {
            scaleX: 1,
            duration: 1.1, delay: (i % 3) * 0.09 + 0.2, ease: 'power3.out',
          });
        }
        obs.disconnect();
      }, { threshold: 0.15 });
      obs.observe(card);
      cardObservers.push(obs);
    });

    return () => {
      headingObs.disconnect();
      cardObservers.forEach(o => o.disconnect());
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 w-full bg-[#05070A]">
      <div className="max-w-7xl mx-auto">

        <div className="cap-heading flex items-center gap-4 mb-16">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,170,0.35))' }} />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]">Technical Stack</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(0,255,170,0.35))' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="cap-card group glass glass-hover rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden min-h-[220px] cursor-none interactive transition-all duration-300 hover:-translate-y-2"
              style={{ border: `1px solid ${cap.color}20` }}
            >
              <div className="cap-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${cap.color} 0%, transparent 70%)` }} />
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(to right, ${cap.color}, transparent)` }} />

              <div className="flex items-start justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0 parallax-subtle"
                  style={{ background: `${cap.color}18`, border: `1px solid ${cap.color}30`, color: cap.color }}>
                  {cap.symbol}
                </div>
                <span className="text-[10px] font-mono text-white/20">{cap.id}</span>
              </div>

              <div className="relative z-10">
                <h3 className="text-base font-bold text-white transition-colors hover:text-cyan-400/90 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-default tracking-wide">{cap.title}</h3>
                <p className="text-[10px] font-mono text-white/30 mt-0.5">{cap.subtitle}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 relative z-10">
                {cap.skills.map((skill) => (
                  <span key={skill} className="text-[10px] font-mono px-2 py-1 rounded transition-transform hover:scale-105"
                    style={{ color: `${cap.color}CC`, background: `${cap.color}10`, border: `1px solid ${cap.color}20` }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className="relative z-10 mt-auto">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/25">Proficiency</span>
                  <span className="text-[9px] font-mono" style={{ color: cap.color }}>{cap.bar}%</span>
                </div>
                <div className="h-px w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="prof-fill h-full rounded-full"
                    style={{ width: `${cap.bar}%`, background: `linear-gradient(to right, ${cap.color}, ${cap.color}60)`, boxShadow: `0 0 6px ${cap.color}50` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
