import { githubUserSchema } from '../schemas/githubUser.schema';
import { githubRepoListSchema } from '../schemas/githubRepo.schema';

/** Base URL for the GitHub REST API v3 */
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Shared fetch wrapper that adds the required GitHub API headers.
 * @param {string} path - API path (e.g. "/users/torvalds")
 * @returns {Promise<unknown>} - Parsed JSON response
 */
async function githubFetch(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${path}`, { headers });

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
 * @returns {Promise<import('../schemas/githubUser.schema').GitHubUser>}
 */
export async function fetchGitHubUser(username) {
  const data = await githubFetch(`/users/${encodeURIComponent(username)}`);

  // Parse and validate the response against the Zod schema.
  // .parse() throws a ZodError if validation fails, which is intentional —
  // callers should handle it via try/catch or React Query's error boundary.
  return githubUserSchema.parse(data);
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
