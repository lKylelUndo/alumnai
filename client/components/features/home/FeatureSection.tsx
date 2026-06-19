import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "AI-Powered Skill Indexing",
    description:
      "Analyze GitHub repositories using GitHub REST API and Gemini AI to generate verified skill profiles.",
    icon: "/icons/ai-indexing.png",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Compare student skills with alumni trends to generate personalized learning recommendations.",
    icon: "/icons/skill-gap.png",
  },
  {
    title: "Intelligent Talent Matching",
    description:
      "Natural language search powered by AI to find perfect student-alumni collaborations.",
    icon: "/icons/matching.png",
  },
  {
    title: "Curriculum Analytics",
    description:
      "Data-driven insights into alumni skill trends to support curriculum enhancement.",
    icon: "/icons/analytics.png",
  },
  {
    title: "Mentorship Recognition",
    description:
      "Recognizes outstanding mentorship performance based on student feedback.",
    icon: "/icons/recognition.png",
  },
  {
    title: "School-Verified System",
    description:
      "Institutional verification ensures credibility and trust within the academic ecosystem.",
    icon: "/icons/verified.png",
  },
  {
    title: "Mentorship System",
    description:
      "Structured mentorship requests and collaboration invitations between students and alumni.",
    icon: "/icons/mentorship.png",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Powerful Features
          </h2>

          <p className="mt-4 text-slate-600">
            alumnAI combines AI technology with institutional
            verification to create meaningful connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
}