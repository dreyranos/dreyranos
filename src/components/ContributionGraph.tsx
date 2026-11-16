import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { COPY, type Lang, type Theme } from '../data/portfolioData';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import { SpotlightCard } from './SpotlightCard';

interface ContributionGraphProps {
  lang: Lang;
  theme: Theme;
}

interface HeatmapCell {
  dateStr: string;
  dateObj: Date;
  count: number;
  weekIndex: number;
  dayOfWeek: number;
}

const DARK_PALETTE = {
  empty: '#18181b',
  emptyStroke: '#27272a',
  levels: ['#1e3a5f', '#1d4ed8', '#3b82f6', '#60a5fa'],
  activeStroke: '#93c5fd',
  text: '#a1a1aa',
};

const LIGHT_PALETTE = {
  empty: '#f4f4f5',
  emptyStroke: '#e4e4e7',
  levels: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'],
  activeStroke: '#1e40af',
  text: '#52525b',
};

export function ContributionGraph({ lang, theme }: ContributionGraphProps) {
  const t = COPY[lang].github.contributionGraph;
  const weekdays = COPY[lang].github.d3Widget.weekdays;
  const { days, totalYear, loading, error, retry } = useGitHubContributions();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(780);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

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

  // Build 52-53 week grid aligned to Sunday -> Saturday across the last year
  const { cells, weekCount, activeDays, bestDay } = useMemo(() => {
    if (days.length === 0) {
      return { cells: [] as HeatmapCell[], weekCount: 0, activeDays: 0, bestDay: 0 };
    }

    const byDate = new Map<string, number>();
    for (const d of days) {
      byDate.set(d.date, d.count);
    }

    const lastDateStr = days[days.length - 1].date;
    const endDate = new Date(`${lastDateStr}T00:00:00`);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const result: HeatmapCell[] = [];
    const cursor = new Date(startDate);
    let activeCount = 0;
    let maxDaily = 0;

    while (cursor <= endDate) {
      const yyyy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, '0');
      const dd = String(cursor.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const count = byDate.get(dateStr) ?? 0;

      if (count > 0) activeCount += 1;
      if (count > maxDaily) maxDaily = count;

      const diffDays = Math.round(
        (cursor.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekIndex = Math.floor(diffDays / 7);
      const dayOfWeek = cursor.getDay();

      result.push({
        dateStr,
        dateObj: new Date(cursor),
        count,
        weekIndex,
        dayOfWeek,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    const totalWeeks = result.length > 0 ? result[result.length - 1].weekIndex + 1 : 0;
    return {
      cells: result,
      weekCount: totalWeeks,
      activeDays: activeCount,
      bestDay: maxDaily,
    };
  }, [days]);

  const palette = theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

  // D3 threshold color scale dynamically updated by dark/light theme
  const colorScale = useMemo(() => {
    const peak = Math.max(bestDay, 4);
    const t1 = Math.max(1, Math.ceil(peak * 0.25));
    const t2 = Math.max(t1 + 1, Math.ceil(peak * 0.5));
    const t3 = Math.max(t2 + 1, Math.ceil(peak * 0.75));

    return d3
      .scaleThreshold<number, string>()
      .domain([1, t1 + 1, t2 + 1, t3 + 1])
      .range([palette.empty, ...palette.levels]);
  }, [bestDay, palette]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || cells.length === 0 || weekCount === 0 || loading || error) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderWidth = Math.max(containerWidth, 680);
    const margin = { top: 20, right: 6, bottom: 6, left: 34 };
    const cellGap = 3;
    const availableW = renderWidth - margin.left - margin.right;
    const cellSize = Math.max(9, Math.floor(availableW / weekCount) - cellGap);
    const step = cellSize + cellGap;
    const svgWidth = margin.left + weekCount * step + margin.right;
    const svgHeight = margin.top + 7 * step + margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Month labels along top axis (detect month transitions on week columns)
    const monthLabels: Array<{ weekIndex: number; label: string }> = [];
    let prevMonth = -1;
    for (let w = 0; w < weekCount; w++) {
      const firstOfWeek = cells.find((c) => c.weekIndex === w);
      if (!firstOfWeek) continue;
      const month = firstOfWeek.dateObj.getMonth();
      if (month !== prevMonth) {
        if (monthLabels.length === 0 || w - monthLabels[monthLabels.length - 1].weekIndex >= 3) {
          monthLabels.push({
            weekIndex: w,
            label: firstOfWeek.dateObj.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
              month: 'short',
            }),
          });
        }
        prevMonth = month;
      }
    }

    g.selectAll('.month-label')
      .data(monthLabels)
      .join('text')
      .attr('class', 'month-label')
      .attr('x', (d) => d.weekIndex * step)
      .attr('y', -7)
      .attr('fill', palette.text)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '10px')
      .text((d) => d.label.replace('.', ''));

    // Weekday labels (Mon, Wed, Fri)
    const visibleWeekdays = [1, 3, 5];
    g.selectAll('.weekday-label')
      .data(visibleWeekdays)
      .join('text')
      .attr('class', 'weekday-label')
      .attr('x', -8)
      .attr('y', (d) => d * step + cellSize * 0.78)
      .attr('text-anchor', 'end')
      .attr('fill', palette.text)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '10px')
      .text((d) => weekdays[d]);

    // Heatmap day cells
    const rects = g
      .selectAll<SVGRectElement, HeatmapCell>('.contrib-cell')
      .data(cells, (d) => d.dateStr)
      .join('rect')
      .attr('class', 'contrib-cell')
      .attr('x', (d) => d.weekIndex * step)
      .attr('y', (d) => d.dayOfWeek * step)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', Math.max(2, Math.round(cellSize * 0.22)))
      .attr('fill', (d) => colorScale(d.count))
      .attr('stroke', (d) => (d.count === 0 ? palette.emptyStroke : 'transparent'))
      .attr('stroke-width', 1)
      .style('cursor', 'pointer');

    if (!prefersReducedMotion) {
      rects
        .attr('opacity', 0)
        .transition()
        .duration(320)
        .delay((d) => Math.min(d.weekIndex * 6, 320))
        .attr('opacity', 1);
    }

    rects
      .on('mouseenter touchstart', function (_event, d) {
        d3.select(this).attr('stroke', palette.activeStroke).attr('stroke-width', 1.5);
        setHoveredCell(d);
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this)
          .attr('stroke', d.count === 0 ? palette.emptyStroke : 'transparent')
          .attr('stroke-width', 1);
        setHoveredCell(null);
      });
  }, [cells, weekCount, containerWidth, theme, lang, loading, error, palette, colorScale, weekdays]);

  const formattedHover = hoveredCell
    ? {
        date: hoveredCell.dateObj.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        countLabel:
          hoveredCell.count === 0
            ? t.noCommits
            : `${hoveredCell.count} ${
                hoveredCell.count === 1 ? t.singleCommit : t.pluralCommits
              }`,
      }
    : null;

  return (
    <SpotlightCard
      delay={0.12}
      className="lg:col-span-12 rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <CalendarDays className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">
              {t.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        {/* Dynamic Hover Inspection or Annual Summary */}
        <div className="font-mono text-xs sm:text-right">
          {formattedHover ? (
            <div>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                {formattedHover.date}
              </div>
              <div className="text-zinc-900 dark:text-zinc-100 font-semibold tabular-nums mt-0.5">
                {formattedHover.countLabel}
              </div>
            </div>
          ) : !loading && !error ? (
            <div className="flex flex-wrap sm:justify-end items-center gap-x-3 gap-y-1 text-zinc-500 dark:text-zinc-400 tabular-nums">
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{totalYear}</strong>{' '}
                {t.pluralCommits}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{activeDays}</strong>{' '}
                {t.activeDaysLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-blue-600 dark:text-blue-400">{bestDay}</strong>{' '}
                {t.bestDayLabel}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Heatmap Container */}
      <div ref={containerRef} className="w-full pt-4">
        {loading ? (
          <div className="h-[150px] flex flex-col items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600/30 border-t-blue-600 dark:border-blue-400/30 dark:border-t-blue-400 animate-spin" />
            <span className="font-mono text-xs">{t.loading}</span>
          </div>
        ) : error ? (
          <div className="h-[150px] flex flex-col items-center justify-center text-center gap-2.5 px-4">
            <div className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              {t.errorTitle}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">{t.errorDesc}</p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[36px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.retry}</span>
            </button>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto pb-1">
              <svg
                ref={svgRef}
                className="block select-none"
                role="img"
                aria-label={t.title}
              />
            </div>

            {/* Dynamic Theme-Aware Legend */}
            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between gap-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>D3.js · 52w</span>
              <div className="flex items-center gap-1.5">
                <span>{t.less}</span>
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-[3px] border"
                  style={{
                    backgroundColor: palette.empty,
                    borderColor: palette.emptyStroke,
                  }}
                />
                {palette.levels.map((color) => (
                  <span
                    key={color}
                    aria-hidden="true"
                    className="w-3 h-3 rounded-[3px]"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <span>{t.more}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </SpotlightCard>
  );
}
