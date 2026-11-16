import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const orbParallax = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[var(--bg)]"
    >
      {/* Layer 1: Scroll-Parallax Architectural Blueprint Grid (Deep Nocturnal Purple) */}
      <motion.div
        style={{ y: shouldReduceMotion ? '0%' : gridY }}
        className="absolute -inset-y-24 inset-x-0 opacity-55 will-change-transform"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="arch-purple-grid"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 64 0 L 0 0 0 64"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.25" fill="rgba(129,124,128,0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-purple-grid)" />
        </svg>
      </motion.div>

      {/* Layer 2: Drifting Ambient Deep Obsidian-Purple Nebulae */}
      <motion.div
        style={{ y: shouldReduceMotion ? '0%' : orbParallax }}
        className="absolute inset-0 will-change-transform"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ['0%', '8%', '-4%', '0%'],
                  y: ['0%', '10%', '-5%', '0%'],
                  scale: [1, 1.12, 0.96, 1],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[18%] -right-[10%] w-[680px] h-[680px] rounded-full bg-[radial-gradient(circle,rgba(64,56,63,0.16)_0%,rgba(41,35,38,0.06)_45%,transparent_72%)] will-change-transform"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ['0%', '-7%', '6%', '0%'],
                  y: ['0%', '-8%', '7%', '0%'],
                  scale: [1, 0.92, 1.14, 1],
                }
          }
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[34%] -left-[12%] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(41,33,37,0.15)_0%,rgba(41,35,38,0.05)_50%,transparent_72%)] will-change-transform"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ['0%', '6%', '-6%', '0%'],
                  y: ['0%', '-6%', '5%', '0%'],
                  scale: [1, 1.08, 0.95, 1],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[16%] right-[18%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(75,66,76,0.12)_0%,rgba(41,33,37,0.04)_48%,transparent_72%)] will-change-transform"
        />
      </motion.div>

      {/* Layer 3: Silent Architectural Data Traces */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0">
          <motion.div
            initial={{ x: '-20%' }}
            animate={{ x: '120%' }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            className="absolute top-[22%] left-0 w-[260px] h-[1px] bg-gradient-to-r from-transparent via-[var(--card)]/45 to-transparent will-change-transform"
          />
          <motion.div
            initial={{ x: '120%' }}
            animate={{ x: '-25%' }}
            transition={{ duration: 11.5, repeat: Infinity, ease: 'linear', delay: 2.2 }}
            className="absolute top-[64%] left-0 w-[320px] h-[1px] bg-gradient-to-r from-transparent via-[var(--card)]/45 to-transparent will-change-transform"
          />
          <motion.div
            initial={{ y: '-20%' }}
            animate={{ y: '120%' }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 0.8 }}
            className="hidden md:block absolute top-0 left-[18%] w-[1px] h-[220px] bg-gradient-to-b from-transparent via-[var(--card)]/35 to-transparent will-change-transform"
          />
          <motion.div
            initial={{ y: '120%' }}
            animate={{ y: '-25%' }}
            transition={{ duration: 13, repeat: Infinity, ease: 'linear', delay: 3.4 }}
            className="hidden md:block absolute top-0 right-[22%] w-[1px] h-[260px] bg-gradient-to-b from-transparent via-[var(--card)]/40 to-transparent will-change-transform"
          />
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_36%,rgba(3,3,6,0.78)_100%)]" />
    </div>
  );
}
