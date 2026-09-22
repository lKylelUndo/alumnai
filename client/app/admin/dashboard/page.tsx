import { Suspense } from "react"
import AdminBanner from "@/components/features/admin/AdminBanner"
import DashboardPanel from "@/components/features/admin/AdminDashboard"

export const dynamic = "force-dynamic"

function AdminBannerSkeleton() {
  return (
    <div className="rounded-2xl bg-primary/[0.03] p-6">
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="h-12 animate-pulse bg-muted" />
            <div className="space-y-2 px-5 py-4">
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminPanelSkeleton() {
  return (
    <div className="mt-6">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
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

export default function AdminDashboardPage() {
  return (
    <>
      <Suspense fallback={<AdminBannerSkeleton />}>
        <AdminBanner />
      </Suspense>
      <Suspense fallback={<AdminPanelSkeleton />}>
        <DashboardPanel />
      </Suspense>
    </>
  )
}

