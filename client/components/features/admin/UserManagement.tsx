"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/common/tables/DataTable"
import { ColumnDef, Row } from "@tanstack/react-table"
import { UserCheck, UserX, ArrowUpRight, RefreshCw, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminService } from "@/services/admin.service"
import { useRouter } from "next/navigation"
import { useAdminSocket } from "@/hooks/useAdminSocket"
import { toast } from "sonner"

export type UserManagement = {
  id: string
  user: string
  status?: "Active" | "Inactive" | "Suspended"
  email: string
  role: "Student" | "Alumni"
}

const ActionCell = ({ row }: { row: Row<UserManagement> }) => {
  const router = useRouter()
  const id = row.original.id

  const handleActivate = async () => {
    const response = await adminService.activateUser(id)
    if (response.code === 200) {
      router.refresh()
      toast("User activated successfully")
    } else {
      toast(response.message || "Failed to activate user")
    }
  }

  const handleSuspend = async () => {
    const response = await adminService.suspendUser(id)
    if (response.code === 200) {
      router.refresh()
      toast("User suspended successfully")
    } else {
      toast(response.message || "Failed to suspend user")
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-1.5">
      <button
        type="button"
        onClick={handleActivate}
        title="Activate User"
        aria-label="Activate this user"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white sm:h-7 sm:w-7"
      >
        <UserCheck className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleSuspend}
        title="Suspend User"
        aria-label="Suspend this user"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 transition-colors hover:bg-rose-500 hover:text-white sm:h-7 sm:w-7"
      >
        <UserX className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="View Profile"
        aria-label="View this user profile"
        onClick={() => router.push(`/admin/view-user-profile/${id}`)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white sm:h-7 sm:w-7"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export const columns: ColumnDef<UserManagement>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-foreground">
        {row.getValue("user")}
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
        {row.getValue("role")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      if (status === "Active") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
          </span>
        )
      }
      if (status === "Suspended") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Suspended
          </span>
        )
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Inactive
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

export default function UserManagement({
  data: initialData,
}: {
  data: UserManagement[]
}) {
  const [users, setUsers] = useState<UserManagement[]>(initialData ?? [])
  const [prevInitialData, setPrevInitialData] = useState(initialData)

  const refetchUsers = useCallback(() => {
    adminService
      .getAllUsers()
      .then((res) => {
        if (res?.data?.users) setUsers(res.data.users)
      })
      .catch((err) => console.error("Refetch users failed:", err))
  }, [])

  // Listen for realtime updates
  useAdminSocket({ target: "all-users", onRefresh: refetchUsers })

  // Sync fresh server data without cascading renders
  if (prevInitialData !== initialData) {
    setPrevInitialData(initialData)
    if (initialData && initialData.length > 0) {
      setUsers(initialData)
    }
  }

  // Fall back to a client fetch when SSR provided nothing (e.g. no
  // backend-domain cookies on the frontend server in production)
  useEffect(() => {
    if (users.length === 0) {
      refetchUsers()
    }
  }, [users.length, refetchUsers])

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">
              User Management
            </h2>
            <p className="text-sm text-muted-foreground">
              Review and manage user accounts and roles
            </p>
          </div>
        </div>

        <Button
          onClick={refetchUsers}
          className="h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 font-medium shadow-sm transition-all sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        filterColumn="user"
        filterPlaceholder="Search by user..."
        statusFilterColumn="status"
        statusOptions={["Active", "Inactive", "Suspended"]}
      />
    </div>
  )
}
