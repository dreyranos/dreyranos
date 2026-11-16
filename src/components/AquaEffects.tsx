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
import { useContent } from '../prefs';
import {
  smoothScrollTo,
  useActiveSection,
} from '../utils/navigation';

/**
 * 1. Intro Curtain (kinetic counter + 4-column staggered shutter wipe in deep obsidian purple)
 */
export function IntroCurtain() {
  const { ui } = useContent();
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
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: exiting ? '-102%' : '0%' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-[var(--bg)] text-[var(--fg)] flex flex-col justify-between p-6 sm:p-12 will-change-transform"
      >
        <div className="flex items-center justify-between text-xs font-mono-tabular uppercase tracking-[0.18em] text-[var(--soft)]">
          <span>ANDREY RAMOS · @DREYRANOS</span>
          <span className="text-[var(--soft)]">{ui.introTag}</span>
        </div>

        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="overflow-hidden mb-3">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono-tabular text-xs uppercase tracking-[0.24em] text-[var(--soft)]"
            >
              {ui.introLine}
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
              className="font-display font-extrabold uppercase tracking-[-0.04em] text-[clamp(2.5rem,9vw,8rem)] leading-[0.86] text-[var(--fg)]"
            >
              ANDREY RAMOS
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-4 font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            {ui.introStatus}
          </motion.p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="w-full h-[3px] bg-[var(--wash)] overflow-hidden">
            <div
              className="h-full w-full bg-gradient-to-r from-[var(--soft)] via-[var(--soft)] to-[var(--btn)] origin-left will-change-transform"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[var(--muted)]">
              {ui.introSkip}
            </span>
            <span className="font-display font-extrabold text-5xl sm:text-7xl font-mono-tabular leading-none tracking-tight text-[var(--fg)]">
              {String(progress).padStart(2, '0')}
              <span className="text-[var(--muted)] text-xl sm:text-3xl ml-1">%</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Page turn between sections. The stage pins for one viewport of scroll
 * while a sheet rotates off its left edge and uncovers the next page.
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
  const { ui, screens } = useContent();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const turn = useTransform(scrollYProgress, [0.04, 0.82], [0, -68]);
  const slide = useTransform(scrollYProgress, [0.18, 0.78], ['0%', '-62%']);
  const shade = useTransform(scrollYProgress, [0.08, 0.4, 0.78], [0.05, 0.55, 0]);
  const copyY = useTransform(scrollYProgress, [0.12, 0.5], [36, 0]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const rule = useTransform(scrollYProgress, [0.08, 0.92], ['0%', '100%']);

  const metaIdx = screens.findIndex((s) => s.id === targetId);
  const meta = metaIdx >= 0 ? screens[metaIdx] : undefined;
  const prevNum = metaIdx > 0 ? screens[metaIdx - 1].num : '00';
  const pageTitle = meta?.label ?? label;

  if (shouldReduceMotion) {
    return (
      <div className="relative py-14 bg-[var(--bg)] border-y border-[var(--line)]/35 flex flex-col items-center justify-center px-6 text-center select-none">
        <span className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[var(--soft)] mb-2">
          {prevNum} → {num}
        </span>
        <button
          type="button"
          onClick={() => smoothScrollTo(`#${targetId}`)}
          className="font-display font-extrabold uppercase tracking-[-0.03em] text-3xl sm:text-5xl text-[var(--fg)] hover:text-[var(--soft)] transition-colors"
        >
          {label}
        </button>
        {meta && (
          <p className="mt-2 font-mono-tabular text-xs text-[var(--muted)]">
            {meta.subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[210vh] bg-[var(--bg)] select-none">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div className="relative h-full w-full" style={{ perspective: '2400px' }}>
        <div className="absolute inset-0 bg-[var(--fg)] text-[var(--bg)] overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[4vw] top-1/2 -translate-y-1/2 font-display font-extrabold leading-none tracking-[-0.07em] text-[34vw] text-[var(--bg)] opacity-[0.12]"
          >
            {num}
          </div>

          <motion.div
            aria-hidden="true"
            style={{ x: marqueeX }}
            className="pointer-events-none absolute left-0 right-0 bottom-[18%] flex w-[160%] gap-[0.4em] whitespace-nowrap font-display font-extrabold uppercase tracking-[-0.05em] text-[11vw] leading-none text-[var(--bg)] opacity-[0.14]"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{pageTitle}</span>
            ))}
          </motion.div>

          <motion.div
            style={{ y: copyY }}
            className="relative h-full flex flex-col justify-between pl-6 pr-16 sm:pl-14 sm:pr-24 py-8 sm:py-12"
          >
            <div className="flex items-center justify-between font-mono-tabular text-[11px] uppercase tracking-[0.24em]">
              <span>{prevNum} → {num}</span>
              <span>{num} / 06</span>
            </div>

            <div className="ml-auto flex max-w-xl flex-col items-end text-right">
              <h2 className="font-display font-extrabold tracking-[-0.045em] text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.88]">
                {pageTitle}
              </h2>
              {meta && (
                <p className="mt-4 max-w-md text-sm sm:text-base opacity-70">
                  {meta.subtitle}
                </p>
              )}
              <button
                type="button"
                onClick={() => smoothScrollTo(`#${targetId}`)}
                className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--bg)] text-[var(--fg)] text-sm font-semibold hover:opacity-85 transition-opacity"
              >
                <span>{ui.follow} {pageTitle}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px w-full bg-[var(--bg)]/25 overflow-hidden">
              <motion.div style={{ width: rule }} className="h-full bg-[var(--bg)]" />
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[34%] bg-gradient-to-r from-black/70 to-transparent"
        />

        <motion.div
          aria-hidden="true"
          style={{ rotateY: turn, x: slide, transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
          className="pointer-events-none absolute inset-0 z-[3] origin-left bg-[var(--bg)] text-[var(--fg)] will-change-transform [backface-visibility:hidden]"
        >
          <div className="absolute inset-0 flex flex-col justify-between py-8 opacity-40" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-px w-full bg-[var(--line)]" />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-10 sm:w-14 border-r border-[var(--line)] flex flex-col justify-between py-6 items-center">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-[var(--fg)]/30" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center pl-16 sm:pl-24 pr-8 overflow-hidden">
            <p className="font-display font-extrabold uppercase tracking-[-0.06em] text-[clamp(4.5rem,14vw,11rem)] leading-[0.82]">
              {pageTitle}
            </p>
          </div>
          <div className="absolute top-8 left-16 sm:left-24 font-mono-tabular text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            {prevNum} → {num}
          </div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--fg)]/20 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[3px] bg-[var(--fg)]" />
        </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * 1d. Desktop Floating Right-Edge Screen Pager (allows stepping screen-to-screen 00..05)
 */
export function ScreenPagerRail() {
  const { screens: SCREEN_DIRECTORY } = useContent();
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
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 bg-[var(--bg)]/88 backdrop-blur-md border border-[var(--line)]/35 py-2.5 px-1.5 no-print"
    >
      <button
        type="button"
        onClick={() => goStep(-1)}
        disabled={activeIdx === 0}
        aria-label="Tela anterior"
        title="Tela anterior"
        className="w-7 h-7 flex items-center justify-center text-[var(--soft)] hover:text-[var(--fg)] hover:bg-[var(--card)]/60 disabled:opacity-25 disabled:pointer-events-none transition-colors"
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
                    ? 'w-5 h-[3px] bg-[var(--soft)]'
                    : 'w-2.5 h-[2px] bg-white/25 group-hover:w-4 group-hover:bg-[var(--card)]'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="font-mono-tabular text-[10px] text-[var(--soft)] font-semibold py-0.5">
        {SCREEN_DIRECTORY[activeIdx].num}
      </span>

      <button
        type="button"
        onClick={() => goStep(1)}
        disabled={activeIdx === SCREEN_DIRECTORY.length - 1}
        aria-label="Próxima tela"
        title="Próxima tela"
        className="w-7 h-7 flex items-center justify-center text-[var(--soft)] hover:text-[var(--fg)] hover:bg-[var(--card)]/60 disabled:opacity-25 disabled:pointer-events-none transition-colors"
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
            ? 'bg-gradient-to-r from-[var(--card)]/80 via-white/20 to-white/8'
            : 'bg-[var(--card)]/55'
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
      ? 'bg-[var(--card)] text-white border-[var(--line)]/60'
      : variant === 'light'
      ? 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)]'
      : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)]';

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
                variant === 'cobalt' ? 'bg-[var(--bg)]' : 'bg-[var(--card)]'
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
              background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(75,66,76,0.45), transparent 72%)`,
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
  { label: 'Perfil', href: '#sobre' },
  { label: 'Trabalhos', href: '#projetos' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Trajetória', href: '#trajetoria' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
];

export function CurvedDrawerNav() {
  const { ui, profile: PROFILE } = useContent();
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
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--bg)] text-[var(--fg)] border border-[var(--line)]/55 shadow-[0_8px_28px_rgba(41,33,37,0.45)] flex flex-col items-center justify-center gap-1.5 hover:bg-[var(--card)] hover:border-[var(--line)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--line)]"
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
              className="fixed top-0 right-0 h-screen w-full sm:w-[440px] lg:w-[500px] bg-[var(--bg)] text-[var(--fg)] border-l border-[var(--line)]/30 z-[700] flex flex-col justify-between p-8 sm:p-14"
            >
              <svg
                className="hidden sm:block absolute top-0 -left-[99px] w-[100px] h-full fill-[var(--bg)] pointer-events-none"
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
                <p className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-[var(--soft)] pb-3 border-b border-[var(--line)]/40 w-fit mb-10">
                  Navegação entre Telas
                </p>

                <nav
                  onMouseLeave={() => setHoveredHref(null)}
                  className="flex flex-col gap-3"
                >
                  {DRAWER_LINKS.map((item, idx) => {
                    const label = ui.drawer[idx] ?? item.label;
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
                          className="w-2.5 h-2.5 rounded-full bg-[var(--card)] mr-4 shrink-0"
                        />
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(item.href);
                          }}
                          className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-[var(--fg)] hover:text-[var(--soft)] transition-colors py-1"
                        >
                          {label}
                        </a>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-[var(--soft)] pb-2 border-b border-[var(--line)]/40 w-fit mb-4">
                  Conecte-se
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--fg)]">
                  <a
                    href={PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-underline hover:text-[var(--soft)]"
                  >
                    GitHub
                  </a>
                  <a
                    href={PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-underline hover:text-[var(--soft)]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://wa.me/${PROFILE.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-underline hover:text-[var(--soft)]"
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
