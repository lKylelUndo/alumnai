"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
export type Mentee = {
  id: string
  name: string
  track: string
  year: "1ST YEAR" | "2ND YEAR" | "3RD YEAR" | "4TH YEAR"
  status: "Active" | "Pending" | "Completed"
}
export const columns: ColumnDef<Mentee>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      return (
        <div className="flex items-center gap-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </div>
          <span className="font-semibold text-foreground">{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "track",
    header: "Track",
    cell: ({ row }) => (
      <span className="font-semibold text-primary text-xs tracking-wider">
        {row.getValue("track")}
      </span>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs font-medium">
        {row.getValue("year")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
        {row.getValue("status")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors text-xs font-medium"
          >
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive transition-colors text-xs font-medium"
          >
            End Collaboration
          </Button>
        </div>
      )
    },
  },
]
const dummyMentees: Mentee[] = [
  {
    id: "1",
    name: "Marvin Barro",
    track: "FRONTEND",
    year: "3RD YEAR",
    status: "Active",
  },
  {
    id: "2",
    name: "Shin Aro",
    track: "FRONTEND",
    year: "3RD YEAR",
    status: "Active",
  },
]
const YourMentees = () => {
  return (
    <div className="py-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Your Mentees</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;re currently mentoring
        </p>
      </div>
      <DataTable columns={columns} data={dummyMentees} filterColumn="name" filterPlaceholder="Search by name..." />
    </div>
  )
}
export default YourMentees