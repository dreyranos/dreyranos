import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      role="progressbar"
      aria-label="Progresso de leitura da página"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[var(--wash)] pointer-events-none no-print"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-[var(--soft)] via-[var(--soft)] to-[var(--btn)] will-change-transform"
      />
    </div>
  );
}
