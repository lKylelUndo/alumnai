import { Suspense } from "react"
import AlumniBanner from "@/components/features/alumni/dashboard/AlumniBanner"
import DashboardPanel from "@/components/features/alumni/dashboard/AlumniDashboard"

function AlumniBannerSkeleton() {
  return (
    <div className="rounded-2xl bg-primary/[0.03] p-4 sm:p-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-3 sm:p-5">
            <div className="flex items-center justify-center gap-2 sm:hidden">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-6 w-6 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-1 hidden h-3 animate-pulse rounded bg-muted sm:block" />
            <div className="mt-3 hidden h-8 w-16 animate-pulse rounded bg-muted sm:block" />
            <div className="mt-1 hidden h-3 w-12 animate-pulse rounded bg-muted sm:block" />
            <div className="mt-1.5 h-3 w-16 animate-pulse rounded bg-muted sm:hidden" />
          </div>
        ))}
      </div>
    </div>
  )
}

function AlumniPanelSkeleton() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-11 animate-pulse rounded-xl bg-muted sm:h-10 sm:flex-1" />
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
