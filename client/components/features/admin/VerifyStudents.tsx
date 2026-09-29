"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/common/tables/DataTable"
import { adminService } from "@/services/admin.service"
import { ColumnDef, Row } from "@tanstack/react-table"
import { CheckCircle2, RefreshCw, UserCheck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminSocket } from "@/hooks/useAdminSocket"
import { toast } from "sonner"

export type VerifyStudents = {
  student_id_number: string
  status?: "pending" | "processing" | "success" | "failed"
  email: string
}

const ActionCell = ({ row }: { row: Row<VerifyStudents> }) => {
  const studentId = row.getValue("student_id_number") as string

  const handleApprove = async () => {
    const response = await adminService.verifyUser(studentId)
    if (response.code === 200) {
      toast("Student verified successfully")
    } else {
      toast(response.message || "Failed to verify student")
    }
  }

  const handleReject = async () => {
    const response = await adminService.rejectUser(studentId)
    if (response.code === 200) {
      toast("Student rejected successfully")
    } else {
      toast(response.message || "Failed to reject student")
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-1.5">
      <button
        type="button"
        onClick={handleApprove}
        title="Approve Alumni Status"
        aria-label="Approve this student"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white sm:h-7 sm:w-7"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleReject}
        title="Decline Request"
        aria-label="Decline this request"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 transition-colors hover:bg-rose-500 hover:text-white sm:h-7 sm:w-7"
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
      <span className="text-xs text-muted-foreground">
        {row.getValue("email")}
      </span>
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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
            Approved
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

export default function VerifyStudents({
  data: initialData,
}: {
  data: VerifyStudents[]
}) {
  const [students, setStudents] = useState<VerifyStudents[]>(initialData ?? [])

  const refetchStudents = useCallback(() => {
    adminService
      .getUnverifiedUsers()
      .then((res) => {
        if (res?.data?.users) setStudents(res.data.users)
      })
      .catch((err) => console.error("Refetch unverified users failed:", err))
  }, [])

  // Listen for realtime updates
  useAdminSocket({ target: "unverified-users", onRefresh: refetchStudents })

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setStudents(initialData)
    } else {
      adminService
        .getUnverifiedUsers()
        .then((res) => {
          if (res?.data?.users) {
            setStudents(res.data.users)
          }
        })
        .catch((err) =>
          console.error("Client fetch unverified users failed:", err)
        )
    }
  }, [initialData])

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">
              Verify Students
            </h2>
            <p className="text-sm text-muted-foreground">
              Approve or reject student verification requests
            </p>
          </div>
        </div>

        <Button
          onClick={refetchStudents}
          className="h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 font-medium shadow-sm transition-all sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={students}
        filterColumn="student_id_number"
        filterPlaceholder="Search by Student Id..."
      />
    </div>
  )
}
