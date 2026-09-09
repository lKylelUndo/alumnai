import type { Feature } from "@/lib/types/feature"

type FeatureCardProps = Pick<Feature, "title" | "description" | "icon">

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  const IconComponent =
    typeof icon === "string" ? null : (icon as React.ComponentType<{ className?: string }>)

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-colors hover:border-[#1A216D]/20 hover:bg-[#F8FAFC]">
      <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#1A216D]/5 text-[#1A216D] transition-colors group-hover:bg-[#1A216D] group-hover:text-white">
        {IconComponent ? (
          <IconComponent className="size-5" />
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-[#131b2e]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#434657]">
        {description}
      </p>
    </article>
  )
}
