import { Suspense } from "react"
import AdminBanner from "@/components/features/admin/AdminBanner"
import DashboardPanel from "@/components/features/admin/AdminDashboard"
import { AdminTabProvider } from "@/components/features/admin/AdminTabs"

export const dynamic = "force-dynamic"

function AdminBannerSkeleton() {
  return (
    <div>
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-border bg-card p-3 sm:min-h-48 sm:px-5 sm:py-4 lg:min-h-[224px]"
          >
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

function AdminPanelSkeleton() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-11 animate-pulse rounded-xl bg-muted sm:h-10 sm:flex-1"
          />
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <AdminTabProvider>
      {/* Provider renders a real div, so main's space-y-6 never reaches the
          banner and panel. This restores the same 24px alumni gets. */}
      <div className="space-y-6">
        <Suspense fallback={<AdminBannerSkeleton />}>
          <AdminBanner />
        </Suspense>
        <Suspense fallback={<AdminPanelSkeleton />}>
          <DashboardPanel />
        </Suspense>
      </div>
    </AdminTabProvider>
  )
}
