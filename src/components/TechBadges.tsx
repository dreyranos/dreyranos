import { motion } from 'motion/react';
import type { Lang } from '../data/portfolioData';

interface TechBadgesProps {
  lang: Lang;
}

const CORE_SKILLS = [
  'Delphi · Horse / FMX',
  'C# .NET',
  'React',
  'React Native · Expo',
  'TypeScript',
  'Firebird SQL',
  'Python & Bash',
  'AI Workflows',
  'AOSP · LineageOS',
];

export function TechBadges({ lang }: TechBadgesProps) {
  const heading = lang === 'pt' ? 'Competências Principais' : 'Core Capabilities';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
        {heading}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
        {CORE_SKILLS.map((skill, idx) => (
          <span key={skill} className="inline-flex items-center gap-3">
            {idx > 0 && (
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
                ·
              </span>
            )}
            <a
              href="#stack"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              {skill}
            </a>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
