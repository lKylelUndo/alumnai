"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, User } from "lucide-react"

import { CardDataTable } from "@/components/common/tables/CardDataTable"
import CollaboratorCard from "./CollaboratorCard"
import { alumniService } from "@/services/alumni.service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  profilePicture?: string | null
  skills: {
    name: string
    level: number
    description: string
    match: boolean
  }[]
  score: number
  contextScore?: number
  reason: string
}

export const columns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
]

export default function FindCollaborators() {
  const router = useRouter()
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
          No matching students found for &quot;{debounceSearchQuery}&quot;.
        </div>
      )}

      {!loading && isSearching && recommendedStudents.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedStudents.map((student) => {
            const rawAbout = (student.bio || "").trim()
            const displayAbout = rawAbout
              ? rawAbout.length > 50
                ? `${rawAbout.substring(0, 50)}...`
                : rawAbout
              : "No bio available."
            const skills = student.skills ?? []
            const visibleSkills = skills.slice(0, 2)

            return (
              <div
                key={student.id}
                className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10 flex flex-col justify-between"
              >
                {/* Hover accent top line */}
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl duration-300 group-hover:opacity-100" />

                <div>
                  <div className="flex items-start justify-between">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
                        {student.profilePicture ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={student.profilePicture}
                            alt={student.name || "Student User"}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-base font-bold text-[#1A216D]/60">
                            <User className="h-6 w-6" />
                          </span>
                        )}
                      </div>

                      {/* Name / About */}
                      <div>
                        <p className="text-sm leading-tight font-bold text-[#1A216D]">
                          {student.name || "Student User"}
                        </p>
                        <p className="mt-0.5 pr-3 text-xs font-semibold text-justify text-[#4F5EBD]">
                          {displayAbout}
                        </p>
                      </div>
                    </div>

                    {/* View Button */}
                    <Button
                      id={`view-collaborator-${student.id}`}
                      variant={"default"}
                      className="rounded-full"
                      onClick={() =>
                        router.push(`/alumni/profile/view/${student.id}`)
                      }
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {visibleSkills.length > 0 ? (
                      visibleSkills.map((skill) => (
                        <span
                          key={skill.name}
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            skill.match
                              ? "border-[#1A216D] bg-[#1A216D] text-white"
                              : "border-[#E2E6F3] bg-[#F5F6FC] text-[#1A216D]"
                          }`}
                        >
                          {skill.name} ({skill.level}/5)
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-[#E2E6F3]/60 bg-[#F5F6FC]/60 px-2.5 py-0.5 text-[11px] italic text-gray-400">
                        No skills listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Score & Reason */}
                {(typeof student.score === "number" || student.reason) && (
                  <div className="mt-3 pt-2.5 border-t border-[#F5F6FC] flex items-center justify-between gap-2 text-xs">
                    {typeof student.score === "number" && (
                      <span className="inline-flex items-center rounded-full bg-[#EEF0FB] px-2 py-0.5 text-[11px] font-bold text-[#1A216D]">
                        {student.score.toFixed(0)}% match
                      </span>
                    )}
                    {student.reason && (
                      <p className="text-[11px] text-muted-foreground truncate flex-1 text-right">
                        {student.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
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
