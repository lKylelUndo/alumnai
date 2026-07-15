import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="bg-[#EFF4F3] min-h-screen">
      <div className="flex  items-center lg:justify-between mx-auto container lg:max-w-[1060px]">
        <div className="">
          <h1 className="text-[55px] leading-tight font-bold text-slate-900">
            Bridge the Gap Between
            <br />
            <span className="text-blue-600">
              Students <span className="text-slate-900">and</span> Alumni
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-justify text-slate-600">
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
