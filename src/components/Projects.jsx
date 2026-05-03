import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const projects = [
  {
    id: 'PRJ_01',
    title: 'Autonomous Driving System',
    category: 'Edge AI / Computer Vision',
    description:
      'Engineered a full-stack self-driving pipeline on NVIDIA Jetson Nano using PilotNet for end-to-end lane following and SSD MobileNet for real-time object detection. Re-architected the inference pipeline to achieve a 4× FPS improvement — from 5 to 20 FPS — under constrained edge compute budgets.',
    impact: 'FPS: 5 → 20  ·  4× inference speedup',
    impactColor: '#00FFAA',
    tags: ['Jetson Nano', 'PilotNet', 'SSD MobileNet', 'OpenCV', 'Python', 'TensorRT'],
    accentColor: '#00FFAA',
  },
  {
    id: 'PRJ_02',
    title: 'FPGA Traffic Controller',
    category: 'Digital Logic / FPGA',
    description:
      'Designed a deterministic traffic-light state machine entirely in Verilog, synthesized and deployed to FPGA. Eliminates OS scheduling jitter — every state transition is clock-cycle precise. Implemented fault-safe fallback modes compliant with IEC 61508 SIL-2 requirements.',
    impact: 'Zero-jitter  ·  μs-precision state transitions',
    impactColor: '#00A8FF',
    tags: ['Verilog', 'FPGA', 'State Machines', 'IEC 61508', 'Quartus'],
    accentColor: '#00A8FF',
  },
  {
    id: 'PRJ_03',
    title: 'JARVIS — Voice-Driven IoT Hub',
    category: 'IoT / Embedded Automation',
    description:
      'Built a fully local voice-activated automation hub on Raspberry Pi 4 — no cloud dependency. Custom wake-word detection, NLP parsing, and hardware GPIO bridging enable real-time command execution across smart home and lab devices. OTA updates deployed via lightweight MQTT broker.',
    impact: '100% local inference  ·  <150ms command latency',
    impactColor: '#A855F7',
    tags: ['Raspberry Pi', 'Python', 'MQTT', 'GPIO', 'Local NLP', 'OTA'],
    accentColor: '#A855F7',
  },
  {
    id: 'PRJ_04',
    title: 'Active Noise Cancellation Engine',
    category: 'DSP / Signal Processing',
    description:
      'Implemented a real-time Filtered-X LMS adaptive ANC algorithm on a bare-metal ARM Cortex-M4. Achieved 18 dB attenuation in the 200–1500 Hz band with under 2ms algorithmic latency. Written entirely in optimized C using CMSIS-DSP intrinsics for maximum throughput.',
    impact: '18 dB attenuation  ·  <2ms processing latency',
    impactColor: '#F59E0B',
    tags: ['Cortex-M4', 'C', 'CMSIS-DSP', 'FxLMS', 'Bare-Metal', 'Real-Time'],
    accentColor: '#F59E0B',
  },
  {
    id: 'PRJ_05',
    title: 'Multi-Sensor Fusion DAQ System',
    category: 'Embedded Systems / Research',
    description:
      'Designed a custom 8-channel data acquisition board in KiCad with synchronized ADC sampling for IMU, LiDAR, and ultrasonic sensors. Firmware written in C on STM32 with DMA-driven SPI transfers and timestamped telemetry streamed over UART to ROS2 on Raspberry Pi 4.',
    impact: '120ms → 38ms pipeline latency  ·  8-channel sync',
    impactColor: '#00FFAA',
    tags: ['STM32', 'KiCad', 'DMA / SPI', 'ROS2', 'C', 'IMU / LiDAR'],
    accentColor: '#00FFAA',
  },
];

export default function Projects() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const label = container.querySelector('.projects-label');
    const cards = container.querySelectorAll('.project-card');

    gsap.set(label, { opacity: 0, y: 30 });

    const labelObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      gsap.to(label, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      labelObs.disconnect();
    }, { threshold: 0.3 });
    if (label) labelObs.observe(label);

    const cardObservers = [];
    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 60, scale: 0.96 });
      const tags = card.querySelectorAll('.project-tag');
      if (tags.length > 0) gsap.set(tags, { scale: 0.75, opacity: 0 });

      const obs = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        
        gsap.to(card, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, ease: 'power3.out'
        });

        if (tags.length > 0) {
          gsap.to(tags, {
            scale: 1, opacity: 1,
            duration: 0.45, stagger: 0.07, ease: 'back.out(1.7)',
            delay: 0.2
          });
        }
        
        obs.disconnect();
      }, { threshold: 0.1 });
      
      obs.observe(card);
      cardObservers.push(obs);
    });

    return () => {
      labelObs.disconnect();
      cardObservers.forEach(o => o.disconnect());
    };
  }, []);

  return (
    <section id="projects" className="py-24 px-6 w-full bg-[#05070A]" ref={containerRef}>
      <div className="max-w-7xl mx-auto">

        <div className="projects-label flex items-center gap-4 mb-20">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00FFAA]/30" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#00FFAA]">
            High-Impact Projects
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00FFAA]/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card glass glass-hover rounded-3xl flex flex-col justify-between min-h-[420px] overflow-hidden group interactive transition-all duration-500 hover:-translate-y-2"
              style={{
                border: `1px solid ${project.accentColor}18`,
                boxShadow: `inset 0 0 0 1px ${project.accentColor}10`,
              }}
            >
              <div
                className="h-[2px] w-full"
                style={{ background: `linear-gradient(to right, ${project.accentColor}, transparent)` }}
              />

              <div className="p-10 flex flex-col gap-5 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded"
                    style={{ color: project.accentColor, background: `${project.accentColor}15`, border: `1px solid ${project.accentColor}30` }}
                  >
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-white/20">{project.id}</span>
                </div>

                <h3
                  className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.4)] cursor-default parallax-subtle"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
                >
                  {project.title}
                </h3>

                <p className="text-[#8892B0] text-sm leading-relaxed flex-1">
                  {project.description}
                </p>

                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold w-fit"
                  style={{
                    color: project.impactColor,
                    background: `${project.impactColor}12`,
                    border: `1px solid ${project.impactColor}30`,
                  }}
                >
                  <span>⚡</span>
                  {project.impact}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="project-tag text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-md text-white/50 transition-all hover:scale-105 hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
