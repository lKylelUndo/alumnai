import FeatureCard from "./FeatureCard"
import { features } from "@/constants/feature"

export default function FeaturesGrid() {
  return (
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
      {/* 7th card spans center on lg */}
      <div className="hidden lg:block" />
    </div>
  )
}
