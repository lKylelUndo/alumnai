"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { DataTable } from "@/components/common/DataTable"
import { FileText, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react"
import { adminService } from "@/services/admin.service"
import { useRouter } from "next/navigation"

export type AlumniRequest = {
  studentId: string
  name: string
  status?:
    | "pending"
    | "processing"
    | "success"
    | "approved"
    | "rejected"
    | "failed"
  email: string
  documents: string
}

const ActionCell = ({ row }: { row: Row<AlumniRequest> }) => {
  const router = useRouter()
  const studentId = row.getValue("studentId") as string

  const handleApprove = async () => {
    const response = await adminService.approveAlumniRequest(studentId)
    if (response.code === 200) {
      alert("Alumni request approved successfully")
      router.refresh()
    } else {
      console.error(response.message || "Failed to approve alumni request")
    }
  }

  const handleReject = async () => {
    const response = await adminService.rejectAlumniRequest(studentId)
    if (response.code === 200) {
      alert("Alumni request rejected")
      router.refresh()
    } else {
      console.error(response.message || "Failed to reject alumni request")
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleApprove}
        title="Approve Alumni Status"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
      <button
        onClick={handleReject}
        title="Decline Request"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 transition-colors hover:bg-rose-500 hover:text-white"
      >
        <XCircle className="h-4 w-4" />
      </button>
      <button
        title="Inspect Documents"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  )
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
      <span className="text-sm font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => (
      <div className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline">
        <FileText className="h-4 w-4" />
        <span>{row.getValue("documents")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string)?.toLowerCase()
      if (status === "success" || status === "approved") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
            Approved
          </span>
        )
      }
      if (status === "rejected" || status === "failed") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Rejected
          </span>
        )
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />{" "}
          Pending
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  },
]

export default function AlumniRequest({ data }: { data: AlumniRequest[] }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">
          Alumni Status Request
        </h2>
        <p className="text-xs text-muted-foreground">
          Review and approve alumni status upgrade requests
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        filterColumn="studentId"
        filterPlaceholder="Search by Student Id..."
      />
    </div>
  )
}
