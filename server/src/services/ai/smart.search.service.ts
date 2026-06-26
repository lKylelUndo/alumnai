import { extractTechnicalSkills } from "@/lib/gemini";

export const SmartSearchService = async (rawSearch: string) => {
  try {
    const response = await extractTechnicalSkills(rawSearch);

    const students = 0;

    return { status: "success", code: 200, students };
  } catch (error) {
    console.error("smartSearch", error);
    return { status: "error", code: 500, message: "Unable to search" };
  }
};
