import { GraduationCap, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { COPY, type Lang } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

interface ExperienceSectionProps {
  lang: Lang;
}

export function ExperienceSection({ lang }: ExperienceSectionProps) {
  const t = COPY[lang].exp;

  return (
    <section id="experiencia" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-12"
        >
          <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
            {t.kicker}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline Column */}
          <div className="lg:col-span-8 space-y-4">
            {t.roles.map((item, idx) => (
              <SpotlightCard
                key={`${item.company}-${item.role}`}
                as="article"
                delay={idx * 0.05}
                className={`rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#0e0e12] border ${
                  item.current
                    ? 'border-blue-600/40 dark:border-blue-400/40'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-zinc-50">
                      {item.role}
                    </h3>
                    {item.current && (
                      <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
                        · {t.currentLabel}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
                    {item.period}
                  </span>
                </div>

                <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {item.company} · {item.location}
                </div>

                {item.summary && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed">
                    {item.summary}
                  </p>
                )}
              </SpotlightCard>
            ))}

            {/* Casa das Vacinas Group */}
            <SpotlightCard
              as="article"
              delay={0.18}
              className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 mb-4">
                <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {t.casaGroup.company}
                </h3>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                  {t.casaGroup.total}
                </span>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 border-t border-zinc-100 dark:border-zinc-800/80">
                {t.casaGroup.subRoles.map((sub) => (
                  <div
                    key={sub.role}
                    className="py-3 first:pt-3 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {sub.role}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {sub.period}
                    </span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* Education & Executive Edge Column */}
          <aside className="lg:col-span-4 space-y-5">
            <SpotlightCard
              delay={0.08}
              className="rounded-2xl p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t.education.kicker}
                  </div>
                  <h3 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                    {t.education.title}
                  </h3>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="font-display font-semibold text-sm text-zinc-950 dark:text-zinc-100">
                  {t.education.school}
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {t.education.course}
                </p>
                <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-2 tabular-nums">
                  {t.education.period}
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard
              delay={0.14}
              className="rounded-2xl p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800"
            >
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t.edge.kicker}
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-950 dark:text-zinc-50 mt-1 mb-4">
                {t.edge.title}
              </h3>
              <ul className="space-y-3">
                {t.edge.items.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </aside>
        </div>
      </div>
    </section>
  );
}
