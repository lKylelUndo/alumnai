"use client"

import { DataTable } from "@/components/common/DataTable"
import { ColumnDef, Row } from "@tanstack/react-table"
import { UserCheck, UserX, ArrowUpRight } from "lucide-react"
import { adminService } from "@/services/admin.service"
import { useRouter } from "next/navigation"

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
      alert("User activated successfully")
      router.refresh()
    } else {
      console.error(response.message || "Failed to activate user")
    }
  }

  const handleSuspend = async () => {
    const response = await adminService.suspendUser(id)
    if (response.code === 200) {
      alert("User suspended successfully")
      router.refresh()
    } else {
      console.error(response.message || "Failed to suspend user")
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleActivate}
        title="Activate User"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
      >
        <UserCheck className="h-4 w-4" />
      </button>
      <button
        onClick={handleSuspend}
        title="Suspend User"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
      >
        <UserX className="h-4 w-4" />
      </button>
      <button
        title="View Details"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors"
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
      <span className="font-semibold text-foreground text-sm">
        {row.getValue("user")}
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

export default function UserManagement({ data }: { data: UserManagement[] }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">User Management</h2>
        <p className="text-xs text-muted-foreground">
          Review and manage user accounts and roles
        </p>
      </div>
      <DataTable columns={columns} data={data} filterColumn="user" filterPlaceholder="Search by user..." />
    </div>
  )
}
