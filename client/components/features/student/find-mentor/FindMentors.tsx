"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { CardDataTable } from "@/components/common/tables/CardDataTable"
import MentorCard from "./MentorCard"
import { studentService } from "@/services/student.service"

export type Mentor = {
  id: string
  name: string
  aboutMe: string
  profilePicture: string | null
  alreadyInvited: boolean
  work_field?: string | null
  companyName?: string | null
  current_position?: string | null

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

  return (
    <div className="py-2">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#1A216D]">
          Find Alumni Mentors
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Discover and connect with experienced alumni in your field.
        </p>
      </div>

      {loading && (
        <div className="mb-5 text-sm text-muted-foreground">
          Loading mentors...
        </div>
      )}

      {!loading && mentors.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No alumni mentors found at the moment.
        </div>
      )}

      {!loading && mentors.length > 0 && (
        <CardDataTable
          columns={columns}
          data={mentors}
          pageSize={6}
          renderCard={(row) => <MentorCard key={row.id} row={row} />}
        />
      )}
    </div>
  )
}
