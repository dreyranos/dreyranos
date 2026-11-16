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
import { useContent } from '../prefs';
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
    eyebrow: 'Várias empresas',
    summary: 'Cada cliente no seu canto, no mesmo sistema.',
    title: 'Um sistema para várias empresas',
    detail:
      'Várias empresas usam a mesma base. Cada uma entra com a sua senha e só vê os próprios dados.',
    stack: 'Delphi Horse · C# .NET · Firebird SQL',
    target: '#projetos',
    actionLabel: 'Ver esse trabalho',
  },
  {
    id: 'Desempenho',
    index: '02',
    eyebrow: 'Uso no dia a dia',
    summary: 'Celular, site e computador, sem travar.',
    title: 'Telas rápidas onde a equipe trabalha',
    detail:
      'O app, o site e o programa de computador respondem rápido, mesmo quando muita gente usa ao mesmo tempo.',
    stack: 'Firebird SQL · React Native · Delphi FMX/VCL',
    target: '#atuacao',
    actionLabel: 'Ver na prática',
  },
  {
    id: 'Valor ao Negócio',
    index: '03',
    eyebrow: 'Menos trabalho manual',
    summary: 'Atualizo sem parar a empresa.',
    title: 'Muda o sistema sem fechar a porta',
    detail:
      'O sistema antigo continua funcionando enquanto eu atualizo. O que se repete passa a rodar sozinho.',
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
  empresas: 'Escalabilidade',
  companies: 'Escalabilidade',
  rápidas: 'Desempenho',
  fast: 'Desempenho',
  automático: 'Valor ao Negócio',
  automate: 'Valor ao Negócio',
  operação: 'Valor ao Negócio',
  work: 'Valor ao Negócio',
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
        className={`relative mr-[0.3em] inline-flex items-center text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--line)] ${
          isSelected
            ? 'underline decoration-2 underline-offset-8 decoration-[var(--muted)]'
            : ''
        }`}
        title="Clique para selecionar este princípio técnico abaixo"
      >
        <span
          aria-hidden="true"
          className="opacity-[0.16] text-[var(--fg)] font-bold"
        >
          {word}
        </span>
        <motion.span
          style={{ opacity, y }}
          className="absolute inset-0 font-bold text-[var(--soft)] group-hover:text-[var(--fg)] transition-colors will-change-transform"
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
        className="opacity-[0.16] text-[var(--fg)] font-normal"
      >
        {word}
      </span>
      <motion.span
        style={{ opacity, y }}
        className="absolute inset-0 font-normal text-[var(--fg)] will-change-transform"
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function ManifestoSection() {
  const { profile: PROFILE, ui } = useContent();
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
      className="py-20 sm:py-28 lg:py-32 bg-[var(--bg)]/80 text-[var(--fg)] overflow-x-clip"
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
          <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-[var(--fg)]">
            {ui.profileTitle}
          </h2>
          <p className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>
              {PROFILE.location} · {PROFILE.experienceLabel}
            </span>
          </p>
        </div>
        <AnimatedRule dark className="mb-12 sm:mb-16" />

        {/* ATO 1: RETRATO EM DESTAQUE + PERFIL OBJETIVO E ESPECIFICAÇÕES */}
        <div
          ref={portraitRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch pb-14 sm:pb-20 mb-14 sm:mb-20 border-b border-[var(--line)]"
        >
          {/* Coluna Focal Esquerda: Retrato 1:1 com Moldura Roxa Escura Nocturnal */}
          <div className="lg:col-span-5 flex flex-col">
            <Tilt3DFrame maxTilt={8} className="h-full">
              <div className="h-full flex flex-col justify-between bg-[var(--bg)] border border-[var(--line)]/55 p-4 sm:p-5 relative overflow-hidden shadow-[0_24px_54px_-18px_rgba(41,35,38,0.52)]">
                <div className="flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[var(--muted)] mb-3.5">
                  <span className="inline-flex items-center gap-2 text-[var(--soft)]">
                    <span className="w-1.5 h-1.5 bg-[var(--card)]" />
                    <span>AUTOR · {PROFILE.handle}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMonochromePhoto((v) => !v)}
                    className="px-2 py-0.5 border border-[var(--line)]/60 text-[10px] text-[var(--soft)] hover:bg-[var(--card)] hover:text-[var(--fg)] transition-colors"
                    title="Alternar acabamento fotográfico"
                  >
                    {monochromePhoto ? 'COR ORIGINAL' : 'EDITORIAL P&B'}
                  </button>
                </div>

                {/* Portrait Image Container */}
                <div
                  data-cursor="view"
                  className="relative aspect-square w-full overflow-hidden bg-[var(--bg)] border border-[var(--line)] group"
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
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[var(--bg)] to-[var(--bg)] text-[var(--soft)]">
                      <Code2 className="w-12 h-12 mb-3 text-[var(--muted)]" />
                      <p className="font-display text-2xl font-bold text-[var(--fg)]">
                        {PROFILE.name}
                      </p>
                      <p className="font-mono-tabular text-xs mt-1 text-[var(--soft)]">
                        {PROFILE.handle}
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg)]/92 via-[var(--bg)]/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono-tabular text-[var(--fg)]/95 pointer-events-none">
                    <span className="px-2 py-0.5 bg-[var(--bg)]/85 border border-[var(--line)]">
                      PROANSI · FULL STACK
                    </span>
                    <span className="px-2 py-0.5 bg-[var(--card)] border border-[var(--line)]/60 text-[var(--fg)] font-semibold">
                      9+ ANOS
                    </span>
                  </div>
                </div>

                {/* Portrait Identity Footer */}
                <div className="pt-4 mt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--fg)] leading-tight">
                      {PROFILE.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-mono-tabular text-[var(--soft)] mt-0.5">
                      {PROFILE.role} · {PROFILE.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={PROFILE.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[var(--line)]/65 text-xs font-mono-tabular text-[var(--fg)] hover:bg-[var(--card)] hover:text-[var(--fg)] hover:border-[var(--line)] transition-colors"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={PROFILE.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[var(--line)] text-xs font-mono-tabular text-[var(--soft)] hover:border-[var(--line)] hover:text-[var(--fg)] transition-colors"
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
              <p className="text-xs font-mono-tabular uppercase tracking-[0.14em] text-[var(--soft)] mb-4">
                {ui.supportLine}
              </p>

              <h3 className="font-display font-bold text-[clamp(1.65rem,3.3vw,2.75rem)] leading-[1.12] tracking-[-0.025em] text-[var(--fg)] headline-balance mb-6">
                <ScrollRevealWords text="Software sólido nasce da precisão técnica, clareza arquitetural e domínio da operação real." />
              </h3>

              <div className="space-y-4 text-[15px] sm:text-[17px] leading-[1.68] text-[var(--soft)] max-w-2xl">
                <p>
                  Com mais de{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    9 anos na engenharia de software e infraestrutura de TI
                  </strong>
                  , comecei na sustentação de ambientes críticos e atendimento N2
                  até liderar entregas Full Stack na{' '}
                  <strong className="text-[var(--fg)] font-semibold">PROANSI</strong>.
                </p>
                <p>
                  Essa base completa me permite enxergar além do código isolado:
                  projeto{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    APIs Multi-Tenant
                  </strong>{' '}
                  em Delphi Horse e C# .NET, modernizo bases{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    Firebird SQL
                  </strong>{' '}
                  com zero downtime e entrego aplicações em{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    React Native, Web e Delphi VCL/FMX
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* 2x2 Factual Spec Matrix + Primary Actions */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[var(--line)]">
                {PROFILE_SPECS.map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={spec.label}
                      className="p-4 bg-[var(--bg)]/95 border-r border-b border-[var(--line)] flex items-start gap-3"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[var(--card)]/50 border border-[var(--line)]/55 text-[var(--soft)] shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
                          {spec.label}
                        </p>
                        <p className="font-display font-semibold text-sm text-[var(--fg)] mt-0.5 leading-snug">
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
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--btn)] text-[var(--btn-fg)] text-xs sm:text-sm font-semibold hover:bg-[var(--soft)] transition-colors whitespace-nowrap shrink-0"
                >
                  <RollingText text="Ver trabalhos" />
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => smoothScrollTo('#trajetoria')}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--line)] text-[var(--fg)] text-xs sm:text-sm font-semibold hover:border-[var(--line)] hover:text-[var(--soft)] transition-colors whitespace-nowrap shrink-0"
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
            <p className="text-xs font-mono-tabular uppercase tracking-[0.14em] text-[var(--soft)]">
              {ui.howIWork}
            </p>
            <p className="text-xs font-mono-tabular text-[var(--muted)]">
              Clique nas palavras destacadas ou nos pilares abaixo
            </p>
          </div>

          <div ref={p1Ref}>
            <h3 className="font-display uppercase text-[clamp(1.35rem,3vw,2.55rem)] leading-[1.28] tracking-[-0.02em] text-[var(--fg)] flex flex-wrap items-center">
              {words1.map((word, idx) => {
                const start = idx / words1.length;
                const end = Math.min(1, start + 1.35 / words1.length);
                const clean = word.replace(/[.,—–]/g, '').toLowerCase();
                const mappedPillar = KEYWORD_TO_PILLAR[clean];
                const isBold = Boolean(mappedPillar);
                const showStarBefore = clean === 'empresas';

                return (
                  <span key={`${word}-${idx}`} className="inline-flex items-center">
                    {showStarBefore && (
                      <motion.svg
                        style={{ rotate: starRotate, scale: starScale }}
                        viewBox="0 0 36 36"
                        aria-hidden="true"
                        className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-[var(--muted)] shrink-0 will-change-transform"
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
            <h3 className="font-display uppercase text-[clamp(1.35rem,3vw,2.55rem)] leading-[1.28] tracking-[-0.02em] text-[var(--fg)] flex flex-wrap items-center">
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
                      className="inline-block w-8 sm:w-12 h-[3px] bg-[var(--soft)] mx-4 sm:mx-8 origin-center will-change-transform"
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
          <div className="border border-[var(--line)] bg-[var(--bg)]">
            <div
              role="tablist"
              aria-label="Pilares de engenharia"
              className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-[var(--line)]"
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
                        ? 'bg-[var(--card)]/45 text-[var(--fg)]'
                        : 'bg-[var(--bg)] text-[var(--soft)] hover:bg-[var(--bg)] hover:text-[var(--fg)]'
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
                        className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--soft)]"
                      />
                    )}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-[var(--soft)]">
                        {pillar.index} · {pillar.eyebrow}
                      </span>
                      <span
                        className={`w-2 h-2 ${
                          active ? 'bg-[var(--soft)]' : 'bg-[var(--wash)]'
                        }`}
                      />
                    </div>
                    <h4 className="font-display font-bold text-lg text-[var(--fg)]">
                      {pillar.id}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[var(--soft)] mt-1 leading-relaxed">
                      {pillar.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-6 sm:p-8 bg-[var(--bg)]">
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
                    <p className="font-mono-tabular text-xs uppercase tracking-[0.14em] text-[var(--soft)] mb-2">
                      Pilar {activePillar.index} · {activePillar.id}
                    </p>
                    <h4 className="font-display text-xl sm:text-2xl font-bold text-[var(--fg)] mb-2">
                      {activePillar.title}
                    </h4>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--soft)]">
                      {activePillar.detail}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex flex-col lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[var(--line)] pt-4 lg:pt-0 lg:pl-6">
                    <p className="font-mono-tabular text-xs text-[var(--muted)] lg:text-right">
                      {activePillar.stack}
                    </p>
                    <button
                      type="button"
                      onClick={() => smoothScrollTo(activePillar.target)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--btn)] text-[var(--btn-fg)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--soft)] transition-colors whitespace-nowrap shrink-0 w-fit"
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
