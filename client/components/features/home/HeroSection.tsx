import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="md:min-h-screen h-[350px] bg-[#EFF4F3]">
      <div className="container mx-auto flex flex-col items-center px-4 lg:max-w-[1060px] lg:flex-row lg:justify-between lg:px-0">
        <div className="md:mt-10 mt-20 text-center lg:text-center">
          <h1 className="text-3xl leading-tight font-bold text-slate-900 sm:text-4xl md:text-5xl lg:text-[55px]">
            Bridge the Gap Between
            <br />
            <span className="text-blue-600">
              Students <span className="text-slate-900">and</span> Alumni
            </span>
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg lg:max-w-xl">
            An AI-powered institutional platform that connects computing
            students with alumni through repository-based skill indexing,
            intelligent matching, and data-driven curriculum insights.
          </p>
        </div>

        <div className="hidden justify-center lg:flex">
          <Image
            src="/images/portal.png"
            alt="Hero Illustration"
            width={350}
            height={350}
            priority
          />
        </div>
      </div>
    </section>
  )
}
