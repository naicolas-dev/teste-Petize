import { useState, useEffect } from 'react';
import { fetchGitHubUser } from '../services/github.service';

/**
 * Fetches a GitHub user profile and manages loading/error state.
 *
 * @param {string} username - GitHub username to look up
 * @returns {{ user: object|null, loading: boolean, error: Error|null }}
 */
export function useGitHubUser(username) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    setLoading(true);
    setUser(null);
    setError(null);

    fetchGitHubUser(username)
      .then((data) => { if (!cancelled) setUser(data); })
      .catch((err) => { if (!cancelled) setError(err);  })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [username]);

  return { user, loading, error };
}
