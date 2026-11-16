import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { PROFILE } from '../data/portfolio';
import {
  SCREEN_DIRECTORY,
  smoothScrollTo,
  useActiveSection,
} from '../utils/navigation';

/**
 * 1. Intro Curtain (kinetic counter + 4-column staggered shutter wipe in deep obsidian purple)
 */
export function IntroCurtain() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDone(true);
      return;
    }

    let rafId = 0;
    const duration = 2350;
    const start = performance.now();
    let t1 = 0;
    let t2 = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        t1 = window.setTimeout(() => setExiting(true), 380);
        t2 = window.setTimeout(() => setDone(true), 1380);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (done) return null;

  return (
    <div
      onClick={() => setDone(true)}
      aria-hidden="true"
      className="fixed inset-0 z-[1000] pointer-events-auto cursor-pointer select-none overflow-hidden"
    >
      {/* 4 Staggered Vertical Shutter Columns */}
      <div className="absolute inset-0 grid grid-cols-4">
        {[0, 1, 2, 3].map((col) => (
          <motion.div
            key={col}
            initial={{ y: '0%' }}
            animate={{
              y: exiting ? (col % 2 === 0 ? '-102%' : '102%') : '0%',
            }}
            transition={{
              duration: 0.82,
              delay: col * 0.065,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="h-full w-full bg-[#050408] border-r border-[#4C1D95]/20 last:border-r-0 will-change-transform"
          />
        ))}
      </div>

      {/* Subtle Deep Obsidian-Purple Radial Glow */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 0.4 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.22),transparent_60%)]"
      />

      {/* Foreground Content Layer */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.06 : 1 }}
        transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
        className="relative z-10 h-full w-full text-[#F5F4FA] flex flex-col justify-between p-6 sm:p-12 pointer-events-none"
      >
        <div className="flex items-center justify-between text-xs font-mono-tabular uppercase tracking-[0.18em] text-[#9E97B4]">
          <span>ANDREY RAMOS · @DREYRANOS</span>
          <span className="text-[#9B86D6]">ENGENHARIA FULL STACK</span>
        </div>

        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="overflow-hidden mb-3">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono-tabular text-xs uppercase tracking-[0.24em] text-[#9B86D6]"
            >
              DELPHI · .NET · REACT NATIVE · IA
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
              className="font-display font-extrabold uppercase tracking-[-0.04em] text-[clamp(2.5rem,9vw,8rem)] leading-[0.86] text-white"
            >
              ANDREY RAMOS
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-4 font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#8E89A3]"
          >
            Carregando arquitetura &amp; portfólio
          </motion.p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="w-full h-[3px] bg-white/10 overflow-hidden">
            <div
              className="h-full w-full bg-gradient-to-r from-[#3B0764] via-[#4C1D95] to-[#826BC2] origin-left will-change-transform"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[#8E89A3]">
              CLIQUE PARA AVANÇAR
            </span>
            <span className="font-display font-extrabold text-5xl sm:text-7xl font-mono-tabular leading-none tracking-tight text-white">
              {String(progress).padStart(2, '0')}
              <span className="text-[#826BC2] text-xl sm:text-3xl ml-1">%</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 1b. In-Flow Sticky Screen Stage (Etapa da Tela entre Seções)
 * Sits cleanly in the normal document flow between sections—never overlapping page content—
 * pinning at 100dvh while obsidian-purple shutter doors part smoothly on scroll.
 */
export function ScreenBridge({
  num,
  label,
  targetId,
}: {
  num: string;
  label: string;
  targetId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  // Doors stay framed as the stage arrives, then smoothly part open across the pinned span
  const leftGateX = useTransform(smooth, [0.24, 0.72], ['0%', '-104%']);
  const rightGateX = useTransform(smooth, [0.24, 0.72], ['0%', '104%']);
  const titleOpacity = useTransform(smooth, [0.14, 0.42, 0.78, 0.94], [0.2, 1, 1, 0.35]);
  const titleScale = useTransform(smooth, [0.16, 0.56], [0.88, 1]);
  const watermarkX = useTransform(smooth, [0, 1], ['-8%', '8%']);
  const seamScaleX = useTransform(smooth, [0.18, 0.76], [0.08, 1]);

  const metaIdx = SCREEN_DIRECTORY.findIndex((s) => s.id === targetId);
  const meta = metaIdx >= 0 ? SCREEN_DIRECTORY[metaIdx] : undefined;
  const prevNum = metaIdx > 0 ? SCREEN_DIRECTORY[metaIdx - 1].num : '00';

  if (shouldReduceMotion) {
    return (
      <div className="relative py-14 bg-[#040407] border-y border-[#4C1D95]/35 flex flex-col items-center justify-center px-6 text-center select-none">
        <span className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#9B86D6] mb-2">
          ETAPA {prevNum} → TELA {num} / 06
        </span>
        <button
          type="button"
          onClick={() => smoothScrollTo(`#${targetId}`)}
          className="font-display font-extrabold uppercase tracking-[-0.03em] text-3xl sm:text-5xl text-white hover:text-[#9B86D6] transition-colors"
        >
          {label}
        </button>
        {meta && (
          <p className="mt-2 font-mono-tabular text-xs text-[#8E89A3]">
            {meta.subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative h-[138vh] min-h-[760px] bg-[#040407] border-y border-[#4C1D95]/30 select-none"
    >
      {/* In-Flow Pinned Full-Screen Stage */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between px-6 sm:px-14 pt-24 pb-10 sm:pb-14 bg-[#040407]">
        {/* Subtle Deep Obsidian-Purple Radial Stage Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(76,29,149,0.2),transparent_64%)] z-[1]"
        />

        {/* Giant Parallax Background Typography */}
        <motion.div
          style={{ x: watermarkX }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-[2] will-change-transform"
        >
          <span className="font-display font-extrabold uppercase tracking-[-0.04em] text-[clamp(4.5rem,18vw,15rem)] leading-none text-[#4C1D95]/14 whitespace-nowrap">
            TELA {num}
          </span>
        </motion.div>

        {/* Opposing Obsidian-Purple Shutter Doors Parting on Scroll */}
        <motion.div
          style={{ x: leftGateX }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#040407] via-[#090712] to-[#1A0B36]/95 border-r border-[#5B21B6]/55 will-change-transform z-10"
        />
        <motion.div
          style={{ x: rightGateX }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#040407] via-[#090712] to-[#1A0B36]/95 border-l border-[#5B21B6]/55 will-change-transform z-10"
        />

        {/* Top Stage Meta Header */}
        <div className="relative z-20 flex items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#8E89A3] border-b border-white/10 pb-3">
          <span>ETAPA DE TRANSIÇÃO</span>
          <span className="text-[#9B86D6]">
            {prevNum} → TELA {num} / 06
          </span>
        </div>

        {/* Center Screen Title & Action */}
        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="relative z-20 my-auto flex flex-col items-center text-center max-w-4xl mx-auto will-change-transform"
        >
          <p className="font-mono-tabular text-xs uppercase tracking-[0.26em] text-[#9B86D6] mb-3">
            TELA {num} · {meta?.label ?? label}
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-[-0.035em] text-[clamp(2.2rem,6.4vw,5.25rem)] leading-[0.92] text-white">
            {label}
          </h2>
          {meta && (
            <p className="mt-4 font-mono-tabular text-xs sm:text-sm text-[#A49EB8] max-w-xl">
              {meta.subtitle}
            </p>
          )}

          {/* Scroll-Scrubbed Progress Seam */}
          <div className="mt-7 w-44 sm:w-64 h-[2px] bg-white/12 overflow-hidden">
            <motion.div
              style={{ scaleX: seamScaleX }}
              className="h-full w-full origin-left bg-gradient-to-r from-[#3B0764] via-[#826BC2] to-[#9B86D6] will-change-transform"
            />
          </div>

          <button
            type="button"
            onClick={() => smoothScrollTo(`#${targetId}`)}
            className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 border border-[#4C1D95]/65 bg-[#0D0A18]/90 hover:bg-[#4C1D95] hover:border-[#826BC2] transition-colors text-xs font-mono-tabular uppercase tracking-[0.18em] text-[#D4C8F2] hover:text-white"
          >
            <span>Avançar para {meta?.label ?? label}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Bottom Stage Cue */}
        <div className="relative z-20 flex items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[#8E89A3] border-t border-white/10 pt-3">
          <span>PORTFÓLIO · ANDREY RAMOS</span>
          <span className="text-[#9B86D6]">CONTINUE ROLANDO ↓</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 1d. Desktop Floating Right-Edge Screen Pager (allows stepping screen-to-screen 00..05)
 */
export function ScreenPagerRail() {
  const activeSection = useActiveSection();
  const activeIdx = Math.max(
    0,
    SCREEN_DIRECTORY.findIndex((s) => s.id === activeSection)
  );

  const goStep = (delta: number) => {
    const nextIdx = Math.min(
      SCREEN_DIRECTORY.length - 1,
      Math.max(0, activeIdx + delta)
    );
    const target = SCREEN_DIRECTORY[nextIdx];
    smoothScrollTo(`#${target.id}`, target.id === 'topo' ? 0 : 64);
  };

  return (
    <aside
      aria-label="Navegador entre telas"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 bg-[#09080E]/88 backdrop-blur-md border border-[#4C1D95]/35 py-2.5 px-1.5 no-print"
    >
      <button
        type="button"
        onClick={() => goStep(-1)}
        disabled={activeIdx === 0}
        aria-label="Tela anterior"
        title="Tela anterior"
        className="w-7 h-7 flex items-center justify-center text-[#9B86D6] hover:text-white hover:bg-[#4C1D95]/60 disabled:opacity-25 disabled:pointer-events-none transition-colors"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center gap-1.5 py-1">
        {SCREEN_DIRECTORY.map((screen) => {
          const isCurrent = screen.id === activeSection;
          return (
            <button
              key={screen.id}
              type="button"
              onClick={() =>
                smoothScrollTo(`#${screen.id}`, screen.id === 'topo' ? 0 : 64)
              }
              aria-label={`Ir para tela ${screen.num}: ${screen.label}`}
              title={`${screen.num} · ${screen.label}`}
              className="group relative flex items-center justify-center w-7 h-5"
            >
              <span
                className={`block transition-all duration-200 ${
                  isCurrent
                    ? 'w-5 h-[3px] bg-[#9B86D6]'
                    : 'w-2.5 h-[2px] bg-white/25 group-hover:w-4 group-hover:bg-[#5B21B6]'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="font-mono-tabular text-[10px] text-[#9B86D6] font-semibold py-0.5">
        {SCREEN_DIRECTORY[activeIdx].num}
      </span>

      <button
        type="button"
        onClick={() => goStep(1)}
        disabled={activeIdx === SCREEN_DIRECTORY.length - 1}
        aria-label="Próxima tela"
        title="Próxima tela"
        className="w-7 h-7 flex items-center justify-center text-[#9B86D6] hover:text-white hover:bg-[#4C1D95]/60 disabled:opacity-25 disabled:pointer-events-none transition-colors"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </aside>
  );
}

/**
 * 2. Custom Mix-Blend-Difference Magnetic Cursor
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');
  const [variant, setVariant] = useState<'default' | 'view' | 'pointer'>(
    'default'
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || reduced) return;

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const viewTarget = target?.closest('[data-cursor="view"]');
      const pointerTarget = target?.closest('a, button, [role="button"]');

      if (viewTarget) {
        setVariant('view');
        setLabel('VER');
      } else if (pointerTarget) {
        setVariant('pointer');
        setLabel('');
      } else {
        setVariant('default');
        setLabel('');
      }
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const sizeClass =
    variant === 'view'
      ? 'w-[84px] h-[84px]'
      : variant === 'pointer'
      ? 'w-[44px] h-[44px]'
      : 'w-[24px] h-[24px]';

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`hidden lg:flex fixed top-0 left-0 z-[9999] rounded-full bg-white text-black mix-blend-difference pointer-events-none items-center justify-center transition-[width,height,opacity] duration-200 ease-out ${sizeClass} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {label && (
        <span className="font-display text-[11px] font-bold tracking-[0.12em]">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * 3. Magnetic Pull Wrapper
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setOffset({ x, y });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 16, mass: 0.4 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * 4. Rolling Text Hover Effect
 */
export function RollingText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex overflow-hidden leading-none group/roll ${className}`}
    >
      <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/roll:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/roll:translate-y-0"
      >
        {text}
      </span>
    </span>
  );
}

/**
 * 5. Scroll-Triggered Expanding Hairline Rule
 */
export function AnimatedRule({
  dark = true,
  className = '',
}: {
  dark?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className={`w-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className={`h-[1.5px] w-full origin-left ${
          dark
            ? 'bg-gradient-to-r from-[#5B21B6]/80 via-white/20 to-white/8'
            : 'bg-[#4C1D95]/55'
        }`}
      />
    </div>
  );
}

/**
 * 5b. Masked Scroll Word Reveal
 */
export function ScrollRevealWords({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.26em] ${className}`}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden py-[0.04em]">
          <motion.span
            initial={{ y: '108%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '108%', opacity: 0 }}
            transition={{
              duration: 0.72,
              delay: delay + idx * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * 5c. Scroll-Velocity Kinetic Marquee Ribbon
 */
export function VelocityMarquee({
  items,
  baseVelocity = 3.6,
  variant = 'dark',
  large = false,
  className = '',
}: {
  items: string[];
  baseVelocity?: number;
  variant?: 'dark' | 'light' | 'cobalt';
  large?: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 42,
    stiffness: 320,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 900], [0, 5.5], {
    clamp: false,
  });
  const directionFactor = useRef<number>(1);
  const x = useTransform(baseX, (v) => {
    const wrapped = ((v % 25) + 25) % 25;
    return `-${wrapped}%`;
  });

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) {
      directionFactor.current = -1;
    } else if (vf > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * Math.min(Math.abs(vf), 5);
    baseX.set(baseX.get() + moveBy);
  });

  const repeated = [...items, ...items, ...items, ...items];

  const paletteClass =
    variant === 'cobalt'
      ? 'bg-[#3B0764] text-white border-[#5B21B6]/60'
      : variant === 'light'
      ? 'bg-[#12111D] text-[#F5F4FA] border-white/15'
      : 'bg-[#090910] text-[#F5F4FA] border-white/12';

  return (
    <div className={`w-full overflow-hidden border-y select-none ${paletteClass} ${className}`}>
      <motion.div
        style={{ x: shouldReduceMotion ? '0%' : x }}
        className={`flex w-max items-center will-change-transform ${
          large ? 'py-3.5 sm:py-4' : 'py-2.5 sm:py-3'
        }`}
      >
        {repeated.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="flex items-center gap-6 sm:gap-8 px-4 sm:px-6 whitespace-nowrap shrink-0"
          >
            <span
              className={`font-display font-extrabold uppercase tracking-[-0.02em] ${
                large ? 'text-base sm:text-2xl' : 'text-xs sm:text-sm tracking-[0.12em]'
              }`}
            >
              {item}
            </span>
            <span
              aria-hidden="true"
              className={`inline-block rotate-45 ${
                large ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'
              } ${
                variant === 'cobalt' ? 'bg-[#07070A]' : 'bg-[#826BC2]'
              }`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * 5c-bis. Crossed Dual-Track Opposing Marquee
 */
export function CrossVelocityMarquee({
  topItems,
  bottomItems,
  className = '',
}: {
  topItems: string[];
  bottomItems: string[];
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden py-5 sm:py-7 ${className}`}>
      <div className="-mx-4 -rotate-1 sm:-rotate-[1.2deg]">
        <VelocityMarquee items={topItems} baseVelocity={3.8} variant="dark" large />
      </div>
      <div className="-mx-4 rotate-1 sm:rotate-[1.2deg] -mt-2">
        <VelocityMarquee items={bottomItems} baseVelocity={-3.4} variant="cobalt" large />
      </div>
    </div>
  );
}

/**
 * 5d. Interactive 3D Perspective Tilt & Specular Sheen Frame
 */
export function Tilt3DFrame({
  children,
  className = '',
  maxTilt = 10,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 190, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 190, damping: 20 });
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawRotateY.set((px - 0.5) * maxTilt * 2);
    rawRotateX.set((0.5 - py) * maxTilt * 2);
    setGlare({ x: px * 100, y: py * 100, active: true });
  };

  const handleLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    setGlare((prev) => ({ ...prev, active: false }));
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="relative w-full h-full will-change-transform"
      >
        {children}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: glare.active ? 0.24 : 0,
              background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(91, 33, 182, 0.45), transparent 72%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/**
 * 6. Floating Magnetic Burger & Curved SVG Drawer
 */
const DRAWER_LINKS = [
  { label: 'Início', href: '#topo' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Trajetória', href: '#trajetoria' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
];

export function CurvedDrawerNav() {
  const [open, setOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const activeSection = useActiveSection();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingBtn(window.scrollY > 240);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpenDrawer = () => {
      setOpen(true);
    };
    const onToggleDrawer = () => {
      setOpen((prev) => !prev);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('portfolio:open-drawer', onOpenDrawer);
    window.addEventListener('portfolio:toggle-drawer', onToggleDrawer);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('portfolio:open-drawer', onOpenDrawer);
      window.removeEventListener('portfolio:toggle-drawer', onToggleDrawer);
    };
  }, []);

  const navigateTo = (href: string) => {
    setOpen(false);
    smoothScrollTo(href, href === '#topo' ? 0 : 64);
  };

  const currentIndicator = hoveredHref ?? `#${activeSection}`;

  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const initialCurve = `M100 0 L200 0 L200 ${vh} L100 ${vh} Q-100 ${vh / 2} 100 0`;
  const targetCurve = `M100 0 L200 0 L200 ${vh} L100 ${vh} Q100 ${vh / 2} 100 0`;

  return (
    <>
      <AnimatePresence>
        {(showFloatingBtn || open) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-9 z-[720] no-print"
          >
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Fechar navegação rápida' : 'Abrir navegação rápida'}
                aria-expanded={open}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#100D19] text-[#F5F4FA] border border-[#4C1D95]/55 shadow-[0_8px_28px_rgba(59,7,100,0.45)] flex flex-col items-center justify-center gap-1.5 hover:bg-[#4C1D95] hover:border-[#826BC2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#826BC2]"
              >
                <span
                  className={`block w-5 h-[1.5px] bg-current transition-transform duration-300 ${
                    open ? 'rotate-45 translate-y-[3.5px]' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-current transition-transform duration-300 ${
                    open ? '-rotate-45 -translate-y-[3.5px]' : ''
                  }`}
                />
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[690]"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navegação rápida"
              initial={{ x: 'calc(100% + 100px)' }}
              animate={{ x: '0%' }}
              exit={{ x: 'calc(100% + 100px)' }}
              transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[440px] lg:w-[500px] bg-[#09080E] text-[#F5F4FA] border-l border-[#4C1D95]/30 z-[700] flex flex-col justify-between p-8 sm:p-14"
            >
              <svg
                className="hidden sm:block absolute top-0 -left-[99px] w-[100px] h-full fill-[#09080E] pointer-events-none"
                viewBox={`0 0 100 ${vh}`}
                preserveAspectRatio="none"
              >
                <motion.path
                  initial={{ d: initialCurve }}
                  animate={{ d: targetCurve }}
                  exit={{ d: initialCurve }}
                  transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
                />
              </svg>

              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-[#9B86D6] pb-3 border-b border-[#4C1D95]/40 w-fit mb-10">
                  Navegação entre Telas
                </p>

                <nav
                  onMouseLeave={() => setHoveredHref(null)}
                  className="flex flex-col gap-3"
                >
                  {DRAWER_LINKS.map((item, idx) => {
                    const isActive = currentIndicator === item.href;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ x: 64, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 64, opacity: 0 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.04 * idx,
                          ease: [0.76, 0, 0.24, 1],
                        }}
                        onMouseEnter={() => setHoveredHref(item.href)}
                        className="relative flex items-center"
                      >
                        <motion.span
                          animate={{ scale: isActive ? 1 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-2.5 h-2.5 rounded-full bg-[#826BC2] mr-4 shrink-0"
                        />
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(item.href);
                          }}
                          className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white hover:text-[#9B86D6] transition-colors py-1"
                        >
                          {item.label}
                        </a>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-[#9B86D6] pb-2 border-b border-[#4C1D95]/40 w-fit mb-4">
                  Conecte-se
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#F5F4FA]">
                  <a
                    href={PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-underline hover:text-[#9B86D6]"
                  >
                    GitHub
                  </a>
                  <a
                    href={PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-underline hover:text-[#9B86D6]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://wa.me/${PROFILE.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-underline hover:text-[#9B86D6]"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
