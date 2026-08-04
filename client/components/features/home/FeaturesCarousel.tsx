"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import FeatureCard from "./FeatureCard"
import { features } from "@/constants/feature"
import { Button } from "@/components/ui/button"

export default function FeaturesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return

    const card = container.querySelector<HTMLElement>("article")
    const gap = 24
    const amount = card ? card.offsetWidth + gap : container.clientWidth * 0.85

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative mt-14">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-linear-to-r from-white to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-linear-to-l from-white to-transparent sm:block" />

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Platform features"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="w-[85vw] max-w-[340px] shrink-0 snap-start sm:w-[320px]"
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 border-[#1A216D]/15 text-[#1A216D]"
          onClick={() => scroll("left")}
          aria-label="Previous features"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 border-[#1A216D]/15 text-[#1A216D]"
          onClick={() => scroll("right")}
          aria-label="Next features"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
