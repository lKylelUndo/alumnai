import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"

export type UserManagement = {
  user: string
  status?: "Active" | "Inactive" | "Suspended"
  email: string
  role: "Student" | "Alumni"
}

export const columns: ColumnDef<UserManagement>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

async function getData(): Promise<UserManagement[]> {
  // Fetch data from your API here.
  return [
    {
      user: "Bernard Bioco",
      role: "Student",
      email: "m@example.com",
      status: "Active",
    },
    // ...
  ]
}

const ManagerUsers = async () => {
  const data = await getData()
  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">User Management</h2>
        <p className="text-xs text-muted-foreground">
          Review and manage user accounts and roles
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default ManagerUsers
