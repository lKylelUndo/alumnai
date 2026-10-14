"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/common/tables/DataTable"
import { adminService } from "@/services/admin.service"
import { ColumnDef, Row } from "@tanstack/react-table"
import { CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export type VerifyStudents = {
  student_id_number: string
  status?: "pending" | "processing" | "success" | "failed"
  email: string
}

const ActionCell = ({ row, onDone }: { row: Row<VerifyStudents>; onDone: (studentId: string) => void }) => {
  const studentId = row.getValue("student_id_number") as string

  const handleApprove = async () => {
    const response = await adminService.verifyUser(studentId)
    if (response.code === 200) {
      onDone(studentId)
      toast("Student verified successfully")
    } else {
      toast(response.message || "Failed to verify student")
    }
  }

  const handleReject = async () => {
    const response = await adminService.rejectUser(studentId)
    if (response.code === 200) {
      onDone(studentId)
      toast("Student rejected successfully")
    } else {
      toast(response.message || "Failed to reject student")
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

const getColumns = (
  onDone: (studentId: string) => void
): ColumnDef<VerifyStudents>[] => [
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
    cell: ({ row }) => <ActionCell row={row} onDone={onDone} />
  }
]

export default function VerifyStudents({ data: initialData }: { data: VerifyStudents[] }) {
  const [students, setStudents] = useState<VerifyStudents[]>(initialData ?? []);

  const handleDone = useCallback((studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.student_id_number !== studentId))
  }, [])

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setStudents(initialData)
    } else {
      adminService.getUnverifiedUsers()
        .then((res) => {
          if (res?.data?.users) {
            setStudents(res.data.users)
          }
        })
        .catch((err) => console.error("Client fetch unverified users failed:", err))
    }
  }, [initialData])

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Verify Students</h2>
        <p className="text-xs text-muted-foreground">
          Approve or reject student verification requests
        </p>
      </div>
      <DataTable columns={getColumns(handleDone)} data={students} filterColumn="student_id_number" filterPlaceholder="Search by Student Id..." />
    </div>
  )
}