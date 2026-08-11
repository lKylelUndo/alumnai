"use client"

import { useEffect, useState } from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { UserCircle2, XCircle } from "lucide-react"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCard } from "@/constants/alumni"
import { alumniService } from "@/services/alumni.service"
import { collaborationService } from "@/services/collaboration.service"
import { useRouter } from "next/navigation"
import CollaborationCard from "./CollaborationCard"
import Spinner from "@/components/common/layout/Spinner"

export const columns: ColumnDef<AlumniStudentCard>[] = [
  { accessorKey: "name", header: "Name" },
]


const YourCollaborations = () => {
  const [collaborations, setCollaborations] = useState<AlumniStudentCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        setLoading(true)
        const response = await alumniService.getMyCollaborations()

        if (response.status === "success") {
          setCollaborations(response.data ?? [])
        }
      } catch (error) {
        console.error("Failed to fetch collaborations", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborations()
  }, [])

  const handleEnded = (recordId: string) => {
    setCollaborations((prev) =>
      prev.filter((collab) => collab.recordId !== recordId),
    )
  }

  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Collaborations</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;re collaborating with
        </p>
      </div>

      {loading && (
        <Spinner content="Loading collaborations..." />
      )}

      {!loading && collaborations.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No active collaborations at the moment.
        </div>
      )}

      {!loading && collaborations.length > 0 && (
        <CardDataTable
          columns={columns}
          data={collaborations}
          pageSize={9}
          renderCard={(row) => (
            <CollaborationCard key={row.id} row={row} onEnded={handleEnded} />
          )}
        />
      )}
    </div>
  )
}

export default YourCollaborations