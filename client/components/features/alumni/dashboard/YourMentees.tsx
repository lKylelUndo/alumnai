"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentMentorshipCardTypes } from "@/lib/types/mentorship"
import MenteeCard from "./MenteeCard"

import { useState, useEffect, useCallback } from "react"
import { useAlumniSocket } from "@/hooks/useAlumniSocket"
import { mentorshipService } from "@/services/mentorship.service"
import { toast } from "sonner"

export const columns: ColumnDef<AlumniStudentMentorshipCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourMentees = ({ mentees: initialMentees }: { mentees: AlumniStudentMentorshipCardTypes[] }) => {
  const [mentees, setMentees] = useState<AlumniStudentMentorshipCardTypes[]>(initialMentees ?? [])
  const [prevInitialMentees, setPrevInitialMentees] = useState(initialMentees)

  const refetchMentees = useCallback(() => {
    mentorshipService.getMyMentees()
      .then((res) => {
        if (Array.isArray(res?.data)) setMentees(res.data)
      })
      .catch((err) => console.error("Refetch mentees failed:", err))
  }, [])

  const removeItem = useCallback((id: string) => {
    setMentees((prev) => prev.filter((item) => item.mentorshipRecordId !== id))
  }, [])

  useAlumniSocket({
    target: "your-mentees",
    onRefresh: (data) => {
      if (data?.message) toast.info(data.message)
      refetchMentees()
    },
  })

  if (prevInitialMentees !== initialMentees) {
    setPrevInitialMentees(initialMentees)
    if (initialMentees) setMentees(initialMentees)
  }

  useEffect(() => {
    if (mentees.length === 0) refetchMentees()
  }, [mentees.length, refetchMentees])
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Mentees</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;re currently mentoring
        </p>
      </div>

      <CardDataTable
        emptyMessage={"No mentees yet"}
          columns={columns}
          data={mentees}
          pageSize={9}
          renderCard={(row) => (
            <MenteeCard key={row.id} row={row} onRemoved={removeItem} />
          )}
        />
    </div>
  )
}

export default YourMentees