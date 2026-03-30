import { z } from 'zod';

/**
 * Minimal owner sub-object embedded inside every repository response.
 */
const repoOwnerSchema = z.object({
  login:      z.string(),
  id:         z.number().int(),
  avatar_url: z.string().url(),
  url:        z.string().url(),
  html_url:   z.string().url(),
  type:       z.enum(['User', 'Organization', 'Bot']),
  site_admin: z.boolean(),
});

/**
 * License sub-object (nullable — many repos have no license).
 */
const licenseSchema = z.object({
  key:     z.string(),
  name:    z.string(),
  spdx_id: z.string().nullable(),
  url:     z.string().url().nullable(),
  node_id: z.string(),
});

/**
 * Schema for a GitHub Repository object.
 * Models the items returned by GET /users/{username}/repos
 * Reference: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
 */
export const githubRepoSchema = z.object({
  // Identity
  id:      z.number().int(),
  node_id: z.string(),
  name:    z.string(),
  full_name: z.string(),

  // Ownership
  owner:   repoOwnerSchema,
  private: z.boolean(),

  // Metadata
  description: z.string().nullable(),
  fork:        z.boolean(),
  language:    z.string().nullable(),
  topics:      z.array(z.string()).optional(),
  license:     licenseSchema.nullable().optional(),

  // URLs
  html_url:    z.string().url(),
  url:         z.string().url(),
  clone_url:   z.string().url().optional(),
  ssh_url:     z.string().optional(),
  homepage:    z.string().nullable().optional(),

  // Stats
  stargazers_count: z.number().int(),
  watchers_count:   z.number().int(),
  forks_count:      z.number().int(),
  open_issues_count: z.number().int(),
  size:             z.number().int(),

  // Flags
  archived:   z.boolean(),
  disabled:   z.boolean(),
  is_template: z.boolean().optional(),
  visibility: z.enum(['public', 'private', 'internal']).optional(),

  // Default branch
  default_branch: z.string(),

  // Timestamps
  created_at:  z.string().datetime().nullable(),
  updated_at:  z.string().datetime().nullable(),
  pushed_at:   z.string().datetime().nullable(),
});

/**
 * Schema for the paginated list response from GET /users/{username}/repos
 * The GitHub API returns a plain array (not wrapped in an object).
 */
export const githubRepoListSchema = z.array(githubRepoSchema);

/**
 * @typedef {import('zod').infer<typeof githubRepoSchema>} GitHubRepo
 * @typedef {import('zod').infer<typeof githubRepoListSchema>} GitHubRepoList
 */
