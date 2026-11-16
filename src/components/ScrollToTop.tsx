import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import type { Lang } from '../data/portfolioData';

interface ScrollToTopProps {
  lang: Lang;
}

const SCROLL_THRESHOLD_PX = 400;

export function ScrollToTop({ lang }: ScrollToTopProps) {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > SCROLL_THRESHOLD_PX;
    setVisible((prev) => (prev === next ? prev : next));
  });

  const handleScrollToTop = () => {
    const behavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';
    const heroEl = document.getElementById('topo');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  const label = lang === 'pt' ? 'Voltar ao topo' : 'Scroll to top';

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleScrollToTop}
          aria-label={label}
          title={label}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.92 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.92 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="print:hidden fixed bottom-[4.25rem] right-4 sm:bottom-[4.75rem] sm:right-6 z-40 w-11 h-11 rounded-xl bg-white/90 dark:bg-[#0b0b0f]/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-950/10 dark:shadow-black/50 text-zinc-700 dark:text-zinc-200 hover:border-blue-600/50 dark:hover:border-blue-400/50 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center justify-center transition-colors active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
