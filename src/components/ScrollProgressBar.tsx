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
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/8 pointer-events-none no-print"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#3B0764] via-[#4C1D95] to-[#826BC2] will-change-transform"
      />
    </div>
  );
}
