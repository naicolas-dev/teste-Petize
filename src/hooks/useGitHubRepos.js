import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAllGitHubUserRepos } from '../services/github.service';

const PER_PAGE = 10;

/**
 * Fetches a user's GitHub repositories from the public API and applies
 * client-side filters (repo name + language) while preserving sort/direction.
 *
 * @param {string} username
 * @param {string} sort - 'updated' | 'created' | 'pushed' | 'full_name'
 * @param {string} direction - 'asc' | 'desc'
 * @param {{ query?: string, language?: string }} [filters]
 * @returns {{ repos, languages, loading, hasMore, error, loadMore }}
 */
export function useGitHubRepos(username, sort = 'updated', direction = 'desc', filters = {}) {
  const { query = '', language = 'all' } = filters;

  const [allRepos, setAllRepos] = useState([]);
  const [visible, setVisible] = useState(PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizedQuery = query.trim().toLowerCase();

  const languages = useMemo(() => {
    return [...new Set(
      allRepos
        .map((repo) => repo.language)
        .filter((lang) => typeof lang === 'string' && lang.length > 0)
    )].sort((a, b) => a.localeCompare(b));
  }, [allRepos]);

  const filteredRepos = useMemo(() => {
    return allRepos.filter((repo) => {
      const matchesName =
        !normalizedQuery ||
        repo.name.toLowerCase().includes(normalizedQuery) ||
        repo.full_name.toLowerCase().includes(normalizedQuery);

      const matchesLanguage = language === 'all' || repo.language === language;
      return matchesName && matchesLanguage;
    });
  }, [allRepos, normalizedQuery, language]);

  const repos = useMemo(
    () => filteredRepos.slice(0, visible),
    [filteredRepos, visible]
  );

  const hasMore = visible < filteredRepos.length;

  // New base query: username/sort/direction changed.
  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    setAllRepos([]);
    setVisible(PER_PAGE);
    setError(null);
    setLoading(true);

    fetchAllGitHubUserRepos(username, { sort, direction })
      .then((data) => {
        if (cancelled) return;
        setAllRepos(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, sort, direction]);

  // New filter query: restart visible pagination.
  useEffect(() => {
    setVisible(PER_PAGE);
  }, [normalizedQuery, language]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setVisible((prev) => prev + PER_PAGE);
    }
  }, [loading, hasMore]);

  return { repos, languages, loading, hasMore, error, loadMore };
}
