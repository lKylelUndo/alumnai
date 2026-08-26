"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCollaborationCardTypes } from "@/lib/types/collaboration"
import CollaborationCard from "./CollaborationCard"

import { useRouter } from "next/navigation"
import { useAlumniSocket } from "@/hooks/useAlumniSocket"
import { toast } from "sonner"

export const columns: ColumnDef<AlumniStudentCollaborationCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourCollaborations = ({ collaborations }: { collaborations: AlumniStudentCollaborationCardTypes[] }) => {
  const router = useRouter()

  useAlumniSocket({
    target: "your-collaborations",
    onRefresh: (data) => {
      if (data?.message) {
        toast.info(data.message)
      } else {
        toast.info("Your collaboration status has been updated.")
      }
      router.refresh()
    },
  })
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
