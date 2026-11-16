import { motion, AnimatePresence } from 'motion/react';
import {
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
  CheckCircle2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import {
  SLOT_COORDS,
  type FlowIconKey,
  type FlowNodeSlot,
  type FlowProgram,
  type FlowProgramScene,
} from '../data/flowPrograms';

interface StageProps {
  program: FlowProgram;
  scene: FlowProgramScene;
  sceneIdx: number;
  sceneProgress: number;
  onJumpToScene: (idx: number) => void;
}

function renderFlowIcon(icon: FlowIconKey, className = 'w-4 h-4 shrink-0') {
  switch (icon) {
    case 'mobile':
      return <Smartphone className={className} />;
    case 'desktop':
      return <Monitor className={className} />;
    case 'web':
      return <Globe className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'server':
      return <Server className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'shield':
      return <ShieldCheck className={className} />;
    case 'flame':
      return <Flame className={className} />;
    default:
      return <Code2 className={className} />;
  }
}

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

/**
 * MODO 01 · Backend & Arquitetura Multi-Tenant
 * Topologia Radial com Gateway Shield Central, Anéis de Escopo Isolado e Fluxo de Pacote JWT/Tenant
 */
function HubTopologyStage({
  program,
  scene,
  sceneIdx,
  sceneProgress,
  onJumpToScene,
}: StageProps) {
  const fromPt = SLOT_COORDS[scene.fromSlot];
  const toPt = SLOT_COORDS[scene.toSlot];
  const activeWirePath = getWirePath(scene.fromSlot, scene.toSlot);
  const packetT = (sceneProgress * 2.2) % 1;

  const tenantState =
    sceneIdx === 0
      ? 'JWT + X-Tenant-ID: #042'
      : sceneIdx === 1
      ? 'TenantGuard(): Contexto Isolado #042'
      : sceneIdx === 2
      ? 'DomainService.Processar(#042)'
      : sceneIdx === 3
      ? 'Firebird Tx · WHERE TENANT_ID = 42'
      : 'HTTP 200 OK · Payload Seguro';

  return (
    <div className="w-full h-full flex flex-col justify-between gap-3">
      {/* Live Tenant Scope Telemetry Strip */}
      <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] font-mono-tabular">
        <div className="bg-[#0E0B1A] border border-[#4C1D95]/45 px-3 py-1.5 flex items-center justify-between gap-2">
          <span className="text-[#8E89A3] uppercase">Tenant</span>
          <span className="text-white font-semibold">#042</span>
        </div>
        <div className="bg-[#0E0B1A] border border-[#4C1D95]/45 px-3 py-1.5 flex items-center justify-between gap-2">
          <span className="text-[#8E89A3] uppercase">Isolamento</span>
          <span className="text-[#9B86D6] inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> Estrito
          </span>
        </div>
        <div className="bg-[#0E0B1A] border border-[#4C1D95]/45 px-3 py-1.5 flex items-center justify-between gap-2 truncate">
          <span className="text-[#8E89A3] uppercase shrink-0">Estado</span>
          <span className="text-[#D4C8F2] truncate">{tenantState}</span>
        </div>
      </div>

      {/* SVG Radial Hub-and-Spoke Topology */}
      <div className="flex-1 flex items-center justify-center min-h-[240px]">
        <svg
          viewBox="0 0 860 440"
          className="w-full h-full max-h-[395px] select-none overflow-visible"
          role="img"
          aria-label={`Diagrama multi-tenant: ${program.title}`}
        >
          <defs>
            <filter id="hubGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Gateway Isolation Rings */}
          <motion.circle
            cx={430}
            cy={220}
            r={126}
            fill="none"
            stroke="rgba(130,107,194,0.16)"
            strokeDasharray="6 6"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '430px', originY: '220px' }}
          />
          <circle
            cx={430}
            cy={220}
            r={92}
            fill="rgba(59,7,100,0.14)"
            stroke="rgba(91,33,182,0.32)"
          />

          {[
            { x: 30, w: 200, title: program.zones[0] },
            { x: 330, w: 200, title: program.zones[1] },
            { x: 630, w: 200, title: program.zones[2] },
          ].map((zone) => (
            <g key={zone.title}>
              <rect
                x={zone.x}
                y={18}
                width={zone.w}
                height={400}
                fill="rgba(255,255,255,0.01)"
                stroke="rgba(130,107,194,0.14)"
                strokeDasharray="4 4"
              />
              <text
                x={zone.x + zone.w / 2}
                y={38}
                textAnchor="middle"
                className="fill-[#8E89A3] text-[10px] font-mono-tabular uppercase tracking-wider"
              >
                {zone.title}
              </text>
            </g>
          ))}

          {program.wires.map((wire) => (
            <path
              key={`${wire.from}-${wire.to}`}
              d={getWirePath(wire.from, wire.to)}
              fill="none"
              stroke="rgba(130,107,194,0.2)"
              strokeWidth="2"
            />
          ))}

          <motion.path
            key={`wire-${scene.id}`}
            d={activeWirePath}
            fill="none"
            stroke="#826BC2"
            strokeWidth="3.5"
            strokeDasharray="10 6"
            initial={{ pathLength: 0.1, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            filter="url(#hubGlow)"
          />

          {(() => {
            const midX = (fromPt.x + toPt.x) / 2;
            const midY = (fromPt.y + toPt.y) / 2;
            const t = packetT;
            const inv = 1 - t;
            const px =
              Math.abs(fromPt.x - toPt.x) < 10
                ? inv * inv * fromPt.x + 2 * inv * t * (fromPt.x + 48) + t * t * toPt.x
                : inv * inv * fromPt.x + 2 * inv * t * midX + t * t * toPt.x;
            const py = inv * inv * fromPt.y + 2 * inv * t * midY + t * t * toPt.y;
            return (
              <g filter="url(#hubGlow)">
                <circle cx={px} cy={py} r={11} fill="rgba(130,107,194,0.34)" />
                <circle cx={px} cy={py} r={5.5} fill="#FFFFFF" />
              </g>
            );
          })()}

          {(Object.keys(SLOT_COORDS) as FlowNodeSlot[]).map((slotKey) => {
            const coord = SLOT_COORDS[slotKey];
            const nodeData = program.nodes[slotKey];
            const isActive = scene.activeSlots.includes(slotKey);
            const isPrimaryTarget = scene.toSlot === slotKey || scene.fromSlot === slotKey;
            const cardW = 168;
            const cardH = 68;
            return (
              <g
                key={slotKey}
                transform={`translate(${coord.x - cardW / 2}, ${coord.y - cardH / 2})`}
                onClick={() => {
                  const idx = program.scenes.findIndex(
                    (sc) => sc.toSlot === slotKey || sc.fromSlot === slotKey
                  );
                  if (idx >= 0) onJumpToScene(idx);
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
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <rect
                  width={cardW}
                  height={cardH}
                  fill={isActive ? '#3B0764' : '#11111B'}
                  stroke={isActive ? '#826BC2' : 'rgba(255,255,255,0.14)'}
                  strokeWidth={isActive ? '2' : '1'}
                />
                <foreignObject width={cardW} height={cardH}>
                  <div className="w-full h-full p-2.5 flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between gap-1.5 text-white">
                      <span className="font-display font-bold text-[12px] leading-tight truncate">
                        {nodeData.label}
                      </span>
                      <span className={isActive ? 'text-[#D4C8F2]' : 'text-[#826BC2]'}>
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
        </svg>
      </div>
    </div>
  );
}

/**
 * MODO 02 · Web, Mobile & Desktop Multiplataforma
 * Estúdio Multi-Dispositivo ao Vivo (Smartphone React Native + Navegador Web + Janela Desktop Delphi)
 */
function MultiDeviceStage({
  sceneIdx,
  sceneProgress,
  onJumpToScene,
}: StageProps) {
  const mobileActive = sceneIdx === 0 || sceneIdx === 1 || sceneIdx === 4;
  const webActive = sceneIdx === 0 || sceneIdx === 2 || sceneIdx === 4;
  const desktopActive = sceneIdx === 3 || sceneIdx === 4;

  const pulsePos = `${Math.round(((sceneProgress * 1.8) % 1) * 100)}%`;

  return (
    <div className="w-full h-full flex flex-col justify-between gap-4 py-1">
      {/* Top Design Tokens Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#0D0A18] border border-[#4C1D95]/45 text-[11px] font-mono-tabular">
        <span className="text-[#9B86D6]">
          DESIGN SYSTEM ÚNICO · NativeWind + Tailwind CSS + Delphi Theme
        </span>
        <span className="text-white">
          {sceneIdx === 4 ? '3/3 Telas em Sync Real-Time' : 'Contratos JSON Tipados'}
        </span>
      </div>

      {/* 3 Live Synchronized Device Frames */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-stretch flex-1 min-h-[230px]">
        {/* Device 1: Smartphone React Native + Expo */}
        <motion.button
          type="button"
          onClick={() => onJumpToScene(1)}
          animate={{ y: mobileActive ? -4 : 0, opacity: mobileActive ? 1 : 0.55 }}
          transition={{ duration: 0.35 }}
          className={`sm:col-span-3 text-left p-3 border flex flex-col justify-between transition-colors ${
            mobileActive
              ? 'bg-[#140B29] border-[#826BC2] shadow-[0_12px_32px_rgba(76,29,149,0.4)]'
              : 'bg-[#0C0C14] border-white/12 hover:border-[#5B21B6]'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono-tabular text-[#9B86D6] pb-2 border-b border-white/10">
            <span className="inline-flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> MOBILE
            </span>
            <span>EXPO</span>
          </div>

          {/* Mini Mobile Screen UI */}
          <div className="my-2.5 space-y-2 flex-1 flex flex-col justify-center">
            <div className="h-2.5 w-2/3 bg-[#5B21B6]/70" />
            <div className="p-2 bg-[#08070E] border border-[#4C1D95]/45 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono-tabular">
                <span className="text-white font-semibold">OS #4821</span>
                <span className="text-[#9B86D6]">CAMPO</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 overflow-hidden">
                <motion.div
                  animate={{ width: mobileActive ? '100%' : '35%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-[#826BC2]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-6 bg-white/[0.04] border border-white/10" />
              <div className="h-6 bg-[#4C1D95]/35 border border-[#826BC2]/40" />
            </div>
          </div>

          <p className="font-mono-tabular text-[10px] text-[#A49EB8] truncate">
            React Native · Cache Offline
          </p>
        </motion.button>

        {/* Device 2: Web Portal (React / Angular) */}
        <motion.button
          type="button"
          onClick={() => onJumpToScene(2)}
          animate={{ y: webActive ? -4 : 0, opacity: webActive ? 1 : 0.55 }}
          transition={{ duration: 0.35 }}
          className={`sm:col-span-5 text-left p-3.5 border flex flex-col justify-between transition-colors ${
            webActive
              ? 'bg-[#140B29] border-[#826BC2] shadow-[0_12px_32px_rgba(76,29,149,0.4)]'
              : 'bg-[#0C0C14] border-white/12 hover:border-[#5B21B6]'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono-tabular text-[#9B86D6] pb-2 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> PORTAL WEB CORPORATIVO
            </span>
            <span>REACT / ANGULAR</span>
          </div>

          {/* Mini Browser Dashboard UI */}
          <div className="my-2.5 grid grid-cols-12 gap-2 flex-1">
            <div className="col-span-3 bg-[#08070E] border border-white/10 p-1.5 space-y-1.5">
              <div className="h-2 w-full bg-[#5B21B6]" />
              <div className="h-1.5 w-3/4 bg-white/15" />
              <div className="h-1.5 w-4/5 bg-white/10" />
              <div className="h-1.5 w-2/3 bg-white/10" />
            </div>
            <div className="col-span-9 bg-[#08070E] border border-[#4C1D95]/40 p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono-tabular">
                <span className="text-white font-semibold">Painel Operacional</span>
                <span className="text-[#9B86D6]">TypeScript</span>
              </div>
              <div className="flex items-end gap-1.5 h-14 pt-2">
                {[38, 65, 52, 88, 72, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: webActive ? `${h}%` : '25%' }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-[#3B0764] to-[#826BC2]"
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="font-mono-tabular text-[10px] text-[#A49EB8] truncate">
            Dashboards, Relatórios &amp; Permissões em Tempo Real
          </p>
        </motion.button>

        {/* Device 3: Desktop Delphi VCL / FMX */}
        <motion.button
          type="button"
          onClick={() => onJumpToScene(3)}
          animate={{ y: desktopActive ? -4 : 0, opacity: desktopActive ? 1 : 0.55 }}
          transition={{ duration: 0.35 }}
          className={`sm:col-span-4 text-left p-3.5 border flex flex-col justify-between transition-colors ${
            desktopActive
              ? 'bg-[#140B29] border-[#826BC2] shadow-[0_12px_32px_rgba(76,29,149,0.4)]'
              : 'bg-[#0C0C14] border-white/12 hover:border-[#5B21B6]'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono-tabular text-[#9B86D6] pb-2 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" /> DESKTOP WINDOWS
            </span>
            <span>DELPHI VCL/FMX</span>
          </div>

          {/* Mini ERP Desktop Grid */}
          <div className="my-2.5 bg-[#08070E] border border-[#4C1D95]/40 p-2 space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] font-mono-tabular border-b border-white/10 pb-1">
              <span className="text-white">ERP · Módulo Fiscal</span>
              <span className="text-[#9B86D6]">NATIVO</span>
            </div>
            {[
              ['NF-e #9012', 'Autorizada'],
              ['Estoque #03', 'Sincronizado'],
              ['Impressão', 'Ativa'],
            ].map(([colA, colB]) => (
              <div
                key={colA}
                className="flex items-center justify-between text-[10px] font-mono-tabular py-0.5 px-1.5 bg-white/[0.03]"
              >
                <span className="text-[#D4C8F2]">{colA}</span>
                <span className="text-[#8E89A3]">{colB}</span>
              </div>
            ))}
          </div>

          <p className="font-mono-tabular text-[10px] text-[#A49EB8] truncate">
            Estações Corporativas &amp; Periféricos
          </p>
        </motion.button>
      </div>

      {/* Bottom Shared API Sync Bus */}
      <button
        type="button"
        onClick={() => onJumpToScene(4)}
        className="relative overflow-hidden bg-[#0E0A18] border border-[#5B21B6]/55 px-4 py-3 text-left group"
      >
        <div
          style={{ left: pulsePos }}
          className="pointer-events-none absolute top-0 bottom-0 w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#826BC2]/35 to-transparent"
        />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
          <span className="text-white font-semibold inline-flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9B86D6]" />
            BARRAMENTO ÚNICO DE API REST &amp; SINCRONIZAÇÃO
          </span>
          <span className="text-[#9B86D6]">
            Mobile ↔ Web ↔ Desktop · Mesma Fonte de Verdade
          </span>
        </div>
      </button>
    </div>
  );
}

/**
 * MODO 03 · Dados & Modernização de Legado Firebird SQL
 * Comparador de Plano de Execução (NATURAL -> INDEX) + Extração Strangler Fig
 */
function SqlTuningStage({ sceneIdx, onJumpToScene }: StageProps) {
  const isTuned = sceneIdx >= 1;
  const isStrangled = sceneIdx >= 2;
  const isMigrated = sceneIdx >= 3;

  const latencyMs =
    sceneIdx === 0 ? 4820 : sceneIdx === 1 ? 18 : sceneIdx === 2 ? 14 : 11;
  const naturalPct = sceneIdx === 0 ? 94 : 6;

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
      {/* Left: Firebird Execution Plan & Latency Gauge */}
      <button
        type="button"
        onClick={() => onJumpToScene(1)}
        className="md:col-span-6 text-left bg-[#0C0B13] border border-[#4C1D95]/50 p-4 flex flex-col justify-between hover:border-[#826BC2] transition-colors"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#9B86D6] inline-flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> PLANO FIREBIRD SQL
          </span>
          <span
            className={`font-mono-tabular text-xs font-bold px-2 py-0.5 ${
              isTuned ? 'bg-[#3B0764] text-white' : 'bg-[#29111A] text-[#F4A8B8]'
            }`}
          >
            {latencyMs} ms
          </span>
        </div>

        <div className="my-3 space-y-3">
          <div className="p-2.5 bg-[#07060C] border border-white/10 font-mono-tabular text-[11px]">
            <p className="text-[#8E89A3] mb-1">
              {isTuned ? 'PLAN OTIMIZADO:' : 'DIAGNÓSTICO INICIAL:'}
            </p>
            <p className={isTuned ? 'text-[#D4C8F2]' : 'text-[#F4A8B8]'}>
              {isTuned
                ? 'PLAN (MOVIMENTOS INDEX (IDX_TENANT_DATA))'
                : 'PLAN (MOVIMENTOS NATURAL) · FULL SCAN'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-mono-tabular">
              <span className="text-[#A49EB8]">Leituras em Disco (I/O)</span>
              <span className="text-white font-semibold">{naturalPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-white/10 overflow-hidden">
              <motion.div
                animate={{ width: `${naturalPct}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full ${
                  isTuned ? 'bg-[#826BC2]' : 'bg-[#9F1239]'
                }`}
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono-tabular text-[#8E89A3]">
          Índices compostos + Controle transacional sem locks longos
        </p>
      </button>

      {/* Right: Strangler Fig & Zero Downtime Evolution */}
      <div className="md:col-span-6 flex flex-col justify-between gap-3">
        <button
          type="button"
          onClick={() => onJumpToScene(2)}
          className={`flex-1 text-left p-4 border transition-colors flex flex-col justify-between ${
            isStrangled
              ? 'bg-[#130C22] border-[#826BC2]'
              : 'bg-[#0C0B13] border-white/12 hover:border-[#5B21B6]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#9B86D6]">
            <span>STRANGLER FIG · EXTRAÇÃO GRADUAL</span>
            <span>{isStrangled ? 'ATIVO' : 'EM ANÁLISE'}</span>
          </div>
          <div className="my-2 flex items-center gap-2 text-xs font-mono-tabular">
            <span className="px-2.5 py-1.5 bg-[#08070E] border border-white/15 text-[#A49EB8]">
              Monólito 24/7
            </span>
            <ArrowRight className="w-4 h-4 text-[#826BC2] shrink-0" />
            <span className="px-2.5 py-1.5 bg-[#3B0764] border border-[#826BC2] text-white font-semibold">
              APIs Desacopladas
            </span>
          </div>
          <p className="text-[11px] text-[#C4C0D4]">
            Regras fiscais migradas em blocos pequenos, mantendo terminais antigos funcionando.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onJumpToScene(isMigrated ? 4 : 3)}
          className={`flex-1 text-left p-4 border transition-colors flex flex-col justify-between ${
            isMigrated
              ? 'bg-[#130C22] border-[#826BC2]'
              : 'bg-[#0C0B13] border-white/12 hover:border-[#5B21B6]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#9B86D6]">
            <span>MIGRAÇÃO DE SCHEMA &amp; PRODUÇÃO</span>
            <span className="inline-flex items-center gap-1 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#9B86D6]" /> ZERO DOWNTIME
            </span>
          </div>
          <p className="font-display font-bold text-base text-white my-1">
            Scripts DDL Versionados &amp; Retrocompatíveis
          </p>
          <p className="text-[11px] font-mono-tabular text-[#8E89A3]">
            Validação em espelho + Rollback seguro · Sem parar a operação
          </p>
        </button>
      </div>
    </div>
  );
}

/**
 * MODO 04 · Automação & Fluxos Inteligentes com IA
 * Esteira Sequencial de 5 Etapas + Console Terminal Bash/Python/IA Ao Vivo
 */
const PIPELINE_STEPS = [
  { num: '01', label: 'Gatilho', sub: 'Checklist Manual -> Script', icon: 'flame' as FlowIconKey },
  { num: '02', label: 'Bash Linux', sub: 'Preflight & Env', icon: 'terminal' as FlowIconKey },
  { num: '03', label: 'Motor Python', sub: 'Compilador_Python', icon: 'code' as FlowIconKey },
  { num: '04', label: 'Fluxo IA', sub: 'Triagem & Síntese', icon: 'sparkles' as FlowIconKey },
  { num: '05', label: 'Auditado', sub: 'Artefato + Log OK', icon: 'shield' as FlowIconKey },
];

const TERMINAL_LINES_BY_SCENE: string[][] = [
  [
    '$ detect --repetitive-tasks ./ops',
    '> Alvos encontrados: build, empacotamento, checagem de logs',
    '> Convertendo rotinas manuais em pipeline determinístico...',
  ],
  [
    '#!/usr/bin/env bash',
    '$ ./preflight.sh --env=production --strict',
    '[OK] Variáveis validadas · Permissões OK · Docker pronto',
  ],
  [
    '$ python3 compiler.py --target=release --verify',
    '[BUILD] Empacotando módulos e dependências...',
    '[OK] Artefato gerado em 1.84s sem intervenções manuais',
  ],
  [
    '$ ai-ops summarize --logs ./var/events.log --schema json',
    '[IA] Classificando anomalias e sintetizando resumo técnico...',
    '[OK] Resumo estruturado pronto para revisão da equipe',
  ],
  [
    '$ pipeline status --last-run',
    '[DONE] 5/5 etapas concluídas com hash e log auditável',
    '[NOTIFY] Operação silenciosa entregue com 0 falhas.',
  ],
];

function PipelineTerminalStage({ sceneIdx, onJumpToScene }: StageProps) {
  const activeLines =
    TERMINAL_LINES_BY_SCENE[sceneIdx] ?? TERMINAL_LINES_BY_SCENE[0];

  return (
    <div className="w-full h-full flex flex-col justify-between gap-4">
      {/* Horizontal 5-Step Pipeline Track */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PIPELINE_STEPS.map((st, idx) => {
          const isCurrent = idx === sceneIdx;
          const isDone = idx < sceneIdx;
          return (
            <button
              key={st.num}
              type="button"
              onClick={() => onJumpToScene(idx)}
              className={`text-left p-3 border transition-colors flex flex-col justify-between min-h-[84px] ${
                isCurrent
                  ? 'bg-[#3B0764] border-[#9B86D6] text-white'
                  : isDone
                  ? 'bg-[#140E24] border-[#5B21B6]/60 text-[#D4C8F2]'
                  : 'bg-[#0C0B13] border-white/12 text-[#8E89A3] hover:border-[#5B21B6]'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono-tabular text-[10px]">
                  {st.num}
                </span>
                {renderFlowIcon(st.icon, 'w-3.5 h-3.5')}
              </div>
              <div>
                <p className="font-display font-bold text-xs text-white truncate">
                  {st.label}
                </p>
                <p className="font-mono-tabular text-[10px] opacity-85 truncate">
                  {st.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Linux Terminal Output */}
      <div className="flex-1 bg-[#05050A] border border-[#4C1D95]/55 p-4 flex flex-col justify-between min-h-[170px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[10px] font-mono-tabular text-[#8E89A3]">
          <span>TERMINAL LINUX · PIPELINE AO VIVO</span>
          <span className="text-[#9B86D6]">
            ETAPA {String(sceneIdx + 1).padStart(2, '0')} / 05
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="font-mono-tabular text-xs sm:text-[13px] space-y-2 my-auto"
          >
            {activeLines.map((line, i) => (
              <p
                key={line}
                className={
                  i === 0
                    ? 'text-white font-semibold'
                    : i === activeLines.length - 1
                    ? 'text-[#D4C8F2]'
                    : 'text-[#9B86D6]'
                }
              >
                {line}
              </p>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-tabular text-[#8E89A3]">
          <span>Automatização determinística · Python + Bash + IA</span>
          <span className="inline-block w-2 h-3.5 bg-[#9B86D6] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * MODO 05 · Android Customizado & Baixo Nível
 * Pilha Vertical de Camadas de Sistema (Bottom-Up Stack) + Inspetor de Build / Logcat
 */
const AOSP_LAYERS = [
  {
    sceneIdx: 4,
    num: 'L5',
    title: 'Estabilidade & Tuning de Sistema',
    sub: 'Boot verificado · Controle total de hardware',
    icon: 'shield' as FlowIconKey,
  },
  {
    sceneIdx: 3,
    num: 'L4',
    title: 'Imagem Final Flashável (ROM)',
    sub: 'system.img + boot.img · Validação ADB / dmesg',
    icon: 'mobile' as FlowIconKey,
  },
  {
    sceneIdx: 2,
    num: 'L3',
    title: 'Binários Nativos em Linguagem C',
    sub: 'Clang / NDK ARM64 · MCLA-Recompiled-Mobile',
    icon: 'code' as FlowIconKey,
  },
  {
    sceneIdx: 1,
    num: 'L2',
    title: 'Árvore AOSP & LineageOS',
    sub: 'SELinux, Flags, Overlays & Framework Android',
    icon: 'layers' as FlowIconKey,
  },
  {
    sceneIdx: 0,
    num: 'L1',
    title: 'Hardware, SoC, Kernel & Vendor Blobs',
    sub: 'Device Tree · BoardConfig · Drivers',
    icon: 'cpu' as FlowIconKey,
  },
];

const AOSP_LOGS = [
  '[DEVICE-TREE] Kernel + Vendor Blobs alinhados ao SoC alvo.',
  '[LUNCH] lunch lineage_device-userdebug · SELinux & manifests OK.',
  '[CLANG-ARM64] Compilação nativa em C concluída (memória & ABI ok).',
  '[MKA BACON] system.img & boot.img empacotados em ambiente Linux.',
  '[ADB VERIFY] Boot limpo verificado · Zero regressões de hardware.',
];

function AospStackStage({ sceneIdx, onJumpToScene }: StageProps) {
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
      {/* Left: Bottom-Up OS Layer Stack */}
      <div className="md:col-span-7 flex flex-col justify-between gap-2">
        {AOSP_LAYERS.map((layer) => {
          const isCurrent = layer.sceneIdx === sceneIdx;
          const isBuilt = layer.sceneIdx <= sceneIdx;
          return (
            <button
              key={layer.num}
              type="button"
              onClick={() => onJumpToScene(layer.sceneIdx)}
              className={`w-full text-left px-3.5 py-2.5 border transition-colors flex items-center justify-between gap-3 ${
                isCurrent
                  ? 'bg-[#3B0764] border-[#9B86D6] text-white'
                  : isBuilt
                  ? 'bg-[#140D24] border-[#5B21B6]/55 text-[#D4C8F2]'
                  : 'bg-[#0C0B13] border-white/12 text-[#8E89A3] hover:border-[#5B21B6]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono-tabular text-[11px] font-bold px-2 py-1 bg-[#08070E] border border-white/12 text-[#9B86D6] shrink-0">
                  {layer.num}
                </span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-xs sm:text-[13px] text-white truncate">
                    {layer.title}
                  </p>
                  <p className="font-mono-tabular text-[10px] opacity-85 truncate">
                    {layer.sub}
                  </p>
                </div>
              </div>
              {renderFlowIcon(layer.icon, 'w-4 h-4 shrink-0 text-[#9B86D6]')}
            </button>
          );
        })}
      </div>

      {/* Right: Linux Build & Logcat Telemetry */}
      <div className="md:col-span-5 bg-[#06060B] border border-[#4C1D95]/50 p-4 flex flex-col justify-between">
        <div className="border-b border-white/10 pb-2.5 flex items-center justify-between text-[10px] font-mono-tabular">
          <span className="text-[#9B86D6]">LINUX BUILD · LOGCAT / DMESG</span>
          <span className="text-white">ARM64</span>
        </div>

        <div className="my-3 space-y-2 flex-1 flex flex-col justify-center">
          {AOSP_LOGS.map((entry, i) => {
            const unlocked = i <= sceneIdx;
            const current = i === sceneIdx;
            return (
              <div
                key={entry}
                className={`p-2 border font-mono-tabular text-[10.5px] leading-snug transition-opacity ${
                  current
                    ? 'bg-[#160D2B] border-[#826BC2] text-white opacity-100'
                    : unlocked
                    ? 'bg-[#0D0B16] border-[#4C1D95]/40 text-[#C4C0D4] opacity-85'
                    : 'bg-[#090910] border-white/8 text-[#6E6982] opacity-40'
                }`}
              >
                {entry}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/10 text-[10px] font-mono-tabular text-[#8E89A3] flex items-center justify-between">
          <span>Camada ativa: {sceneIdx + 1}/5</span>
          <span className="text-[#9B86D6]">Bottom-Up System Build</span>
        </div>
      </div>
    </div>
  );
}

export default function FlowStageVisuals(props: StageProps) {
  switch (props.program.stageMode) {
    case 'multi-device':
      return <MultiDeviceStage {...props} />;
    case 'sql-tuning':
      return <SqlTuningStage {...props} />;
    case 'pipeline-terminal':
      return <PipelineTerminalStage {...props} />;
    case 'aosp-stack':
      return <AospStackStage {...props} />;
    case 'hub-topology':
    default:
      return <HubTopologyStage {...props} />;
  }
}
