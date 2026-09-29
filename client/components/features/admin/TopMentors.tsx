"use client"

import { useState, useEffect, useCallback } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/common/tables/DataTable"
import { Award, ArrowUpRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminService } from "@/services/admin.service"
import type { TopMentors } from "@/lib/types/mentorship"
import { useAdminSocket } from "@/hooks/useAdminSocket"

export const columns: ColumnDef<TopMentors>[] = [
  {
    accessorKey: "ranking",
    header: "Ranking",
    cell: ({ row }) => {
      const rank = Number(row.getValue("ranking"))
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {rank === 1 && <Award className="h-4 w-4 text-amber-500" />}
          <span className="font-mono text-primary">#{rank}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "mentees",
    header: "Mentees",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {row.getValue("mentees")} Mentees
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <button
        type="button"
        title="View mentor"
        aria-label="View this mentor"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white sm:h-7 sm:w-7"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    ),
  },
]

export default function TopMentors({
  data: initialData,
}: {
  data: TopMentors[]
}) {
  const [mentors, setMentors] = useState<TopMentors[]>(initialData ?? [])

  const refetchTopMentors = useCallback(() => {
    adminService
      .getTopMentors()
      .then((res) => {
        if (res?.data?.mentors) {
          setMentors(res.data.mentors)
        }
      })
      .catch((err) => console.error("Client fetch top mentors failed:", err))
  }, [])

  // Listen for realtime updates
  useAdminSocket({ target: "top-mentors", onRefresh: refetchTopMentors })

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setMentors(initialData)
    } else {
      adminService
        .getTopMentors()
        .then((res) => {
          if (res?.data?.mentors) {
            setMentors(res.data.mentors)
          }
        })
        .catch((err) => console.error("Client fetch top mentors failed:", err))
    }
  }, [initialData])

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">Top Mentors</h2>
            <p className="text-sm text-muted-foreground">
              Alumni with the most mentees and contributions
            </p>
          </div>
        </div>

        <Button
          onClick={refetchTopMentors}
          className="h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 font-medium shadow-sm transition-all sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={mentors}
        filterColumn="name"
        filterPlaceholder="Search by name..."
      />
    </div>
  )
}
