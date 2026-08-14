"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCardTypes } from "@/constants/alumni"
import MenteeCard from "./MenteeCard"

export const columns: ColumnDef<AlumniStudentCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourMentees = ({ mentees }: { mentees: AlumniStudentCardTypes[] }) => {
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