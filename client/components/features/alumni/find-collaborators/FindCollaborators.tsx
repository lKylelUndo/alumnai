"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Search, Briefcase, ChevronDown, User, ArrowRight } from "lucide-react"

import { CardDataTable } from "@/components/common/tables/CardDataTable"
import CollaboratorCard from "./CollaboratorCard"
import { alumniService } from "@/services/alumni.service"
import { useDebounce } from "@/hooks/useDebounce"
import { aiService } from "@/services/ai.service"
import { Collaborator } from "@/lib/types/collaboration"
import { RecommendedStudent } from "@/lib/types/student"
import { IT_FIELDS } from "@/lib/constants"

export const columns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
]

export default function FindCollaborators() {
  const router = useRouter()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [recommendedStudents, setRecommendedStudents] = useState<RecommendedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedField, setSelectedField] = useState("")
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

  const fieldOptions = useMemo(() => [...IT_FIELDS], [])

  const filteredCollaborators = useMemo(() => {
    return collaborators.filter((collaborator) => {
      const matchesField =
        selectedField === "" || collaborator.work_field === selectedField
      return matchesField
    })
  }, [collaborators, selectedField])

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#131b2e]">Find Student Collaborators</h1>
          <p className="mt-2 text-[#434657] max-w-2xl">
            Discover talented students using AI-powered intelligent search and find the right collaborators for your projects.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* AI Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A4B1CC]" />
            <input
              type="text"
              placeholder="Search by name, skills, or role... (AI-powered)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#131b2e] placeholder:text-[#A4B1CC] focus:outline-none focus:ring-2 focus:ring-[#1A216D]/20 focus:border-[#1A216D]/40 transition-all cursor-text"
            />
          </div>

          {/* Field Dropdown */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A4B1CC] pointer-events-none" />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#1A216D]/20 focus:border-[#1A216D]/40 transition-all cursor-pointer"
            >
              <option value="" disabled hidden>Field / Specialization</option>
              {fieldOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A4B1CC] pointer-events-none" />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-[#434657]">
              {isSearching ? "Searching with AI..." : "Loading collaborators..."}
            </div>
          </div>
        )}

        {/* AI search - no results */}
        {!loading && isSearching && recommendedStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e0e0ff]">
              <Search className="h-8 w-8 text-[#1877F2]/40" />
            </div>
            <p className="text-base font-semibold text-[#131b2e]">
              No matching students found for &quot;{debounceSearchQuery}&quot;
            </p>
          </div>
        )}

        {/* AI search results */}
        {!loading && isSearching && recommendedStudents.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedStudents.map((student) => {
              const rawAbout = (student.bio || "").trim()
              const displayAbout = rawAbout
                ? rawAbout.length > 120
                  ? `${rawAbout.substring(0, 120)}...`
                  : rawAbout
                : "No bio available."
              const skills = student.skills ?? []
              const visibleSkills = skills.slice(0, 3)

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col hover:shadow-md hover:border-[#1A216D]/20 transition-all cursor-pointer"
                  onClick={() => router.push(`/alumni/profile/view/${student.id}`)}
                >
                  {/* Avatar + Name + Position */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#e0e0ff] border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
                      {student.profilePicture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={student.profilePicture}
                          alt={student.name || "Student"}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-[#1877F2]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#131b2e] leading-tight truncate">
                        {student.name || "Student User"}
                      </p>
                      <p className="text-xs font-semibold text-[#1877F2] truncate">
                        Student
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-[#434657] leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {displayAbout}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {visibleSkills.length > 0 ? (
                      visibleSkills.map((skill) => (
                        <span
                          key={skill.name}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            skill.match
                              ? "bg-[#1A216D] text-white"
                              : "bg-[#F1F5F9] text-[#434657]"
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-[#A4B1CC]">No skills listed</span>
                    )}
                  </div>

                  {/* Match score + View Profile */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                    {typeof student.score === "number" ? (
                      <span className="text-xs font-semibold text-[#434657]">
                        {student.score.toFixed(0)}% match
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#1A216D]">
                      View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Default collaborator list */}
        {!loading && !isSearching && filteredCollaborators.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e0e0ff]">
              <Search className="h-8 w-8 text-[#1877F2]/40" />
            </div>
            <p className="text-base font-semibold text-[#131b2e]">
              {collaborators.length === 0
                ? "No student collaborators found at the moment."
                : "No students match your filter."}
            </p>
          </div>
        )}

        {!loading && !isSearching && filteredCollaborators.length > 0 && (
          <CardDataTable
            columns={columns}
            data={filteredCollaborators}
            pageSize={6}
            renderCard={(row) => <CollaboratorCard key={row.id} row={row} />}
          />
        )}
      </main>
    </div>
  )
}
