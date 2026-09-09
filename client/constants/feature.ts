import {
  BrainCircuit,
  BarChart3,
  Users,
  PieChart,
  Award,
  ShieldCheck,
  Handshake,
} from "lucide-react";
import { Feature } from "@/lib/types/feature";

export type { Feature };

export const features = [
  {
    title: "AI-Powered Skill Indexing",
    description:
      "Your GitHub repos are analyzed by AI to build a verified skill profile — no manual entry needed.",
    icon: BrainCircuit,
  },
  {
    title: "Skill Gap Analysis",
    description:
      "See exactly where your skills stand compared to alumni in your field, with personalized learning paths.",
    icon: BarChart3,
  },
  {
    title: "Intelligent Talent Matching",
    description:
      "Natural language search that connects students with the right alumni collaborators and mentors.",
    icon: Users,
  },
  {
    title: "Curriculum Analytics",
    description:
      "Data-driven insights into alumni skill trends so departments can strengthen their programs.",
    icon: PieChart,
  },
  {
    title: "Mentorship Recognition",
    description:
      "Outstanding mentors are recognized through real student feedback and measurable impact.",
    icon: Award,
  },
  {
    title: "School-Verified System",
    description:
      "Every profile is institution-verified, so you know the people you connect with are who they say they are.",
    icon: ShieldCheck,
  },
  {
    title: "Mentorship & Collaboration",
    description:
      "Structured requests and invitations that make it easy to start meaningful mentorships and projects.",
    icon: Handshake,
  },
];
