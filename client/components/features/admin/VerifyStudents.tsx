"use client"

import { DataTable } from "@/components/common/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, XCircle, ArrowUpRight } from "lucide-react"

export type VerifyStudents = {
  studentId: string
  name: string
  status?: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<VerifyStudents>[] = [
  {
    accessorKey: "studentId",
    header: "Student ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {row.getValue("studentId")}
      </span>
    ),
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      if (status === "success") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Approved
          </span>
        )
      }
      if (status === "failed") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Rejected
          </span>
        )
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <div className="flex items-center gap-1.5">
        <button
          title="Approve"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
        <button
          title="Reject"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
        <button
          title="View Details"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

const mockData: VerifyStudents[] = [
  { studentId: "728ed52f", name: "Arnel Pineda", status: "pending", email: "arnel@example.com" },
  { studentId: "819fc31a", name: "Maria Santos", status: "success", email: "maria@example.com" },
  { studentId: "931ab24b", name: "Juan Dela Cruz", status: "pending", email: "juan@example.com" },
  { studentId: "614cd89e", name: "Elena Ramos", status: "success", email: "elena@example.com" },
  { studentId: "502ef12d", name: "Bernard Bioco", status: "pending", email: "bernard@example.com" },
]

export default function VerifyStudents() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Verify Students</h2>
        <p className="text-xs text-muted-foreground">
          Approve or reject student verification requests
        </p>
      </div>
      <DataTable columns={columns} data={mockData} filterColumn="studentId" filterPlaceholder="Search by Student Id..." />
    </div>
  )
}
