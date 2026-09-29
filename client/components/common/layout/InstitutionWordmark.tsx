import Image from "next/image"

const InstitutionWordmark = () => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src="/logo/logoalumnaiv2.png"
        alt="alumnAI"
        width={100}
        height={80}
        priority
        fetchPriority="high"
        sizes="112px"
        className="h-20 w-auto shrink-0 object-contain"
      />
      <span className="hidden h-16 w-px shrink-0 bg-border sm:block" aria-hidden="true" />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[11px] font-semibold tracking-wide text-foreground">
          Cordova Public College
        </span>
        <span className="hidden truncate text-[10px] text-muted-foreground sm:block">
          College of Computer Studies &middot; BSIT
        </span>
      </span>
    </div>
  )
}

export default InstitutionWordmark
