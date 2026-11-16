import type { MouseEvent, ReactNode } from 'react';
import { motion } from 'motion/react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'article' | 'aside';
}

export function SpotlightCard({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: SpotlightCardProps) {
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  const Component = motion[as];

  return (
    <Component
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`spotlight-surface ${className}`}
    >
      {children}
    </Component>
  );
}
