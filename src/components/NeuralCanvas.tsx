import { useEffect, useRef } from 'react';
import type { Theme } from '../data/portfolioData';

interface NeuralCanvasProps {
  theme: Theme;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  r: number;
  hub: boolean;
}

export function NeuralCanvas({ theme }: NeuralCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<Theme>(theme);
  const redrawStaticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    redrawStaticRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let animationId = 0;
    let nodes: NodePoint[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const initNodes = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 640 ? 28 : width < 1024 ? 46 : 68;
      nodes = Array.from({ length: count }, (_, idx) => {
        const baseVx = (Math.random() - 0.5) * 0.42;
        const baseVy = (Math.random() - 0.5) * 0.42;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          r: idx % 5 === 0 ? Math.random() * 1.3 + 2.0 : Math.random() * 1.1 + 0.9,
          hub: idx % 5 === 0,
        };
      });
    };

    const drawFrame = () => {
      const isDark = themeRef.current === 'dark';
      const rgb = isDark ? '228, 228, 231' : '24, 24, 27';
      const accentRgb = isDark ? '96, 165, 250' : '37, 99, 235';
      const maxDist = width < 768 ? 115 : 155;
      const influenceRadius = width < 768 ? 190 : 245;
      const connectionRadius = width < 768 ? 165 : 195;
      const maxSpeed = 1.45;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dxP = pointer.x - n.x;
        const dyP = pointer.y - n.y;
        const distP = Math.hypot(dxP, dyP);
        const inField = pointer.active && distP < influenceRadius;

        if (!prefersReducedMotion) {
          if (inField && distP > 1) {
            const nx = dxP / distP;
            const ny = dyP / distP;
            const falloff = 1 - distP / influenceRadius;

            if (distP > 28) {
              // Gentle gravitational pull toward cursor or touch point
              const pull = falloff * 0.045;
              n.vx += nx * pull;
              n.vy += ny * pull;
            } else {
              // Soft inner-core cushion so particles orbit gently without collapsing
              n.vx -= nx * 0.015;
              n.vy -= ny * 0.015;
            }
          } else {
            // Gradually relax velocity back to natural ambient drift
            n.vx += (n.baseVx - n.vx) * 0.014;
            n.vy += (n.baseVy - n.vy) * 0.014;
          }

          // Subtle damping + speed cap
          n.vx *= 0.992;
          n.vy *= 0.992;
          const speed = Math.hypot(n.vx, n.vy);
          if (speed > maxSpeed) {
            n.vx = (n.vx / speed) * maxSpeed;
            n.vy = (n.vy / speed) * maxSpeed;
          }

          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0) {
            n.x = 0;
            n.vx = Math.abs(n.vx);
            n.baseVx = Math.abs(n.baseVx);
          } else if (n.x > width) {
            n.x = width;
            n.vx = -Math.abs(n.vx);
            n.baseVx = -Math.abs(n.baseVx);
          }

          if (n.y < 0) {
            n.y = 0;
            n.vy = Math.abs(n.vy);
            n.baseVy = Math.abs(n.baseVy);
          } else if (n.y > height) {
            n.y = height;
            n.vy = -Math.abs(n.vy);
            n.baseVy = -Math.abs(n.baseVy);
          }
        }

        if (pointer.active && distP < connectionRadius && distP > 1) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(pointer.x, pointer.y);
          const alphaP = (1 - distP / connectionRadius) * (isDark ? 0.3 : 0.2);
          ctx.strokeStyle = `rgba(${accentRgb}, ${alphaP})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            const alpha = (1 - dist / maxDist) * (isDark ? 0.14 : 0.08);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        const fieldStrength = inField ? 1 - distP / influenceRadius : 0;

        if (n.hub || fieldStrength > 0.35) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * (2.3 + fieldStrength * 0.7), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRgb}, ${(isDark ? 0.08 : 0.05) + fieldStrength * 0.08})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + fieldStrength * 0.35, 0, Math.PI * 2);
        const nodeColor = fieldStrength > 0.25 ? accentRgb : rgb;
        const baseAlpha = isDark ? (n.hub ? 0.55 : 0.35) : (n.hub ? 0.3 : 0.18);
        ctx.fillStyle = `rgba(${nodeColor}, ${Math.min(0.85, baseAlpha + fieldStrength * 0.28)})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationId = window.requestAnimationFrame(drawFrame);
      }
    };

    redrawStaticRef.current = prefersReducedMotion ? drawFrame : null;

    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handlePointerClear = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      pointer.x = touch.clientX;
      pointer.y = touch.clientY;
      pointer.active = true;
    };

    const handleResize = () => {
      initNodes();
      if (prefersReducedMotion) drawFrame();
    };

    initNodes();
    drawFrame();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerClear);
    window.addEventListener('blur', handlePointerClear);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handlePointerClear);
    window.addEventListener('touchcancel', handlePointerClear);

    return () => {
      redrawStaticRef.current = null;
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handlePointerClear);
      window.removeEventListener('blur', handlePointerClear);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerClear);
      window.removeEventListener('touchcancel', handlePointerClear);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 architectural-grid" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
