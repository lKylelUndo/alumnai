import { parseRawInput } from "@/lib/gemini";

export const smartSearch = async (rawSearch: string) => {
  try {
    await parseRawInput(rawSearch);

    const students = 0;

    return { status: "success", code: 200, students };
  } catch (error) {
    console.error("smartSearch", error);
    return { status: "error", code: 500, message: "Unable to search" };
  }
};
