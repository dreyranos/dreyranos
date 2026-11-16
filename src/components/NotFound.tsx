import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { COPY, type Lang } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

interface NotFoundProps {
  lang: Lang;
  attemptedPath: string;
  onNavigateHome: (sectionHash?: string) => void;
}

export function NotFound({ lang, attemptedPath, onNavigateHome }: NotFoundProps) {
  const t = COPY[lang].notFound;

  return (
    <section
      aria-labelledby="not-found-title"
      className="relative flex-1 flex items-center pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="architectural-grid pointer-events-none absolute inset-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Primary 404 Narrative & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
              {t.kicker}
            </p>

            <div className="mt-3 flex items-baseline gap-4">
              <span className="font-mono text-5xl sm:text-7xl font-bold tracking-tight text-blue-600 dark:text-blue-400 tabular-nums leading-none">
                404
              </span>
              <span className="h-px flex-1 max-w-[120px] bg-zinc-300 dark:bg-zinc-800" aria-hidden="true" />
            </div>

            <h1
              id="not-found-title"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-4 leading-[1.12]"
            >
              {t.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 max-w-xl leading-relaxed">
              {t.desc}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>{t.requestedLabel}</span>
              <span aria-hidden="true">·</span>
              <code className="text-zinc-800 dark:text-zinc-200 break-all">
                {attemptedPath}
              </code>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateHome('#topo')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-[var(--fg)] dark:text-zinc-950 font-semibold text-sm transition-all active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.backHome}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateHome('#projetos')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[var(--bg)] hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-100 font-semibold text-sm transition-all active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
              >
                <span>{t.viewProjects}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Architectural Quick Section Directory */}
          <div className="lg:col-span-5">
            <SpotlightCard
              delay={0.08}
              className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                <h2 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                  {t.quickLinksTitle}
                </h2>
              </div>

              <div className="mt-3 divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
                {t.quickLinks.map((item) => (
                  <button
                    key={item.hash}
                    type="button"
                    onClick={() => onNavigateHome(item.hash)}
                    className="w-full py-3.5 flex items-center justify-between gap-4 text-left group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
                  >
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        {item.desc}
                      </div>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
