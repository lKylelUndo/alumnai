import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-[#1A216D] px-8 py-14 text-center sm:px-16 sm:py-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your skills are real. Your connections should be too.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Join the CPC computing community on AlumnAI. Build a verified
            profile, find the right mentor, and grow with evidence.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-white px-7 text-base text-[#1A216D] hover:bg-white/90 sm:w-auto"
            >
              <Link href="/register">
                Join AlumnAI&thinsp;—&thinsp;It&rsquo;s Free
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full border-white/20 bg-transparent px-7 text-base text-white hover:bg-white/10 sm:w-auto"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
