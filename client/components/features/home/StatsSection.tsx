import { Shield, GitPullRequest, Users } from "lucide-react"

// TODO: Wire these to real API data once available
const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Verified Members",
    description: "Students & alumni from CPC",
  },
  {
    icon: Shield,
    value: "200+",
    label: "Mentorships Formed",
    description: "Real connections, real guidance",
  },
  {
    icon: GitPullRequest,
    value: "10K+",
    label: "Skills Indexed",
    description: "Verified from GitHub activity",
  },
]

export default function StatsSection() {
  return (
    <section className="border-y border-[#E2E8F0] bg-white py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1A216D]/5 text-[#1A216D]">
              <stat.icon className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#131b2e] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#131b2e]">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-[#434657] sm:text-sm">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
