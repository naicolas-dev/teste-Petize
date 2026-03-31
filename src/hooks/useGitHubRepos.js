/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAllGitHubUserRepos, fetchGitHubUserRepos } from '../services/github.service';

const PER_PAGE = 10;

function mergeUniqueRepos(previousRepos, nextRepos) {
  const seenIds = new Set(previousRepos.map((repo) => repo.id));
  const mergedRepos = [...previousRepos];

  nextRepos.forEach((repo) => {
    if (!seenIds.has(repo.id)) {
      seenIds.add(repo.id);
      mergedRepos.push(repo);
    }
  });

  return mergedRepos;
}

/**
 * Fetches a user's repositories with API pagination (10 items/page) for
 * infinite scroll, and keeps a full repo catalog for language/name filters.
 *
 * @param {string} username
 * @param {string} sort - 'updated' | 'created' | 'pushed' | 'full_name'
 * @param {string} direction - 'asc' | 'desc'
 * @param {{ query?: string, language?: string }} [filters]
 * @returns {{ repos, languages, loading, hasMore, error, loadMore }}
 */
export function useGitHubRepos(username, sort = 'updated', direction = 'desc', filters = {}) {
  const { query = '', language = 'all' } = filters;
  const normalizedQuery = query.trim().toLowerCase();
  const hasActiveFilters = normalizedQuery.length > 0 || language !== 'all';

  // API-paginated list (used when no filters are active).
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreApi, setHasMoreApi] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  // Full catalog (used for language options + accurate local filtering).
  const [catalogRepos, setCatalogRepos] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);

  // Local visibility pagination for filtered mode.
  const [visibleFiltered, setVisibleFiltered] = useState(PER_PAGE);

  // Base API fetch: page 1 when username/sort/direction changes.
  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    setRepos([]);
    setPage(1);
    setHasMoreApi(true);
    setPageError(null);
    setPageLoading(true);

    fetchGitHubUserRepos(username, {
      perPage: PER_PAGE,
      page: 1,
      sort,
      direction,
    })
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
        setHasMoreApi(data.length === PER_PAGE);
      })
      .catch((err) => {
        if (!cancelled) setPageError(err);
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, sort, direction]);

  // API fetch for additional pages in infinite scroll mode.
  useEffect(() => {
    if (!username || page <= 1 || hasActiveFilters) return;

    let cancelled = false;
    setPageLoading(true);

    fetchGitHubUserRepos(username, {
      perPage: PER_PAGE,
      page,
      sort,
      direction,
    })
      .then((data) => {
        if (cancelled) return;
        setRepos((prevRepos) => mergeUniqueRepos(prevRepos, data));
        setHasMoreApi(data.length === PER_PAGE);
      })
      .catch((err) => {
        if (!cancelled) setPageError(err);
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, page, sort, direction, hasActiveFilters]);

  // Full catalog fetch for dynamic language options and filter accuracy.
  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    setCatalogRepos([]);
    setCatalogError(null);
    setCatalogLoading(true);

    fetchAllGitHubUserRepos(username, { sort, direction })
      .then((data) => {
        if (!cancelled) setCatalogRepos(data);
      })
      .catch((err) => {
        if (!cancelled) setCatalogError(err);
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, sort, direction]);

  // Reset filtered local pagination when filter values change.
  useEffect(() => {
    setVisibleFiltered(PER_PAGE);
  }, [normalizedQuery, language, username, sort, direction]);

  const languages = useMemo(() => {
    return [...new Set(
      catalogRepos
        .map((repo) => repo.language)
        .filter((lang) => typeof lang === 'string' && lang.length > 0)
    )].sort((a, b) => a.localeCompare(b));
  }, [catalogRepos]);

  const filteredRepos = useMemo(() => {
    const filtered = catalogRepos.filter((repo) => {
      const matchesName =
        !normalizedQuery ||
        repo.name.toLowerCase().includes(normalizedQuery) ||
        repo.full_name.toLowerCase().includes(normalizedQuery);

      const matchesLanguage = language === 'all' || repo.language === language;
      return matchesName && matchesLanguage;
    });

    // Re-sort locally so the filtered view always reflects the selected sort,
    // regardless of the order the catalog was fetched in.
    const dir = direction === 'asc' ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sort === 'full_name') {
        return dir * a.full_name.localeCompare(b.full_name);
      }

      // Map sort key → repo field
      const field =
        sort === 'created' ? 'created_at' :
        sort === 'pushed'  ? 'pushed_at'  :
                             'updated_at';          // 'updated' or fallback

      const aTime = a[field] ? new Date(a[field]).getTime() : 0;
      const bTime = b[field] ? new Date(b[field]).getTime() : 0;
      return dir * (aTime - bTime);
    });
  }, [catalogRepos, normalizedQuery, language, sort, direction]);


  const filteredVisibleRepos = useMemo(
    () => filteredRepos.slice(0, visibleFiltered),
    [filteredRepos, visibleFiltered]
  );

  const visibleRepos = hasActiveFilters ? filteredVisibleRepos : repos;
  const hasMore = hasActiveFilters
    ? visibleFiltered < filteredRepos.length
    : hasMoreApi;

  const loading = hasActiveFilters
    ? (catalogLoading || pageLoading)
    : pageLoading;

  const error = hasActiveFilters
    ? (catalogError ?? pageError)
    : pageError;

  const loadMore = useCallback(() => {
    if (hasActiveFilters) {
      if (!catalogLoading && visibleFiltered < filteredRepos.length) {
        setVisibleFiltered((prev) => prev + PER_PAGE);
      }
      return;
    }

    if (!pageLoading && hasMoreApi) {
      setPage((prev) => prev + 1);
    }
  }, [hasActiveFilters, catalogLoading, visibleFiltered, filteredRepos.length, pageLoading, hasMoreApi]);

  return {
    repos: visibleRepos,
    languages,
    loading,
    hasMore,
    error,
    loadMore,
  };
}

