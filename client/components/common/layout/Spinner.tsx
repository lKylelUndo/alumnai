import Logo from "@/components/common/layout/Logo"

const Spinner = ({ content }: { content: string }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6"
    >
      <Logo priority />
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        <p className="animate-pulse text-sm text-muted-foreground">{content}</p>
      </div>
    </div>
  )
}

export default Spinner
