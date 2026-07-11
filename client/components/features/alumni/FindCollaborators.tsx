"use client"

import { useEffect, useRef, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { CardDataTable } from "@/components/common/CardDataTable"
import CollaboratorCard from "./CollaboratorCard"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"

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
  const [query, setQuery] = useState("")

  const debouncedQuery = useDebounce(query, 600)

  const [loading, setLoading] = useState(false)

  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    console.log("debounced query:", debouncedQuery)

    if (!debouncedQuery.trim()) {
      setCollaborators([])
      return
    }

    const search = async () => {
      controllerRef.current?.abort()

      const controller = new AbortController()

      controllerRef.current = controller

      try {
        setLoading(true)

        // const response = await fetch(
        //   "http://localhost:8000/api/v1/ai/smart-search",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       rawSearch: debouncedQuery,
        //     }),
        //     signal: controller.signal,
        //   }
        // )

        // if (!response.ok) {
        //   throw new Error("Search failed")
        // }

        // const result = await response.json()

        // setCollaborators(result.recommendedStudents);

        setCollaborators([
          {
            id: "1",
            name: "Maria Santos",
            bio: "Frontend Developer",
            score: 90,
            reason: "Strong React experience",
            skills: [
              {
                name: "React",
                level: 5,
                description: "Built multiple React applications",
              },
            ],
          },
        ])
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error(error)
        }
      } finally {
        setLoading(false)
      }
    }

    search()

    return () => controllerRef.current?.abort()
  }, [debouncedQuery])

  return (
    <div className="py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#1A216D]">
          Find Student Collaborators
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Discover talented students using AI-powered intelligent search.
        </p>
      </div>

      <div className="mb-8">
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
      )}

      <CardDataTable
        columns={columns}
        data={collaborators}
        pageSize={9}
        renderCard={(row) => <CollaboratorCard key={row.id} row={row} />}
      />
    </div>
  )
}
