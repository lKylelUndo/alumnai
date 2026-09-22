export default function StudentLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      {/* Banner skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-primary/[0.03] p-6">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          </div>

          {/* Stat cards skeleton */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
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
