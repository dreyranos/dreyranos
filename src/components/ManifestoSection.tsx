import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {
  ArrowUpRight,
  ArrowDown,
  Code2,
  MapPin,
  Briefcase,
  Layers,
  Cpu,
  Terminal,
} from 'lucide-react';
import { PROFILE } from '../data/portfolio';
import {
  AnimatedRule,
  ScrollRevealWords,
  Tilt3DFrame,
  RollingText,
} from './AquaEffects';
import { smoothScrollTo } from '../utils/navigation';

const PILLAR_DATA = [
  {
    id: 'Escalabilidade',
    index: '01',
    eyebrow: 'Backend & Multi-Tenant',
    summary: 'Isolamento real por cliente sobre infraestrutura unificada.',
    title: 'Arquitetura Multi-Tenant com Isolamento Real',
    detail:
      'Resolução automática de contexto por cliente no gateway de API, permitindo atender múltiplas empresas simultaneamente sobre uma única base segura em Delphi Horse e C# .NET.',
    stack: 'Delphi Horse · C# .NET · Firebird SQL',
    target: '#projetos',
    actionLabel: 'Inspecionar blueprint multi-tenant',
  },
  {
    id: 'Desempenho',
    index: '02',
    eyebrow: 'Dados & Clientes Nativos',
    summary: 'Tuning Firebird SQL e clientes fluidos no mobile, web e desktop.',
    title: 'Tuning de Dados & Clientes Nativos de Baixa Latência',
    detail:
      'Análise contínua de planos de execução em Firebird SQL, eliminação de gargalos de I/O e entrega de interfaces ágeis em React Native, React, Angular e Delphi VCL/FMX.',
    stack: 'Firebird SQL · React Native · Delphi FMX/VCL',
    target: '#atuacao',
    actionLabel: 'Assistir fluxos das especialidades',
  },
  {
    id: 'Valor ao Negócio',
    index: '03',
    eyebrow: 'Evolução & Automação',
    summary: 'Modernização sem parada operacional e scripts de alta eficiência.',
    title: 'Evolução Incremental Sem Parar a Operação',
    detail:
      'Refatoração progressiva de sistemas legados mantendo 100% da continuidade do negócio, somada a rotinas determinísticas em Python, Bash e fluxos inteligentes com IA.',
    stack: 'Python · Bash · Fluxos com IA · Refatoração Segura',
    target: '#trajetoria',
    actionLabel: 'Explorar trajetória prática',
  },
] as const;

const PROFILE_SPECS = [
  {
    icon: Briefcase,
    label: 'Atuação Atual',
    value: 'Desenvolvedor Full Stack @ PROANSI',
  },
  {
    icon: Layers,
    label: 'Especialidade Central',
    value: 'APIs Multi-Tenant & Firebird SQL',
  },
  {
    icon: Cpu,
    label: 'Plataformas',
    value: 'React Native, Web & Delphi FMX/VCL',
  },
  {
    icon: Terminal,
    label: 'Automação & Sistema',
    value: 'Python, Bash, Fluxos IA & AOSP',
  },
] as const;

const KEYWORD_TO_PILLAR: Record<string, string> = {
  'multi-tenant': 'Escalabilidade',
  delphi: 'Escalabilidade',
  escalável: 'Escalabilidade',
  firebird: 'Desempenho',
  legível: 'Valor ao Negócio',
  incrementais: 'Valor ao Negócio',
  automação: 'Valor ao Negócio',
};

function WordToken({
  word,
  range,
  progress,
  isBold,
  isSelected,
  onSelect,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  isBold?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [10, 0]);

  if (isBold && onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`relative mr-[0.3em] inline-flex items-center text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B86D6] ${
          isSelected
            ? 'underline decoration-2 underline-offset-8 decoration-[#826BC2]'
            : ''
        }`}
        title="Clique para selecionar este princípio técnico abaixo"
      >
        <span
          aria-hidden="true"
          className="opacity-[0.16] text-[#F5F4FA] font-bold"
        >
          {word}
        </span>
        <motion.span
          style={{ opacity, y }}
          className="absolute inset-0 font-bold text-[#9B86D6] group-hover:text-white transition-colors will-change-transform"
        >
          {word}
        </motion.span>
      </button>
    );
  }

  return (
    <span className="relative mr-[0.3em] inline-flex items-center">
      <span
        aria-hidden="true"
        className="opacity-[0.16] text-[#F5F4FA] font-normal"
      >
        {word}
      </span>
      <motion.span
        style={{ opacity, y }}
        className="absolute inset-0 font-normal text-[#F5F4FA] will-change-transform"
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>('Escalabilidade');
  const [photoError, setPhotoError] = useState(false);
  const [monochromePhoto, setMonochromePhoto] = useState(false);

  const { scrollYProgress: rawPortrait } = useScroll({
    target: portraitRef,
    offset: ['start end', 'end start'],
  });
  const portraitScroll = useSpring(rawPortrait, { stiffness: 120, damping: 24 });
  const portraitImgY = useTransform(portraitScroll, [0, 1], ['-4%', '4%']);
  const portraitImgScale = useTransform(
    portraitScroll,
    [0, 0.5, 1],
    [1.06, 1.01, 1.05]
  );

  const { scrollYProgress: rawP1 } = useScroll({
    target: p1Ref,
    offset: ['start 0.92', 'start 0.34'],
  });
  const p1Progress = useSpring(rawP1, { stiffness: 130, damping: 24 });

  const { scrollYProgress: rawP2 } = useScroll({
    target: p2Ref,
    offset: ['start 0.9', 'start 0.34'],
  });
  const p2Progress = useSpring(rawP2, { stiffness: 130, damping: 24 });

  const { scrollYProgress: rawSection } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const sectionScroll = useSpring(rawSection, { stiffness: 110, damping: 24 });

  const starRotate = useTransform(p1Progress, [0, 1], [0, 540]);
  const starScale = useTransform(p1Progress, [0, 1], [0.65, 1.3]);
  const dashScaleX = useTransform(p2Progress, [0, 1], [0.4, 3.2]);
  const stageScale = useTransform(sectionScroll, [0, 0.5, 1], [0.97, 1, 0.98]);

  const words1 = PROFILE.manifestoParts.statement1.split(' ');
  const words2 = PROFILE.manifestoParts.statement2.split(' ');
  const activePillar =
    PILLAR_DATA.find((p) => p.id === selectedPillar) ?? PILLAR_DATA[0];

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="py-20 sm:py-28 lg:py-32 bg-[#09090F]/80 text-[#F5F4FA] overflow-x-clip"
    >
      <motion.div
        style={{ scale: stageScale }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 will-change-transform"
      >
        {/* Clean Editorial Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
          <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-white">
            01. Sobre Andrey Ramos
          </h2>
          <p className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[#9B86D6]">
            <MapPin className="w-3.5 h-3.5 text-[#826BC2]" />
            <span>
              {PROFILE.location} · {PROFILE.experienceLabel}
            </span>
          </p>
        </div>
        <AnimatedRule dark className="mb-12 sm:mb-16" />

        {/* ATO 1: RETRATO EM DESTAQUE + PERFIL OBJETIVO E ESPECIFICAÇÕES */}
        <div
          ref={portraitRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch pb-14 sm:pb-20 mb-14 sm:mb-20 border-b border-white/10"
        >
          {/* Coluna Focal Esquerda: Retrato 1:1 com Moldura Roxa Escura Nocturnal */}
          <div className="lg:col-span-5 flex flex-col">
            <Tilt3DFrame maxTilt={8} className="h-full">
              <div className="h-full flex flex-col justify-between bg-[#0B0914] border border-[#4C1D95]/55 p-4 sm:p-5 relative overflow-hidden shadow-[0_24px_54px_-18px_rgba(46,16,101,0.52)]">
                <div className="flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[#8E89A3] mb-3.5">
                  <span className="inline-flex items-center gap-2 text-[#9B86D6]">
                    <span className="w-1.5 h-1.5 bg-[#5B21B6]" />
                    <span>AUTOR · {PROFILE.handle}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMonochromePhoto((v) => !v)}
                    className="px-2 py-0.5 border border-[#4C1D95]/60 text-[10px] text-[#9B86D6] hover:bg-[#4C1D95] hover:text-white transition-colors"
                    title="Alternar acabamento fotográfico"
                  >
                    {monochromePhoto ? 'COR ORIGINAL' : 'EDITORIAL P&B'}
                  </button>
                </div>

                {/* Portrait Image Container */}
                <div
                  data-cursor="view"
                  className="relative aspect-square w-full overflow-hidden bg-[#100D1B] border border-white/10 group"
                >
                  {!photoError ? (
                    <motion.img
                      style={{ y: portraitImgY, scale: portraitImgScale }}
                      src={PROFILE.avatarUrl}
                      alt={`Retrato profissional de ${PROFILE.name}`}
                      referrerPolicy="no-referrer"
                      onError={() => setPhotoError(true)}
                      className={`w-full h-full object-cover object-top transition-all duration-500 will-change-transform group-hover:scale-[1.03] ${
                        monochromePhoto
                          ? 'grayscale contrast-125'
                          : 'grayscale-0 contrast-105'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#190D33] to-[#060609] text-[#C4C0D4]">
                      <Code2 className="w-12 h-12 mb-3 text-[#826BC2]" />
                      <p className="font-display text-2xl font-bold text-white">
                        {PROFILE.name}
                      </p>
                      <p className="font-mono-tabular text-xs mt-1 text-[#9B86D6]">
                        {PROFILE.handle}
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050408]/92 via-[#050408]/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono-tabular text-white/95 pointer-events-none">
                    <span className="px-2 py-0.5 bg-[#060609]/85 border border-white/15">
                      PROANSI · FULL STACK
                    </span>
                    <span className="px-2 py-0.5 bg-[#3B0764] border border-[#5B21B6]/60 text-white font-semibold">
                      9+ ANOS
                    </span>
                  </div>
                </div>

                {/* Portrait Identity Footer */}
                <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">
                      {PROFILE.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-mono-tabular text-[#9B86D6] mt-0.5">
                      {PROFILE.role} · {PROFILE.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={PROFILE.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#4C1D95]/65 text-xs font-mono-tabular text-[#F5F4FA] hover:bg-[#4C1D95] hover:text-white hover:border-[#826BC2] transition-colors"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={PROFILE.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-white/20 text-xs font-mono-tabular text-[#C4C0D4] hover:border-[#826BC2] hover:text-white transition-colors"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </Tilt3DFrame>
          </div>

          {/* Coluna Direita: História Direta + Ficha Factual 2x2 + CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 py-1">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-[0.14em] text-[#9B86D6] mb-4">
                Do Suporte N2 &amp; Infraestrutura à Arquitetura Full Stack
              </p>

              <h3 className="font-display font-bold text-[clamp(1.65rem,3.3vw,2.75rem)] leading-[1.12] tracking-[-0.025em] text-white headline-balance mb-6">
                <ScrollRevealWords text="Software sólido nasce da precisão técnica, clareza arquitetural e domínio da operação real." />
              </h3>

              <div className="space-y-4 text-[15px] sm:text-[17px] leading-[1.68] text-[#C4C0D4] max-w-2xl">
                <p>
                  Com mais de{' '}
                  <strong className="text-white font-semibold">
                    9 anos na engenharia de software e infraestrutura de TI
                  </strong>
                  , comecei na sustentação de ambientes críticos e atendimento N2
                  até liderar entregas Full Stack na{' '}
                  <strong className="text-white font-semibold">PROANSI</strong>.
                </p>
                <p>
                  Essa base completa me permite enxergar além do código isolado:
                  projeto{' '}
                  <strong className="text-white font-semibold">
                    APIs Multi-Tenant
                  </strong>{' '}
                  em Delphi Horse e C# .NET, modernizo bases{' '}
                  <strong className="text-white font-semibold">
                    Firebird SQL
                  </strong>{' '}
                  com zero downtime e entrego aplicações em{' '}
                  <strong className="text-white font-semibold">
                    React Native, Web e Delphi VCL/FMX
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* 2x2 Factual Spec Matrix + Primary Actions */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-white/10">
                {PROFILE_SPECS.map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={spec.label}
                      className="p-4 bg-[#0E0E17]/95 border-r border-b border-white/10 flex items-start gap-3"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#3B0764]/50 border border-[#4C1D95]/55 text-[#9B86D6] shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#8E89A3]">
                          {spec.label}
                        </p>
                        <p className="font-display font-semibold text-sm text-white mt-0.5 leading-snug">
                          {spec.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => smoothScrollTo('#projetos')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#4C1D95] text-white text-xs sm:text-sm font-semibold hover:bg-[#5B21B6] transition-colors whitespace-nowrap shrink-0"
                >
                  <RollingText text="Explorar Projetos" />
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => smoothScrollTo('#trajetoria')}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-[#F5F4FA] text-xs sm:text-sm font-semibold hover:border-[#826BC2] hover:text-[#9B86D6] transition-colors whitespace-nowrap shrink-0"
                >
                  <RollingText text="Ver Linha do Tempo" />
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ATO 2: MANIFESTO DE ENGENHARIA + PILARES UNIFICADOS */}
        <div className="max-w-[1220px] mx-auto space-y-10 sm:space-y-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-mono-tabular uppercase tracking-[0.14em] text-[#9B86D6]">
              Manifesto &amp; Princípios de Engenharia
            </p>
            <p className="text-xs font-mono-tabular text-[#8E89A3]">
              Clique nas palavras destacadas ou nos pilares abaixo
            </p>
          </div>

          <div ref={p1Ref}>
            <h3 className="font-display uppercase text-[clamp(1.35rem,3vw,2.55rem)] leading-[1.28] tracking-[-0.02em] text-[#F5F4FA] flex flex-wrap items-center">
              {words1.map((word, idx) => {
                const start = idx / words1.length;
                const end = Math.min(1, start + 1.35 / words1.length);
                const clean = word.replace(/[.,—–]/g, '').toLowerCase();
                const mappedPillar = KEYWORD_TO_PILLAR[clean];
                const isBold = Boolean(mappedPillar);
                const showStarBefore = clean === 'apis';

                return (
                  <span key={`${word}-${idx}`} className="inline-flex items-center">
                    {showStarBefore && (
                      <motion.svg
                        style={{ rotate: starRotate, scale: starScale }}
                        viewBox="0 0 36 36"
                        aria-hidden="true"
                        className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-[#826BC2] shrink-0 will-change-transform"
                      >
                        <path
                          fill="currentColor"
                          d="M18 0L21.5 14.5L36 18L21.5 21.5L18 36L14.5 21.5L0 18L14.5 14.5L18 0Z"
                        />
                      </motion.svg>
                    )}
                    <WordToken
                      word={word}
                      range={[start, end]}
                      progress={p1Progress}
                      isBold={isBold}
                      isSelected={mappedPillar === selectedPillar}
                      onSelect={
                        mappedPillar
                          ? () => setSelectedPillar(mappedPillar)
                          : undefined
                      }
                    />
                  </span>
                );
              })}
            </h3>
          </div>

          <div ref={p2Ref}>
            <h3 className="font-display uppercase text-[clamp(1.35rem,3vw,2.55rem)] leading-[1.28] tracking-[-0.02em] text-[#F5F4FA] flex flex-wrap items-center">
              {words2.map((word, idx) => {
                const start = idx / words2.length;
                const end = Math.min(1, start + 1.35 / words2.length);
                const clean = word.replace(/[.,]/g, '').toLowerCase();
                const mappedPillar = KEYWORD_TO_PILLAR[clean];
                const isBold = Boolean(mappedPillar);

                if (word === '—' || word === '-') {
                  return (
                    <motion.span
                      key={`dash-${idx}`}
                      style={{ scaleX: dashScaleX }}
                      aria-hidden="true"
                      className="inline-block w-8 sm:w-12 h-[3px] bg-[#4C1D95] mx-4 sm:mx-8 origin-center will-change-transform"
                    />
                  );
                }

                return (
                  <WordToken
                    key={`${word}-${idx}`}
                    word={word}
                    range={[start, end]}
                    progress={p2Progress}
                    isBold={isBold}
                    isSelected={mappedPillar === selectedPillar}
                    onSelect={
                      mappedPillar
                        ? () => setSelectedPillar(mappedPillar)
                        : undefined
                    }
                  />
                );
              })}
            </h3>
          </div>

          {/* Unified 3-Pillar Explorer Matrix + Synchronized Detail Drawer */}
          <div className="border border-white/10 bg-[#0E0E17]">
            <div
              role="tablist"
              aria-label="Pilares de engenharia"
              className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10"
            >
              {PILLAR_DATA.map((pillar) => {
                const active = selectedPillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedPillar(pillar.id)}
                    className={`relative text-left p-5 sm:p-6 transition-colors ${
                      active
                        ? 'bg-[#3B0764]/45 text-white'
                        : 'bg-[#0E0E17] text-[#C4C0D4] hover:bg-[#141221] hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="sobrePillarTopBar"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                        className="absolute top-0 left-0 right-0 h-[3px] bg-[#4C1D95]"
                      />
                    )}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#9B86D6]">
                        {pillar.index} · {pillar.eyebrow}
                      </span>
                      <span
                        className={`w-2 h-2 ${
                          active ? 'bg-[#9B86D6]' : 'bg-white/15'
                        }`}
                      />
                    </div>
                    <h4 className="font-display font-bold text-lg text-white">
                      {pillar.id}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#9E97B4] mt-1 leading-relaxed">
                      {pillar.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-6 sm:p-8 bg-[#0B0B12]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                >
                  <div className="lg:col-span-8">
                    <p className="font-mono-tabular text-xs uppercase tracking-[0.14em] text-[#9B86D6] mb-2">
                      Pilar {activePillar.index} · {activePillar.id}
                    </p>
                    <h4 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                      {activePillar.title}
                    </h4>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-[#C4C0D4]">
                      {activePillar.detail}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex flex-col lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                    <p className="font-mono-tabular text-xs text-[#8E89A3] lg:text-right">
                      {activePillar.stack}
                    </p>
                    <button
                      type="button"
                      onClick={() => smoothScrollTo(activePillar.target)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4C1D95] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5B21B6] transition-colors whitespace-nowrap shrink-0 w-fit"
                    >
                      <span>{activePillar.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
