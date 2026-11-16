import { useCallback, useEffect, useState } from 'react';

export interface ContributionDay {
  date: string;
  count: number;
}

export interface GitHubContributionsData {
  days: ContributionDay[];
  totalYear: number;
  sourceMode: 'calendar' | 'events';
}

let cachedData: GitHubContributionsData | null = null;
let inflightPromise: Promise<GitHubContributionsData> | null = null;

async function fetchContributionsOnce(): Promise<GitHubContributionsData> {
  if (cachedData) return cachedData;
  if (inflightPromise) return inflightPromise;

  inflightPromise = (async () => {
    try {
      const calRes = await fetch(
        'https://github-contributions-api.jogruber.de/v4/dreyranos?y=last'
      );
      if (calRes.ok) {
        const data = (await calRes.json()) as {
          total?: { lastYear?: number };
          contributions?: ContributionDay[];
        };
        if (Array.isArray(data.contributions) && data.contributions.length > 0) {
          const result: GitHubContributionsData = {
            days: data.contributions,
            totalYear:
              typeof data.total?.lastYear === 'number'
                ? data.total.lastYear
                : data.contributions.reduce((acc, d) => acc + d.count, 0),
            sourceMode: 'calendar',
          };
          cachedData = result;
          return result;
        }
      }
    } catch {
      // Fall back to public GitHub events API below
    }

    const evRes = await fetch(
      'https://api.github.com/users/dreyranos/events/public?per_page=100'
    );
    if (!evRes.ok) {
      throw new Error('GitHub API unavailable');
    }

    const events = (await evRes.json()) as Array<{
      type: string;
      created_at: string;
      payload?: { size?: number; commits?: unknown[] };
    }>;

    const countsByDate = new Map<string, number>();
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      countsByDate.set(d.toISOString().slice(0, 10), 0);
    }

    let sum = 0;
    for (const ev of events) {
      const dateKey = ev.created_at.slice(0, 10);
      const weight =
        ev.type === 'PushEvent'
          ? ev.payload?.size || ev.payload?.commits?.length || 1
          : 1;
      if (countsByDate.has(dateKey)) {
        countsByDate.set(dateKey, (countsByDate.get(dateKey) || 0) + weight);
      }
      sum += weight;
    }

    const result: GitHubContributionsData = {
      days: Array.from(countsByDate.entries()).map(([date, count]) => ({ date, count })),
      totalYear: sum,
      sourceMode: 'events',
    };
    cachedData = result;
    return result;
  })();

  try {
    return await inflightPromise;
  } finally {
    inflightPromise = null;
  }
}

export function useGitHubContributions() {
  const [days, setDays] = useState<ContributionDay[]>(() => cachedData?.days ?? []);
  const [totalYear, setTotalYear] = useState<number>(() => cachedData?.totalYear ?? 0);
  const [sourceMode, setSourceMode] = useState<'calendar' | 'events'>(
    () => cachedData?.sourceMode ?? 'calendar'
  );
  const [loading, setLoading] = useState<boolean>(() => !cachedData);
  const [error, setError] = useState<boolean>(false);

  const load = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      cachedData = null;
      inflightPromise = null;
    }
    setLoading(true);
    setError(false);

    try {
      const result = await fetchContributionsOnce();
      setDays(result.days);
      setTotalYear(result.totalYear);
      setSourceMode(result.sourceMode);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (cachedData) {
      setDays(cachedData.days);
      setTotalYear(cachedData.totalYear);
      setSourceMode(cachedData.sourceMode);
      setLoading(false);
      return;
    }

    fetchContributionsOnce()
      .then((result) => {
        if (!active) return;
        setDays(result.days);
        setTotalYear(result.totalYear);
        setSourceMode(result.sourceMode);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const retry = useCallback(() => {
    load(true);
  }, [load]);

  return { days, totalYear, sourceMode, loading, error, retry };
}
