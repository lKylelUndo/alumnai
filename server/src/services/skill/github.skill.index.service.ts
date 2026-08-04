export const GithubSkillIndexService = async (githubURL: string) => {
    try {
        console.log("github: ", githubURL);
        
        return { status: "success", code: 200, message: "Skill indexed from github" };
    } catch (error) {
        console.error("GithubSkillIndexService", error);
        return { status: "error", code: 500, message: "Unable to index skill from github" };
    }
}
