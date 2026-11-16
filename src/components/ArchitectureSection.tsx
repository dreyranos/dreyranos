import { useState } from 'react';
import { ArrowDown, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { COPY, type ArchNodeKey, type Lang } from '../data/portfolioData';

interface ArchitectureSectionProps {
  lang: Lang;
}

export function ArchitectureSection({ lang }: ArchitectureSectionProps) {
  const [activeNode, setActiveNode] = useState<ArchNodeKey>('gateway');
  const t = COPY[lang].arch;
  const selected = t.nodes[activeNode];

  const getNodeClasses = (key: ArchNodeKey, isGateway = false) => {
    const isActive = activeNode === key;
    if (isActive) {
      return 'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/30';
    }
    if (isGateway) {
      return 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/80 hover:border-zinc-400 dark:hover:border-zinc-500';
    }
    return 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700';
  };

  return (
    <section id="arquitetura" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-12 max-w-3xl"
        >
          <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
            {t.kicker}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            {t.desc}
          </p>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-2">
            {t.hint}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-5 sm:p-8 lg:p-10 bg-white dark:bg-[#0b0b0f] border border-zinc-200 dark:border-zinc-800"
        >
          {/* Interactive 3-Layer Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-4 items-center">
            {/* Layer 1: Clients */}
            <div className="lg:col-span-3 space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                {t.col1}
              </div>

              {(['mobile', 'desktop', 'auto'] as ArchNodeKey[]).map((key) => {
                const isSelected = activeNode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveNode(key)}
                    aria-pressed={isSelected}
                    className={`relative w-full text-left p-4 min-h-[44px] rounded-xl border transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${getNodeClasses(
                      key
                    )}`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="arch-active-ring"
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-xl ring-2 ring-blue-600/35 dark:ring-blue-400/40 pointer-events-none"
                      />
                    )}
                    <div className="font-display font-semibold text-sm text-zinc-950 dark:text-zinc-50">
                      {t.nodes[key].shortTitle}
                    </div>
                    <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {t.nodes[key].shortSub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Connector 1 -> 2 */}
            <div className="flex lg:hidden justify-center py-1 text-blue-600/70 dark:text-blue-400/70" aria-hidden="true">
              <ArrowDown className="w-5 h-5" />
            </div>
            <div className="hidden lg:flex lg:col-span-1 justify-center text-zinc-400 dark:text-zinc-600" aria-hidden="true">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 80 200" fill="none">
                <path id="arch-in-1" d="M0 30 C 40 30, 40 100, 80 100" stroke="currentColor" strokeWidth="1.75" className="flow-dash" />
                <path id="arch-in-2" d="M0 100 L 80 100" stroke="currentColor" strokeWidth="1.75" className="flow-dash" />
                <path id="arch-in-3" d="M0 170 C 40 170, 40 100, 80 100" stroke="currentColor" strokeWidth="1.75" className="flow-dash" />

                <circle r="3" className="fill-blue-600 dark:fill-blue-400">
                  <animateMotion dur="2.6s" repeatCount="indefinite" path="M0 30 C 40 30, 40 100, 80 100" />
                </circle>
                <circle r="3" className="fill-blue-600 dark:fill-blue-400">
                  <animateMotion dur="2.1s" begin="0.5s" repeatCount="indefinite" path="M0 100 L 80 100" />
                </circle>
                <circle r="3" className="fill-blue-600 dark:fill-blue-400">
                  <animateMotion dur="2.8s" begin="1.1s" repeatCount="indefinite" path="M0 170 C 40 170, 40 100, 80 100" />
                </circle>
              </svg>
            </div>

            {/* Layer 2: Multi-Tenant Core */}
            <div className="lg:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                {t.col2}
              </div>
              <button
                type="button"
                onClick={() => setActiveNode('gateway')}
                aria-pressed={activeNode === 'gateway'}
                className={`relative w-full text-left p-5 sm:p-6 min-h-[44px] rounded-xl border transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${getNodeClasses(
                  'gateway',
                  true
                )}`}
              >
                {activeNode === 'gateway' && (
                  <motion.span
                    layoutId="arch-active-ring"
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-xl ring-2 ring-blue-600/35 dark:ring-blue-400/40 pointer-events-none"
                  />
                )}
                <div className="font-mono text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
                  Core Gateway
                </div>
                <div className="font-display font-bold text-lg text-zinc-950 dark:text-zinc-50">
                  {t.nodes.gateway.shortTitle}
                </div>
                <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                  {t.nodes.gateway.shortSub}
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  Horse (Delphi) · C# .NET
                </div>
              </button>
            </div>

            {/* Connector 2 -> 3 */}
            <div className="flex lg:hidden justify-center py-1 text-blue-600/70 dark:text-blue-400/70" aria-hidden="true">
              <ArrowDown className="w-5 h-5" />
            </div>
            <div className="hidden lg:flex lg:col-span-1 justify-center text-zinc-400 dark:text-zinc-600" aria-hidden="true">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 80 140" fill="none">
                <path d="M0 70 C 40 70, 40 32, 80 32" stroke="currentColor" strokeWidth="1.75" className="flow-dash" />
                <path d="M0 70 C 40 70, 40 108, 80 108" stroke="currentColor" strokeWidth="1.75" className="flow-dash" />

                <circle r="3" className="fill-blue-600 dark:fill-blue-400">
                  <animateMotion dur="2.2s" begin="0.3s" repeatCount="indefinite" path="M0 70 C 40 70, 40 32, 80 32" />
                </circle>
                <circle r="3" className="fill-blue-600 dark:fill-blue-400">
                  <animateMotion dur="2.4s" begin="0.9s" repeatCount="indefinite" path="M0 70 C 40 70, 40 108, 80 108" />
                </circle>
              </svg>
            </div>

            {/* Layer 3: Domain & Persistence */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                {t.col3}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {(['services', 'database'] as ArchNodeKey[]).map((key) => {
                  const isSelected = activeNode === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveNode(key)}
                      aria-pressed={isSelected}
                      className={`relative w-full text-left p-4 min-h-[44px] rounded-xl border transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${getNodeClasses(
                        key
                      )}`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="arch-active-ring"
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 rounded-xl ring-2 ring-blue-600/35 dark:ring-blue-400/40 pointer-events-none"
                        />
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-sm text-zinc-950 dark:text-zinc-50">
                          {t.nodes[key].shortTitle}
                        </span>
                        {key === 'database' && (
                          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                            Data Layer
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {t.nodes[key].shortSub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Animated Inspector Output */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${lang}-${activeNode}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <h3 className="font-display font-bold text-base sm:text-lg">{selected.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    {selected.desc}
                  </p>
                </div>
                <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 shrink-0 md:text-right">
                  {selected.tag}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
