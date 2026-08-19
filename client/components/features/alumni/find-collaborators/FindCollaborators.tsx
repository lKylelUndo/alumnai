"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { CardDataTable } from "@/components/common/tables/CardDataTable"
import CollaboratorCard from "./CollaboratorCard"
import { alumniService } from "@/services/alumni.service"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { aiService } from "@/services/ai.service"

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

// Shape returned by the AI smart search endpoint
export type RecommendedStudent = {
  id: string
  name: string
  bio: string
  skills: {
    name: string
    level: number
    description: string
    match: boolean
  }[]
  score: number
  contextScore: number
  reason: string
}

export const columns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
]

export default function FindCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [recommendedStudents, setRecommendedStudents] = useState<
    RecommendedStudent[]
  >([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debounceSearchQuery = useDebounce(searchQuery, 2000)
  const isSearching = debounceSearchQuery.trim().length > 0


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

  useEffect(() => {
    if (!isSearching) {
      setRecommendedStudents([])
      return
    }

    const intelligentSearch = async () => {
      try {
        setLoading(true)
        const response = await aiService.smartSearch(debounceSearchQuery)

        if (response.status === "success") {
          setRecommendedStudents(response.recommendedStudents)
        }
      } catch (error) {
        console.error("Failed to fetch AI recommendations", error)
      } finally {
        setLoading(false)
      }
    }

    intelligentSearch()
  }, [debounceSearchQuery, isSearching])

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

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

      <div className="my-4">
        <Input
          type="text"
          placeholder="Input your desired talent e.g 'Looking for a student who knows Laravel'"
          value={searchQuery}
          onChange={handleSearchQuery}
        />
      </div>

      {loading && (
        <div className="mb-5 text-sm text-muted-foreground">
          {isSearching ? "Searching with AI..." : "Loading collaborators..."}
        </div>
      )}

      {/* AI search results */}
      {!loading && isSearching && recommendedStudents.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No matching students found for "{debounceSearchQuery}".
        </div>
      )}

      {!loading && isSearching && recommendedStudents.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedStudents.map((student) => (
            <div key={student.id} className="rounded-lg border p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1A216D]">{student.name}</h3>
                <span className="rounded-full bg-[#1A216D]/10 px-2 py-0.5 text-xs font-medium text-[#1A216D]">
                  {student.score.toFixed(1)}% match
                </span>
              </div>

              {student.bio && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {student.bio}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1">
                {student.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      skill.match
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {skill.name} · Lv {skill.level}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {student.reason}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Default collaborator list (only shown when not searching) */}
      {!loading && !isSearching && collaborators.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No student collaborators found at the moment.
        </div>
      )}

      {!loading && !isSearching && collaborators.length > 0 && (
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
