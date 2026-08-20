import { Feature } from "@/lib/types/feature";

export type { Feature };

export const features = [
  {
    title: "AI-Powered Skill Indexing",
    description:
      "Analyze GitHub repositories using GitHub REST API and Gemini AI to generate verified skill profiles.",
    icon: "/images/aifeature.png",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Compare student skills with alumni trends to generate personalized learning recommendations.",
    icon: "/images/gaps.png",
  },
  {
    title: "Intelligent Talent Matching",
    description:
      "Natural language search powered by AI to find perfect student-alumni collaborations.",
    icon: "/images/match.png",
  },
  {
    title: "Curriculum Analytics",
    description:
      "Data-driven insights into alumni skill trends to support curriculum enhancement.",
    icon: "/images/analytics.png",
  },
  {
    title: "Mentorship Recognition",
    description:
      "Recognizes outstanding mentorship performance based on student feedback.",
    icon: "/images/recognition.png",
  },
  {
    title: "School-Verified System",
    description:
      "Institutional verification ensures credibility and trust within the academic ecosystem.",
    icon: "/images/verified.png",
  },
  {
    title: "Mentorship & Collaboration",
    description:
      "Structured mentorship requests and collaboration invitations between students and alumni.",
    icon: "/images/mentorship.png",
  },
]