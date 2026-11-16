import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BarChart3, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_INFO, COPY, type Lang, type Theme } from '../data/portfolioData';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import { SpotlightCard } from './SpotlightCard';

interface GitHubCommitChartProps {
  lang: Lang;
  theme: Theme;
}

interface ChartPoint {
  id: string;
  label: string;
  fullLabel: string;
  count: number;
}

type ViewMode = 'weekly' | 'weekday';

export function GitHubCommitChart({ lang, theme }: GitHubCommitChartProps) {
  const t = COPY[lang].github.d3Widget;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { days, totalYear, sourceMode, loading, error, retry } = useGitHubContributions();
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [containerWidth, setContainerWidth] = useState<number>(640);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // Responsive container measurement via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextWidth = Math.floor(entry.contentRect.width);
        if (nextWidth > 0) setContainerWidth(nextWidth);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, error]);

  // Transform raw daily data into Weekly (last 16 weeks) or Weekday aggregates
  const chartData = useMemo<ChartPoint[]>(() => {
    if (days.length === 0) return [];

    const recentDays = days.slice(-112); // 16 weeks * 7 days

    if (viewMode === 'weekly') {
      const weeks: ChartPoint[] = [];
      for (let i = 0; i < recentDays.length; i += 7) {
        const slice = recentDays.slice(i, i + 7);
        if (slice.length === 0) continue;
        const sum = slice.reduce((acc, d) => acc + d.count, 0);
        const startDate = new Date(`${slice[0].date}T00:00:00`);
        const endDate = new Date(`${slice[slice.length - 1].date}T00:00:00`);
        const fmt = (dt: Date) =>
          dt.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
          });
        weeks.push({
          id: slice[0].date,
          label: fmt(startDate),
          fullLabel: `${fmt(startDate)} – ${fmt(endDate)}`,
          count: sum,
        });
      }
      return weeks;
    }

    // By weekday
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    for (const d of recentDays) {
      const wd = new Date(`${d.date}T00:00:00`).getDay();
      buckets[wd] += d.count;
    }
    return buckets.map((count, idx) => ({
      id: `wd-${idx}`,
      label: t.weekdays[idx],
      fullLabel: t.weekdays[idx],
      count,
    }));
  }, [days, viewMode, lang, t.weekdays]);

  const metrics = useMemo(() => {
    if (chartData.length === 0) return { avg: 0, peak: 0 };
    const totalWindow = chartData.reduce((acc, p) => acc + p.count, 0);
    const avg = Math.round(totalWindow / chartData.length);
    const peak = d3.max(chartData, (d) => d.count) || 0;
    return { avg, peak };
  }, [chartData]);

  // Render D3 Bar + Area/Line Frequency Visualization
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || chartData.length === 0 || loading || error) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDark = theme === 'dark';

    const height = containerWidth < 520 ? 200 : 230;
    const margin = {
      top: 16,
      right: 14,
      bottom: 28,
      left: 34,
    };
    const innerWidth = Math.max(200, containerWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('width', containerWidth).attr('height', height).attr('viewBox', `0 0 ${containerWidth} ${height}`);

    const defs = svg.append('defs');
    const areaGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-commit-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', isDark ? '#60a5fa' : '#2563eb')
      .attr('stop-opacity', isDark ? 0.28 : 0.2);

    areaGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', isDark ? '#60a5fa' : '#2563eb')
      .attr('stop-opacity', 0);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand<string>()
      .domain(chartData.map((d) => d.id))
      .range([0, innerWidth])
      .padding(viewMode === 'weekly' ? 0.34 : 0.42);

    const maxVal = Math.max(d3.max(chartData, (d) => d.count) || 4, 4);
    const y = d3.scaleLinear().domain([0, maxVal * 1.15]).nice().range([innerHeight, 0]);

    // Horizontal grid lines
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(9,9,11,0.06)';
    const textColor = isDark ? '#a1a1aa' : '#52525b';
    const barDefault = isDark ? 'rgba(96, 165, 250, 0.32)' : 'rgba(37, 99, 235, 0.24)';
    const barPeak = isDark ? '#60a5fa' : '#2563eb';

    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .call((axis) => axis.select('.domain').remove())
      .call((axis) => axis.selectAll('line').attr('stroke', gridColor));

    // Y Axis labels
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(0))
      .call((axis) => axis.select('.domain').remove())
      .call((axis) =>
        axis
          .selectAll('text')
          .attr('fill', textColor)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', '10px')
          .attr('dx', '-6')
      );

    // X Axis labels (skip every other label on narrow screens in weekly mode)
    const tickValues =
      viewMode === 'weekly' && containerWidth < 560
        ? chartData.filter((_, idx) => idx % 3 === 0).map((d) => d.id)
        : viewMode === 'weekly'
          ? chartData.filter((_, idx) => idx % 2 === 0).map((d) => d.id)
          : chartData.map((d) => d.id);

    const labelById = new Map(chartData.map((d) => [d.id, d.label]));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(tickValues)
          .tickSize(0)
          .tickFormat((id) => labelById.get(id) || '')
      )
      .call((axis) => axis.select('.domain').attr('stroke', gridColor))
      .call((axis) =>
        axis
          .selectAll('text')
          .attr('fill', textColor)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', '10px')
          .attr('dy', '10')
      );

    // Area & Trend Line
    const areaGen = d3
      .area<ChartPoint>()
      .x((d) => (x(d.id) || 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    const lineGen = d3
      .line<ChartPoint>()
      .x((d) => (x(d.id) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#d3-commit-area-grad)')
      .attr('d', areaGen);

    const linePath = g
      .append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', barPeak)
      .attr('stroke-width', 2)
      .attr('d', lineGen);

    if (!prefersReducedMotion) {
      const totalLen = linePath.node()?.getTotalLength() || 0;
      linePath
        .attr('stroke-dasharray', `${totalLen} ${totalLen}`)
        .attr('stroke-dashoffset', totalLen)
        .transition()
        .duration(650)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    }

    // Bars
    const peakCount = d3.max(chartData, (d) => d.count) || 0;

    const bars = g
      .selectAll<SVGRectElement, ChartPoint>('.commit-bar')
      .data(chartData, (d) => d.id)
      .join('rect')
      .attr('class', 'commit-bar')
      .attr('x', (d) => x(d.id) || 0)
      .attr('width', x.bandwidth())
      .attr('rx', 4)
      .attr('fill', (d) => (d.count === peakCount && peakCount > 0 ? barPeak : barDefault))
      .style('cursor', 'pointer');

    if (prefersReducedMotion) {
      bars.attr('y', (d) => y(d.count)).attr('height', (d) => Math.max(2, innerHeight - y(d.count)));
    } else {
      bars
        .attr('y', innerHeight)
        .attr('height', 0)
        .transition()
        .duration(480)
        .delay((_, i) => i * 18)
        .ease(d3.easeCubicOut)
        .attr('y', (d) => y(d.count))
        .attr('height', (d) => Math.max(2, innerHeight - y(d.count)));
    }

    // Data points along curve
    g.selectAll<SVGCircleElement, ChartPoint>('.commit-dot')
      .data(chartData, (d) => d.id)
      .join('circle')
      .attr('class', 'commit-dot')
      .attr('cx', (d) => (x(d.id) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.count))
      .attr('r', 3)
      .attr('fill', isDark ? '#0e0e12' : '#ffffff')
      .attr('stroke', barPeak)
      .attr('stroke-width', 1.75)
      .style('pointer-events', 'none');

    // Interactive hover/focus bindings
    bars
      .on('mouseenter touchstart', function (_event, d) {
        d3.select(this).attr('fill', barPeak);
        setHoveredPoint(d);
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this).attr('fill', d.count === peakCount && peakCount > 0 ? barPeak : barDefault);
        setHoveredPoint(null);
      });
  }, [chartData, containerWidth, theme, viewMode, loading, error]);

  return (
    <SpotlightCard
      delay={0.02}
      className="lg:col-span-12 rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <BarChart3 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">
              {t.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {sourceMode === 'events' ? t.sourceNoteEvents : t.subtitle}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div
          role="tablist"
          aria-label={t.title}
          className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start lg:self-auto"
        >
          {(['weekly', 'weekday'] as ViewMode[]).map((mode) => {
            const active = viewMode === mode;
            const label = mode === 'weekly' ? t.modeWeekly : t.modeWeekday;
            return (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setHoveredPoint(null);
                  setViewMode(mode);
                }}
                className={`relative px-3 py-1.5 min-h-[34px] rounded-lg font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="d3-view-tab"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-xs"
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary KPIs + Live Hover Inspection */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{t.totalYear}</div>
            <div className="font-display font-bold text-lg sm:text-xl text-zinc-950 dark:text-zinc-50 tabular-nums mt-0.5">
              {totalYear.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{t.avgWeek}</div>
            <div className="font-display font-bold text-lg sm:text-xl text-zinc-950 dark:text-zinc-50 tabular-nums mt-0.5">
              {metrics.avg}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{t.peakWeek}</div>
            <div className="font-display font-bold text-lg sm:text-xl text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">
              {metrics.peak}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {hoveredPoint ? (
              <div className="text-left sm:text-right">
                <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                  {hoveredPoint.fullLabel}
                </div>
                <div className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50 tabular-nums">
                  {hoveredPoint.count} {t.commitsLabel}
                </div>
              </div>
            ) : (
              <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:text-right">
                D3.js · {CONTACT_INFO.handle}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart Body / Loading / Error */}
      <div ref={containerRef} className="w-full pt-4">
        {loading ? (
          <div className="h-[210px] flex flex-col items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
            <div className="w-6 h-6 rounded-full border-2 border-blue-600/30 border-t-blue-600 dark:border-blue-400/30 dark:border-t-blue-400 animate-spin" />
            <span className="font-mono text-xs">{t.loading}</span>
          </div>
        ) : error ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-center gap-3 px-4">
            <div className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              {t.errorTitle}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">{t.errorDesc}</p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.retry}</span>
            </button>
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full block select-none overflow-visible"
            role="img"
            aria-label={t.title}
          />
        )}
      </div>
    </SpotlightCard>
  );
}
