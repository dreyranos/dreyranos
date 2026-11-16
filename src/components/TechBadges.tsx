import {
  Code2,
  Cpu,
  Database,
  FileCode2,
  Flame,
  Layers,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Lang } from '../data/portfolioData';

interface TechBadgesProps {
  lang: Lang;
}

const CORE_SKILLS = [
  {
    id: 'delphi',
    label: 'Delphi · Horse / FMX',
    icon: Flame,
    badgeClass:
      'bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300 hover:border-rose-500/50',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'csharp',
    label: 'C# .NET',
    icon: Layers,
    badgeClass:
      'bg-violet-500/10 border-violet-500/25 text-violet-700 dark:text-violet-300 hover:border-violet-500/50',
    iconClass: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'react',
    label: 'React',
    icon: Code2,
    badgeClass:
      'bg-sky-500/10 border-sky-500/25 text-sky-700 dark:text-sky-300 hover:border-sky-500/50',
    iconClass: 'text-sky-600 dark:text-sky-400',
  },
  {
    id: 'react-native',
    label: 'React Native · Expo',
    icon: Smartphone,
    badgeClass:
      'bg-cyan-500/10 border-cyan-500/25 text-cyan-700 dark:text-cyan-300 hover:border-cyan-500/50',
    iconClass: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: FileCode2,
    badgeClass:
      'bg-blue-500/10 border-blue-500/25 text-blue-700 dark:text-blue-300 hover:border-blue-500/50',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'firebird',
    label: 'Firebird SQL',
    icon: Database,
    badgeClass:
      'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300 hover:border-amber-500/50',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'python-bash',
    label: 'Python & Bash',
    icon: Terminal,
    badgeClass:
      'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500/50',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'ai',
    label: 'AI Workflows',
    icon: Zap,
    badgeClass:
      'bg-indigo-500/10 border-indigo-500/25 text-indigo-700 dark:text-indigo-300 hover:border-indigo-500/50',
    iconClass: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'aosp',
    label: 'AOSP · LineageOS',
    icon: Cpu,
    badgeClass:
      'bg-teal-500/10 border-teal-500/25 text-teal-700 dark:text-teal-300 hover:border-teal-500/50',
    iconClass: 'text-teal-600 dark:text-teal-400',
  },
];

export function TechBadges({ lang }: TechBadgesProps) {
  const heading = lang === 'pt' ? 'Competências Principais' : 'Core Skills';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
        {heading}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {CORE_SKILLS.map((skill, idx) => {
          const Icon = skill.icon;
          return (
            <motion.a
              key={skill.id}
              href="#stack"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.25,
                delay: idx * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 min-h-[34px] rounded-lg border font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${skill.badgeClass}`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${skill.iconClass}`} aria-hidden="true" />
              <span>{skill.label}</span>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
