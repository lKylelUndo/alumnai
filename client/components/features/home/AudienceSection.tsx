import { BarChart3, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const audiences = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Find mentors who match your tech stack. See where your skills stand. Request collaborations with alumni who've walked the path you're on.",
    cta: "Join as Student",
    href: "/register",
  },
  {
    icon: Users,
    title: "For Alumni",
    description:
      "Give back to the next generation. Find collaborators for projects. Get recognized for the real impact you have on students.",
    cta: "Join as Alumni",
    href: "/register",
  },
  {
    icon: BarChart3,
    title: "For Administrators",
    description:
      "See where alumni skills are trending. Understand mentorship activity across your programs. Make data-informed curriculum decisions.",
    cta: "Sign In",
    href: "/login",
  },
]

export default function AudienceSection() {
  return (
    <section className="border-t border-[#E2E8F0] bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1A216D]">
            Made for CPC
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
            Whether you&rsquo;re just starting out or giving back
            &thinsp;—&thinsp;there&rsquo;s a place for you here.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {audiences.map((audience) => (
            <article
              key={audience.title}
              className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-colors hover:border-[#1A216D]/20"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#1A216D] text-white">
                <audience.icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-[#131b2e]">
                {audience.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#434657]">
                {audience.description}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-6 w-full border-[#E2E8F0] text-[#1A216D] hover:bg-[#1A216D] hover:text-white"
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
