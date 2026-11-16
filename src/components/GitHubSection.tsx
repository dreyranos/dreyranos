import { useEffect, useState } from 'react';
import { ExternalLink, GitBranch } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_INFO, COPY, type Lang, type Theme } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { GitHubCommitChart } from './GitHubCommitChart';
import { ContributionGraph } from './ContributionGraph';

interface GitHubSectionProps {
  lang: Lang;
  theme: Theme;
}

export function GitHubSection({ lang, theme }: GitHubSectionProps) {
  const t = COPY[lang].github;
  const [streakFailed, setStreakFailed] = useState(false);
  const [activityFailed, setActivityFailed] = useState(false);
  const [arcadeFailed, setArcadeFailed] = useState(false);

  useEffect(() => {
    setStreakFailed(false);
    setActivityFailed(false);
    setArcadeFailed(false);
  }, [lang, theme]);

  const locale = lang === 'en' ? 'en' : 'pt_BR';

  const streakSrc =
    theme === 'dark'
      ? `https://streak-stats.demolab.com?user=dreyranos&theme=transparent&border=ffffff22&border_radius=12&ring=60a5fa&fire=60a5fa&currStreakLabel=e4e4e7&sideLabels=a1a1aa&currStreakNum=ffffff&sideNums=d4d4d8&dates=71717a&locale=${locale}`
      : `https://streak-stats.demolab.com?user=dreyranos&theme=transparent&border=09090b1a&border_radius=12&ring=2563eb&fire=2563eb&currStreakLabel=3f3f46&sideLabels=52525b&currStreakNum=09090b&sideNums=27272a&dates=71717a&locale=${locale}`;

  const activitySrc =
    theme === 'dark'
      ? 'https://github-readme-activity-graph.vercel.app/graph?username=dreyranos&bg_color=05050700&color=e4e4e7&line=60a5fa&point=ffffff&area=true&hide_border=true'
      : 'https://github-readme-activity-graph.vercel.app/graph?username=dreyranos&bg_color=f4f4f600&color=18181b&line=2563eb&point=09090b&area=true&hide_border=true';

  const arcadeSrc =
    theme === 'dark'
      ? 'https://raw.githubusercontent.com/dreyranos/dreyranos/output/puzzle-bobble-contribution-graph-dark.svg'
      : 'https://raw.githubusercontent.com/dreyranos/dreyranos/output/puzzle-bobble-contribution-graph.svg';

  return (
    <section id="github" className="print:hidden py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
              {t.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2">
              {t.title}
            </h2>
          </div>

          <a
            href={CONTACT_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>github.com/dreyranos</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Dynamic D3 Commit Frequency Widget */}
          <GitHubCommitChart lang={lang} theme={theme} />

          {/* Full-Year D3 Contribution Heatmap */}
          <ContributionGraph lang={lang} theme={theme} />

          <SpotlightCard
            delay={0.06}
            className="lg:col-span-5 rounded-2xl p-5 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[200px]"
          >
            {!streakFailed ? (
              <img
                src={streakSrc}
                alt={t.streakTitle}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setStreakFailed(true)}
                className="w-full max-w-md rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center text-center gap-2 p-4">
                <GitBranch className="w-6 h-6 text-zinc-400" aria-hidden="true" />
                <div className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {t.streakTitle}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">{t.fallbackText}</p>
              </div>
            )}
          </SpotlightCard>

          <SpotlightCard
            delay={0.1}
            className="lg:col-span-7 rounded-2xl p-5 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden min-h-[200px]"
          >
            {!activityFailed ? (
              <img
                src={activitySrc}
                alt={t.activityTitle}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setActivityFailed(true)}
                className="w-full rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center text-center gap-2 p-4">
                <GitBranch className="w-6 h-6 text-zinc-400" aria-hidden="true" />
                <div className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {t.activityTitle}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">{t.fallbackText}</p>
              </div>
            )}
          </SpotlightCard>

          <SpotlightCard
            delay={0.14}
            className="lg:col-span-12 rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="w-full flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {t.arcadeTitle}
              </span>
              <a
                href={CONTACT_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                @dreyranos
              </a>
            </div>

            {!arcadeFailed ? (
              <img
                src={arcadeSrc}
                alt={t.arcadeTitle}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setArcadeFailed(true)}
                className="w-full max-w-4xl rounded-xl"
              />
            ) : (
              <div className="py-8 text-center">
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{t.fallbackText}</p>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
