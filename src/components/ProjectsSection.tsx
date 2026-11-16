import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
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
  X,
  Layers,
  Server,
  Database,
  Smartphone,
  Monitor,
  Terminal,
  GitBranch,
  Activity,
  Play,
  Maximize2,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  TECH_STACK,
  FALLBACK_REPOS,
  PROFILE,
  type ShowcaseProject,
  type GitHubRepo,
} from '../data/portfolio';
import {
  AnimatedRule,
  RollingText,
  ScrollRevealWords,
  Tilt3DFrame,
} from './AquaEffects';
import FlowVideoSimulator from './FlowVideoSimulator';
import { TechIcon } from './TechIcons';
import { smoothScrollTo } from '../utils/navigation';
import { useContent } from '../prefs';

const STACK_FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'frontend', label: 'Web, Mobile & Desktop' },
  { id: 'infra', label: 'Dados & Infra' },
  { id: 'praticas', label: 'Práticas' },
] as const;

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const FALLBACK_WEEKDAY_COUNTS = [4, 14, 19, 16, 21, 15, 7];

function ShowcaseRow({
  project,
  index,
  total,
  deckProgress,
  failed,
  onImageError,
  onSelect,
}: {
  project: ShowcaseProject;
  index: number;
  total: number;
  deckProgress: MotionValue<number>;
  failed: boolean;
  onImageError: (id: string) => void;
  onSelect: (project: ShowcaseProject) => void;
}) {
  const { ui } = useContent();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawCardScroll } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const cardScroll = useSpring(rawCardScroll, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });

  const rangeStart = index / total;
  const targetScale = 1 - (total - 1 - index) * 0.048;
  const stackScale = useTransform(deckProgress, [rangeStart, 1], [1, targetScale]);
  const stackRotateX = useTransform(deckProgress, [rangeStart, 1], [0, 5]);
  const innerImgScale = useTransform(cardScroll, [0, 0.5, 1], [1.24, 1.08, 1.18]);
  const innerImgY = useTransform(cardScroll, [0, 1], ['-9%', '9%']);

  const isVioletCard = index % 2 === 1;
  const isMediaLeft = index % 2 === 1;
  const stickyTopPx = 82 + index * 20;

  return (
    <div
      ref={cardRef}
      style={{ perspective: 1300 }}
      className="lg:sticky lg:mb-[10vh] last:lg:mb-0"
    >
      <motion.article
        style={{
          scale: stackScale,
          rotateX: stackRotateX,
          top: stickyTopPx,
        }}
        className={`lg:sticky origin-top border p-6 sm:p-10 lg:p-12 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] will-change-transform ${
          isVioletCard
            ? 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)]/45'
            : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text & Monumental Title Column */}
          <div
            className={`lg:col-span-6 ${
              isMediaLeft ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[var(--line)]">
              <p className="font-mono-tabular text-xs uppercase tracking-[0.14em] text-[var(--soft)]">
                {project.index} · {project.category}
              </p>
              <span className="font-mono-tabular text-xs text-[var(--muted)]">
                {project.year}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelect(project)}
              className="block w-full text-left group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--line)]"
            >
              <h4 className="font-display font-extrabold uppercase tracking-[-0.035em] text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.88] text-[var(--fg)] group-hover:text-[var(--soft)] transition-colors duration-200">
                <span className="block">{project.titleTop}</span>
                <span className="block">{project.titleBottom}</span>
              </h4>
            </button>

            <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.6] max-w-xl text-[var(--soft)]">
              {project.shortDesc}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono-tabular text-[var(--muted)]">
              {project.stack.map((tech, tIdx) => (
                <span key={tech} className="inline-flex items-center gap-2.5">
                  {tIdx > 0 && <span aria-hidden="true">·</span>}
                  <span>{tech}</span>
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onSelect(project)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  isVioletCard
                    ? 'bg-[var(--btn)] text-[var(--btn-fg)] hover:bg-[var(--soft)]'
                    : 'bg-[var(--btn)] text-[var(--btn-fg)] hover:bg-[var(--soft)]'
                }`}
              >
                <RollingText text={ui.howItWorks} />
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider editorial-underline py-1 whitespace-nowrap shrink-0 text-[var(--fg)] hover:text-[var(--soft)]"
                >
                  <span>Repositório GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Media Column */}
          <div
            className={`lg:col-span-6 ${
              isMediaLeft ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <Tilt3DFrame maxTilt={9}>
              <motion.button
                type="button"
                data-cursor="view"
                initial={{ clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.7 }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelect(project)}
                aria-label={`Abrir detalhes de ${project.titleTop} ${project.titleBottom}`}
                className="block w-full text-left overflow-hidden border border-[var(--line)]/30 bg-[var(--bg)] aspect-[4/3] relative group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--line)]"
              >
                {!failed ? (
                  <motion.img
                    style={{ y: innerImgY, scale: innerImgScale }}
                    src={project.image}
                    alt={project.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => onImageError(project.id)}
                    className="w-full h-full object-cover brightness-95 group-hover:brightness-105 transition-[filter] duration-300 will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[var(--card)] to-[var(--bg)] text-[var(--fg)]">
                    <Layers className="w-10 h-10 mb-3 text-[var(--muted)]" />
                    <p className="font-display font-bold text-xl">
                      {project.titleTop} {project.titleBottom}
                    </p>
                    <p className="text-xs text-[var(--soft)] mt-1">{project.category}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-[var(--fg)]">
                  <span className="text-[var(--soft)] font-semibold">{project.metrics[0]?.value}</span>
                  <span className="underline underline-offset-4">
                    Abrir estudo ↗
                  </span>
                </div>
              </motion.button>
            </Tilt3DFrame>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const { projects: SHOWCASE_PROJECTS, arch: ARCH_NODES, ui } = useContent();
  const deckRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawDeck } = useScroll({
    target: deckRef,
    offset: ['start start', 'end end'],
  });
  const deckProgress = useSpring(rawDeck, {
    stiffness: 120,
    damping: 26,
    mass: 0.25,
  });

  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(
    null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('gateway');
  const [simulatingFlow, setSimulatingFlow] = useState<boolean>(false);
  const [stackFilter, setStackFilter] = useState<string>('all');
  const [selectedTechId, setSelectedTechId] = useState<string>('horse');
  const [chartMode, setChartMode] = useState<'area' | 'bars'>('area');
  const [activeDayIdx, setActiveDayIdx] = useState<number>(4);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [reposLoading, setReposLoading] = useState<boolean>(true);
  const [weekdayCounts, setWeekdayCounts] = useState<number[]>(
    FALLBACK_WEEKDAY_COUNTS
  );
  const [githubPublicRepos, setGithubPublicRepos] = useState<number>(3);
  const [activitySource, setActivitySource] = useState<'live' | 'cached'>(
    'cached'
  );
  const flowStageRef = useRef<HTMLDivElement | null>(null);

  const handleStartFlowSimulation = () => {
    flushSync(() => {
      setSimulatingFlow(true);
    });
    const stageEl = flowStageRef.current;
    if (stageEl && !document.fullscreenElement) {
      stageEl.requestFullscreen?.().catch(() => {});
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadGitHub() {
      try {
        const [reposRes, userRes, eventsRes] = await Promise.all([
          fetch('https://api.github.com/users/dreyranos/repos?sort=updated&per_page=6'),
          fetch('https://api.github.com/users/dreyranos'),
          fetch('https://api.github.com/users/dreyranos/events/public?per_page=100'),
        ]);

        if (reposRes.ok) {
          const data = await reposRes.json();
          if (!cancelled && Array.isArray(data) && data.length > 0) {
            setRepos(
              data.map((r: GitHubRepo) => ({
                name: r.name,
                description: r.description,
                language: r.language,
                html_url: r.html_url,
                homepage: r.homepage,
                updated_at: r.updated_at,
              }))
            );
          }
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          if (!cancelled && typeof userData?.public_repos === 'number') {
            setGithubPublicRepos(userData.public_repos);
          }
        }

        if (eventsRes.ok) {
          const events = await eventsRes.json();
          if (!cancelled && Array.isArray(events) && events.length > 0) {
            const counts = [0, 0, 0, 0, 0, 0, 0];
            for (const ev of events) {
              if (ev?.created_at) {
                const day = new Date(ev.created_at).getDay();
                counts[day] += 1;
              }
            }
            const total = counts.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setWeekdayCounts(counts);
              setActivitySource('live');
            }
          }
        }
      } catch {
        // Fallback data already initialized
      } finally {
        if (!cancelled) setReposLoading(false);
      }
    }
    loadGitHub();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeNode =
    ARCH_NODES.find((n) => n.id === selectedNodeId) ?? ARCH_NODES[3];

  const filteredStack =
    stackFilter === 'all'
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === stackFilter);

  const clientNodes = ARCH_NODES.filter((n) => n.layer === 'client');
  const coreNodes = ARCH_NODES.filter((n) => n.layer === 'core');
  const dataNodes = ARCH_NODES.filter((n) => n.layer === 'data');

  const maxDayCount = Math.max(...weekdayCounts, 1);
  const totalWeekEvents = weekdayCounts.reduce((a, b) => a + b, 0);
  const selectedTech =
    TECH_STACK.find((t) => t.id === selectedTechId) ?? TECH_STACK[0];

  const domainCounts = [
    {
      id: 'backend',
      label: 'Backend & APIs',
      count: TECH_STACK.filter((t) => t.category === 'backend').length,
    },
    {
      id: 'frontend',
      label: 'Web, Mobile & Desktop',
      count: TECH_STACK.filter((t) => t.category === 'frontend').length,
    },
    {
      id: 'infra',
      label: 'Dados & Infra',
      count: TECH_STACK.filter((t) => t.category === 'infra').length,
    },
    {
      id: 'praticas',
      label: 'Práticas',
      count: TECH_STACK.filter((t) => t.category === 'praticas').length,
    },
  ];
  const maxDomainCount = Math.max(...domainCounts.map((d) => d.count), 1);

  const ghW = 360;
  const ghH = 148;
  const ghPadX = 24;
  const ghPadTop = 22;
  const ghPadBot = 26;
  const ghPoints = weekdayCounts.map((count, i) => {
    const x =
      ghPadX + (i / (weekdayCounts.length - 1)) * (ghW - ghPadX * 2);
    const y =
      ghH -
      ghPadBot -
      (count / maxDayCount) * (ghH - ghPadTop - ghPadBot);
    return { x, y, count, label: WEEKDAY_LABELS[i] };
  });
  const ghCurvePath = ghPoints.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');
  const ghAreaPath = `${ghCurvePath} L ${ghPoints[ghPoints.length - 1].x} ${
    ghH - ghPadBot
  } L ${ghPoints[0].x} ${ghH - ghPadBot} Z`;

  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'mobile':
        return <Smartphone className="w-4 h-4 shrink-0" />;
      case 'desktop':
        return <Monitor className="w-4 h-4 shrink-0" />;
      case 'auto':
        return <Terminal className="w-4 h-4 shrink-0" />;
      case 'gateway':
        return <Layers className="w-4 h-4 shrink-0" />;
      case 'services':
        return <Server className="w-4 h-4 shrink-0" />;
      default:
        return <Database className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <section
      id="projetos"
      className="py-16 sm:py-24 bg-[var(--bg)]/70 text-[var(--fg)] overflow-x-clip"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14">
        {/* Section Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 pb-5"
        >
          <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-[var(--fg)]">
            <ScrollRevealWords text={ui.worksHeading} />
          </h2>
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-[var(--soft)] hover:text-[var(--fg)] transition-colors"
          >
            <RollingText text="Ver Todos no GitHub" />
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
        <AnimatedRule dark className="mb-12 sm:mb-16" />

        {/* Monumental Heading */}
        <h3 className="font-display font-bold uppercase text-center tracking-[-0.03em] text-[clamp(2.25rem,7vw,6.5rem)] leading-[0.95] text-[var(--fg)] mb-10 sm:mb-16 headline-balance">
          <ScrollRevealWords text={ui.worksTitle} className="justify-center" />
        </h3>

        {/* Sticky Scroll-Stacking 3D Showcase Deck */}
        <div ref={deckRef} className="relative space-y-8 lg:space-y-12 pb-6">
          {SHOWCASE_PROJECTS.map((project, idx) => (
            <ShowcaseRow
              key={project.id}
              project={project}
              index={idx}
              total={SHOWCASE_PROJECTS.length}
              deckProgress={deckProgress}
              failed={Boolean(failedImages[project.id])}
              onImageError={(id) =>
                setFailedImages((prev) => ({ ...prev, [id]: true }))
              }
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

        {/* Interactive Blueprint de Referência Multi-Tenant */}
        <div className="mt-20 sm:mt-28 pt-16 border-t border-[var(--line)]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-2">
                Blueprint em Produção
              </p>
              <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[var(--fg)]">
                <ScrollRevealWords text={ui.systemMap} />
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-[var(--soft)] max-w-sm">
                Clique em qualquer camada ou simule o fluxo de requisição entre cliente e banco.
              </p>
              <button
                type="button"
                onClick={handleStartFlowSimulation}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 bg-[var(--btn)] text-[var(--btn-fg)] border-[var(--line)] hover:bg-[var(--soft)]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simular Fluxo</span>
                <Maximize2 className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>

          {/* Animated Signal Pipeline Strip */}
          <div className="mb-4 bg-[var(--bg)] text-[var(--fg)] border border-[var(--line)]/30 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs font-mono-tabular">
              <span className="text-[var(--soft)] uppercase tracking-wider font-semibold">
                Rota Ativa
              </span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  activeNode.layer === 'client' ? 'text-white font-semibold' : 'text-[var(--muted)]'
                }
              >
                01 Cliente
              </span>
              <span className="text-[var(--muted)]">→</span>
              <span
                className={
                  activeNode.layer === 'core' ? 'text-white font-semibold' : 'text-[var(--muted)]'
                }
              >
                02 Gateway Multi-Tenant
              </span>
              <span className="text-[var(--muted)]">→</span>
              <span
                className={
                  activeNode.layer === 'data' ? 'text-white font-semibold' : 'text-[var(--muted)]'
                }
              >
                03 Serviços &amp; Firebird SQL
              </span>
            </div>
            <span className="font-mono-tabular text-[11px] text-[var(--soft)]">
              Foco: {activeNode.shortTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 3-Column Architecture Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[var(--bg)] border border-[var(--line)] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--soft)] pb-2 border-b border-[var(--line)]">
                  01 · Camada Cliente
                </p>
                {clientNodes.map((node) => {
                  const active = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSimulatingFlow(false);
                        setSelectedNodeId(node.id);
                      }}
                      className={`text-left p-3.5 border transition-all duration-200 min-h-[76px] flex flex-col justify-between ${
                        active
                          ? 'bg-[var(--card)] text-[var(--fg)] border-[var(--line)]'
                          : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)] hover:border-[var(--line)]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-sm">
                          {node.shortTitle}
                        </span>
                        {getNodeIcon(node.id)}
                      </div>
                      <span
                        className={`text-[11px] font-mono-tabular mt-2 ${
                          active ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
                        }`}
                      >
                        {node.shortSub}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--soft)] pb-2 border-b border-[var(--line)]">
                  02 · Núcleo Multi-Tenant
                </p>
                {coreNodes.map((node) => {
                  const active = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSimulatingFlow(false);
                        setSelectedNodeId(node.id);
                      }}
                      className={`flex-1 text-left p-4 border transition-all duration-200 flex flex-col justify-between min-h-[140px] ${
                        active
                          ? 'bg-[var(--card)] text-[var(--fg)] border-[var(--line)]'
                          : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)] hover:border-[var(--line)]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-bold text-base">
                          {node.shortTitle}
                        </span>
                        {getNodeIcon(node.id)}
                      </div>
                      <div>
                        <p
                          className={`text-xs leading-relaxed ${
                            active ? 'text-[var(--fg)]' : 'text-[var(--soft)]'
                          }`}
                        >
                          {node.shortSub}
                        </p>
                        <p
                          className={`text-[11px] font-mono-tabular mt-3 ${
                            active ? 'text-[var(--fg)]' : 'text-[var(--soft)]'
                          }`}
                        >
                          Delphi Horse · C# .NET
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--soft)] pb-2 border-b border-[var(--line)]">
                  03 · Domínio &amp; Dados
                </p>
                {dataNodes.map((node) => {
                  const active = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSimulatingFlow(false);
                        setSelectedNodeId(node.id);
                      }}
                      className={`flex-1 text-left p-3.5 border transition-all duration-200 min-h-[96px] flex flex-col justify-between ${
                        active
                          ? 'bg-[var(--card)] text-[var(--fg)] border-[var(--line)]'
                          : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--line)] hover:border-[var(--line)]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-sm">
                          {node.shortTitle}
                        </span>
                        {getNodeIcon(node.id)}
                      </div>
                      <span
                        className={`text-[11px] font-mono-tabular mt-2 ${
                          active ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
                        }`}
                      >
                        {node.shortSub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Detail Inspector */}
            <div className="lg:col-span-5 bg-[var(--bg)] border border-[var(--line)] p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-2">
                    {activeNode.stackLabel}
                  </p>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-[var(--fg)] mb-3">
                    {activeNode.title}
                  </h4>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--soft)] mb-6">
                    {activeNode.desc}
                  </p>

                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--muted)] mb-3">
                    Responsabilidades-Chave
                  </p>
                  <ul className="space-y-2.5 text-sm text-[var(--fg)]">
                    {activeNode.responsibilities.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 pb-2 border-b border-[var(--line)] last:border-b-0"
                      >
                        <span className="font-mono-tabular text-xs text-[var(--muted)] mt-0.5">
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Ecossistema Técnico + Atividade & Repositórios GitHub */}
        <div className="mt-20 sm:mt-24 pt-16 border-t border-[var(--line)] grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-1">
                  Ecossistema Técnico · {TECH_STACK.length} Tecnologias
                </p>
                <h3 className="font-display text-2xl font-bold text-[var(--fg)]">
                  Stack Tecnológica
                </h3>
              </div>

              <div
                role="tablist"
                aria-label="Filtrar stack tecnológica"
                className="flex flex-wrap gap-1 bg-[var(--bg)] p-1 border border-[var(--line)]"
              >
                {STACK_FILTERS.map((filter) => {
                  const active = stackFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setStackFilter(filter.id)}
                      className={`relative px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 z-10 ${
                        active
                          ? 'text-[var(--btn-fg)]'
                          : 'text-[var(--soft)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="stackFilterBg"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute inset-0 bg-[var(--btn)] -z-10"
                        />
                      )}
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Domain Distribution Graphic */}
            <div className="bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 mb-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  Distribuição por Domínio (clique para filtrar)
                </span>
                {stackFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setStackFilter('all')}
                    className="font-mono-tabular text-[11px] text-[var(--soft)] hover:underline"
                  >
                    Mostrar todas
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {domainCounts.map((dom) => {
                  const pct = Math.round((dom.count / maxDomainCount) * 100);
                  const active = stackFilter === dom.id;
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() =>
                        setStackFilter(active ? 'all' : dom.id)
                      }
                      className={`text-left p-2.5 border transition-colors ${
                        active
                          ? 'border-[var(--line)] bg-[var(--card)]/18'
                          : 'border-white/5 hover:border-[var(--line)]/45'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-[var(--fg)]">
                          {dom.label}
                        </span>
                        <span className="font-mono-tabular text-[var(--soft)] font-semibold">
                          {dom.count} itens
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[var(--wash)] overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: `${pct}%` }}
                          className={`h-full origin-left ${
                            active
                              ? 'bg-[var(--soft)]'
                              : 'bg-gradient-to-r from-[var(--card)] to-[var(--card)]'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[var(--line)]"
            >
              <AnimatePresence mode="popLayout">
                {filteredStack.map((item) => {
                  const isSelected = selectedTechId === item.id;
                  return (
                    <motion.button
                      layout
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedTechId(item.id)}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className={`text-left p-3.5 sm:p-4 border-r border-b border-[var(--line)] transition-colors cursor-pointer group ${
                        isSelected
                          ? 'bg-[var(--card)] text-[var(--fg)]'
                          : 'bg-[var(--bg)]/95 text-[var(--fg)] hover:bg-[var(--card)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-sm truncate">
                            {item.name}
                          </p>
                          <p
                            className={`text-[12px] mt-0.5 truncate ${
                              isSelected ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
                            }`}
                          >
                            {item.sub}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 border shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[var(--wash)] border-[var(--line)] text-[var(--fg)]'
                              : 'bg-[var(--bg)] border-[var(--line)]/25 text-[var(--soft)] group-hover:border-[var(--line)] group-hover:text-[var(--fg)]'
                          }`}
                        >
                          <TechIcon id={item.id} className="w-4 h-4" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Interactive Tech Usage Spotlight Bar */}
            <div className="mt-4 bg-[var(--bg)]/95 text-[var(--fg)] border border-[var(--line)]/35 p-4 sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTech.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-start gap-3.5"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-[var(--card)]/20 border border-[var(--line)]/45 text-[var(--soft)] shrink-0">
                    <TechIcon id={selectedTech.id} className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[var(--soft)]">
                      Aplicação em Produção · {selectedTech.name}
                    </p>
                    <p className="text-sm text-[var(--fg)] mt-1">
                      {selectedTech.usage}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dark Violet-Noir GitHub Activity Chart + Repositories */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-1">
                    Atividade Pública
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[var(--fg)]">
                    GitHub (@dreyranos)
                  </h3>
                </div>
                <span className="font-mono-tabular text-xs text-[var(--muted)]">
                  {githubPublicRepos} repos públicos
                </span>
              </div>

              {/* Aesthetic Interactive Dark Violet-Black Activity Chart */}
              <div className="bg-[var(--bg)] text-[var(--fg)] border border-[var(--line)]/35 p-5 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg)]">
                      <Activity className="w-3.5 h-3.5 text-[var(--soft)]" />
                      <span>Frequência Semanal ({totalWeekEvents} eventos)</span>
                    </span>
                    <p className="font-mono-tabular text-[11px] text-[var(--muted)] mt-0.5">
                      {activitySource === 'live' ? 'Sincronizado via API GitHub' : 'Resumo recente'} ·{' '}
                      <span className="text-[var(--soft)]">
                        {WEEKDAY_LABELS[activeDayIdx]}: {weekdayCounts[activeDayIdx]} eventos
                      </span>
                    </p>
                  </div>

                  {/* Chart View Switcher (Curva vs Barras) */}
                  <div
                    role="tablist"
                    aria-label="Modo de visualização do gráfico GitHub"
                    className="flex items-center gap-1 bg-[var(--wash)] p-1 border border-[var(--line)]"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={chartMode === 'area'}
                      onClick={() => setChartMode('area')}
                      className={`relative z-10 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        chartMode === 'area'
                          ? 'text-[var(--btn-fg)]'
                          : 'text-[var(--soft)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {chartMode === 'area' && (
                        <motion.span
                          layoutId="ghChartMode"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 bg-[var(--btn)] -z-10"
                        />
                      )}
                      <TrendingUp className="w-3 h-3" />
                      <span>Curva</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={chartMode === 'bars'}
                      onClick={() => setChartMode('bars')}
                      className={`relative z-10 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        chartMode === 'bars'
                          ? 'text-[var(--btn-fg)]'
                          : 'text-[var(--soft)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {chartMode === 'bars' && (
                        <motion.span
                          layoutId="ghChartMode"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 bg-[var(--btn)] -z-10"
                        />
                      )}
                      <BarChart3 className="w-3 h-3" />
                      <span>Barras</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {chartMode === 'area' ? (
                    <motion.div
                      key="gh-area"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        viewBox={`0 0 ${ghW} ${ghH}`}
                        className="w-full h-auto select-none overflow-visible"
                        role="img"
                        aria-label="Gráfico em curva da atividade semanal no GitHub"
                      >
                        <defs>
                          <linearGradient id="ghAreaGradPurple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4B424C" stopOpacity="0.62" />
                            <stop offset="100%" stopColor="#40383F" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>

                        {[0.25, 0.5, 0.75, 1].map((ratio) => {
                          const gy =
                            ghH -
                            ghPadBot -
                            ratio * (ghH - ghPadTop - ghPadBot);
                          return (
                            <line
                              key={ratio}
                              x1={ghPadX - 10}
                              y1={gy}
                              x2={ghW - ghPadX + 10}
                              y2={gy}
                              stroke="rgba(166,160,166,0.12)"
                              strokeDasharray="3 3"
                            />
                          );
                        })}

                        <path d={ghAreaPath} fill="url(#ghAreaGradPurple)" />

                        <motion.path
                          d={ghCurvePath}
                          fill="none"
                          stroke="#9B9699"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        />

                        {ghPoints.map((pt, i) => {
                          const isActive = activeDayIdx === i;
                          return (
                            <g
                              key={pt.label}
                              onMouseEnter={() => setActiveDayIdx(i)}
                              onClick={() => setActiveDayIdx(i)}
                              className="cursor-pointer"
                            >
                              {isActive && (
                                <line
                                  x1={pt.x}
                                  y1={pt.y}
                                  x2={pt.x}
                                  y2={ghH - ghPadBot}
                                  stroke="#9B9699"
                                  strokeWidth="1"
                                  strokeDasharray="2 2"
                                />
                              )}
                              <circle cx={pt.x} cy={pt.y} r={18} fill="transparent" />
                              {isActive && (
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={9}
                                  fill="none"
                                  stroke="#9B9699"
                                  strokeOpacity="0.55"
                                />
                              )}
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isActive ? 5 : 3.5}
                                fill={isActive ? '#9B9699' : '#0E0D17'}
                                stroke="#817C80"
                                strokeWidth="2"
                              />
                              <text
                                x={pt.x}
                                y={ghH - 6}
                                textAnchor="middle"
                                className={`text-[10px] font-mono-tabular ${
                                  isActive ? 'fill-white font-semibold' : 'fill-[var(--card)]'
                                }`}
                              >
                                {pt.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gh-bars"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-7 gap-2.5 items-end h-[132px] pt-4"
                    >
                      {weekdayCounts.map((count, i) => {
                        const heightPct = Math.max(
                          14,
                          Math.round((count / maxDayCount) * 100)
                        );
                        const isActive = activeDayIdx === i;
                        return (
                          <button
                            key={WEEKDAY_LABELS[i]}
                            type="button"
                            onMouseEnter={() => setActiveDayIdx(i)}
                            onClick={() => setActiveDayIdx(i)}
                            className="flex flex-col items-center gap-1.5 h-full justify-end group"
                          >
                            <span
                              className={`font-mono-tabular text-[10px] transition-opacity ${
                                isActive ? 'text-[var(--soft)] opacity-100' : 'text-[var(--muted)] opacity-70'
                              }`}
                            >
                              {count}
                            </span>
                            <div className="w-full flex-1 flex items-end">
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{
                                  duration: 0.45,
                                  delay: i * 0.04,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                style={{ height: `${heightPct}%` }}
                                className={`w-full origin-bottom transition-colors will-change-transform ${
                                  isActive
                                    ? 'bg-[var(--soft)]'
                                    : 'bg-[var(--card)] group-hover:bg-[var(--card)]'
                                }`}
                              />
                            </div>
                            <span
                              className={`font-mono-tabular text-[10px] ${
                                isActive ? 'text-[var(--fg)] font-semibold' : 'text-[var(--muted)]'
                              }`}
                            >
                              {WEEKDAY_LABELS[i]}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
                  Repositórios Recentes
                </p>
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--soft)] hover:underline whitespace-nowrap shrink-0"
                >
                  Ver perfil ↗
                </a>
              </div>

              <div className="divide-y divide-white/12 border-y border-[var(--line)]">
                {reposLoading && repos.length === 0 ? (
                  <p className="py-6 text-sm text-[var(--muted)]">
                    Carregando repositórios...
                  </p>
                ) : (
                  repos.slice(0, 4).map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-3.5 group hover:bg-[var(--bg)] px-2 -mx-2 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <GitBranch className="w-4 h-4 text-[var(--muted)] shrink-0" />
                          <span className="font-display font-bold text-[15px] text-[var(--fg)] group-hover:text-[var(--soft)] truncate">
                            {repo.name}
                          </span>
                        </div>
                        <span className="font-mono-tabular text-xs text-[var(--soft)] shrink-0">
                          {repo.language ?? 'Code'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-[var(--soft)] mt-1 line-clamp-2">
                        {repo.description ||
                          'Repositório público no GitHub de Andrey Ramos.'}
                      </p>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Case Study Curtain Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes do projeto ${selectedProject.titleTop} ${selectedProject.titleBottom}`}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--bg)] text-[var(--fg)] border border-[var(--line)]/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative my-auto shadow-[0_24px_80px_rgba(41,33,37,0.42)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--line)]">
                <div>
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)]">
                    {selectedProject.index} · {selectedProject.category} ·{' '}
                    {selectedProject.year}
                  </p>
                  <h3 className="font-display font-extrabold uppercase text-3xl sm:text-5xl tracking-tight text-[var(--fg)] mt-2">
                    {selectedProject.titleTop} {selectedProject.titleBottom}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Fechar detalhes do projeto"
                  className="inline-flex items-center justify-center w-11 h-11 border border-[var(--line)] text-[var(--fg)] hover:bg-[var(--card)] hover:border-[var(--line)] transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-7">
                <div className="md:col-span-5 aspect-[4/3] overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-7 flex flex-col justify-between">
                  <div>
                    <p className="text-[15px] sm:text-[16px] leading-[1.65] text-[var(--soft)] mb-6">
                      {selectedProject.fullDesc}
                    </p>

                    <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--muted)] mb-3">
                      {ui.howBuilt}
                    </p>
                    <ul className="space-y-2.5 text-sm text-[var(--fg)] mb-6">
                      {selectedProject.architectureNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2.5">
                          <span className="font-mono-tabular text-[var(--muted)] font-bold">
                            —
                          </span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs font-mono-tabular text-[var(--muted)]">
                      {selectedProject.stack.join(' · ')}
                    </div>

                    {selectedProject.repoUrl ? (
                      <a
                        href={selectedProject.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--btn)] text-[var(--btn-fg)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--soft)] transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>{selectedProject.repoLabel}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <a
                        href="#contato"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedProject(null);
                          setTimeout(() => smoothScrollTo('#contato'), 220);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--btn)] text-[var(--btn-fg)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--soft)] transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Conversar sobre esta arquitetura</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Explanatory Flow Video Simulator */}
      <FlowVideoSimulator
        open={simulatingFlow}
        initialProgramId="01."
        stageRef={flowStageRef}
        onClose={() => setSimulatingFlow(false)}
        onNodeSync={(nodeId) => setSelectedNodeId(nodeId)}
      />
    </section>
  );
}
