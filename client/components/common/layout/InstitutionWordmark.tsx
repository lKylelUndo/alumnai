import Image from "next/image"

const InstitutionWordmark = () => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src="/logo/logoalumnaiv3.png"
        alt="alumnAI"
        width={226}
        height={237}
        priority
        fetchPriority="high"
        sizes="56px"
        className="h-10 w-auto shrink-0 object-contain"
      />
      <span className="hidden h-12 w-px shrink-0 bg-border sm:block" aria-hidden="true" />
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
