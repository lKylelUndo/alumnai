"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
export type MentorshipRequest = {
  id: string
  name: string
  track: string
  year: "1ST YEAR" | "2ND YEAR" | "3RD YEAR" | "4TH YEAR"
  status: "Active" | "Pending" | "Completed"
}
export const columns: ColumnDef<MentorshipRequest>[] = [
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
      <span className="text-xs font-semibold tracking-wider text-primary">
        {row.getValue("track")}
      </span>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground">
        {row.getValue("year")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
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
            className="border-primary/20 text-xs font-medium text-primary transition-colors hover:bg-primary/5 hover:text-primary"
          >
            View Profile
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/95"
          >
            View Message
          </Button>
        </div>
      )
    },
  },
]
const dummyRequests: MentorshipRequest[] = [
  {
    id: "1",
    name: "Kyle Ando",
    track: "FULL-STACK",
    year: "3RD YEAR",
    status: "Pending",
  },
  {
    id: "2",
    name: "Ismael Codilla",
    track: "FULL-STACK",
    year: "3RD YEAR",
    status: "Pending",
  },
]
const ManageMentorships = () => {
  return (
    <div className="py-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">
          Manage Mentorship request
        </h2>
        <p className="text-xs text-muted-foreground">
          Students who are requesting for your mentorship
        </p>
      </div>
      <DataTable columns={columns} data={dummyRequests} filterColumn="name" filterPlaceholder="Search by name..." />
    </div>
  )
}
export default ManageMentorships
