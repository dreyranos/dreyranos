import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] h-[2.5px] bg-zinc-200/40 dark:bg-zinc-800/50 pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 dark:from-blue-500 dark:via-blue-400 dark:to-sky-300 shadow-[0_1px_10px_rgba(37,99,235,0.4)] dark:shadow-[0_1px_12px_rgba(96,165,250,0.5)]"
      />
    </div>
  );
}
