import { githubUserSchema } from '../schemas/githubUser.schema';
import { githubRepoListSchema } from '../schemas/githubRepo.schema';
import { z } from 'zod';

/** Base URL for the GitHub REST API v3 */
const GITHUB_API_BASE = 'https://api.github.com';
const USER_CACHE_TTL_MS = 2 * 60 * 1000;
const USER_SEARCH_CACHE_TTL_MS = 60 * 1000;

const githubUserSuggestionSchema = z.object({
  id: z.number().int(),
  login: z.string(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  type: z.enum(['User', 'Organization', 'Bot']),
});

const githubUserSearchSchema = z.object({
  total_count: z.number().int().nonnegative(),
  items: z.array(githubUserSuggestionSchema),
});

/** @type {Map<string, { user: import('../schemas/githubUser.schema').GitHubUser, expiresAt: number }>} */
const userCache = new Map();
/** @type {Map<string, Promise<import('../schemas/githubUser.schema').GitHubUser>>} */
const inFlightUserRequests = new Map();
/** @type {Map<string, { users: import('zod').infer<typeof githubUserSuggestionSchema>[], expiresAt: number }>} */
const userSearchCache = new Map();
/** @type {Map<string, Promise<import('zod').infer<typeof githubUserSuggestionSchema>[]>>} */
const inFlightUserSearchRequests = new Map();

function getCachedUser(usernameKey) {
  const cached = userCache.get(usernameKey);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    userCache.delete(usernameKey);
    return null;
  }

  return cached.user;
}

function getCachedUserSearch(cacheKey) {
  const cached = userSearchCache.get(cacheKey);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    userSearchCache.delete(cacheKey);
    return null;
  }

  return cached.users;
}

/**
 * Shared fetch wrapper that adds the required GitHub API headers.
 * @param {string} path - API path (e.g. "/users/torvalds")
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<unknown>} - Parsed JSON response
 */
async function githubFetch(path, options = {}) {
  const { signal } = options;
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${path}`, { headers, signal });

  if (!response.ok) {
    // Propagate a structured error with the HTTP status code
    const error = new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Fetches and validates a GitHub user profile.
 * Endpoint: GET /users/{username}
 *
 * @param {string} username - The GitHub username to look up
 * @param {{ signal?: AbortSignal, useCache?: boolean }} [options]
 * @returns {Promise<import('../schemas/githubUser.schema').GitHubUser>}
 */
export async function fetchGitHubUser(username, options = {}) {
  const { signal, useCache = true } = options;
  const usernameKey = String(username).trim().toLowerCase();

  if (useCache) {
    const cached = getCachedUser(usernameKey);
    if (cached) return cached;

    const existingRequest = inFlightUserRequests.get(usernameKey);
    if (existingRequest) return existingRequest;
  }

  const requestPromise = githubFetch(`/users/${encodeURIComponent(username)}`, { signal })
    .then((data) => githubUserSchema.parse(data));

  if (useCache) {
    inFlightUserRequests.set(usernameKey, requestPromise);
  }

  try {
    const user = await requestPromise;

    if (useCache) {
      userCache.set(usernameKey, {
        user,
        expiresAt: Date.now() + USER_CACHE_TTL_MS,
      });
    }

    return user;
  } finally {
    if (useCache) {
      inFlightUserRequests.delete(usernameKey);
    }
  }
}

/**
 * Fetches user suggestions by login query.
 * Endpoint: GET /search/users
 *
 * @param {string} query
 * @param {{ perPage?: number, signal?: AbortSignal, useCache?: boolean }} [options]
 * @returns {Promise<import('zod').infer<typeof githubUserSuggestionSchema>[]>}
 */
export async function fetchGitHubUserSuggestions(query, options = {}) {
  const { perPage = 8, signal, useCache = true } = options;
  const normalizedQuery = String(query).trim().toLowerCase();
  const cacheKey = `${normalizedQuery}|${perPage}`;

  if (!normalizedQuery) return [];

  if (useCache) {
    const cached = getCachedUserSearch(cacheKey);
    if (cached) return cached;

    const inFlight = inFlightUserSearchRequests.get(cacheKey);
    if (inFlight) return inFlight;
  }

  const searchParams = new URLSearchParams({
    q: `${normalizedQuery} in:login`,
    per_page: String(perPage),
    page: '1',
  });

  const requestPromise = githubFetch(`/search/users?${searchParams}`, { signal })
    .then((data) => githubUserSearchSchema.parse(data).items);

  if (useCache) {
    inFlightUserSearchRequests.set(cacheKey, requestPromise);
  }

  try {
    const users = await requestPromise;

    if (useCache) {
      userSearchCache.set(cacheKey, {
        users,
        expiresAt: Date.now() + USER_SEARCH_CACHE_TTL_MS,
      });
    }

    return users;
  } finally {
    if (useCache) {
      inFlightUserSearchRequests.delete(cacheKey);
    }
  }
}

/**
 * Fetches and validates the public repositories of a GitHub user.
 * Endpoint: GET /users/{username}/repos
 *
 * @param {string} username - The GitHub username
 * @param {{
 *   perPage?: number,
 *   page?: number,
 *   sort?: 'created'|'updated'|'pushed'|'full_name',
 *   direction?: 'asc'|'desc'
 * }} [options]
 * @returns {Promise<import('../schemas/githubRepo.schema').GitHubRepoList>}
 */
export async function fetchGitHubUserRepos(username, options = {}) {
  const { perPage = 10, page = 1, sort = 'updated', direction = 'desc' } = options;
  const query = new URLSearchParams({
    per_page: String(perPage),
    page:     String(page),
    sort,
    direction,
  });

  const data = await githubFetch(
    `/users/${encodeURIComponent(username)}/repos?${query}`
  );

  return githubRepoListSchema.parse(data);
}

/**
 * Fetches all public repositories for a user by traversing every API page.
 * Endpoint: GET /users/{username}/repos
 *
 * @param {string} username - The GitHub username
 * @param {{
 *   sort?: 'created'|'updated'|'pushed'|'full_name',
 *   direction?: 'asc'|'desc'
 * }} [options]
 * @returns {Promise<import('../schemas/githubRepo.schema').GitHubRepoList>}
 */
export async function fetchAllGitHubUserRepos(username, options = {}) {
  const { sort = 'updated', direction = 'desc' } = options;
  const perPage = 100;
  const allRepos = [];
  let page = 1;
  let keepLoading = true;

  while (keepLoading) {
    // Keep using the same validated list endpoint and aggregate every page.
    const pageRepos = await fetchGitHubUserRepos(username, {
      perPage,
      page,
      sort,
      direction,
    });

    allRepos.push(...pageRepos);
    keepLoading = pageRepos.length === perPage;
    page += 1;
  }

  return allRepos;
}
