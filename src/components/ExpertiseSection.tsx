import { Server, Smartphone, Database, Zap, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { COPY, type Lang } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { TechBadges } from './TechBadges';

interface ExpertiseSectionProps {
  lang: Lang;
}

const ICONS = {
  backend: Server,
  frontend: Smartphone,
  database: Database,
  automation: Zap,
  android: Cpu,
};

export function ExpertiseSection({ lang }: ExpertiseSectionProps) {
  const t = COPY[lang].about;

  return (
    <section id="sobre" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10"
        >
          <div>
            <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2">
              {t.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
            {t.desc}
          </p>
        </motion.div>

        <TechBadges lang={lang} />

        {/* Manifesto Banner */}
        <SpotlightCard className="mb-6 rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.manifestoLabel}
            </span>
            <p className="font-display text-lg sm:text-2xl font-medium text-zinc-950 dark:text-zinc-100 leading-snug">
              {t.manifestoQuote}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 shrink-0">
            {t.pillars.map((pillar, i) => (
              <span key={pillar} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">{pillar}</span>
              </span>
            ))}
          </div>
        </SpotlightCard>

        {/* Asymmetric 6-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {t.areas.map((area, idx) => {
            const Icon = ICONS[area.id as keyof typeof ICONS] || Server;
            const spanClass = area.span === 'wide' ? 'md:col-span-3' : 'md:col-span-2';
            return (
              <SpotlightCard
                key={area.id}
                as="article"
                delay={idx * 0.05}
                className={`${spanClass} rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 group`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-2">
                    {area.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {area.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {area.tags.join(' · ')}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
