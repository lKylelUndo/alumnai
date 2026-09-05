import { Suspense } from "react"
import AlumniBanner from "@/components/features/alumni/dashboard/AlumniBanner"
import DashboardPanel from "@/components/features/alumni/dashboard/AlumniDashboard"

function AlumniBannerSkeleton() {
  return (
    <div className="rounded-2xl bg-primary/[0.03] p-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
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
  )
}

function AlumniPanelSkeleton() {
  return (
    <div className="mt-6">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 flex-1 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
    </div>
  )
}

export default function AlumniDashboardPage() {
  return (
    <>
      <Suspense fallback={<AlumniBannerSkeleton />}>
        <AlumniBanner />
      </Suspense>
      <Suspense fallback={<AlumniPanelSkeleton />}>
        <DashboardPanel />
      </Suspense>
    </>
  )
}
