"use client"

import { useState, useEffect, useCallback } from "react"
import { BookOpen, GraduationCap, Handshake, Users } from "lucide-react"
import { adminService } from "@/services/admin.service"
import { useAdminSocket } from "@/hooks/useAdminSocket"

export interface AdminDashboardStats {
  totalStudents?: number
  verifiedAlumni?: number
  activeMentorships?: number
  activeCollaborations?: number
}

interface AdminStatCardsProps {
  data?: AdminDashboardStats | null
}

const stats = [
  {
    key: "students" as const,
    label: "Total Students",
    shortLabel: "Students",
    icon: Users,
    count: (s: AdminDashboardStats) => s?.totalStudents ?? 0,
  },
  {
    key: "alumni" as const,
    label: "Verified Alumni",
    shortLabel: "Alumni",
    icon: GraduationCap,
    count: (s: AdminDashboardStats) => s?.verifiedAlumni ?? 0,
  },
  {
    key: "mentorships" as const,
    label: "Active Mentorships",
    shortLabel: "Mentors",
    icon: BookOpen,
    count: (s: AdminDashboardStats) => s?.activeMentorships ?? 0,
  },
  {
    key: "collaborations" as const,
    label: "Active Collaborations",
    shortLabel: "Collaborators",
    icon: Handshake,
    count: (s: AdminDashboardStats) => s?.activeCollaborations ?? 0,
  },
]

const AdminStatCards = ({ data: initialData }: AdminStatCardsProps) => {
  const [statsData, setStatsData] = useState<AdminDashboardStats | null>(
    initialData ?? null
  )

  const refetchStats = useCallback(async () => {
    await adminService
      .getDashboardStats()
      .then((res) => {
        if (res?.data) setStatsData(res.data)
      })
      .catch((err) => console.error("Refetch stats failed:", err))
  }, [])

  useAdminSocket({ target: "stats", onRefresh: refetchStats })

  useEffect(() => {
    if (initialData) {
      setStatsData(initialData)
    } else {
      adminService
        .getDashboardStats()
        .then((res) => {
          if (res?.data) setStatsData(res.data)
        })
        .catch((err) => console.error("Client fetch stats failed:", err))
    }
  }, [initialData])

  return (
    <section className="mt-5 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const count = stat.count(statsData!)
        const countColor =
          count === 0 ? "text-muted-foreground" : "text-foreground"

        return (
          <div
            key={stat.key}
            // Alumni has no min-h: its cards reach full height because the
            // section's Quick Actions sibling stretches the grid row. Without
            // that sibling these collapse, so pin the same height:
            // sm:p-5 (40) + header h-8 + sm:mb-4 (48) + 3 buttons at
            // sm:py-2.5 + text-sm line (40 each) + gap-2 (16) = 224.
            className="group flex min-w-0 flex-col rounded-2xl border border-border/80 bg-card px-3 py-3 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-4 lg:min-h-[224px]"
          >
            <div className="flex items-center justify-center gap-2 sm:hidden">
              <stat.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span
                className={`text-2xl font-extrabold tabular-nums ${countColor}`}
              >
                {count}
              </span>
            </div>
            <span className="mt-1.5 block truncate text-center text-[11px] font-medium text-muted-foreground sm:hidden">
              {stat.shortLabel}
            </span>

            <div className="hidden min-w-0 items-center gap-2.5 sm:flex">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <span
              className={`mt-3 hidden text-4xl font-bold tabular-nums sm:block ${countColor}`}
            >
              {count}
            </span>
          </div>
        )
      })}
    </section>
  )
}

export default AdminStatCards
