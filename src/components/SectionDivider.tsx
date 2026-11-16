import { motion, useReducedMotion } from 'motion/react';

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className = '' }: SectionDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scaleX: 0.72 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-px w-full origin-center overflow-hidden bg-gradient-to-r from-transparent via-zinc-300/80 dark:via-zinc-700/80 to-transparent print:bg-none print:border-t print:border-zinc-200"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/25 dark:via-blue-400/30 to-transparent print:hidden" />

        {!shouldReduceMotion && (
          <motion.div
            initial={{ x: '-40%' }}
            animate={{ x: '240%' }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'linear',
            }}
            className="print:hidden absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-600/75 dark:via-blue-400/80 to-transparent"
          />
        )}
      </motion.div>
    </div>
  );
}
