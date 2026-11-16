import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowDown, Code2 } from 'lucide-react';
import { useContent } from '../prefs';
import {
  Magnetic,
  RollingText,
  Tilt3DFrame,
  CrossVelocityMarquee,
} from './AquaEffects';
import { smoothScrollTo } from '../utils/navigation';

export default function HeroSection() {
  const { profile: PROFILE, ui } = useContent();
  const heroRef = useRef<HTMLElement>(null);
  const [localTime, setLocalTime] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [activeMetricIdx, setActiveMetricIdx] = useState<number | null>(null);

  const { scrollYProgress: rawHeroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScroll = useSpring(rawHeroScroll, {
    stiffness: 110,
    damping: 22,
    mass: 0.25,
  });
  const badgeRotate = useTransform(heroScroll, [0, 1], [0, 720]);
  const badgeScale = useTransform(heroScroll, [0, 1], [1, 1.24]);
  const heroStudioY = useTransform(heroScroll, [0, 1], ['0%', '-16%']);
  const heroStudioScale = useTransform(heroScroll, [0, 1], [1.04, 1.2]);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date());
        setLocalTime(formatted);
      } catch {
        setLocalTime('');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      id="topo"
      className="pt-6 sm:pt-10 pb-14 sm:pb-20 bg-[var(--bg)]/68 text-[var(--fg)] overflow-x-clip"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14">
        {/* Clean Responsive Metadata Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-5 border-b border-[var(--line)] text-[12.5px] sm:text-[13px] text-[var(--soft)]">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-semibold text-[var(--fg)]">{PROFILE.handle}</span>
            <span aria-hidden="true">·</span>
            <span>{PROFILE.experienceLabel}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">{PROFILE.location}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--soft)] font-medium">{PROFILE.availability}</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 font-mono-tabular text-[11.5px] sm:text-[12px] text-[var(--soft)]">
            <a
              href="#trajetoria"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('#trajetoria');
              }}
              className="hover:text-[var(--soft)] transition-colors truncate"
            >
              <RollingText text={PROFILE.currentRoleBadge} />
            </a>
            {localTime && (
              <>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span className="shrink-0 text-[var(--muted)]">BRT {localTime}</span>
              </>
            )}
          </div>
        </div>

        <div className="relative my-10 sm:my-16 md:pr-36">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12px] sm:text-[13px] font-mono-tabular uppercase tracking-[0.16em] text-[var(--muted)] mb-5"
          >
            <span className="text-[var(--fg)]">00</span>
            <span className="mx-2">—</span>
            {ui.heroKicker}
          </motion.p>

          <motion.h1
            initial={{ y: '16%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold tracking-[-0.045em] text-[var(--fg)] text-[clamp(3.1rem,8vw,7rem)] leading-[0.92] headline-balance"
          >
            {PROFILE.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-2xl text-[1.15rem] sm:text-[1.45rem] leading-snug text-[var(--fg)]"
          >
            {ui.heroLine}
          </motion.p>

          <motion.div
            style={{ scale: badgeScale }}
            className="hidden sm:block absolute bottom-0 right-0 z-30 will-change-transform"
          >
            <Magnetic strength={0.35}>
              <a
                href="#projetos"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('#projetos');
                }}
                aria-label="Ver trabalhos"
                className="group relative w-[114px] h-[114px] flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)]/95 hover:scale-110 hover:border-[var(--line)] transition-all duration-300"
              >
                <motion.svg
                  style={{ rotate: badgeRotate }}
                  viewBox="0 0 100 100"
                  className="w-full h-full p-1.5"
                >
                  <defs>
                    <path
                      id="hero-scroll-circle"
                      d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    />
                  </defs>
                  <text className="fill-[var(--soft)] text-[8.3px] font-mono-tabular font-semibold uppercase tracking-[0.16em]">
                    <textPath href="#hero-scroll-circle">
                      {ui.stamp}
                    </textPath>
                  </text>
                </motion.svg>
                <ArrowDown className="w-5 h-5 text-[var(--fg)] absolute transition-transform duration-300 group-hover:translate-y-1" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* 2-Column Balanced Lower Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pt-4">
          {/* Left Column: Value Proposition & Primary Action */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[var(--bg)] border border-[var(--line)] p-7 sm:p-10">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-4">
                {ui.heroFocus}
              </p>
              <p className="text-[17px] sm:text-[20px] leading-[1.6] text-[var(--fg)] font-normal">
                {PROFILE.bio}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--line)] flex flex-wrap items-center gap-4">
              <Magnetic strength={0.22}>
                <a
                  href="#projetos"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo('#projetos');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] bg-[var(--btn)] text-[var(--btn-fg)] text-sm font-semibold hover:bg-[var(--soft)] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--line)]"
                >
                  <RollingText text={ui.seeWork} />
                  <ArrowDown className="w-4 h-4 shrink-0" />
                </a>
              </Magnetic>

              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('#sobre');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[46px] border border-[var(--line)] text-[var(--fg)] text-sm font-semibold hover:border-[var(--line)] hover:text-[var(--fg)] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--line)]"
              >
                <RollingText text={ui.seeProfile} />
                <ArrowDown className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Studio Visual */}
          <Tilt3DFrame maxTilt={10} className="lg:col-span-6 h-full">
            <div className="h-full flex flex-col justify-between bg-[var(--bg)] text-[var(--fg)] overflow-hidden border border-[var(--line)]/45">
              <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] overflow-hidden bg-[var(--bg)]">
                {!heroImgError ? (
                  <motion.img
                    style={{ y: heroStudioY, scale: heroStudioScale }}
                    src={PROFILE.heroImage}
                    alt="Retrato de apresentação de Andrey Ramos"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-[120%] object-cover opacity-85 will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[var(--bg)] to-[var(--bg)] text-[var(--soft)]">
                    <Code2 className="w-10 h-10 mb-3 text-[var(--muted)]" />
                    <p className="font-display text-lg font-semibold text-[var(--fg)]">
                      Sistemas em uso
                    </p>
                    <p className="text-xs mt-1">
                      APIs Multi-Tenant · Mobile · Desktop
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/88 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="px-6 py-4 flex items-center justify-between gap-4 border-t border-[var(--line)] bg-[var(--bg)]">
                <a
                  href="#sobre"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo('#sobre');
                  }}
                  className="flex items-center gap-3.5 min-w-0 group"
                >
                  {!avatarError ? (
                    <img
                      src={PROFILE.avatarUrl}
                      alt={`Foto de perfil de ${PROFILE.name}`}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-11 h-11 rounded-full object-cover border border-[var(--line)]/70 group-hover:border-[var(--line)] transition-colors shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[var(--btn)] text-[var(--btn-fg)] font-display font-bold text-sm flex items-center justify-center shrink-0">
                      AR
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[15px] text-[var(--fg)] group-hover:text-[var(--soft)] transition-colors truncate">
                      {PROFILE.name}
                    </p>
                    <p className="text-xs text-[var(--soft)] truncate">
                      Perfil · SJRP, BR
                    </p>
                  </div>
                </a>

                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-[var(--soft)] hover:text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
                >
                  <RollingText text="GitHub" />
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Tilt3DFrame>
        </div>

        {/* Interactive Full-Width 4-Column Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--line)] bg-[var(--bg)] mt-8">
          {PROFILE.metrics.map((metric, idx) => {
            const targets = ['#trajetoria', '#projetos', '#atuacao', '#projetos'];
            const hints = ui.hints;
            const isHovered = activeMetricIdx === idx;
            return (
              <button
                key={metric.value}
                type="button"
                onMouseEnter={() => setActiveMetricIdx(idx)}
                onMouseLeave={() => setActiveMetricIdx(null)}
                onClick={() => smoothScrollTo(targets[idx] ?? '#projetos')}
                className={`group text-left p-5 sm:p-6 transition-colors duration-200 relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--line)] ${
                  isHovered ? 'bg-[var(--card)] text-[var(--fg)]' : 'hover:bg-[var(--bg)]'
                } ${idx < 3 ? 'lg:border-r border-[var(--line)]' : ''} ${
                  idx % 2 === 0 ? 'border-r lg:border-r border-[var(--line)]' : ''
                } ${idx < 2 ? 'border-b lg:border-b-0 border-[var(--line)]' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`font-display font-bold text-xl sm:text-2xl tracking-tight font-mono-tabular transition-colors ${
                      isHovered ? 'text-[var(--fg)]' : 'text-[var(--soft)]'
                    }`}
                  >
                    {metric.value}
                  </p>
                  <ArrowUpRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isHovered
                        ? 'text-[var(--fg)] translate-x-0.5 -translate-y-0.5'
                        : 'text-[var(--muted)]'
                    }`}
                  />
                </div>
                <p
                  className={`text-xs sm:text-[13px] mt-1 transition-colors ${
                    isHovered ? 'text-[var(--fg)]' : 'text-[var(--soft)]'
                  }`}
                >
                  {isHovered ? hints[idx] : metric.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Crossed Scroll-Velocity Kinetic Marquee Divider */}
      <CrossVelocityMarquee
        className="mt-12 sm:mt-16"
        topItems={[
          'DELPHI HORSE MULTI-TENANT',
          'C# .NET & APIS',
          'REACT NATIVE & EXPO',
          'FIREBIRD SQL',
          'PYTHON & IA OPS',
        ]}
        bottomItems={[
          'ANDROID AOSP & CUSTOM ROMS',
          'ARQUITETURA EM PRODUÇÃO',
          'AUTOMAÇÃO DE PROCESSOS',
          '9+ ANOS DE ENGENHARIA',
        ]}
      />
    </section>
  );
}
