import type { Feature } from "@/lib/types/feature"
import Image from "next/image"

type FeatureCardProps = Pick<Feature, "title" | "description" | "icon">

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  const isImageIcon = typeof icon === "string"
  const IconComponent = !isImageIcon ? icon : null

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#1A216D]/8 bg-white p-6 shadow-sm transition-shadow hover:shadow-md hover:shadow-[#1A216D]/5">
      <div className="mb-5 flex size-11 items-center justify-center overflow-hidden rounded-xl bg-[#1A216D]/5 text-[#1A216D] transition-colors group-hover:bg-[#1A216D] group-hover:text-white">
        {isImageIcon ? (
          <Image
            src={icon}
            alt={title}
            width={24}
            height={24}
            className="size-6 object-contain"
          />
        ) : IconComponent ? (
          <IconComponent className="size-5" aria-hidden />
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-[#1A216D]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </article>
  )
}
