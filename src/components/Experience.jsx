import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const experiences = [
  {
    role: 'Embedded Software Engineer',
    company: 'Caterpillar Inc.',
    location: 'USA',
    date: '2023 — Present',
    type: 'Full-time',
    color: '#00FFAA',
    highlights: [
      'Architected AUTOSAR BSW/SWC modules for next-gen ECU platforms, reducing integration time by 30%.',
      'Implemented SAE J1939 CAN protocol stack for heavy-equipment diagnostics across distributed ECU networks.',
      'Designed HIL test benches in MATLAB/Simulink to validate ECU control logic before hardware availability.',
      'Developed UDS diagnostic services (0x22, 0x2E, 0x31) for ECU calibration and field service tooling.',
      'Collaborated cross-functionally with mechanical and safety teams to meet ISO 26262 ASIL-B requirements.',
      'Owned fault detection and DTC management pipeline — reducing field-reported ECU failures by 22% in first year.',
      'Built automated regression test suite in Python (CANalyzer + CAPL scripting) covering 400+ test vectors.',
    ]
  },
  {
    role: 'Graduate Research Assistant',
    company: 'Colorado State University',
    location: 'Fort Collins, CO',
    date: '2022 — 2023',
    type: 'Research',
    color: '#00A8FF',
    highlights: [
      'Designed multi-sensor fusion pipelines (IMU, LiDAR, ultrasonic) for autonomous ground vehicle research.',
      'Built real-time data acquisition and telemetry system using Python and ROS2 on Raspberry Pi 4.',
      'Published findings on sensor latency compensation in low-power embedded contexts.',
      'Reduced system latency from 120ms to 38ms through interrupt-driven firmware optimizations.',
      'Designed custom DAQ board (KiCad) with 8-channel ADC for synchronized high-frequency sensor capture.',
    ]
  },
  {
    role: 'Embedded Systems Developer',
    company: 'Aquafarm Automation India',
    location: 'India',
    date: '2020 — 2022',
    type: 'Full-time',
    color: '#00FFAA',
    highlights: [
      'Built end-to-end IoT monitoring system for large-scale aquafarm operations across 12 remote sites.',
      'Designed custom PCBs for water quality sensors (pH, DO, temperature) using KiCad and JLCPCB.',
      'Implemented MQTT-based telemetry pipeline with OTA firmware update capability over 4G LTE.',
      'Reduced manual monitoring overhead by 80% through automated alert and control workflows.',
    ]
  }
];

export default function Experience() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const label    = container.querySelector('.exp-section-label');
    const line     = container.querySelector('.timeline-line');
    const dots     = container.querySelectorAll('.timeline-dot');
    const cards    = container.querySelectorAll('.timeline-card');

    // Set initial states
    gsap.set(label, { opacity: 0, y: 30 });
    gsap.set(line,  { scaleY: 0, transformOrigin: 'top' });
    gsap.set(dots,  { scale: 0, opacity: 0 });

    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, x: 0 });
      gsap.set(card.querySelectorAll('.bullet-point'), { opacity: 0, x: -20 });
    });

    // Label observer
    const labelObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      gsap.to(label, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      labelObs.disconnect();
    }, { threshold: 0.3 });
    if (label) labelObs.observe(label);

    // Timeline line + dots observer
    const timelineEl = container.querySelector('.timeline-container');
    const timelineObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      gsap.to(line, { scaleY: 1, duration: 1.8, ease: 'power3.out' });
      gsap.to(dots, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.3, delay: 0.2 });
      timelineObs.disconnect();
    }, { threshold: 0.05 });
    if (timelineEl) timelineObs.observe(timelineEl);

    // Each card individually
    const cardObservers = [];
    cards.forEach((card, i) => {
      const obs = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        gsap.to(card, {
          opacity: 1, x: 0,
          duration: 1.0, ease: 'power3.out',
        });
        const bullets = card.querySelectorAll('.bullet-point');
        if (bullets.length > 0) {
          gsap.to(bullets, {
            opacity: 1, x: 0,
            duration: 0.6, stagger: 0.07, ease: 'power2.out', delay: 0.3,
          });
        }
        obs.disconnect();
      }, { threshold: 0.1 });
      obs.observe(card);
      cardObservers.push(obs);
    });

    return () => {
      labelObs.disconnect();
      timelineObs.disconnect();
      cardObservers.forEach(o => o.disconnect());
    };
  }, []);

  return (
    <section className="py-24 px-6 w-full bg-[#05070A]" ref={containerRef}>
      <div className="max-w-4xl mx-auto">

        <div className="exp-section-label flex items-center gap-4 mb-20">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00FFAA]/30" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]">Experience Architecture</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00FFAA]/30" />
        </div>

        <div className="timeline-container relative ml-4 md:ml-0">
          <div className="timeline-line absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#00FFAA]/40 via-[#00A8FF]/30 to-transparent origin-top" />

          {experiences.map((exp, index) => (
            <div key={index} className="timeline-card mb-20 pl-10 relative">
              <div
                className="timeline-dot absolute -left-[5.5px] top-3 w-3 h-3 rounded-full"
                style={{ background: exp.color, boxShadow: `0 0 0 4px ${exp.color}18, 0 0 20px ${exp.color}80` }}
              />
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded"
                    style={{ color: exp.color, background: `${exp.color}15`, border: `1px solid ${exp.color}30` }}>
                    {exp.type}
                  </span>
                  <span className="text-xs font-mono text-white/30">{exp.date}</span>
                  <span className="text-xs font-mono text-white/25">· {exp.location}</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{exp.role}</h3>
                  <p className="text-base font-medium mt-1" style={{ color: exp.color }}>{exp.company}</p>
                </div>
                <ul className="mt-3 flex flex-col gap-3">
                  {exp.highlights.map((item, i) => (
                    <li key={i} className="bullet-point flex items-start gap-3 text-[#8892B0] text-sm leading-relaxed">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: exp.color, boxShadow: `0 0 6px ${exp.color}` }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
