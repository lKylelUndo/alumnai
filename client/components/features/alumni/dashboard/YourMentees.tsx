"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCard } from "@/constants/alumni"
import MenteeCard from "./MenteeCard"

export const columns: ColumnDef<AlumniStudentCard>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourMentees = ({ mentees }: { mentees: any }) => {
  console.log("yourmenteescmp",mentees)
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Mentees</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;re currently mentoring
        </p>
      </div>

      <CardDataTable
        emptyMessage={"No mentees yet"}
          columns={columns}
          data={mentees}
          pageSize={9}
          renderCard={(row) => (
            <MenteeCard key={row.id} row={row} />
          )}
        />
    </div>
  )
}

export default YourMentees