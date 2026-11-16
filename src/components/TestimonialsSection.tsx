import { useState, useRef, useEffect, type MouseEvent } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowUpRight,
  MousePointer2,
} from 'lucide-react';
import { TESTIMONIALS, type TestimonialItem } from '../data/portfolio';
import { AnimatedRule, ScrollRevealWords } from './AquaEffects';
import { prefillAndScrollToContact } from '../utils/navigation';

function InteractiveTestimonialCard({
  item,
  isSelected,
  onSelect,
}: {
  item: TestimonialItem;
  isSelected: boolean;
  onSelect: (item: TestimonialItem) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 22 });

  const [pointer, setPointer] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawRotateY.set((px - 0.5) * 16);
    rawRotateX.set((0.5 - py) * 16);
    setPointer({ x: px * 100, y: py * 100, active: true });
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    setPointer((prev) => ({ ...prev, active: false }));
  };

  return (
    <div style={{ perspective: 1100 }} className="w-[310px] sm:w-[390px] lg:w-[430px] shrink-0">
      <motion.button
        ref={cardRef}
        type="button"
        onClick={() => onSelect(item)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-pressed={isSelected}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className={`group relative w-full h-full min-h-[300px] sm:min-h-[320px] text-left p-6 sm:p-7 border flex flex-col justify-between transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#826BC2] ${
          isSelected
            ? 'bg-[#120C21] border-[#826BC2] shadow-[0_20px_50px_-18px_rgba(76,29,149,0.55)]'
            : 'bg-[#0C0B12] border-white/12 hover:border-[#5B21B6]/75'
        }`}
      >
        {/* Dynamic Mouse-Tracking Obsidian-Purple Spotlight */}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: pointer.active ? 1 : 0,
              background: `radial-gradient(300px circle at ${pointer.x}% ${pointer.y}%, rgba(91, 33, 182, 0.34), rgba(59, 7, 100, 0.12) 45%, transparent 72%)`,
            }}
          />
        )}

        {/* Mouse-Reactive Top Edge Specular Beam */}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
            style={{
              opacity: pointer.active || isSelected ? 1 : 0,
              background: pointer.active
                ? `radial-gradient(180px circle at ${pointer.x}% 0%, #9B86D6, #4C1D95 60%, transparent 100%)`
                : 'linear-gradient(90deg, #3B0764, #826BC2, #3B0764)',
            }}
          />
        )}

        {/* Top Meta Bar */}
        <div
          className="relative z-10 flex items-center justify-between gap-3 pb-4 border-b border-white/10"
          style={shouldReduceMotion ? undefined : { transform: 'translateZ(14px)' }}
        >
          <span className="font-mono-tabular text-[11px] uppercase tracking-[0.16em] text-[#9B86D6]">
            {item.index} · {item.track}
          </span>
          <Quote
            className={`w-4 h-4 transition-colors shrink-0 ${
              isSelected || pointer.active ? 'text-[#9B86D6]' : 'text-[#4C1D95]'
            }`}
          />
        </div>

        {/* Quote Body */}
        <blockquote
          className="relative z-10 my-5 text-[14.5px] sm:text-[15.5px] leading-[1.65] text-[#E6E3F0]"
          style={shouldReduceMotion ? undefined : { transform: 'translateZ(22px)' }}
        >
          “{item.quote}”
        </blockquote>

        {/* Footer Author + Outcome */}
        <div
          className="relative z-10 pt-4 border-t border-white/10 space-y-3"
          style={shouldReduceMotion ? undefined : { transform: 'translateZ(16px)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#3B0764] border border-[#826BC2]/45 text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
                {item.initials}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm text-white truncate">
                  {item.author}
                </p>
                <p className="text-xs text-[#A49EB8] truncate">{item.role}</p>
              </div>
            </div>
            <span className="font-mono-tabular text-[11px] text-[#8E89A3] shrink-0">
              {item.year}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular bg-[#08070E] border border-[#4C1D95]/35 px-3 py-2">
            <span className="text-[#9B86D6] truncate">{item.outcome}</span>
            <span className="text-[#8E89A3] shrink-0 group-hover:text-white transition-colors">
              {isSelected ? 'Em foco' : 'Detalhes'}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
}

export default function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string>(TESTIMONIALS[0].id);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const trackX = useMotionValue(0);

  const selectedItem =
    TESTIMONIALS.find((t) => t.id === selectedId) ?? TESTIMONIALS[0];

  const duplicatedItems = [...TESTIMONIALS, ...TESTIMONIALS];

  // Measure seamless loop boundary (50% of duplicated track)
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Continuous infinite carousel animation via rAF
  useEffect(() => {
    if (shouldReduceMotion) return;
    let lastTime = performance.now();
    let rafId = 0;
    const speedPxPerSec = 48;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const half = halfWidthRef.current;
      if (half > 0 && !isPaused && !isHovered) {
        const delta = (direction === 'left' ? -1 : 1) * speedPxPerSec * dt;
        let next = offsetRef.current + delta;
        if (next <= -half) next += half;
        if (next >= 0) next -= half;
        offsetRef.current = next;
        trackX.set(next);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion, isPaused, isHovered, direction, trackX]);

  const handleStep = (delta: number) => {
    const currentIdx = TESTIMONIALS.findIndex((t) => t.id === selectedId);
    const nextIdx =
      (currentIdx + delta + TESTIMONIALS.length) % TESTIMONIALS.length;
    setSelectedId(TESTIMONIALS[nextIdx].id);

    // Also advance visual carousel offset cleanly
    const half = halfWidthRef.current;
    if (!shouldReduceMotion && half > 0) {
      let next = offsetRef.current - delta * 420;
      while (next <= -half) next += half;
      while (next >= 0) next -= half;
      offsetRef.current = next;
      trackX.set(next);
    }
  };

  return (
    <section
      id="depoimentos"
      className="py-16 sm:py-24 bg-[#07070B]/85 text-[#F5F4FA] overflow-x-clip"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 pb-5"
        >
          <div>
            <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-white">
              <ScrollRevealWords text="04. Depoimentos & Impacto" />
            </h2>
            <p className="text-xs font-mono-tabular text-[#8E89A3] mt-1">
              Feedback técnico de entregas em produção · passe o mouse ou clique nas cartas
            </p>
          </div>

          {/* Carousel Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              aria-label="Depoimento anterior"
              className="w-9 h-9 border border-white/15 bg-[#0E0D16] text-[#C4C0D4] flex items-center justify-center hover:border-[#5B21B6] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="inline-flex items-center gap-2 px-3.5 h-9 border border-[#4C1D95]/55 bg-[#120C21] text-xs font-mono-tabular uppercase tracking-wider text-[#D4C8F2] hover:bg-[#4C1D95] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Retomar</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setDirection((d) => (d === 'left' ? 'right' : 'left'))
              }
              className="px-3 h-9 border border-white/15 bg-[#0E0D16] text-[11px] font-mono-tabular uppercase tracking-wider text-[#9B86D6] hover:border-[#5B21B6] hover:text-white transition-colors whitespace-nowrap shrink-0"
              title="Inverter direção do carrossel"
            >
              {direction === 'left' ? '← Fluxo' : 'Fluxo →'}
            </button>

            <button
              type="button"
              onClick={() => handleStep(1)}
              aria-label="Próximo depoimento"
              className="w-9 h-9 border border-white/15 bg-[#0E0D16] text-[#C4C0D4] flex items-center justify-center hover:border-[#5B21B6] hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <AnimatedRule dark className="mb-10 sm:mb-12" />
      </div>

      {/* Full-Bleed Infinite Carousel Stage with Edge Vignette Masks */}
      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right Obsidian Fade Masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-28 bg-gradient-to-r from-[#07070B] to-transparent z-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-28 bg-gradient-to-l from-[#07070B] to-transparent z-20"
        />

        {shouldReduceMotion ? (
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((item) => (
              <InteractiveTestimonialCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={(it) => setSelectedId(it.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            ref={trackRef}
            style={{ x: trackX }}
            className="flex gap-5 sm:gap-6 px-5 sm:px-8 will-change-transform w-max"
          >
            {duplicatedItems.map((item, idx) => (
              <InteractiveTestimonialCard
                key={`${item.id}-${idx}`}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={(it) => setSelectedId(it.id)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Synchronized Interactive Spotlight Readout Bar */}
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 mt-8 sm:mt-10">
        <div className="bg-[#0B0A12] border border-[#4C1D95]/45 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[#9B86D6]">
              <MousePointer2 className="w-3.5 h-3.5 text-[#826BC2]" />
              <span>
                Relato Selecionado · {selectedItem.index}/{String(TESTIMONIALS.length).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((t) => {
                const active = t.id === selectedId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    aria-label={`Selecionar depoimento de ${t.author}`}
                    className={`h-2 transition-all ${
                      active
                        ? 'w-7 bg-[#826BC2]'
                        : 'w-2.5 bg-white/15 hover:bg-[#5B21B6]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-8">
                <p className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#9B86D6] mb-2">
                  {selectedItem.context} · {selectedItem.track}
                </p>
                <p className="font-display text-lg sm:text-xl font-semibold text-white leading-snug">
                  “{selectedItem.quote}”
                </p>
              </div>

              <div className="lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-6 flex flex-col justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-base text-white">
                    {selectedItem.author}
                  </p>
                  <p className="text-xs text-[#A49EB8] mt-0.5">
                    {selectedItem.role} · {selectedItem.year}
                  </p>
                  <p className="mt-2 font-mono-tabular text-xs text-[#9B86D6]">
                    Resultado: {selectedItem.outcome}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    prefillAndScrollToContact(
                      'Projeto Sob Demanda',
                      `Olá Andrey! Vi o relato sobre "${selectedItem.context}" (${selectedItem.track}) e gostaria de conversar sobre um desafio semelhante.`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4C1D95] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5B21B6] transition-colors whitespace-nowrap shrink-0 self-start"
                >
                  <span>Conversar sobre demanda similar</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
