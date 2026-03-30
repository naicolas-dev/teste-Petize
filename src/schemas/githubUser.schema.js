import { z } from 'zod';

/**
 * Schema for the GitHub user plan object (private data, only available
 * for authenticated requests).
 */
export const githubUserPlanSchema = z.object({
  name: z.string(),
  space: z.number().int(),
  private_repos: z.number().int(),
  collaborators: z.number().int(),
});

/**
 * Schema for a full GitHub User object.
 * Models the response from GET /users/{username}
 * Reference: https://docs.github.com/en/rest/users/users#get-a-user
 */
export const githubUserSchema = z.object({
  // Identity
  id:       z.number().int(),
  node_id:  z.string(),
  login:    z.string(),
  type:     z.enum(['User', 'Organization', 'Bot']),
  site_admin: z.boolean(),

  // Display
  name:     z.string().nullable(),
  avatar_url: z.string().url(),
  gravatar_id: z.string().nullable(),
  bio:      z.string().nullable(),
  company:  z.string().nullable(),
  blog:     z.string().nullable(),
  location: z.string().nullable(),
  email:    z.string().nullable(),
  hireable: z.boolean().nullable(),
  twitter_username: z.string().nullable().optional(),

  // Profile URLs
  html_url:           z.string().url(),
  url:                z.string().url(),
  followers_url:      z.string().url(),
  following_url:      z.string(),
  repos_url:          z.string().url(),
  gists_url:          z.string(),
  starred_url:        z.string(),
  subscriptions_url:  z.string().url(),
  organizations_url:  z.string().url(),
  events_url:         z.string(),
  received_events_url: z.string().url(),

  // Stats (public)
  public_repos:  z.number().int(),
  public_gists:  z.number().int(),
  followers:     z.number().int(),
  following:     z.number().int(),

  // Timestamps
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),

  // Private stats (only present when authenticated as this user)
  private_gists:       z.number().int().optional(),
  total_private_repos: z.number().int().optional(),
  owned_private_repos: z.number().int().optional(),
  disk_usage:          z.number().int().optional(),
  collaborators:       z.number().int().optional(),
  two_factor_authentication: z.boolean().optional(),
  plan: githubUserPlanSchema.optional(),
});

/**
 * TypeScript-style type alias inferred from the schema.
 * Usage: /** @type {GitHubUser} *\/
 * @typedef {import('zod').infer<typeof githubUserSchema>} GitHubUser
 */
