import { useEffect, useMemo, useState } from 'react';

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

export interface CoreWebVitalsState {
  fcpMs: number | null;
  lcpMs: number | null;
  cls: number | null;
  fidMs: number | null;
  loadMs: number | null;
  isSlow: boolean;
  slowReasons: string[];
}

const THRESHOLDS = {
  fcpMs: 1800,
  lcpMs: 2500,
  cls: 0.1,
  fidMs: 100,
  loadMs: 3500,
} as const;

export function useCoreWebVitals(): CoreWebVitalsState {
  const [fcpMs, setFcpMs] = useState<number | null>(null);
  const [lcpMs, setLcpMs] = useState<number | null>(null);
  const [cls, setCls] = useState<number | null>(null);
  const [fidMs, setFidMs] = useState<number | null>(null);
  const [loadMs, setLoadMs] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      return;
    }

    const observers: PerformanceObserver[] = [];

    // 1. Navigation Timing (full page load duration)
    const measureNavigationLoad = () => {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const nav = navEntries[0];
      if (nav && nav.loadEventEnd > 0) {
        setLoadMs(Math.round(nav.loadEventEnd - nav.startTime));
      }
    };

    measureNavigationLoad();
    window.addEventListener('load', measureNavigationLoad, { once: true });

    if (typeof PerformanceObserver === 'undefined') {
      return () => {
        window.removeEventListener('load', measureNavigationLoad);
      };
    }

    const supported = PerformanceObserver.supportedEntryTypes ?? [];

    // 2. First Contentful Paint (FCP)
    if (supported.includes('paint')) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              setFcpMs(Math.round(entry.startTime));
            }
          }
        });
        paintObserver.observe({ type: 'paint', buffered: true });
        observers.push(paintObserver);
      } catch {
        // Ignore unsupported observer configuration
      }
    }

    // 3. Largest Contentful Paint (LCP)
    if (supported.includes('largest-contentful-paint')) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) {
            setLcpMs(Math.round(last.startTime));
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        observers.push(lcpObserver);
      } catch {
        // Ignore unsupported observer configuration
      }
    }

    // 4. Cumulative Layout Shift (CLS)
    if (supported.includes('layout-shift')) {
      try {
        let clsTotal = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as LayoutShiftEntry[]) {
            if (!entry.hadRecentInput) {
              clsTotal += entry.value;
            }
          }
          setCls(Number(clsTotal.toFixed(3)));
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        observers.push(clsObserver);
      } catch {
        // Ignore unsupported observer configuration
      }
    }

    // 5. First Input Delay (FID)
    if (supported.includes('first-input')) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const first = list.getEntries()[0] as FirstInputEntry | undefined;
          if (first) {
            setFidMs(Math.round(first.processingStart - first.startTime));
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        observers.push(fidObserver);
      } catch {
        // Ignore unsupported observer configuration
      }
    }

    return () => {
      window.removeEventListener('load', measureNavigationLoad);
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, []);

  return useMemo(() => {
    const slowReasons: string[] = [];

    if (lcpMs !== null && lcpMs > THRESHOLDS.lcpMs) {
      slowReasons.push(`LCP: ${lcpMs}ms`);
    }
    if (fcpMs !== null && fcpMs > THRESHOLDS.fcpMs) {
      slowReasons.push(`FCP: ${fcpMs}ms`);
    }
    if (cls !== null && cls > THRESHOLDS.cls) {
      slowReasons.push(`CLS: ${cls}`);
    }
    if (fidMs !== null && fidMs > THRESHOLDS.fidMs) {
      slowReasons.push(`FID: ${fidMs}ms`);
    }
    if (loadMs !== null && loadMs > THRESHOLDS.loadMs) {
      slowReasons.push(`Load: ${loadMs}ms`);
    }

    return {
      fcpMs,
      lcpMs,
      cls,
      fidMs,
      loadMs,
      isSlow: slowReasons.length > 0,
      slowReasons,
    };
  }, [fcpMs, lcpMs, cls, fidMs, loadMs]);
}
