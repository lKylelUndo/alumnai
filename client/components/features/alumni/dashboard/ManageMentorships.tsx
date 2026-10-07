"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import MentorshipRequestCard from "./MentorshipRequestCard"
import { AlumniStudentMentorshipCardTypes } from "@/lib/types/mentorship"

import { useState, useEffect, useCallback } from "react"
import { useAlumniSocket } from "@/hooks/useAlumniSocket"
import { mentorshipService } from "@/services/mentorship.service"
import { toast } from "sonner"

export const columns: ColumnDef<AlumniStudentMentorshipCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const ManageMentorships = ({ requests: initialRequests }: { requests: AlumniStudentMentorshipCardTypes[] }) => {
  const [requests, setRequests] = useState<AlumniStudentMentorshipCardTypes[]>(initialRequests ?? [])
  const [prevInitialRequests, setPrevInitialRequests] = useState(initialRequests)

  const refetchRequests = useCallback(() => {
    mentorshipService.getMentorshipRequests()
      .then((res) => {
        if (Array.isArray(res?.data)) setRequests(res.data)
      })
      .catch((err) => console.error("Refetch mentorship requests failed:", err))
  }, [])

  const removeItem = useCallback((id: string) => {
    setRequests((prev) => prev.filter((item) => item.mentorshipRecordId !== id))
  }, [])

  useAlumniSocket({
    target: "manage-mentorships",
    onRefresh: (data) => {
      if (data?.message) toast.info(data.message)
      refetchRequests()
    },
  })

  if (prevInitialRequests !== initialRequests) {
    setPrevInitialRequests(initialRequests)
    if (initialRequests) setRequests(initialRequests)
  }

  useEffect(() => {
    if (requests.length === 0) refetchRequests()
  }, [requests.length, refetchRequests])
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">
          Manage Mentorship Request
        </h2>
        <p className="text-xs text-muted-foreground">
          Students who are requesting for your mentorship
        </p>
      </div>

      <CardDataTable
        emptyMessage="No pending mentorship requests at the moment."
        columns={columns}
        data={requests}
        pageSize={9}
        renderCard={(row) => <MentorshipRequestCard key={row.id} row={row} onRemoved={removeItem} />}
      />
    </div>
  )
}

export default ManageMentorships
