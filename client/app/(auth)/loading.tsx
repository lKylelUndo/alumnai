export default function AuthLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-[#1A216D]/8 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-16 animate-pulse rounded bg-muted" />
            <div className="h-9 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 w-full">
        {/* Left column: background placeholder */}
        <div className="hidden lg:block bg-[#1A216D]" />

        {/* Right column: form skeleton */}
        <div className="w-full flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </main>
    </div>
  )
}
