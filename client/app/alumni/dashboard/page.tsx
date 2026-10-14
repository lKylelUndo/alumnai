import { Suspense } from "react"
import AlumniBanner from "@/components/features/alumni/dashboard/AlumniBanner"
import DashboardPanel from "@/components/features/alumni/dashboard/AlumniDashboard"
import ProfileCompletionBanner from "@/components/common/profile/ProfileCompletionBanner"

function AlumniBannerSkeleton() {
  return (
    <div>
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-border bg-card p-3 sm:min-h-48 sm:px-5 sm:py-4">
            <div className="flex items-center justify-center gap-2 sm:hidden">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-6 w-6 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-1.5 h-3 w-16 animate-pulse rounded bg-muted sm:hidden" />
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-3 hidden sm:block">
              <div className="h-9 w-12 animate-pulse rounded bg-muted" />
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
      <div className="mt-6">
        <ProfileCompletionBanner role="ALUMNI" />
      </div>
      <Suspense fallback={<AlumniPanelSkeleton />}>
        <DashboardPanel />
      </Suspense>
    </>
  )
}
