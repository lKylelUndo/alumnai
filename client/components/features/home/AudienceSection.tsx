import { BarChart3, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const audiences = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Discover mentors who match your tech stack, identify skill gaps against industry trends, and request collaborations with verified alumni.",
    cta: "Join as Student",
    href: "/register",
  },
  {
    icon: Users,
    title: "For Alumni",
    description:
      "Give back through mentorship, find collaborators for side projects, and get recognized for your impact on the next generation.",
    cta: "Join as Alumni",
    href: "/register",
  },
  {
    icon: BarChart3,
    title: "For Administrators",
    description:
      "Access institutional analytics on alumni skill trends, mentorship activity, and curriculum gaps to drive program improvements.",
    cta: "Learn More",
    href: "/login",
  },
]

export default function AudienceSection() {
  return (
    <section className="border-t border-[#1A216D]/8 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2D7EE2]">
            Built for everyone at CPC
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1A216D] sm:text-4xl">
            One platform, three perspectives
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audiences.map((audience) => (
            <article
              key={audience.title}
              className="flex flex-col rounded-2xl border border-[#1A216D]/8 bg-[#F7F8FC] p-6"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#1A216D] text-white">
                <audience.icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-[#1A216D]">
                {audience.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {audience.description}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-6 w-full border-[#1A216D]/15 text-[#1A216D] hover:bg-[#1A216D] hover:text-white"
              >
                <Link href={audience.href}>{audience.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
