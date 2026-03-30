import { useEffect, useMemo, useState } from 'react';
import { fetchGitHubUserSuggestions } from '../services/github.service';

const SUGGESTIONS_DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;
const MIN_VISIBLE_SUGGESTIONS = 3;
const SUGGESTIONS_PER_REQUEST = 12;

function isSuggestionInputInvalid(rawQuery) {
  if (!rawQuery) return false;
  if (rawQuery.length > 39) return true;
  if (/\s/.test(rawQuery)) return true;
  return /[^a-zA-Z0-9-]/.test(rawQuery);
}

function mergeUniqueSuggestions(primaryUsers, secondaryUsers) {
  const merged = [...primaryUsers];
  const existingIds = new Set(primaryUsers.map((user) => user.id));

  for (const user of secondaryUsers) {
    if (existingIds.has(user.id)) continue;
    merged.push(user);
    existingIds.add(user.id);
  }

  return merged;
}

/**
 * Fetches similar usernames while the user types.
 * Includes debounce and request cancellation to avoid unnecessary requests.
 *
 * @param {string} rawQuery
 * @returns {{
 *   state: 'idle'|'loading'|'ready'|'empty'|'rate_limited'|'invalid'|'error',
 *   users: Array<{ id: number, login: string, avatar_url: string, html_url: string, type: string }>,
 *   exactMatch: { id: number, login: string, avatar_url: string, html_url: string, type: string } | null,
 *   minQueryLength: number
 * }}
 */
export function useGitHubUserSuggestions(rawQuery) {
  const normalizedQuery = useMemo(
    () => rawQuery.trim().toLowerCase(),
    [rawQuery]
  );

  const [requestState, setRequestState] = useState('idle');
  const [users, setUsers] = useState([]);
  const [resolvedQuery, setResolvedQuery] = useState('');
  const inputMode = useMemo(() => {
    if (!normalizedQuery) return 'idle';
    if (isSuggestionInputInvalid(normalizedQuery)) return 'invalid';
    if (normalizedQuery.length < MIN_QUERY_LENGTH) return 'short';
    return 'searchable';
  }, [normalizedQuery]);

  useEffect(() => {
    if (inputMode !== 'searchable') {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setResolvedQuery(normalizedQuery);
      setRequestState('loading');
      setUsers([]);

      try {
        const nextUsers = await fetchGitHubUserSuggestions(normalizedQuery, {
          perPage: SUGGESTIONS_PER_REQUEST,
          signal: controller.signal,
        });

        let finalUsers = nextUsers;

        if (
          nextUsers.length < MIN_VISIBLE_SUGGESTIONS &&
          normalizedQuery.length > MIN_QUERY_LENGTH
        ) {
          const broaderQuery = normalizedQuery.slice(0, -1);
          const broaderUsers = await fetchGitHubUserSuggestions(broaderQuery, {
            perPage: SUGGESTIONS_PER_REQUEST,
            signal: controller.signal,
          });

          finalUsers = mergeUniqueSuggestions(nextUsers, broaderUsers);
        }

        if (controller.signal.aborted) return;

        setUsers(finalUsers);
        setResolvedQuery(normalizedQuery);
        setRequestState(finalUsers.length > 0 ? 'ready' : 'empty');
      } catch (error) {
        if (controller.signal.aborted) return;

        setUsers([]);
        setResolvedQuery(normalizedQuery);

        if (error?.status === 403) {
          setRequestState('rate_limited');
          return;
        }

        setRequestState('error');
      }
    }, SUGGESTIONS_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [inputMode, normalizedQuery]);

  const hasResolvedCurrentQuery =
    inputMode === 'searchable' && resolvedQuery === normalizedQuery;

  const state = useMemo(() => {
    if (inputMode === 'idle' || inputMode === 'short') return 'idle';
    if (inputMode === 'invalid') return 'invalid';
    if (!hasResolvedCurrentQuery) return 'idle';
    return requestState;
  }, [inputMode, hasResolvedCurrentQuery, requestState]);

  const visibleUsers = useMemo(
    () => (hasResolvedCurrentQuery ? users : []),
    [hasResolvedCurrentQuery, users]
  );

  const exactMatch = useMemo(
    () =>
      visibleUsers.find(
        (userSuggestion) =>
          userSuggestion.login.toLowerCase() === normalizedQuery
      ) ?? null,
    [visibleUsers, normalizedQuery]
  );

  return {
    state,
    users: visibleUsers,
    exactMatch,
    minQueryLength: MIN_QUERY_LENGTH,
  };
}
