import { useState, type MouseEvent } from 'react';
import { Code2, Boxes, RefreshCw, Settings, Zap, Monitor } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { COPY, STACK_ITEMS, type Lang, type StackCategory, type StackItem, type Theme } from '../data/portfolioData';

interface StackSectionProps {
  lang: Lang;
  theme: Theme;
}

function TechIcon({ item, theme }: { item: StackItem; theme: Theme }) {
  const [imgError, setImgError] = useState(false);

  if (item.customIcon === 'windows') {
    return <Monitor className="w-5 h-5 text-sky-500" aria-hidden="true" />;
  }
  if (item.customIcon === 'horse') {
    return (
      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5l2-4 1-5-3-1 3-5 4-1 2 2 3-1-1 4c2 2 2 5 1 7l2 4z" />
      </svg>
    );
  }
  if (item.customIcon === 'multitenant') {
    return <Boxes className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
  }
  if (item.customIcon === 'refactor') {
    return <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
  }
  if (item.customIcon === 'automation') {
    return <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
  }
  if (item.customIcon === 'ai') {
    return <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
  }

  if (!item.slug || imgError) {
    return <Code2 className="w-5 h-5 text-zinc-600 dark:text-zinc-300" aria-hidden="true" />;
  }

  const hex = theme === 'dark' ? item.colorDark : item.colorLight;
  return (
    <img
      src={`https://cdn.simpleicons.org/${item.slug}/${hex}`}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className="w-5 h-5 object-contain"
    />
  );
}

export function StackSection({ lang, theme }: StackSectionProps) {
  const [filter, setFilter] = useState<StackCategory>('all');
  const t = COPY[lang].stack;

  const filteredItems = filter === 'all' ? STACK_ITEMS : STACK_ITEMS.filter((item) => item.cat === filter);

  const handleSpotMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="stack" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2">
              {t.title}
            </h2>
          </div>

          {/* Segmented Filter Bar with Sliding Active Tab */}
          <div
            role="tablist"
            aria-label={t.title}
            className="print:hidden flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 self-start lg:self-auto"
          >
            {t.filters.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(f.id)}
                  className={`relative px-3 py-1.5 min-h-[36px] rounded-lg font-mono text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive
                      ? 'text-zinc-950 dark:text-[var(--fg)]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="stack-active-tab"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Animated Responsive Stack Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const title = lang === 'en' && item.nameEn ? item.nameEn : item.name;
              const sub = lang === 'en' ? item.subEn : item.subPt;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onMouseMove={handleSpotMove}
                  className="spotlight-surface rounded-xl p-4 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                      <TechIcon item={item} theme={theme} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.cat}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="font-display font-semibold text-sm sm:text-base text-zinc-950 dark:text-zinc-50 truncate">
                      {title}
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {sub}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
