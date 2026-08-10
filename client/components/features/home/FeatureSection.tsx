import FeaturesCarousel from "./FeaturesCarousel"

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2D7EE2]">
            Platform capabilities
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1A216D] sm:text-4xl">
            Everything you need to connect &amp; grow
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            <span className="font-semibold text-[#1A216D]">alumnAI</span>{" "}
            combines AI technology with institutional verification to create
            meaningful, evidence-based connections.
          </p>
        </div>

        <FeaturesCarousel />
      </div>
    </section>
  )
}
