import Link from "next/link"
import { ArrowRight, CheckCircle2, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const trustPoints = [
  "Institution-verified profiles",
  "Evidence from GitHub activity",
  "AI-driven skill matching",
]

/* ── Bento composition: large browser-window card ─────────────── */

function BrowserWindowCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white shadow-xl ${className}`}
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28CA42]" />
        <span className="ml-3 flex-1 rounded-full bg-[#F1F5F9] px-3 py-1 text-center text-[11px] font-medium text-[#94A3B8]">
          alumnai.app
        </span>
      </div>

      {/* Card body: mentor match + skills */}
      <div className="flex flex-col gap-4 p-5">
        {/* Mentor match row */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e0e0ff] text-sm font-bold text-[#1A216D]">
            JD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-[#131b2e]">
              Jamie Delgado
            </p>
            <p className="text-xs text-[#434657]">Software Engineer</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-[#1A216D] px-2.5 py-0.5 text-[11px] font-semibold text-white">
            92% match
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E2E8F0]" />

        {/* Verified Skills section */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#434657]">
            Verified Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Node.js"].map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-semibold text-[#434657]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Small overlapping recognition badge ───────────────────────── */

function RecognitionBadgeCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`product-mockup-float-slow flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-md ${className}`}
      style={{ animationDuration: "6.5s", animationDelay: "2.4s" }}
    >
      <Star className="h-4 w-4 fill-[#FFC000] text-[#FFC000]" />
      <span className="text-sm font-semibold text-[#131b2e]">Recognized</span>
      <span className="text-xs text-[#434657]">by 12 peers</span>
    </div>
  )
}

/* ── Tiny verified pill (top-left accent) ──────────────────────── */

function VerifiedPill({ className = "" }: { className?: string }) {
  return (
    <div
      className={`product-mockup-float-alt inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 shadow-md ${className}`}
      style={{ animationDuration: "8s", animationDelay: "1.2s" }}
    >
      <Check className="h-3 w-3 text-[#28CA42]" />
      <span className="text-[11px] font-semibold text-[#434657]">Verified</span>
    </div>
  )
}

/* ── Hero section ──────────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        {/* Copy */}
        <div className="flex flex-col text-center lg:text-left">
          <span className="mb-4 inline-block self-center rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-[#1A216D] sm:self-start lg:self-start">
            For the CPC computing community
          </span>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#131b2e] sm:text-5xl lg:text-6xl">
            Where verified skill meets real mentorship.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#434657] sm:text-lg lg:mx-0">
            AlumnAI connects CPC students and alumni through evidence-based
            profiles built from your actual GitHub activity. No empty
            claims&thinsp;—&thinsp;just real skills, real connections.
          </p>

          <ul className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-[#434657]"
              >
                <CheckCircle2
                  className="size-4 shrink-0 text-[#1A216D]"
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
              className="h-12 w-full px-7 text-base sm:w-auto"
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
              className="h-12 w-full border-[#E2E8F0] px-7 text-base text-[#1A216D] hover:bg-[#F8FAFC] sm:w-auto"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>

        {/* ── Desktop (≥lg): Bento composition ── */}
        <div className="hidden lg:flex lg:justify-end">
          <div className="relative w-full max-w-lg">
            {/* Tiny verified pill: overlaps top-left of browser window */}
            <div className="absolute -left-4 -top-3 z-20">
              <VerifiedPill />
            </div>

            {/* Large browser-window card */}
            <BrowserWindowCard />

            {/* Recognition badge: overlaps bottom-right */}
            <div className="absolute -mb-8 -mt-8 ml-auto w-3/4 rotate-1">
              <RecognitionBadgeCard />
            </div>
          </div>
        </div>

        {/* ── Mobile (<lg): simplified stacked composition ── */}
        <div className="flex flex-col items-center gap-3 lg:hidden">
          {/* Browser window full-width */}
          <div className="relative w-full max-w-sm">
            <BrowserWindowCard />
            {/* Recognition badge overlaps bottom-right */}
            <div className="absolute -mb-6 -mt-4 ml-auto w-3/4 rotate-1">
              <RecognitionBadgeCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
