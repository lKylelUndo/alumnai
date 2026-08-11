const Spinner = ({ content }: { content: string }) => {
  return (
    <div className="flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="animate-pulse text-sm text-muted-foreground">
          {content}
        </p>
      </div>
    </div>
  )
}

export default Spinner
