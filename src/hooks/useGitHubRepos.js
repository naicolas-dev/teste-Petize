import { useState, useEffect, useCallback } from 'react';
import { fetchGitHubUserRepos } from '../services/github.service';

const PER_PAGE = 10;

/**
 * Fetches a user's GitHub repositories with infinite-scroll pagination.
 *
 * Strategy (two separate effects):
 *  - Effect 1: fires when `username` or `sort` changes → resets state and
 *    always fetches page 1.
 *  - Effect 2: fires when `page` increments beyond 1 → appends more repos.
 *
 * @param {string} username
 * @param {string} sort   - 'updated' | 'created' | 'pushed' | 'full_name'
 * @param {string} direction - 'asc' | 'desc'
 * @returns {{ repos, loading, hasMore, error, loadMore }}
 */
export function useGitHubRepos(username, sort = 'updated', direction = 'desc') {
  const [repos,   setRepos]   = useState([]);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Effect 1: New query (username / sort / direction changed) ──────────────
  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    // Reset pagination state synchronously before the async call
    setPage(1);
    setRepos([]);
    setHasMore(true);
    setError(null);
    setLoading(true);

    fetchGitHubUserRepos(username, { perPage: PER_PAGE, page: 1, sort, direction })
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
        setHasMore(data.length >= PER_PAGE);
      })
      .catch((err)  => { if (!cancelled) setError(err); })
      .finally(()   => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [username, sort, direction]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 2: Load more (page incremented) ────────────────────────────────
  useEffect(() => {
    // page === 1 is handled by Effect 1; skip when there is nothing to load
    if (!username || page <= 1) return;

    let cancelled = false;
    setLoading(true);

    fetchGitHubUserRepos(username, { perPage: PER_PAGE, page, sort, direction })
      .then((data) => {
        if (cancelled) return;
        setRepos((prev) => [...prev, ...data]);
        setHasMore(data.length >= PER_PAGE);
      })
      .catch((err)  => { if (!cancelled) setError(err); })
      .finally(()   => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Call this to trigger the next page load */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((p) => p + 1);
  }, [loading, hasMore]);

  return { repos, loading, hasMore, error, loadMore };
}
