"use client"

import { useEffect, useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Search, Briefcase, ChevronDown } from "lucide-react"

import { CardDataTable } from "@/components/common/tables/CardDataTable"
import MentorCard from "./MentorCard"
import { studentService } from "@/services/student.service"
import { IT_FIELDS } from "@/lib/constants"

export type Mentor = {
  id: string
  name: string
  aboutMe: string
  profilePicture: string | null
  alreadyInvited: boolean
  work_field?: string | null
  companyName?: string | null
  current_position?: string | null
  recognitionCount: number
  skills: {
    name: string
    level: number
    description: string
  }[]
}

export const columns: ColumnDef<Mentor>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
]

export default function FindMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedField, setSelectedField] = useState("")

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true)
        const response = await studentService.findMentors()
        if (response.status === "success") {
          setMentors(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch mentors", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMentors()
  }, [])

  const fieldOptions = useMemo(() => [...IT_FIELDS], [])

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesSearch =
        !searchQuery ||
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.current_position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.companyName?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesField =
        selectedField === "" || mentor.work_field === selectedField

      return matchesSearch && matchesField
    })
  }, [mentors, searchQuery, selectedField])

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#131b2e]">Find Alumni Mentors</h1>
          <p className="mt-2 text-[#434657] max-w-2xl">
            Discover and connect with experienced alumni who can guide your career path and share valuable industry insights.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A4B1CC]" />
            <input
              type="text"
              placeholder="Search by name, company, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#131b2e] placeholder:text-[#A4B1CC] focus:outline-none focus:ring-2 focus:ring-[#1A216D]/20 focus:border-[#1A216D]/40 transition-all cursor-text"
            />
          </div>

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
            <div className="text-sm text-[#434657]">Loading mentors...</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredMentors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e0e0ff]">
              <Search className="h-8 w-8 text-[#1877F2]/40" />
            </div>
            <p className="text-base font-semibold text-[#131b2e]">
              {mentors.length === 0
                ? "No alumni mentors found at the moment."
                : "No mentors match your search."}
            </p>
          </div>
        )}

        {/* Card Grid with CardDataTable pagination */}
        {!loading && filteredMentors.length > 0 && (
          <CardDataTable
            columns={columns}
            data={filteredMentors}
            pageSize={6}
            renderCard={(row) => <MentorCard key={row.original.id} row={row} />}
          />
        )}
      </main>
    </div>
  )
}
