import type { LucideIcon } from "lucide-react"
import {
  Award,
  BarChart3,
  Brain,
  GitBranch,
  Handshake,
  Search,
  ShieldCheck,
} from "lucide-react"

export type Feature = {
  title: string
  description: string
  icon: LucideIcon
}

export const features: Feature[] = [
  {
    title: "AI-Powered Skill Indexing",
    description:
      "Analyze GitHub repositories using the GitHub REST API and Gemini AI to generate verified skill profiles.",
    icon: Brain,
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Compare student skills with alumni trends to generate personalized learning recommendations.",
    icon: GitBranch,
  },
  {
    title: "Intelligent Talent Matching",
    description:
      "Natural language search powered by AI to find ideal student-alumni collaborations.",
    icon: Search,
  },
  {
    title: "Curriculum Analytics",
    description:
      "Data-driven insights into alumni skill trends to support curriculum enhancement.",
    icon: BarChart3,
  },
  {
    title: "Mentorship Recognition",
    description:
      "Recognizes outstanding mentorship performance based on student feedback.",
    icon: Award,
  },
  {
    title: "School-Verified System",
    description:
      "Institutional verification ensures credibility and trust within the academic ecosystem.",
    icon: ShieldCheck,
  },
  {
    title: "Mentorship & Collaboration",
    description:
      "Structured mentorship requests and collaboration invitations between students and alumni.",
    icon: Handshake,
  },
]
