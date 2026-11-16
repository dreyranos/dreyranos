import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowDown, Code2 } from 'lucide-react';
import { PROFILE } from '../data/portfolio';
import {
  Magnetic,
  RollingText,
  Tilt3DFrame,
  CrossVelocityMarquee,
} from './AquaEffects';
import { smoothScrollTo } from '../utils/navigation';

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hoveringHero, setHoveringHero] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [activeMetricIdx, setActiveMetricIdx] = useState<number | null>(null);
  const [spotlightPinned, setSpotlightPinned] = useState(false);

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
  const line1X = useTransform(heroScroll, [0, 1], ['0%', '-22%']);
  const line2X = useTransform(heroScroll, [0, 1], ['0%', '20%']);
  const line3X = useTransform(heroScroll, [0, 1], ['0%', '-16%']);
  const headlineScale = useTransform(heroScroll, [0, 1], [1, 1.07]);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const maskSize = hoveringHero || spotlightPinned ? 360 : 0;

  return (
    <section
      ref={heroRef}
      id="topo"
      className="pt-6 sm:pt-10 pb-14 sm:pb-20 bg-[#060609]/68 text-[#F5F4FA] overflow-x-clip"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14">
        {/* Clean Responsive Metadata Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-5 border-b border-white/10 text-[12.5px] sm:text-[13px] text-[#9E97B4]">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-semibold text-white">{PROFILE.handle}</span>
            <span aria-hidden="true">·</span>
            <span>{PROFILE.experienceLabel}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">{PROFILE.location}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#9B86D6] font-medium">{PROFILE.availability}</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 font-mono-tabular text-[11.5px] sm:text-[12px] text-[#9E97B4]">
            <a
              href="#trajetoria"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('#trajetoria');
              }}
              className="hover:text-[#9B86D6] transition-colors truncate"
            >
              <RollingText text={PROFILE.currentRoleBadge} />
            </a>
            {localTime && (
              <>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span className="shrink-0 text-[#8E89A3]">BRT {localTime}</span>
              </>
            )}
          </div>
        </div>

        {/* Full-Stage Interactive Cursor Spotlight + Scroll Drift Hero (Black & Deep Dark Purple) */}
        <div
          ref={headlineRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHoveringHero(true)}
          onMouseLeave={() => setHoveringHero(false)}
          className="relative my-8 sm:my-12 py-10 sm:py-16 md:pr-32 select-none overflow-hidden"
        >
          {/* Base Layer (Void Black + White/Deep Purple Ink) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[12px] sm:text-[13px] font-mono-tabular uppercase tracking-[0.14em] text-[#8E89A3] flex items-center gap-2">
                <span className="text-[#9B86D6]">00</span>
                <span>—</span>
                <span className="hidden md:inline">PASSE O CURSOR OU ROLE</span>
                <span className="md:hidden">ROLAR</span>
              </p>

              <button
                type="button"
                onClick={() => setSpotlightPinned((v) => !v)}
                className="text-[12px] font-mono-tabular uppercase tracking-[0.2em] text-[#9B86D6] hover:text-white font-semibold transition-colors"
                title="Alternar modo manifesto"
              >
                {spotlightPinned ? 'AR · ATIVO' : 'AR'}
              </button>
            </div>

            <motion.h1
              style={{ scale: headlineScale }}
              className="font-display font-extrabold uppercase tracking-[-0.04em] text-white text-[clamp(2.65rem,8.4vw,7.75rem)] leading-[0.9] headline-balance origin-left will-change-transform"
            >
              <motion.span
                style={{ x: line1X }}
                initial={{ y: '40%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 sm:gap-6 sm:pl-[14%] will-change-transform"
              >
                <span>FULL</span>
                <span className="inline-block h-[6px] sm:h-[12px] w-[32px] sm:w-[66px] bg-[#5B21B6]" />
                <span>STACK</span>
              </motion.span>
              <motion.span
                style={{ x: line2X }}
                initial={{ y: '40%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[#F5F4FA] will-change-transform"
              >
                ENGENHARIA
              </motion.span>
              <motion.span
                style={{ x: line3X }}
                initial={{ y: '40%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-x-6 sm:pl-[16%] will-change-transform"
              >
                <span>DE SOFTWARE</span>
                <span className="hidden xl:inline-block text-[14px] font-sans font-semibold tracking-[0.06em] text-[#9B86D6] max-w-[190px] leading-snug">
                  PRECISÃO TÉCNICA &amp; ESCALA EM PRODUÇÃO
                </span>
              </motion.span>
            </motion.h1>
          </div>

          {/* Inverted Deep Nocturnal Purple Spotlight Reveal Layer */}
          <motion.div
            aria-hidden="true"
            animate={{
              clipPath: `circle(${maskSize / 2}px at ${cursor.x}px ${cursor.y}px)`,
            }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.28 }}
            className="hidden md:flex flex-col justify-center absolute inset-0 z-20 bg-[#240642] text-white py-10 sm:py-16 pointer-events-none"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[12px] sm:text-[13px] font-mono-tabular uppercase tracking-[0.14em] text-[#C8B9ED]">
                ANDREY RAMOS · @DREYRANOS
              </p>
              <p className="text-[12px] font-mono-tabular uppercase tracking-[0.2em] text-white font-semibold">
                MANIFESTO
              </p>
            </div>

            <div className="font-display font-extrabold uppercase tracking-[-0.04em] text-[clamp(2.65rem,8.4vw,7.75rem)] leading-[0.9]">
              <motion.span
                style={{ x: line1X }}
                className="block sm:pl-[14%] text-white will-change-transform"
              >
                CÓDIGO LEGÍVEL
              </motion.span>
              <motion.span
                style={{ x: line2X }}
                className="block text-[#C8B9ED] will-change-transform"
              >
                MULTI-TENANT
              </motion.span>
              <motion.span
                style={{ x: line3X }}
                className="flex items-center gap-x-6 sm:pl-[16%] text-white will-change-transform"
              >
                <span>VALOR REAL</span>
                <span className="hidden xl:inline-block text-[14px] font-sans font-semibold tracking-[0.06em] text-[#D4C8F2] max-w-[200px] leading-snug">
                  AUTOMAÇÃO DE TUDO QUE FOR REPETITIVO
                </span>
              </motion.span>
            </div>
          </motion.div>

          {/* Rotating Circular Scroll Stamp */}
          <motion.div
            style={{ scale: badgeScale }}
            className="hidden sm:block absolute bottom-2 right-2 z-30 will-change-transform"
          >
            <Magnetic strength={0.35}>
              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('#sobre');
                }}
                aria-label="Avançar para a tela Sobre"
                className="group relative w-[114px] h-[114px] flex items-center justify-center rounded-full border border-[#4C1D95]/65 bg-[#0C0A14]/95 hover:scale-110 hover:border-[#826BC2] transition-all duration-300 shadow-[0_8px_28px_rgba(59,7,100,0.42)]"
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
                  <text className="fill-[#9B86D6] text-[8.3px] font-mono-tabular font-semibold uppercase tracking-[0.18em]">
                    <textPath href="#hero-scroll-circle">
                      SOBRE ANDREY · PORTFÓLIO · ROLAR ·
                    </textPath>
                  </text>
                </motion.svg>
                <ArrowDown className="w-5 h-5 text-white absolute transition-transform duration-300 group-hover:translate-y-1" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* 2-Column Balanced Lower Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pt-4">
          {/* Left Column: Value Proposition & Primary Action */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#0C0C14] border border-white/10 p-7 sm:p-10">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#9B86D6] mb-4">
                Foco Principal · Delphi Horse · C# .NET · React Native · IA
              </p>
              <p className="text-[17px] sm:text-[20px] leading-[1.6] text-[#DFDCEB] font-normal">
                {PROFILE.bio}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.22}>
                <a
                  href={`https://wa.me/${PROFILE.whatsappRaw}?text=${encodeURIComponent(
                    'Olá Andrey! Vi seu portfólio e gostaria de conversar sobre um projeto ou oportunidade.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#5B21B6] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#826BC2]"
                >
                  <RollingText text="Conversar no WhatsApp" />
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
              </Magnetic>

              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('#sobre');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[46px] border border-white/20 text-[#F5F4FA] text-sm font-semibold hover:border-[#826BC2] hover:text-[#9B86D6] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#826BC2]"
              >
                <RollingText text="Conhecer Sobre Mim" />
                <ArrowDown className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Studio Visual */}
          <Tilt3DFrame maxTilt={10} className="lg:col-span-6 h-full">
            <div className="h-full flex flex-col justify-between bg-[#0C0C14] text-[#F5F4FA] overflow-hidden border border-[#4C1D95]/45">
              <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] overflow-hidden bg-[#100E1B]">
                {!heroImgError ? (
                  <motion.img
                    style={{ y: heroStudioY, scale: heroStudioScale }}
                    src={PROFILE.heroImage}
                    alt="Estação de trabalho de engenharia de software minimalista"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-[120%] object-cover opacity-85 will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#190D33] to-[#060609] text-[#C4C0D4]">
                    <Code2 className="w-10 h-10 mb-3 text-[#826BC2]" />
                    <p className="font-display text-lg font-semibold text-white">
                      Engenharia de Produção
                    </p>
                    <p className="text-xs mt-1">
                      APIs Multi-Tenant · Mobile · Desktop
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060609]/88 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="px-6 py-4 flex items-center justify-between gap-4 border-t border-white/10 bg-[#08080D]">
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
                      className="w-11 h-11 rounded-full object-cover border border-[#4C1D95]/70 group-hover:border-[#826BC2] transition-colors shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#4C1D95] text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
                      AR
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[15px] text-white group-hover:text-[#9B86D6] transition-colors truncate">
                      {PROFILE.name}
                    </p>
                    <p className="text-xs text-[#9E97B4] truncate">
                      Sobre &amp; Trajetória · SJRP, BR
                    </p>
                  </div>
                </a>

                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-[#9B86D6] hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <RollingText text="GitHub" />
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Tilt3DFrame>
        </div>

        {/* Interactive Full-Width 4-Column Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/12 bg-[#0C0C14] mt-8">
          {PROFILE.metrics.map((metric, idx) => {
            const targets = ['#trajetoria', '#projetos', '#atuacao', '#projetos'];
            const hints = [
              'Ver linha do tempo',
              'Ver blueprint',
              'Explorar atuações',
              'Ver automações',
            ];
            const isHovered = activeMetricIdx === idx;
            return (
              <button
                key={metric.value}
                type="button"
                onMouseEnter={() => setActiveMetricIdx(idx)}
                onMouseLeave={() => setActiveMetricIdx(null)}
                onClick={() => smoothScrollTo(targets[idx] ?? '#projetos')}
                className={`group text-left p-5 sm:p-6 transition-colors duration-200 relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#826BC2] ${
                  isHovered ? 'bg-[#3B0764] text-white' : 'hover:bg-[#13111E]'
                } ${idx < 3 ? 'lg:border-r border-white/10' : ''} ${
                  idx % 2 === 0 ? 'border-r lg:border-r border-white/10' : ''
                } ${idx < 2 ? 'border-b lg:border-b-0 border-white/10' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`font-display font-bold text-xl sm:text-2xl tracking-tight font-mono-tabular transition-colors ${
                      isHovered ? 'text-white' : 'text-[#9B86D6]'
                    }`}
                  >
                    {metric.value}
                  </p>
                  <ArrowUpRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isHovered
                        ? 'text-white translate-x-0.5 -translate-y-0.5'
                        : 'text-[#8E89A3]'
                    }`}
                  />
                </div>
                <p
                  className={`text-xs sm:text-[13px] mt-1 transition-colors ${
                    isHovered ? 'text-[#D4C8F2]' : 'text-[#9E97B4]'
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
