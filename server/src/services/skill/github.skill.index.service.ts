import { parseGithubUsername, fetchUserRepos, collectRepoMetadata } from "@/lib/github";
import { analyzeGithubSkills } from "@/lib/gemini";

export const GithubSkillIndexService = async (githubURL: string) => {
  try {
    // 1. Parse username
    const username = parseGithubUsername(githubURL);
    if (!username) {
      return { status: "error", code: 400, message: "Invalid GitHub profile URL" };
    }

    console.log(`[GithubSkillIndex] Indexing skills for: ${username}`);

    // 2. Fetch repos
    const repos = await fetchUserRepos(username);
    if (repos.length === 0) {
      return { status: "error", code: 404, message: "No public repositories found for this user" };
    }

    console.log(`GithubSkillIndex Found ${repos.length} repos`);

    // 3. Collect condensed token-optimized metadata
    const repoMetadata = await collectRepoMetadata(username, repos);

    console.log("repometadata", repoMetadata);

    // 4. Analyse with Gemini
    const skills = await analyzeGithubSkills(repoMetadata);

    return {
      status: "success",
      code: 200,
      message: "Skills indexed from GitHub successfully",
      data: {
        username,
        reposAnalyzed: repos.length,
        skills,
      },
    };
  } catch (error: any) {
    console.error("GithubSkillIndexService", error);
    return {
      status: "error",
      code: 500,
      message: error.message || "Unable to index skills from GitHub",
    };
  }
};
