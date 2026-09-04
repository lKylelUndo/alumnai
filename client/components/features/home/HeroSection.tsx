import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const trustPoints = [
  "Institution-verified profiles",
  "Evidence from GitHub activity",
  "AI-driven skill matching",
]

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#F7F8FC]">
      <div className="mx-auto px-12 flex max-w-7xl flex-col gap-12 px-6 py-16 sm:py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-28">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1A216D]/10 bg-white px-4 py-1.5 text-xs font-medium text-[#1A216D] shadow-sm sm:text-sm">
            <Sparkles className="size-3.5 shrink-0 text-[#2D7EE2]" aria-hidden />
            AI-powered platform for CPC computing community
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#1A216D] sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Verified skills.
            <br />
            <span className="text-[#2D7EE2]">Real connections.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
            alumnAI connects computing students and alumni through evidence-based
            skill profiles built from GitHub activity. Get intelligent matching,
            mentorship, and curriculum insights.
          </p>

          <ul className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <CheckCircle2
                  className="size-4 shrink-0 text-[#2D7EE2]"
                  aria-hidden
                />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="h-11 w-full px-6 text-base sm:w-auto"
            >
              <Link href="/register">
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 w-full border-[#1A216D]/15 px-6 text-base text-[#1A216D] sm:w-auto"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>

        <div className="md:flex hidden flex-1 justify-center lg:justify-end">
          <Image
            src="/images/portalv2.png"
            alt="alumnAI platform connecting students and alumni"
            width={420}
            height={420}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 420px"
            className="h-auto w-full max-w-xs object-contain sm:max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </section>
  )
}
