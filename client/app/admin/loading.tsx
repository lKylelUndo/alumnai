export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="h-8 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Banner skeleton */}
        <div className="rounded-2xl bg-primary/[0.03] p-6">
          <div className="space-y-2">
            <div className="h-8 w-56 animate-pulse rounded bg-muted" />
            <div className="h-4 w-80 animate-pulse rounded bg-muted" />
          </div>

          {/* Stat cards skeleton - 4 columns for admin */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="h-12 animate-pulse bg-muted" />
                <div className="px-5 py-4 space-y-2">
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 flex-1 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      </div>
    </div>
  )
}
