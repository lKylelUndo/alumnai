"use client"

import { useEffect, useRef, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { CardDataTable } from "@/components/common/CardDataTable"
import CollaboratorCard from "./CollaboratorCard"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { MOCK_COLLABORATORS } from "@/constants/collaborators"

export type Collaborator = {
  id: string
  name: string
  bio: string
  score: number
  reason: string
  profilePicture?: string | null

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
  // const [query, setQuery] = useState("")

  // const debouncedQuery = useDebounce(query, 600)

  // const [loading, setLoading] = useState(false)

  const [collaborators, setCollaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS)

  //const controllerRef = useRef<AbortController | null>(null)

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

      {/* <div className="mb-8">
        <Input
          placeholder='Try: "Looking for someone who knows React, Docker and PostgreSQL"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="mb-5 text-sm text-muted-foreground">
          Searching collaborators...
        </div>
      )} */}

      <CardDataTable
        columns={columns}
        data={collaborators}
        pageSize={6}
        renderCard={(row) => <CollaboratorCard key={row.id} row={row} />}
      />
    </div>
  )
}
