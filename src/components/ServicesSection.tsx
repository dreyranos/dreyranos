import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Plus,
  Minus,
  Play,
  Maximize2,
  Film,
} from 'lucide-react';
import { SERVICES_LIST } from '../data/portfolio';
import { AnimatedRule, RollingText, ScrollRevealWords } from './AquaEffects';
import FlowVideoSimulator from './FlowVideoSimulator';
import { prefillAndScrollToContact, smoothScrollTo } from '../utils/navigation';

export default function ServicesSection() {
  const [expandedIndex, setExpandedIndex] = useState<string | null>('01.');
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const flowStageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: rawProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.25,
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 36,
    stiffness: 260,
  });
  const velocitySkew = useTransform(smoothVelocity, [-1600, 1600], [-6.5, 6.5]);

  const leftDrift = useTransform(scrollYProgress, [0, 1], [-56, 56]);
  const rightDrift = useTransform(scrollYProgress, [0, 1], [56, -56]);

  const handleLaunchFlow = (serviceIndex: string) => {
    flushSync(() => {
      setHoveredIndex(null);
      setActiveFlowId(serviceIndex);
    });
    const stageEl = flowStageRef.current;
    if (stageEl && !document.fullscreenElement) {
      stageEl.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <section
      ref={sectionRef}
      id="atuacao"
      className="relative py-20 sm:py-28 bg-[#08080E]/82 text-[#F5F4FA] overflow-x-clip"
    >
      {/* Fullscreen Deep Obsidian-Black Veil on Service Hover */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-[#040308] pointer-events-none z-[15] transition-opacity duration-500 ${
          hoveredIndex && !activeFlowId ? 'opacity-85' : 'opacity-0'
        }`}
      />

      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 relative z-[20]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 pb-5"
        >
          <div>
            <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-white">
              <ScrollRevealWords text="02. Áreas de Atuação" />
            </h2>
            <p className="text-xs font-mono-tabular text-[#8E89A3] mt-1">
              Cada especialidade possui um fluxo demonstrativo animado em tela cheia
            </p>
          </div>
          <a
            href="#trajetoria"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('#trajetoria');
            }}
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-wider text-[#9B86D6] hover:text-white transition-colors"
          >
            <RollingText text="Trajetória Profissional" />
            <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>
        <AnimatedRule dark className="mb-14 sm:mb-20" />

        {/* Staggered Monumental Services List */}
        <div className="flex flex-col gap-10 sm:gap-14">
          {SERVICES_LIST.map((service) => {
            const isOpen = expandedIndex === service.index;
            const isRight = service.align === 'right';
            const isHovered = hoveredIndex === service.index;
            const dimmed = hoveredIndex !== null && !isHovered;

            return (
              <motion.div
                key={service.index}
                style={{
                  x: isRight ? rightDrift : leftDrift,
                  skewX: velocitySkew,
                }}
                whileHover={{ scale: 1.018 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIndex(service.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative transition-opacity duration-300 will-change-transform ${
                  isHovered ? 'z-[25]' : 'z-[18]'
                } ${dimmed ? 'opacity-25' : 'opacity-100'}`}
              >
                {/* Service Row Meta Bar + Quick Video Flow Trigger */}
                <div
                  className={`flex flex-wrap items-center gap-3 mb-2 text-xs font-mono-tabular tracking-wider uppercase ${
                    isRight ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleLaunchFlow(service.index)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#4C1D95]/65 bg-[#110C1D] text-[#9B86D6] hover:bg-[#4C1D95] hover:text-white hover:border-[#826BC2] transition-colors"
                    title={`Assistir fluxo demonstrativo em vídeo: ${service.line1} ${service.line2}`}
                  >
                    <Film className="w-3 h-3" />
                    <span>Fluxo em Vídeo</span>
                    <Maximize2 className="w-2.5 h-2.5 opacity-80" />
                  </button>

                  <span
                    className={`transition-colors duration-300 ${
                      isHovered
                        ? 'text-[#9B86D6]'
                        : isOpen
                        ? 'text-[#826BC2]'
                        : 'text-[#8E89A3]'
                    }`}
                  >
                    {service.index} {service.highlights.join(' · ')}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedIndex(isOpen ? null : service.index)
                    }
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? `Recolher detalhes de ${service.line1} ${service.line2}`
                        : `Expandir detalhes de ${service.line1} ${service.line2}`
                    }
                    className={`inline-flex items-center justify-center w-6 h-6 border transition-colors ${
                      isHovered
                        ? 'border-[#826BC2] text-white bg-[#4C1D95]/55'
                        : 'border-white/25 text-[#F5F4FA]'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Monumental Interactive Headline */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedIndex(isOpen ? null : service.index)
                  }
                  aria-expanded={isOpen}
                  className={`w-full group flex flex-col ${
                    isRight ? 'items-end text-right' : 'items-start text-left'
                  } focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#826BC2]`}
                >
                  <h3
                    className={`font-display font-bold uppercase tracking-[-0.03em] text-[clamp(2rem,6.2vw,5.5rem)] leading-[0.88] transition-colors duration-300 ${
                      isHovered ? 'text-[#9B86D6]' : 'text-white'
                    }`}
                  >
                    <span className="block overflow-hidden">
                      <RollingText text={service.line1} />
                    </span>
                    <span className="block">{service.line2}</span>
                  </h3>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        clipPath: 'inset(0% 0% 100% 0%)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        clipPath: 'inset(0% 0% 0% 0%)',
                      }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        clipPath: 'inset(0% 0% 100% 0%)',
                      }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                      className={`mt-4 max-w-2xl ${
                        isRight ? 'ml-auto text-right' : 'mr-auto text-left'
                      }`}
                    >
                      <p className="text-[15px] sm:text-[17px] leading-[1.65] text-[#C4C0D4]">
                        {service.summary}
                      </p>

                      <div
                        className={`mt-4 flex flex-wrap gap-3 ${
                          isRight ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleLaunchFlow(service.index)}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                            isHovered
                              ? 'bg-[#5B21B6] text-white border-[#826BC2] hover:bg-[#4C1D95]'
                              : 'bg-[#4C1D95] text-white border-[#5B21B6] hover:bg-[#5B21B6]'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Assistir Fluxo em Vídeo (5 cenas)</span>
                          <Maximize2 className="w-3.5 h-3.5 opacity-80" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            prefillAndScrollToContact(
                              service.index === '03.'
                                ? 'Consultoria em Legado'
                                : 'Projeto Sob Demanda',
                              `Olá Andrey! Gostaria de conversar sobre ${service.line1} ${service.line2} (${service.highlights.join(', ')}).`
                            )
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/25 text-[#F5F4FA] hover:border-[#826BC2] hover:text-[#9B86D6] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Conversar sobre esta frente</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Explanatory Flow Video Simulator triggered per Service Area */}
      <FlowVideoSimulator
        open={Boolean(activeFlowId)}
        initialProgramId={activeFlowId ?? '01.'}
        stageRef={flowStageRef}
        onClose={() => setActiveFlowId(null)}
      />
    </section>
  );
}
