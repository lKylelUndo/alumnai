"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCard } from "@/constants/alumni"
import { alumniService } from "@/services/alumni.service"
import MentorshipRequestCard from "./MentorshipRequestCard"

export const columns: ColumnDef<AlumniStudentCard>[] = [
  { accessorKey: "name", header: "Name" },
]

const ManageMentorships = () => {
  const [requests, setRequests] = useState<AlumniStudentCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await alumniService.getMentorshipRequests()

        if (response.status === "success") {
          setRequests(response.data ?? [])
        }
      } catch (error) {
        console.error("Failed to fetch mentorship requests", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

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

      {loading && (
        <div className="mb-5 text-sm text-muted-foreground">
          Loading mentorship requests...
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No pending mentorship requests at the moment.
        </div>
      )}

      {!loading && requests.length > 0 && (
        <CardDataTable
          columns={columns}
          data={requests}
          pageSize={9}
          renderCard={(row) => (
            <MentorshipRequestCard key={row.id} row={row} />
          )}
        />
      )}
    </div>
  )
}

export default ManageMentorships
