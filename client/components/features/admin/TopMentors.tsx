"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/common/tables/DataTable"
import { Award, ArrowUpRight } from "lucide-react"

export type TopMentors = {
  ranking: string | number
  name: string
  mentees: string | number
}

export const columns: ColumnDef<TopMentors>[] = [
  {
    accessorKey: "ranking",
    header: "Ranking",
    cell: ({ row }) => {
      const rank = Number(row.getValue("ranking"))
      return (
        <div className="flex items-center gap-1.5 font-bold text-xs">
          {rank === 1 && <Award className="h-4 w-4 text-amber-500" />}
          <span className="text-primary font-mono">#{rank}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground text-sm">
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
      <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors">
        <ArrowUpRight className="h-4 w-4" />
      </button>
    ),
  },
]

export default function TopMentors({ data }: { data: TopMentors[] }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Top Mentors</h2>
        <p className="text-xs text-muted-foreground">
          Alumni with the most mentees and contributions
        </p>
      </div>
      <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Search by name..." />
    </div>
  )
}
