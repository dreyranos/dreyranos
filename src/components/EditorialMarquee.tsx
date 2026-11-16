import { COPY, type Lang } from '../data/portfolioData';

interface EditorialMarqueeProps {
  lang: Lang;
}

export function EditorialMarquee({ lang }: EditorialMarqueeProps) {
  const items = COPY[lang].hero.marqueeItems;
  const repeated = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="print:hidden editorial-marquee-wrap border-y border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-[#09090c]/60 overflow-hidden py-3.5 select-none"
    >
      <div className="editorial-marquee-track items-center">
        {repeated.map((label, idx) => (
          <div key={`${label}-${idx}`} className="flex items-center shrink-0">
            <span className="font-mono text-xs tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400 px-5 whitespace-nowrap">
              {label}
            </span>
            <span className="text-blue-600/70 dark:text-blue-400/70 font-mono text-xs">
              ·
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
