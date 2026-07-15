import FeatureCard from "./FeatureCard";
import { features } from "@/constants/feature";

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="lg:text-4xl text-3xl font-bold text-slate-900">
            Powerful Features
          </h2>

          <p className="mt-4 lg:text-base text-[14px] text-slate-600">
            alumnAI combines AI technology with institutional
            verification to create meaningful connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
}