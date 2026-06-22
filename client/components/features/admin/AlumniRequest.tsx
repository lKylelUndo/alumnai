import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"

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
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "documents",
    header: "Documents",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

async function getData(): Promise<AlumniRequest[]> {
  // Fetch data from your API here.
  return [
    {
      studentId: "728ed52f",
      name: "Arnel Pineda",
      status: "pending",
      documents: "asdasdasdasd",
      email: "m@example.com",
    },
    // ...
  ]
}

const AlumniRequest = async () => {
  const data = await getData()
  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">
          Alumni Status Request
        </h2>
        <p className="text-xs text-muted-foreground">
          Alumni Status Request Verification Review and approve alumni status
          upgrade requests
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default AlumniRequest
