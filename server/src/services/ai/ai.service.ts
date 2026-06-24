import { parseRawInput } from "@/lib/gemini";

export class AIService {
    private parseRawInput = async (rawSearch: string) => {
        const response = await parseRawInput(rawSearch);
        console.log(`re`, response);
    }

    public smartSearch = async (rawSearch: string) => {
        try {
            const parsedInput = await this.parseRawInput(rawSearch)

            const students = 0;

            return { status: "success", code: 200, students }
        } catch (error) {
            console.error("SmartSearchService", error);
            return { status: "error", code: 500, message: "Unable to search"}
        }
    }
}