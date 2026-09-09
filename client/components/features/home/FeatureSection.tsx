import FeaturesGrid from "./FeaturesCarousel"

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1A216D]">
            Platform Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
            Everything you need to grow, connect, and get recognized
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#434657] sm:text-lg">
            Built by and for the CPC computing community. Seven tools that turn
            your code into career opportunities.
          </p>
        </div>

        <FeaturesGrid />
      </div>
    </section>
  )
}
