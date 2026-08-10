"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { CardDataTable } from "@/components/common/CardDataTable"
import CollaboratorCard from "./CollaboratorCard"
import { alumniService } from "@/services/alumni.service"

export type Collaborator = {
  id: string
  name: string
  aboutMe: string
  profilePicture: string | null
  alreadyInvited: boolean

  skills: {
    name: string
    level: number
    description: string
  }[]
}

export const columns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
]

export default function FindCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setLoading(true)
        const response = await alumniService.findCollaborators()

        if (response.status === "success") {
          setCollaborators(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch collaborators", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborators()
  }, [])

  return (
    <div className="py-2">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#1A216D]">
          Find Student Collaborators
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Discover talented students using AI-powered intelligent search.
        </p>
      </div>

      {loading && (
        <div className="mb-5 text-sm text-muted-foreground">
          Loading collaborators...
        </div>
      )}

      {!loading && collaborators.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No student collaborators found at the moment.
        </div>
      )}

      {!loading && collaborators.length > 0 && (
        <CardDataTable
          columns={columns}
          data={collaborators}
          pageSize={6}
          renderCard={(row) => <CollaboratorCard key={row.id} row={row} />}
        />
      )}
    </div>
  )
}
