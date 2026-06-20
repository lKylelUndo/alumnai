import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"

export type TopMentors = {
  ranking: string | number
  name: string
  mentees: string | number
}

export const columns: ColumnDef<TopMentors>[] = [
  {
    accessorKey: "ranking",
    header: "Ranking",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "mentees",
    header: "Mentees",
  },
]

async function getData(): Promise<TopMentors[]> {
  // Fetch data from your API here.
  return [
    {
      ranking: 1,
      name: "Arnel Pineda",
      mentees: 10,
    },
    // ...
  ]
}

const TopMentors = async () => {
  const data = await getData()
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default TopMentors
