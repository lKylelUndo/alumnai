import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"

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
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

async function getData(): Promise<VerifyStudents[]> {
  // Fetch data from your API here.
  return [
    {
      studentId: "728ed52f",
      name: "Arnel Pineda",
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

const VerifyStudents = async () => {
  const data = await getData()
  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Verify Students</h2>
        <p className="text-xs text-muted-foreground">
          Approve or reject student verification requests
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default VerifyStudents
