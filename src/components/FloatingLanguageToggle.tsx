import { Globe } from 'lucide-react';
import { motion } from 'motion/react';
import type { Lang } from '../data/portfolioData';

interface FloatingLanguageToggleProps {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
}

export function FloatingLanguageToggle({ lang, onChangeLang }: FloatingLanguageToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      role="group"
      aria-label={lang === 'pt' ? 'Alternar idioma' : 'Switch language'}
      className="print:hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-[#0e0e12]/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-950/10 dark:shadow-black/50"
    >
      <Globe
        className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 ml-2 mr-0.5 shrink-0"
        aria-hidden="true"
      />
      {(['pt', 'en'] as Lang[]).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChangeLang(code)}
            aria-pressed={active}
            aria-label={code === 'pt' ? 'Português' : 'English'}
            className={`relative px-2.5 py-1.5 min-h-[34px] rounded-lg font-mono text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
              active
                ? 'text-white dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
            }`}
          >
            {active && (
              <motion.span
                layoutId="floating-lang-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-lg bg-blue-600 dark:bg-blue-400"
              />
            )}
            <span className="relative z-10 uppercase">{code}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
