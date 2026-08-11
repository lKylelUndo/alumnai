"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCardTypes } from "@/constants/alumni"
import MentorshipRequestCard from "./MentorshipRequestCard"

export const columns: ColumnDef<AlumniStudentCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const ManageMentorships = ({ requests }: { requests: any }) => {
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">
          Manage Mentorship Request
        </h2>
        <p className="text-xs text-muted-foreground">
          Students who are requesting for your mentorship
        </p>
      </div>

      <CardDataTable
        emptyMessage="No pending mentorship requests at the moment."
        columns={columns}
        data={requests}
        pageSize={9}
        renderCard={(row) => <MentorshipRequestCard key={row.id} row={row} />}
      />
    </div>
  )
}

export default ManageMentorships
