import { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import { EXPERIENCE, EDUCATION } from '../data/portfolio';
import { useContent } from '../prefs';
import { AnimatedRule, ScrollRevealWords } from './AquaEffects';
import { prefillAndScrollToContact } from '../utils/navigation';

interface CareerStage {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  duration: string;
  startYear: number;
  endYear: number;
  track: 'edu' | 'dev' | 'infra' | 'mgmt';
  trackLabel: string;
  elevation: number;
  location: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  transitionNote: string;
  subRoles?: { role: string; period: string }[];
}

function buildCareerStages(
  education: typeof EDUCATION,
  experience: typeof EXPERIENCE,
): CareerStage[] {
  return [
  {
    id: education.id,
    title: education.school,
    subtitle: education.course,
    period: education.period,
    duration: education.duration,
    startYear: education.startYear,
    endYear: education.endYear,
    track: 'edu',
    trackLabel: education.trackLabel,
    elevation: education.elevation,
    location: 'São José do Rio Preto, SP',
    summary: education.summary,
    highlights: education.highlights,
    transitionNote: education.transitionNote,
  },
  ...[...experience].reverse().map((exp) => ({
    id: exp.id,
    title: exp.company,
    subtitle: exp.role,
    period: exp.period,
    duration: exp.duration,
    startYear: exp.startYear,
    endYear: exp.endYear,
    track: exp.track,
    trackLabel: exp.trackLabel,
    elevation: exp.elevation,
    location: exp.location,
    current: exp.current,
    summary: exp.summary,
    highlights: exp.highlights,
    transitionNote: exp.transitionNote,
    subRoles: exp.subRoles,
  })),
  ];
}

const TRACK_FILTERS = [
  { id: 'all' },
  { id: 'dev' },
  { id: 'infra' },
] as const;

export default function ExperienceSection() {
  const { experience, education, edge: EXECUTIVE_EDGE, ui } = useContent();
  const CAREER_STAGES = buildCareerStages(education, experience);
  const [selectedStageId, setSelectedStageId] = useState<string>('proansi');
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);
  const [trackFilter, setTrackFilter] = useState<'all' | 'dev' | 'infra'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string>('proansi');
  const [activeEdgeIdx, setActiveEdgeIdx] = useState<number>(0);

  const ledgerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawLedgerScroll } = useScroll({
    target: ledgerRef,
    offset: ['start 0.8', 'end 0.68'],
  });
  const lineScaleY = useSpring(rawLedgerScroll, {
    stiffness: 140,
    damping: 28,
  });

  const activeStageId = hoveredStageId ?? selectedStageId;
  const activeStageIndex = Math.max(
    0,
    CAREER_STAGES.findIndex((s) => s.id === activeStageId)
  );
  const activeStage = CAREER_STAGES[activeStageIndex];

  const handleStep = (delta: number) => {
    const nextIdx =
      (activeStageIndex + delta + CAREER_STAGES.length) % CAREER_STAGES.length;
    const nextId = CAREER_STAGES[nextIdx].id;
    setSelectedStageId(nextId);
    setExpandedCardId(nextId);
  };

  // Build SVG Career Progression Coordinates (viewBox 0 0 760 220)
  const chartW = 760;
  const chartH = 220;
  const padX = 56;
  const padTop = 34;
  const padBottom = 42;
  const minYear = 2014;
  const maxYear = 2027;

  const points = CAREER_STAGES.map((stage) => {
    const midYear = (stage.startYear + stage.endYear) / 2;
    const x =
      padX + ((midYear - minYear) / (maxYear - minYear)) * (chartW - padX * 2);
    const y =
      chartH -
      padBottom -
      ((stage.elevation - 1) / 4.2) * (chartH - padTop - padBottom);
    return { stage, x, y };
  });

  const curvePath = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${
    chartH - padBottom
  } L ${points[0].x} ${chartH - padBottom} Z`;

  const reverseChronological = [...CAREER_STAGES].reverse();
  const visibleCards = reverseChronological.filter((stage) => {
    if (trackFilter === 'all') return true;
    if (trackFilter === 'dev') return stage.track === 'dev' || stage.track === 'edu';
    return stage.track === 'infra' || stage.track === 'mgmt';
  });

  return (
    <section
      id="trajetoria"
      className="py-16 sm:py-24 bg-[var(--bg)]/82 text-[var(--fg)] overflow-x-clip"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.06 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
          <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-[var(--fg)]">
            <ScrollRevealWords text="03. Trajetória Profissional & Evolução" />
          </h2>
          <span className="font-mono-tabular text-xs uppercase tracking-wider text-[var(--soft)]">
            2014 → Presente · Evolução Contínua em TI &amp; Software
          </span>
        </div>
        <AnimatedRule dark className="mb-10 sm:mb-14" />

        {/* Interactive Career Trajectory Map + Synchronized Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 sm:mb-16 items-stretch">
          {/* Left: Visual Interactive SVG Career Progression Chart */}
          <div className="lg:col-span-7 bg-[var(--bg)] text-[var(--fg)] border border-[var(--line)]/45 p-5 sm:p-7 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[var(--soft)]">
                  {ui.careerMap}
                </p>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--fg)] mt-0.5">
                  {ui.careerTitle}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  aria-label="Etapa anterior"
                  className="w-9 h-9 border border-[var(--line)] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--card)] hover:text-[var(--fg)] hover:border-[var(--line)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  aria-label="Próxima etapa"
                  className="w-9 h-9 border border-[var(--line)] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--card)] hover:text-[var(--fg)] hover:border-[var(--line)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-auto select-none overflow-visible"
                role="img"
                aria-label="Gráfico interativo da evolução profissional de Andrey Ramos de 2014 até o presente"
              >
                <defs>
                  <linearGradient id="careerAreaGradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4B424C" stopOpacity="0.48" />
                    <stop offset="100%" stopColor="#292125" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[
                  { label: 'Full Stack', level: 5 },
                  { label: 'Gestão / N2', level: 3.7 },
                  { label: 'Infra & Dev', level: 2.5 },
                  { label: 'Formação', level: 1.3 },
                ].map((guide) => {
                  const gy =
                    chartH -
                    padBottom -
                    ((guide.level - 1) / 4.2) * (chartH - padTop - padBottom);
                  return (
                    <g key={guide.label}>
                      <line
                        x1={padX - 18}
                        y1={gy}
                        x2={chartW - padX + 18}
                        y2={gy}
                        stroke="rgba(129,124,128,0.14)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={6}
                        y={gy + 3}
                        className="fill-[var(--card)] text-[9px] font-mono-tabular uppercase"
                      >
                        {guide.label}
                      </text>
                    </g>
                  );
                })}

                <motion.path
                  d={areaPath}
                  fill="url(#careerAreaGradPurple)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                />

                <motion.path
                  d={curvePath}
                  fill="none"
                  stroke="#817C80"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />

                {[2014, 2017, 2020, 2022, 2023, 2026].map((yr) => {
                  const tx =
                    padX + ((yr - minYear) / (maxYear - minYear)) * (chartW - padX * 2);
                  return (
                    <g key={yr}>
                      <line
                        x1={tx}
                        y1={chartH - padBottom}
                        x2={tx}
                        y2={chartH - padBottom + 6}
                        stroke="rgba(155,150,153,0.32)"
                      />
                      <text
                        x={tx}
                        y={chartH - padBottom + 20}
                        textAnchor="middle"
                        className="fill-[var(--card)] text-[10px] font-mono-tabular"
                      >
                        {yr === 2026 ? 'Atual' : yr}
                      </text>
                    </g>
                  );
                })}

                {points.map(({ stage, x, y }) => {
                  const isActive = activeStage.id === stage.id;
                  const shortName =
                    stage.id === 'etec'
                      ? 'Etec TI'
                      : stage.id === 'casa-das-vacinas'
                      ? 'Casa das Vacinas'
                      : stage.id === 'tesla'
                      ? 'Tesla'
                      : stage.id === 'hepta'
                      ? 'Hepta N2'
                      : 'PROANSI';
                  return (
                    <g
                      key={stage.id}
                      onMouseEnter={() => setHoveredStageId(stage.id)}
                      onMouseLeave={() => setHoveredStageId(null)}
                      onClick={() => {
                        setSelectedStageId(stage.id);
                        setExpandedCardId(stage.id);
                      }}
                      className="cursor-pointer"
                    >
                      {isActive && (
                        <line
                          x1={x}
                          y1={y}
                          x2={x}
                          y2={chartH - padBottom}
                          stroke="#9B9699"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                      )}

                      <circle cx={x} cy={y} r={24} fill="transparent" />

                      {isActive && (
                        <circle
                          cx={x}
                          cy={y}
                          r={13}
                          fill="none"
                          stroke="#9B9699"
                          strokeWidth="1.5"
                          strokeOpacity="0.6"
                        />
                      )}

                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 7.5 : 5.5}
                        fill={isActive ? '#9B9699' : '#08080D'}
                        stroke="#817C80"
                        strokeWidth="2"
                      />

                      <text
                        x={x}
                        y={y - 16}
                        textAnchor="middle"
                        className={`text-[10.5px] font-display font-semibold transition-colors ${
                          isActive ? 'fill-white' : 'fill-[var(--soft)]'
                        }`}
                      >
                        {shortName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--line)] flex flex-wrap gap-1.5">
              {CAREER_STAGES.map((stage, idx) => {
                const isActive = activeStage.id === stage.id;
                const label =
                  stage.id === 'etec'
                    ? '2014 · Etec'
                    : stage.id === 'casa-das-vacinas'
                    ? '2017 · Casa das Vacinas'
                    : stage.id === 'tesla'
                    ? '2022 · Tesla'
                    : stage.id === 'hepta'
                    ? '2022 · Hepta'
                    : '2023 · PROANSI';
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setSelectedStageId(stage.id);
                      setExpandedCardId(stage.id);
                    }}
                    className={`relative z-10 px-2.5 py-1.5 text-[11px] font-mono-tabular transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[var(--btn-fg)] font-semibold'
                        : 'text-[var(--soft)] hover:text-[var(--fg)] border border-[var(--line)]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="careerStepActive"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-[var(--btn)] -z-10"
                      />
                    )}
                    <span>
                      0{idx + 1}. {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Synchronized Stage Detail Inspector */}
          <div className="lg:col-span-5 bg-[var(--bg)] border border-[var(--line)] p-6 sm:p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--line)]">
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular text-xs uppercase tracking-wider text-[var(--soft)] font-semibold">
                    {activeStage.track === 'edu' ? (
                      <GraduationCap className="w-4 h-4" />
                    ) : (
                      <Briefcase className="w-4 h-4" />
                    )}
                    <span>{activeStage.trackLabel}</span>
                  </span>
                  <span className="font-mono-tabular text-xs text-[var(--muted)]">
                    {activeStage.period}
                  </span>
                </div>

                <h4 className="font-display text-2xl sm:text-[26px] font-bold text-[var(--fg)] leading-tight">
                  {activeStage.title}
                </h4>
                <p className="text-sm font-semibold text-[var(--soft)] mt-1">
                  {activeStage.subtitle} · {activeStage.duration}
                </p>

                <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[var(--soft)]">
                  {activeStage.summary}
                </p>

                <p className="mt-5 mb-2.5 text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
                  Principais Entregas &amp; Foco
                </p>
                <ul className="space-y-2 text-sm text-[var(--fg)]">
                  {activeStage.highlights.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <span className="font-mono-tabular text-[var(--muted)] font-bold">
                        —
                      </span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border border-[var(--line)]/40 bg-[var(--card)]/20 p-4">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--soft)] font-semibold mb-1">
                    Conexão na Trajetória
                  </p>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--fg)]">
                    {activeStage.transitionNote}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
            Detalhamento Cronológico · Clique em qualquer etapa para expandir
          </p>

          <div
            role="tablist"
            aria-label="Filtrar etapas da trajetória"
            className="flex flex-wrap gap-1 bg-[var(--bg)] p-1 border border-[var(--line)]"
          >
            {TRACK_FILTERS.map((f, filterIdx) => {
              const active = trackFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTrackFilter(f.id)}
                  className={`relative z-10 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'text-[var(--btn-fg)]' : 'text-[var(--soft)] hover:text-[var(--fg)]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="careerFilterBg"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 bg-[var(--btn)] -z-10"
                    />
                  )}
                  {ui.filters[filterIdx]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll-Driven Vertical Timeline Ledger */}
        <div ref={ledgerRef} className="relative pl-5 sm:pl-8">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-[var(--wash)]"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScaleY }}
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--soft)] origin-top will-change-transform"
          />

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {visibleCards.map((stage) => {
                const isOpen = expandedCardId === stage.id;
                const isSelectedInChart = activeStage.id === stage.id;
                return (
                  <motion.div
                    layout
                    key={stage.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative border transition-colors ${
                      isSelectedInChart
                        ? 'border-[var(--line)]/70 bg-[var(--bg)]'
                        : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--line)]/65'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`hidden sm:block absolute -left-8 top-7 w-3 h-3 -translate-x-[5px] border transition-colors ${
                        stage.current || isSelectedInChart
                          ? 'bg-[var(--card)] border-[var(--line)]'
                          : 'bg-[var(--bg)] border-white/35'
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStageId(stage.id);
                        setExpandedCardId(isOpen ? '' : stage.id);
                      }}
                      aria-expanded={isOpen}
                      className="w-full text-left p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-center"
                    >
                      <div className="lg:col-span-3">
                        <p className="font-mono-tabular text-xs font-medium text-[var(--fg)]">
                          {stage.period}
                        </p>
                        <p className="font-mono-tabular text-xs text-[var(--muted)] mt-0.5">
                          {stage.duration}
                          {stage.current && (
                            <span className="text-[var(--soft)] font-semibold">
                              {' '}
                              · Atual
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="lg:col-span-4">
                        <h4 className="font-display text-lg sm:text-xl font-bold text-[var(--fg)]">
                          {stage.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[var(--soft)]">
                          {stage.subtitle}
                        </p>
                      </div>

                      <div className="lg:col-span-4">
                        <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)]">
                          {stage.trackLabel}
                        </p>
                      </div>

                      <div className="lg:col-span-1 flex justify-end">
                        <ChevronDown
                          className={`w-4 h-4 text-[var(--soft)] transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            clipPath: 'inset(0% 0% 100% 0%)',
                          }}
                          animate={{
                            opacity: 1,
                            clipPath: 'inset(0% 0% 0% 0%)',
                          }}
                          exit={{
                            opacity: 0,
                            clipPath: 'inset(0% 0% 100% 0%)',
                          }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="px-5 sm:px-6 pb-6 pt-3 border-t border-[var(--line)]"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-7">
                              <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--soft)]">
                                {stage.summary}
                              </p>

                              {stage.subRoles && (
                                <div className="mt-4 pt-3 border-t border-[var(--line)] space-y-1.5 max-w-md">
                                  {stage.subRoles.map((sub) => (
                                    <div
                                      key={sub.role}
                                      className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--soft)]"
                                    >
                                      <span className="font-semibold text-[var(--fg)]">
                                        {sub.role}
                                      </span>
                                      <span className="font-mono-tabular">
                                        {sub.period}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="lg:col-span-5 space-y-2 text-xs sm:text-[13px] text-[var(--fg)]">
                              {stage.highlights.map((hl) => (
                                <p key={hl} className="flex items-start gap-2">
                                  <span className="font-mono-tabular text-[var(--muted)] font-bold">
                                    —
                                  </span>
                                  <span>{hl}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Visão End-to-End */}
        <div className="mt-14 sm:mt-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
              Diferencial Executivo · Visão End-to-End
            </p>
            <button
              type="button"
              onClick={() =>
                prefillAndScrollToContact(
                  'Vaga Full-Time',
                  'Olá Andrey! Vi sua trajetória de infraestrutura até arquitetura Full Stack e gostaria de conversar sobre uma oportunidade.'
                )
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--soft)] hover:text-[var(--fg)] hover:underline"
            >
              <span>Conversar sobre oportunidade</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXECUTIVE_EDGE.map((point, idx) => {
              const active = activeEdgeIdx === idx;
              return (
                <motion.button
                  key={point}
                  type="button"
                  onClick={() => setActiveEdgeIdx(idx)}
                  onMouseEnter={() => setActiveEdgeIdx(idx)}
                  whileHover={{ y: -4 }}
                  className={`text-left p-6 border transition-colors ${
                    active
                      ? 'bg-[var(--card)] text-[var(--fg)] border-[var(--line)]'
                      : 'bg-[var(--bg)] text-[var(--soft)] border-[var(--line)] hover:border-[var(--line)]/75'
                  }`}
                >
                  <span
                    className={`font-mono-tabular text-xs font-semibold ${
                      active ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
                    }`}
                  >
                    0{idx + 1}.
                  </span>
                  <p
                    className={`mt-2.5 text-sm sm:text-[15px] leading-relaxed font-medium ${
                      active ? 'text-[var(--fg)]' : 'text-[var(--fg)]'
                    }`}
                  >
                    {point}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
