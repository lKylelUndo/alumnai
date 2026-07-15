import Image from "next/image"
import { Brain } from "lucide-react"
import { roboto_slab } from "@/lib/fonts"

export default function HeroSection() {
  return (
    <section className="bg-[#EFF4F3]">
      <div className="flex justify-between mx-auto border container max-w-[1200px]">
        <div className="text-justify">
          <div className="flex items-center justify-center gap-2">
            <h3
              className={`text-5xl font-bold text-[#1A216D]`}
            >
              alumnAI
            </h3>
          </div>

          <h1 className="text-5xl leading-tight font-bold text-slate-900">
            Bridge the Gap Between
            <br />
            <span className="text-blue-600">
              Students <span className="text-slate-900">and</span> Alumni
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-slate-600">
            An AI-powered institutional platform that connects computing
            students with alumni through repository-based skill indexing,
            intelligent matching, and data-driven curriculum insights.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/portal.png"
            alt="Hero Illustration"
            width={350}
            height={350}
          />
        </div>
      </div>
    </section>
  )
}
