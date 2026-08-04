import { ENV } from "@/config/env";

export interface GitHubRepo {
  name: string;
  description: string | null;
  fork: boolean;
  pushed_at: string;
  languages_url: string;
}

export interface CondensedRepoMetadata {
  name: string;
  description?: string;
  languages: string[];
  dependencies: string[];
}

export interface CondensedGitHubProfile {
  username: string;
  repoCount: number;
  allLanguages: string[];
  allDependencies: string[];
  repos: CondensedRepoMetadata[];
}

// GITHUB HELPER FUNCTIONS

// Build common headers for GitHub REST API requests.
// Uses GITHUB_TOKEN from env if available, otherwise unauthenticated (60 req/hr).
function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  const token = ENV.GITHUB_PAT;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Extract a GitHub username from a profile URL.
export function parseGithubUsername(url: string): string | null {
  try {
    const normalised = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(normalised);

    if (!parsed.hostname.includes("github.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.length >= 1 ? segments[0] : null;
  } catch {
    return null;
  }
}

// Fetch public, non-fork repos for a user, sorted by most recently pushed.
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?type=owner&sort=pushed&per_page=10`,
    { headers: githubHeaders() }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }

  const repos: GitHubRepo[] = await res.json();

  // Filter out forks
  return repos.filter((r) => !r.fork);
}

// Fetch the language names for a single repo.
async function fetchRepoLanguages(languagesUrl: string): Promise<string[]> {
  const res = await fetch(languagesUrl, { headers: githubHeaders() });
  if (!res.ok) return [];
  const languagesMap: Record<string, number> = await res.json();
  return Object.keys(languagesMap);
}

// Filter out dev tooling / linting dependencies that add token noise
function filterRelevantDependencies(deps: string[]): string[] {
  const noisePatterns = [
    /^@types\//,
    /^@eslint\//,
    /^@typescript-eslint\//,
    /^eslint/,
    /^globals$/,
    /^@vitejs\//,
    /^prettier/,
  ];

  return deps.filter((dep) => !noisePatterns.some((pattern) => pattern.test(dep)));
}

// Attempt to fetch and parse package.json from a repo, returning filtered dependencies.
async function fetchPackageJsonDeps(username: string, repoName: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/package.json`,
      { headers: githubHeaders() }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));

    const rawDeps = [
      ...Object.keys(content.dependencies ?? {}),
      ...Object.keys(content.devDependencies ?? {}),
    ];

    return filterRelevantDependencies(rawDeps);
  } catch {
    return [];
  }
}

// Collect token-optimized metadata for all user repos.
export async function collectRepoMetadata(
  username: string,
  repos: GitHubRepo[]
): Promise<CondensedGitHubProfile> {
  const repoResults: CondensedRepoMetadata[] = await Promise.all(
    repos.map(async (repo) => {
      const [languages, dependencies] = await Promise.all([
        fetchRepoLanguages(repo.languages_url),
        fetchPackageJsonDeps(username, repo.name),
      ]);

      const item: CondensedRepoMetadata = {
        name: repo.name,
        languages,
        dependencies,
      };

      if (repo.description) {
        item.description = repo.description;
      }

      return item;
    })
  );

  const allLanguagesSet = new Set<string>();
  const allDependenciesSet = new Set<string>();

  for (const repo of repoResults) {
    repo.languages.forEach((lang) => allLanguagesSet.add(lang));
    repo.dependencies.forEach((dep) => allDependenciesSet.add(dep));
  }

  return {
    username,
    repoCount: repos.length,
    allLanguages: Array.from(allLanguagesSet),
    allDependencies: Array.from(allDependenciesSet),
    repos: repoResults.map((r) => {
      const cleanedRepo: any = { name: r.name };
      if (r.description) cleanedRepo.description = r.description;
      if (r.languages.length > 0) cleanedRepo.languages = r.languages;
      if (r.dependencies.length > 0) cleanedRepo.dependencies = r.dependencies;
      return cleanedRepo;
    }),
  };
}
