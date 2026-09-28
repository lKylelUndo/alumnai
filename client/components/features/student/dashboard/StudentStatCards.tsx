"use client"

import { useState, useEffect, useCallback } from "react"
import DashboardQuickAction from "@/components/common/layout/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"
import { studentService } from "@/services/student.service"

interface StudentDashboardStats {
  activeCollaborators?: number;
  pendingInvites?: number;
  pendingRequests?: number;
  activeMentorships?: number;
}

const stats = [
  {
    key: "collaborators" as const,
    label: "Active Collaborators",
    shortLabel: "Collaborators",
    sublabel: "Users",
    icon: Handshake,
    bannerBg: "bg-primary/10",
    count: (s: StudentDashboardStats) => s?.activeCollaborators || 0,
  },
  {
    key: "invites" as const,
    label: "Pending Invites",
    shortLabel: "Invites",
    sublabel: "Invites",
    icon: Mail,
    bannerBg: "bg-primary/15",
    count: (s: StudentDashboardStats) => s?.pendingInvites ?? s?.pendingRequests ?? 0,
  },
  {
    key: "mentorships" as const,
    label: "Active Mentorships",
    shortLabel: "Mentors",
    sublabel: "Mentors",
    icon: Users,
    bannerBg: "bg-primary/8",
    count: (s: StudentDashboardStats) => s?.activeMentorships || 0,
  },
]

const StudentStatCards = ({ dashboardStats: initialStats }: { dashboardStats: StudentDashboardStats | null }) => {
  const [dashboardStats, setDashboardStats] = useState<StudentDashboardStats | null>(initialStats)
  const [prevInitialStats, setPrevInitialStats] = useState(initialStats)

  const refetchStats = useCallback(() => {
    studentService.getDashboardStats()
      .then((res) => {
        if (res?.data) setDashboardStats(res.data)
      })
      .catch((err) => console.error("Refetch student stats failed:", err))
  }, [])

  if (prevInitialStats !== initialStats) {
    setPrevInitialStats(initialStats)
    if (initialStats) setDashboardStats(initialStats)
  }

  useEffect(() => {
    if (!dashboardStats) refetchStats()
  }, [dashboardStats, refetchStats])

  return (
    <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:col-span-3">
        {stats.map((stat) => {
          const count = stat.count(dashboardStats!)

          return (
            <div
              key={stat.key}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`${stat.bannerBg} hidden px-5 py-4 sm:block`}>
                <div className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-semibold text-primary">{stat.label}</span>
                </div>
              </div>
              <div className="px-3 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center justify-center gap-2 sm:hidden">
                  <stat.icon className="h-4 w-4 shrink-0 text-primary" />
                  <span
                    className={`text-2xl font-extrabold ${count === 0 ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    {count}
                  </span>
                </div>
                <span className="mt-1 block truncate text-center text-[11px] font-medium text-muted-foreground sm:hidden">
                  {stat.shortLabel}
                </span>

                <span
                  className={`hidden text-4xl font-extrabold sm:block ${
                    count === 0 ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {count}
                </span>
                <span className="mt-1 hidden text-xs text-muted-foreground sm:block">{stat.sublabel}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions Panel */}
      <DashboardQuickAction
        profileRoute="/student/profile"
        updateProfileRoute="/student/profile/update"
        featureRoute="/student/find-mentors"
        featureLabel="Find Mentors"
      />
    </section>
  )
}

export default StudentStatCards
