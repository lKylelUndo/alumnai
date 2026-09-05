import { SkillAnalyticsData } from "@/lib/types/analytics";

export const defaultAnalytics: SkillAnalyticsData = {
  pieChart: [
    { name: "TypeScript", value: 40, color: "#2563EB" },
    { name: "JavaScript", value: 20, color: "#F59E0B" },
    { name: "React", value: 20, color: "#06B6D4" },
    { name: "PHP", value: 10, color: "#8B5CF6" },
    { name: "C#", value: 10, color: "#EF4444" },
  ],
  topSkills: [
    {
      field: "Fullstack Web Development",
      skill: "TypeScript",
      percentage: 40,
      abbreviation: "TS",
      bgColor: "#2563EB",
    },
    {
      field: "Backend Web Development",
      skill: "PHP",
      percentage: 10,
      abbreviation: "PHP",
      bgColor: "#8B5CF6",
    },
  ],
  recommendation:
    "TypeScript continues to lead industry adoption. Consider adding advanced Fullstack TypeScript workshops for graduating students.",
}