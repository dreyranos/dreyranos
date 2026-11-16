import { useState, useEffect, useCallback, useRef, type MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  X,
  Smartphone,
  Monitor,
  Globe,
  Terminal,
  Layers,
  Server,
  Database,
  Cpu,
  Sparkles,
  ShieldCheck,
  Flame,
  Code2,
  Maximize2,
  Minimize2,
  Film,
} from 'lucide-react';
import {
  FLOW_PROGRAMS,
  SLOT_COORDS,
  type FlowIconKey,
  type FlowNodeSlot,
} from '../data/flowPrograms';

function getWirePath(from: FlowNodeSlot, to: FlowNodeSlot) {
  const a = SLOT_COORDS[from];
  const b = SLOT_COORDS[to];
  if (Math.abs(a.x - b.x) < 10) {
    const ctrlX = a.x + 48;
    return `M ${a.x} ${a.y} Q ${ctrlX} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`;
  }
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

function renderFlowIcon(icon: FlowIconKey) {
  switch (icon) {
    case 'mobile':
      return <Smartphone className="w-4 h-4 shrink-0" />;
    case 'desktop':
      return <Monitor className="w-4 h-4 shrink-0" />;
    case 'web':
      return <Globe className="w-4 h-4 shrink-0" />;
    case 'terminal':
      return <Terminal className="w-4 h-4 shrink-0" />;
    case 'layers':
      return <Layers className="w-4 h-4 shrink-0" />;
    case 'server':
      return <Server className="w-4 h-4 shrink-0" />;
    case 'database':
      return <Database className="w-4 h-4 shrink-0" />;
    case 'cpu':
      return <Cpu className="w-4 h-4 shrink-0" />;
    case 'sparkles':
      return <Sparkles className="w-4 h-4 shrink-0" />;
    case 'shield':
      return <ShieldCheck className="w-4 h-4 shrink-0" />;
    case 'flame':
      return <Flame className="w-4 h-4 shrink-0" />;
    default:
      return <Code2 className="w-4 h-4 shrink-0" />;
  }
}

export default function FlowVideoSimulator({
  open,
  initialProgramId = '01.',
  stageRef,
  onClose,
  onNodeSync,
}: {
  open: boolean;
  initialProgramId?: string;
  stageRef?: MutableRefObject<HTMLDivElement | null>;
  onClose: () => void;
  onNodeSync?: (nodeId: string) => void;
}) {
  const [programId, setProgramId] = useState<string>(initialProgramId);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 1.5>(1);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isNativeFs, setIsNativeFs] = useState(false);

  const localStageRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  const onNodeSyncRef = useRef(onNodeSync);
  const wasNativeFsRef = useRef(false);
  const progressRef = useRef(0);

  onCloseRef.current = onClose;
  onNodeSyncRef.current = onNodeSync;

  const setStageNode = useCallback(
    (node: HTMLDivElement | null) => {
      localStageRef.current = node;
      if (stageRef) {
        stageRef.current = node;
      }
    },
    [stageRef]
  );

  const activeProgram =
    FLOW_PROGRAMS.find((p) => p.id === programId) ?? FLOW_PROGRAMS[0];
  const scenes = activeProgram.scenes;
  const safeSceneIdx = sceneIdx < scenes.length ? sceneIdx : 0;
  const currentScene = scenes[safeSceneIdx];
  const sceneDurationMs = speed === 1.5 ? 3200 : 4800;

  const handleClose = useCallback(() => {
    wasNativeFsRef.current = false;
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onCloseRef.current();
  }, []);

  const handleSelectProgram = (nextId: string) => {
    setProgramId(nextId);
    setSceneIdx(0);
    progressRef.current = 0;
    setSceneProgress(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!open) {
      wasNativeFsRef.current = false;
      return;
    }
    setProgramId(initialProgramId);
    setSceneIdx(0);
    progressRef.current = 0;
    setSceneProgress(0);
    setIsPlaying(true);
  }, [open, initialProgramId]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const syncFsState = () => {
      const activeFs = Boolean(document.fullscreenElement);
      if (wasNativeFsRef.current && !activeFs) {
        wasNativeFsRef.current = false;
        setIsNativeFs(false);
        onCloseRef.current();
        return;
      }
      wasNativeFsRef.current = activeFs;
      setIsNativeFs(activeFs);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        progressRef.current = 0;
        setSceneProgress(0);
        setSceneIdx((prev) => (prev + 1) % scenes.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        progressRef.current = 0;
        setSceneProgress(0);
        setSceneIdx((prev) => (prev - 1 + scenes.length) % scenes.length);
      }
    };

    const initialFs = Boolean(document.fullscreenElement);
    wasNativeFsRef.current = initialFs;
    setIsNativeFs(initialFs);

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', syncFsState);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', syncFsState);
    };
  }, [open, scenes.length, handleClose]);

  useEffect(() => {
    if (!open) return;
    onNodeSyncRef.current?.(activeProgram.linkedBlueprintNodeId);
  }, [open, activeProgram.linkedBlueprintNodeId]);

  useEffect(() => {
    if (!open || !isPlaying) return;
    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      const next = progressRef.current + delta / sceneDurationMs;
      if (next >= 1) {
        progressRef.current = 0;
        setSceneProgress(0);
        setSceneIdx((s) => (s + 1) % scenes.length);
      } else {
        progressRef.current = next;
        setSceneProgress(next);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [open, isPlaying, sceneDurationMs, scenes.length]);

  const toggleNativeFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      const targetEl = localStageRef.current ?? document.documentElement;
      targetEl.requestFullscreen?.().catch(() => {});
    }
  };

  const jumpToScene = (idx: number) => {
    setSceneIdx(idx);
    progressRef.current = 0;
    setSceneProgress(0);
  };

  const fromPt = SLOT_COORDS[currentScene.fromSlot];
  const toPt = SLOT_COORDS[currentScene.toSlot];
  const activeWirePath = getWirePath(currentScene.fromSlot, currentScene.toSlot);
  const packetT = (sceneProgress * 2.2) % 1;
  const targetNodeInfo = activeProgram.nodes[currentScene.toSlot];
  const totalScenesStr = String(scenes.length).padStart(2, '0');

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="flow-video-theater-root"
          ref={setStageNode}
          role="dialog"
          aria-modal="true"
          aria-label={`Simulação animada em tela cheia: ${activeProgram.title}`}
          initial={{ opacity: 0.96 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9990] w-screen h-[100dvh] bg-[#040407] text-[#F5F4FA] overflow-y-auto lg:overflow-hidden"
        >
          {/* Ambient radial deep obsidian-purple stage glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(76,29,149,0.16),transparent_65%)]"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              clipPath: 'inset(4% 4% 4% 4%)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              clipPath: 'inset(5% 5% 5% 5%)',
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full min-h-full lg:h-full flex flex-col justify-between"
          >
            {/* TOP VIDEO CHROME BAR + 5-AREA PROGRAM SWITCHER */}
            <div className="relative z-10 border-b border-white/10 bg-[#07070C]/94 backdrop-blur-md shrink-0">
            <div className="px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#4C1D95] text-white text-[11px] font-mono-tabular font-semibold uppercase tracking-wider shrink-0">
                  <Film className="w-3.5 h-3.5" />
                  <span>Fluxo Demonstrativo</span>
                </span>
                <div className="hidden sm:flex items-center gap-2 min-w-0 font-mono-tabular text-xs">
                  <span className="text-white font-semibold truncate">
                    {activeProgram.index}. {activeProgram.title}
                  </span>
                  <span className="text-[#8E89A3] shrink-0">
                    · Cena {currentScene.num}/{totalScenesStr}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSpeed((s) => (s === 1 ? 1.5 : 1))}
                  className="px-3 py-1.5 border border-white/15 bg-[#101019] text-xs font-mono-tabular text-[#9B86D6] hover:border-[#5B21B6] hover:text-white transition-colors"
                  title="Alternar velocidade de reprodução"
                >
                  {speed}x
                </button>

                <button
                  type="button"
                  onClick={toggleNativeFullscreen}
                  aria-label={
                    isNativeFs
                      ? 'Minimizar tela nativa'
                      : 'Expandir para tela cheia nativa'
                  }
                  title={
                    isNativeFs ? 'Minimizar tela nativa' : 'Expandir monitor inteiro'
                  }
                  className="hidden sm:inline-flex items-center justify-center w-9 h-9 border border-white/15 bg-[#101019] text-[#C4C0D4] hover:border-[#5B21B6] hover:text-white transition-colors"
                >
                  {isNativeFs ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#4C1D95]/65 bg-[#130C22] text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#4C1D95] transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Sair (ESC)</span>
                </button>
              </div>
            </div>

            {/* 5-Area Switcher Strip */}
            <div className="px-4 sm:px-8 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/[0.06] pt-2">
              <span className="font-mono-tabular text-[10px] uppercase tracking-wider text-[#8E89A3] mr-2 shrink-0 hidden md:inline">
                Áreas de Atuação:
              </span>
              {FLOW_PROGRAMS.map((prog) => {
                const isSelected = prog.id === activeProgram.id;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleSelectProgram(prog.id)}
                    className={`relative px-3 py-1.5 text-[11px] font-mono-tabular border transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#4C1D95] text-white border-[#826BC2] font-semibold'
                        : 'bg-[#0E0E17] text-[#9E97B4] border-white/10 hover:border-[#5B21B6]/60 hover:text-white'
                    }`}
                  >
                    {prog.index}. {prog.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER STAGE: ANIMATED DIAGRAM CANVAS + EXPLANATORY SUBTITLE SIDEBAR */}
          <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6 lg:p-7 max-w-[1440px] w-full mx-auto min-h-0 items-stretch">
            {/* Left/Main Animated Topology Video Canvas */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-[#090910] border border-[#4C1D95]/45 p-4 sm:p-6 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <p className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#9B86D6] truncate">
                  {activeProgram.subtitle} · {currentScene.shortTitle}
                </p>
                <span className="font-mono-tabular text-[11px] text-[#8E89A3] shrink-0">
                  {isPlaying ? 'REPRODUZINDO' : 'PAUSADO'} · Cena {currentScene.num}/
                  {totalScenesStr}
                </span>
              </div>

              {/* SVG Live Architecture Canvas */}
              <div className="relative flex-1 flex items-center justify-center my-2 min-h-[250px] sm:min-h-[310px]">
                <AnimatePresence mode="wait">
                  <motion.svg
                    key={activeProgram.id}
                    initial={{ opacity: 0.35, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.35 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    viewBox="0 0 860 440"
                    className="w-full h-full max-h-[420px] select-none overflow-visible"
                    role="img"
                    aria-label={`Diagrama animado do fluxo: ${activeProgram.title}`}
                  >
                    <defs>
                      <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {[
                      { x: 30, w: 200, title: activeProgram.zones[0] },
                      { x: 330, w: 200, title: activeProgram.zones[1] },
                      { x: 630, w: 200, title: activeProgram.zones[2] },
                    ].map((zone) => (
                      <g key={zone.title}>
                        <rect
                          x={zone.x}
                          y={20}
                          width={zone.w}
                          height={395}
                          fill="rgba(255,255,255,0.012)"
                          stroke="rgba(130,107,194,0.16)"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={zone.x + zone.w / 2}
                          y={40}
                          textAnchor="middle"
                          className="fill-[#8E89A3] text-[10px] font-mono-tabular uppercase tracking-wider"
                        >
                          {zone.title}
                        </text>
                      </g>
                    ))}

                    {activeProgram.wires.map((wire) => (
                      <path
                        key={`${wire.from}-${wire.to}`}
                        d={getWirePath(wire.from, wire.to)}
                        fill="none"
                        stroke="rgba(130,107,194,0.22)"
                        strokeWidth="2"
                      />
                    ))}

                    <motion.path
                      key={`wire-${activeProgram.id}-${currentScene.id}`}
                      d={activeWirePath}
                      fill="none"
                      stroke="#826BC2"
                      strokeWidth="3.5"
                      strokeDasharray="10 6"
                      initial={{ pathLength: 0.1, opacity: 0.5 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      filter="url(#purpleGlow)"
                    />

                    {(() => {
                      const midX = (fromPt.x + toPt.x) / 2;
                      const midY = (fromPt.y + toPt.y) / 2;
                      const t = packetT;
                      const inv = 1 - t;
                      const px =
                        Math.abs(fromPt.x - toPt.x) < 10
                          ? inv * inv * fromPt.x +
                            2 * inv * t * (fromPt.x + 48) +
                            t * t * toPt.x
                          : inv * inv * fromPt.x +
                            2 * inv * t * midX +
                            t * t * toPt.x;
                      const py =
                        inv * inv * fromPt.y +
                        2 * inv * t * midY +
                        t * t * toPt.y;
                      return (
                        <g filter="url(#purpleGlow)">
                          <circle
                            cx={px}
                            cy={py}
                            r={11}
                            fill="rgba(130,107,194,0.32)"
                          />
                          <circle cx={px} cy={py} r={5.5} fill="#FFFFFF" />
                        </g>
                      );
                    })()}

                    {(Object.keys(SLOT_COORDS) as FlowNodeSlot[]).map((slotKey) => {
                      const coord = SLOT_COORDS[slotKey];
                      const nodeData = activeProgram.nodes[slotKey];
                      const isActive = currentScene.activeSlots.includes(slotKey);
                      const isPrimaryTarget =
                        currentScene.toSlot === slotKey ||
                        currentScene.fromSlot === slotKey;
                      const cardW = 168;
                      const cardH = 68;
                      return (
                        <g
                          key={slotKey}
                          transform={`translate(${coord.x - cardW / 2}, ${
                            coord.y - cardH / 2
                          })`}
                          onClick={() => {
                            const targetIdx = scenes.findIndex(
                              (sc) =>
                                sc.toSlot === slotKey || sc.fromSlot === slotKey
                            );
                            if (targetIdx >= 0) jumpToScene(targetIdx);
                          }}
                          className="cursor-pointer"
                        >
                          {isPrimaryTarget && (
                            <motion.rect
                              x={-5}
                              y={-5}
                              width={cardW + 10}
                              height={cardH + 10}
                              fill="none"
                              stroke="#9B86D6"
                              strokeWidth="1.5"
                              animate={{ opacity: [0.35, 0.9, 0.35] }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          <rect
                            width={cardW}
                            height={cardH}
                            fill={isActive ? '#3B0764' : '#11111B'}
                            stroke={
                              isActive ? '#826BC2' : 'rgba(255,255,255,0.14)'
                            }
                            strokeWidth={isActive ? '2' : '1'}
                          />
                          <foreignObject width={cardW} height={cardH}>
                            <div className="w-full h-full p-2.5 flex flex-col justify-between text-left">
                              <div className="flex items-center justify-between gap-1.5 text-white">
                                <span className="font-display font-bold text-[12px] leading-tight truncate">
                                  {nodeData.label}
                                </span>
                                <span
                                  className={
                                    isActive ? 'text-[#D4C8F2]' : 'text-[#826BC2]'
                                  }
                                >
                                  {renderFlowIcon(nodeData.icon)}
                                </span>
                              </div>
                              <span
                                className={`font-mono-tabular text-[10px] truncate ${
                                  isActive ? 'text-[#D4C8F2]' : 'text-[#8E89A3]'
                                }`}
                              >
                                {nodeData.sub}
                              </span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </motion.svg>
                </AnimatePresence>
              </div>

              {/* Live Packet Wire Telemetry Bar */}
              <div className="border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block w-2 h-2 bg-[#826BC2] shrink-0 animate-pulse" />
                  <span className="text-[#9B86D6] truncate">
                    {currentScene.packetLabel}
                  </span>
                </div>
                <span className="text-[#8E89A3] shrink-0">
                  Etapa: {targetNodeInfo.label}
                </span>
              </div>
            </div>

            {/* Right Explanatory Narration & Chapter Panel */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-[#0E0E17] border border-white/10 p-5 sm:p-6 overflow-y-auto">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeProgram.id}-${currentScene.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#9B86D6] mb-2">
                      Narração · Cena {currentScene.num} / {totalScenesStr}
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight mb-3">
                      {currentScene.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-[#DFDCEB] bg-[#140F22] border-l-2 border-[#5B21B6] p-3.5 mb-4">
                      “{currentScene.narration}”
                    </p>

                    <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#8E89A3] mb-2">
                      O que acontece nesta etapa
                    </p>
                    <ul className="space-y-2 text-xs sm:text-[13px] text-[#C4C0D4] mb-5">
                      {currentScene.highlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-2">
                          <span className="font-mono-tabular text-[#826BC2] font-bold">
                            —
                          </span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Clickable Chapter Index */}
              <div className="pt-4 border-t border-white/10">
                <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#8E89A3] mb-2.5">
                  Capítulos do Fluxo ({activeProgram.index})
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                  {scenes.map((sc, idx) => {
                    const active = idx === safeSceneIdx;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => jumpToScene(idx)}
                        className={`text-left px-3 py-2 text-xs border transition-colors flex items-center justify-between gap-2 ${
                          active
                            ? 'bg-[#4C1D95] text-white border-[#826BC2] font-semibold'
                            : 'bg-[#12121C] text-[#9E97B4] border-white/10 hover:border-[#5B21B6]/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate">
                          {sc.num}. {sc.shortTitle}
                        </span>
                        {active && (
                          <span className="font-mono-tabular text-[10px] text-[#D4C8F2] shrink-0">
                            AO VIVO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM VIDEO SCRUBBER & TRANSPORT CONTROLS BAR */}
          <div className="relative z-10 border-t border-white/10 bg-[#07070C]/96 px-4 sm:px-8 py-3.5 shrink-0">
            <div className="max-w-[1440px] mx-auto space-y-3">
              {/* Clickable Segmented Timeline Bar */}
              <div
                style={{
                  gridTemplateColumns: `repeat(${scenes.length}, minmax(0, 1fr))`,
                }}
                className="grid gap-1.5"
                role="tablist"
                aria-label="Linha do tempo do fluxo demonstrativo"
              >
                {scenes.map((sc, idx) => {
                  const fill =
                    idx < safeSceneIdx
                      ? 100
                      : idx === safeSceneIdx
                      ? Math.min(100, Math.round(sceneProgress * 100))
                      : 0;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => jumpToScene(idx)}
                      aria-label={`Ir para cena ${sc.num}: ${sc.shortTitle}`}
                      className="group text-left py-1"
                    >
                      <div className="h-2 w-full bg-white/12 overflow-hidden group-hover:h-2.5 transition-all">
                        <div
                          style={{ width: `${fill}%` }}
                          className="h-full bg-gradient-to-r from-[#3B0764] via-[#4C1D95] to-[#826BC2]"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Player Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => jumpToScene(0)}
                    aria-label="Reiniciar vídeo"
                    className="w-9 h-9 border border-white/15 bg-[#101019] flex items-center justify-center text-[#C4C0D4] hover:border-[#5B21B6] hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      jumpToScene(
                        (safeSceneIdx - 1 + scenes.length) % scenes.length
                      )
                    }
                    aria-label="Cena anterior"
                    className="w-9 h-9 border border-white/15 bg-[#101019] flex items-center justify-center text-[#C4C0D4] hover:border-[#5B21B6] hover:text-white transition-colors"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex items-center gap-2 px-4 h-9 bg-[#4C1D95] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5B21B6] transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Reproduzir</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      jumpToScene((safeSceneIdx + 1) % scenes.length)
                    }
                    aria-label="Próxima cena"
                    className="w-9 h-9 border border-white/15 bg-[#101019] flex items-center justify-center text-[#C4C0D4] hover:border-[#5B21B6] hover:text-white transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono-tabular text-[#8E89A3]">
                  <span className="hidden md:inline">
                    Espaço: Play/Pause · Setas: Cenas · ESC: Sair
                  </span>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-[#9B86D6] hover:text-white font-semibold uppercase tracking-wider"
                  >
                    Fechar e voltar ao portfólio ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
