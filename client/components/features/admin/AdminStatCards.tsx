"use client"

import { useState, useEffect, useCallback } from "react"
import { BookOpen, GraduationCap, Handshake, Users2 } from "lucide-react"
import { adminService } from "@/services/admin.service"
import { useAdminSocket } from "@/hooks/useAdminSocket"

export interface AdminDashboardStats {
  totalStudents?: number;
  verifiedAlumni?: number;
  activeMentorships?: number;
  activeCollaborations?: number;
}

interface AdminStatCardsProps {
  data?: AdminDashboardStats | null;
}

const stats = [
  {
    key: "students" as const,
    label: "Total Students",
    sublabel: "Students",
    icon: Users2,
    bannerBg: "bg-primary/10",
    count: (s: AdminDashboardStats) => s?.totalStudents ?? 0,
  },
  {
    key: "alumni" as const,
    label: "Verified Alumni",
    sublabel: "Alumni",
    icon: GraduationCap,
    bannerBg: "bg-primary/15",
    count: (s: AdminDashboardStats) => s?.verifiedAlumni ?? 0,
  },
  {
    key: "mentorships" as const,
    label: "Active Mentorships",
    sublabel: "Mentors",
    icon: BookOpen,
    bannerBg: "bg-primary/8",
    count: (s: AdminDashboardStats) => s?.activeMentorships ?? 0,
  },
  {
    key: "collaborations" as const,
    label: "Active Collaborations",
    sublabel: "Collaborators",
    icon: Handshake,
    bannerBg: "bg-primary/12",
    count: (s: AdminDashboardStats) => s?.activeCollaborations ?? 0,
  },
]

const AdminStatCards = ({ data: initialData }: AdminStatCardsProps) => {
  const [statsData, setStatsData] = useState<AdminDashboardStats | null>(initialData ?? null)

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
      adminService.getDashboardStats()
        .then((res) => {
          if (res?.data) setStatsData(res.data)
        })
        .catch((err) => console.error("Client fetch stats failed:", err))
    }
  }, [initialData])

  return (
    <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="group rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
        >
          <div className={`${stat.bannerBg} px-5 py-4`}>
            <div className="flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{stat.label}</span>
            </div>
          </div>
          <div className="px-5 py-4">
            <span className="text-4xl font-extrabold text-foreground block">
              {stat.count(statsData!)}
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">{stat.sublabel}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

export default AdminStatCards
