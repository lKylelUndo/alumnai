"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/common/DataTable"
import { FileText, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react"

export type AlumniRequest = {
  studentId: string
  name: string
  status?: "pending" | "processing" | "success" | "failed"
  email: string
  documents: string
}

export const columns: ColumnDef<AlumniRequest>[] = [
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
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer hover:underline">
        <FileText className="h-4 w-4" />
        <span>{row.getValue("documents")}</span>
      </div>
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
          title="Approve Alumni Status"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
        <button
          title="Decline Request"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
        <button
          title="Inspect Documents"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

const mockData: AlumniRequest[] = [
  {
    studentId: "728ed52f",
    name: "Arnel Pineda",
    status: "pending",
    documents: "Diploma_Verification.pdf",
    email: "arnel@example.com",
  },
  {
    studentId: "819fc31a",
    name: "Maria Santos",
    status: "success",
    documents: "Graduation_Cert.pdf",
    email: "maria@example.com",
  },
]

export default function AlumniRequest() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Alumni Status Request</h2>
        <p className="text-xs text-muted-foreground">
          Review and approve alumni status upgrade requests
        </p>
      </div>
      <DataTable columns={columns} data={mockData} filterColumn="studentId" filterPlaceholder="Search by Student Id..." />
    </div>
  )
}
