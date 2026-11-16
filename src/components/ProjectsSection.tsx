import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Clock,
  FolderGit2,
  GitFork,
  Globe,
  RefreshCw,
  Search,
  Star,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_INFO, COPY, type Lang } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

interface ProjectsSectionProps {
  lang: Lang;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  pushed_at: string;
}

const WORDS_PER_MINUTE = 180;

function estimateReadingMinutes(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function getRepoTags(repo: GitHubRepo): string[] {
  const seen = new Map<string, string>();
  const raw = [repo.language, ...(repo.topics || [])];

  for (const item of raw) {
    if (!item) continue;
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, trimmed);
    }
  }

  return Array.from(seen.values());
}

export function ProjectsSection({ lang }: ProjectsSectionProps) {
  const t = COPY[lang].projects;
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchRepos = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(
        'https://api.github.com/users/dreyranos/repos?sort=updated&per_page=30&type=owner',
        { signal }
      );
      if (!res.ok) throw new Error('GitHub repos API error');
      const data = (await res.json()) as GitHubRepo[];

      const active = data.filter((r) => !r.archived);
      const nonProfile = active.filter((r) => r.name.toLowerCase() !== 'dreyranos');
      const pool = nonProfile.length > 0 ? nonProfile : active;

      const sorted = [...pool].sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
      });

      setRepos(sorted);
      setLoading(false);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRepos(controller.signal);
    return () => controller.abort();
  }, [fetchRepos]);

  // Build ordered list of top technology tags across loaded repositories
  const availableTags = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();

    for (const repo of repos) {
      for (const tag of getRepoTags(repo)) {
        const key = tag.toLowerCase();
        const existing = counts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, { label: tag, count: 1 });
        }
      }
    }

    const sortedTags = Array.from(counts.values())
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 8)
      .map((entry) => entry.label);

    return ['ALL', ...sortedTags];
  }, [repos]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isFiltered = selectedTag !== 'ALL' || normalizedQuery.length > 0;

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const repoTags = getRepoTags(repo);

      if (selectedTag !== 'ALL') {
        const selectedLower = selectedTag.toLowerCase();
        const hasTag = repoTags.some((tag) => tag.toLowerCase() === selectedLower);
        if (!hasTag) return false;
      }

      if (normalizedQuery.length > 0) {
        const haystack = [
          repo.name,
          repo.description || '',
          repo.language || '',
          ...(repo.topics || []),
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [repos, selectedTag, normalizedQuery]);

  const visibleRepos = useMemo(() => {
    return isFiltered ? filteredRepos.slice(0, 9) : filteredRepos.slice(0, 6);
  }, [filteredRepos, isFiltered]);

  const handleClearFilters = () => {
    setSelectedTag('ALL');
    setSearchQuery('');
  };

  return (
    <section id="projetos" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
                {t.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2">
                {t.title}
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                {t.desc}
              </p>
            </div>

            {!loading && !error && repos.length > 0 && (
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
                {t.resultsCount(visibleRepos.length, filteredRepos.length)}
              </div>
            )}
          </div>

          {/* Search & Technology Tag Filter Bar */}
          {!loading && !error && repos.length > 0 && (
            <div className="print:hidden mt-6 pt-5 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative w-full lg:w-80 shrink-0">
                <label htmlFor="projects-search" className="sr-only">
                  {t.searchLabel}
                </label>
                <Search
                  className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="projects-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-colors"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={t.clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg inline-flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {availableTags.length > 1 && (
                <div
                  role="tablist"
                  aria-label={t.filterByTag}
                  className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 self-start lg:self-auto"
                >
                  {availableTags.map((tagItem) => {
                    const active = selectedTag === tagItem;
                    const label = tagItem === 'ALL' ? t.allFilter : tagItem;
                    return (
                      <button
                        key={tagItem}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedTag(tagItem)}
                        className={`relative px-3 py-1.5 min-h-[34px] rounded-lg font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          active
                            ? 'text-zinc-950 dark:text-white'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="projects-lang-tab"
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-xs"
                          />
                        )}
                        <span className="relative z-10">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 h-56 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
                  <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-900" />
                </div>
                <div className="h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-900" />
              </div>
            ))}
          </div>
        ) : error ? (
          <SpotlightCard className="rounded-2xl p-8 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-zinc-400" aria-hidden="true" />
            <h3 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
              {t.errorTitle}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">{t.errorDesc}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fetchRepos()}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.retry}</span>
              </button>
              <a
                href={`${CONTACT_INFO.githubUrl}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-zinc-950 text-xs font-semibold transition-colors"
              >
                <span>{t.visitGithub}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </SpotlightCard>
        ) : visibleRepos.length === 0 ? (
          <div className="rounded-2xl p-8 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center gap-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.empty}</p>
            {isFiltered && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 hover:border-blue-600/40 dark:hover:border-blue-400/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.clearFilters}</span>
              </button>
            )}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {visibleRepos.map((repo, idx) => {
                const tags = getRepoTags(repo).slice(0, 4);
                const hasHomepage = Boolean(repo.homepage && repo.homepage.trim().startsWith('http'));
                const descriptionText = repo.description?.trim() || t.noDescription;
                const readingMinutes = estimateReadingMinutes(descriptionText);

                return (
                  <motion.article
                    key={repo.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{
                      y: -5,
                      scale: 1.018,
                      transition: { type: 'spring', stiffness: 380, damping: 26 },
                    }}
                    whileTap={{ scale: 0.99 }}
                    transition={{
                      duration: 0.24,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
                    }}
                    className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-xl hover:shadow-zinc-950/8 dark:hover:shadow-black/60 transition-[border-color,box-shadow] duration-200 flex flex-col justify-between gap-5"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background:
                          'radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(59, 130, 246, 0.1), transparent 65%)',
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 transition-transform duration-200 group-hover:scale-105">
                            <FolderGit2 className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 truncate">
                            {repo.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0 pt-1">
                          <span className="inline-flex items-center gap-1" title={t.starsLabel}>
                            <Star className="w-3.5 h-3.5" aria-hidden="true" />
                            {repo.stargazers_count}
                          </span>
                          <span className="inline-flex items-center gap-1" title={t.forksLabel}>
                            <GitFork className="w-3.5 h-3.5" aria-hidden="true" />
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4 line-clamp-3">
                        {descriptionText}
                      </p>
                    </div>

                    <div className="relative z-10 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                      {/* Unboxed typographic tags & estimated reading time */}
                      <div className="flex items-center justify-between gap-3 font-mono text-xs">
                        <span className="text-zinc-600 dark:text-zinc-300 truncate">
                          {tags.length > 0 ? tags.join(' · ') : 'GitHub · Open Source'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          <span>{t.readTime(readingMinutes)}</span>
                        </span>
                      </div>

                      {/* Project Links */}
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                        >
                          <span>{t.viewRepo}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </a>

                        {hasHomepage && (
                          <a
                            href={repo.homepage!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap"
                          >
                            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t.viewDemo}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
