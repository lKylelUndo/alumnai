"use client"

import { DataTable } from "@/components/common/tables/DataTable"
import { adminService } from "@/services/admin.service"
import { ColumnDef, Row } from "@tanstack/react-table"
import { CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export type VerifyStudents = {
  student_id_number: string
  status?: "pending" | "processing" | "success" | "failed"
  email: string
}

const ActionCell = ({ row }: { row: Row<VerifyStudents> }) => {
  const router = useRouter()
  const studentId = row.getValue("student_id_number") as string

  const handleApprove = async () => {
    const response = await adminService.verifyUser(studentId)
    if (response.code === 200) {
      alert("Student verified successfully")
      router.refresh()
    } else {
      console.error(response.message || "Failed to verify student")
    }
  }

  const handleReject = async () => {
    const response = await adminService.rejectUser(studentId)
    if (response.code === 200) {
      alert("Student rejected successfully")
      router.refresh()
    } else {
      console.error(response.message || "Failed to reject student")
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleApprove}
        title="Approve Alumni Status"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
      <button
        onClick={handleReject}
        title="Decline Request"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  )
}

export const columns: ColumnDef<VerifyStudents>[] = [
  {
    accessorKey: "student_id_number",
    header: "Student ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {row.getValue("student_id_number")}
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
    cell: ({ row }) => <ActionCell row={row} />
  }
]

export default function VerifyStudents({ data }: { data: VerifyStudents[] }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Verify Students</h2>
        <p className="text-xs text-muted-foreground">
          Approve or reject student verification requests
        </p>
      </div>
      <DataTable columns={columns} data={data} filterColumn="student_id_number" filterPlaceholder="Search by Student Id..." />
    </div>
  )
}
