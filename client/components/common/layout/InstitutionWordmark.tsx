import Logo from "@/components/common/layout/Logo"

const InstitutionWordmark = () => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Logo priority />
      <span className="hidden h-8 w-px shrink-0 bg-border sm:block" aria-hidden="true" />
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
