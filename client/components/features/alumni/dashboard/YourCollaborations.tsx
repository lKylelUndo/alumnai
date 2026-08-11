"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCard } from "@/constants/alumni"
import CollaborationCard from "./CollaborationCard"

export const columns: ColumnDef<AlumniStudentCard>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourCollaborations = ({ collaborations }: { collaborations: any }) => {
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Collaborations</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;re collaborating with
        </p>
      </div>

      <CardDataTable
        emptyMessage="No collaborations yet."
        columns={columns}
        data={collaborations}
        pageSize={9}
        renderCard={(row) => <CollaborationCard key={row.id} row={row} />}
      />
    </div>
  )
}

export default YourCollaborations
