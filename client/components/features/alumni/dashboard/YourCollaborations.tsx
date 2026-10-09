"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCollaborationCardTypes } from "@/lib/types/collaboration"
import CollaborationCard from "./CollaborationCard"

import { useState, useEffect, useCallback } from "react"
import { useAlumniSocket } from "@/hooks/useAlumniSocket"
import { alumniService } from "@/services/alumni.service"

export const columns: ColumnDef<AlumniStudentCollaborationCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourCollaborations = ({ collaborations: initialCollaborations }: { collaborations: AlumniStudentCollaborationCardTypes[] }) => {
  const [collaborations, setCollaborations] = useState<AlumniStudentCollaborationCardTypes[]>(initialCollaborations ?? [])
  const [prevInitialCollaborations, setPrevInitialCollaborations] = useState(initialCollaborations)

  const refetchCollaborations = useCallback(() => {
    alumniService.getMyCollaborations()
      .then((res) => {
        if (Array.isArray(res?.data)) setCollaborations(res.data)
      })
      .catch((err) => console.error("Refetch collaborations failed:", err))
  }, [])

  const removeItem = useCallback((id: string) => {
    setCollaborations((prev) => prev.filter((item) => item.collaborationId !== id))
  }, [])

  useAlumniSocket({
    target: "your-collaborations",
    onRefresh: () => {
      refetchCollaborations()
    },
  })

  if (prevInitialCollaborations !== initialCollaborations) {
    setPrevInitialCollaborations(initialCollaborations)
    if (initialCollaborations) setCollaborations(initialCollaborations)
  }

  useEffect(() => {
    if (collaborations.length === 0) refetchCollaborations()
  }, [collaborations.length, refetchCollaborations])
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
        renderCard={(row) => <CollaborationCard key={row.id} row={row} onRemoved={removeItem} />}
      />
    </div>
  )
}

export default YourCollaborations
