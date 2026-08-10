import { Building2, GitPullRequest, Users } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Verified members",
    description: "Students & alumni from CPC",
  },
  {
    icon: GitPullRequest,
    value: "10k+",
    label: "Repos analyzed",
    description: "Skills indexed from real code",
  },
  {
    icon: Building2,
    value: "1",
    label: "Institution",
    description: "Built for CPC computing programs",
  },
]

export default function StatsSection() {
  return (
    <section className="border-y border-[#1A216D]/8 bg-white py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-3 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1A216D]/5 text-[#1A216D]">
              <stat.icon className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A216D] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
