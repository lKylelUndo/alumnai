"use client"

import { useEffect, useState } from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { UserCircle2, XCircle } from "lucide-react"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCard } from "@/constants/alumni"
import { alumniService } from "@/services/alumni.service"
import { mentorshipService } from "@/services/mentorship.service"
import { useRouter } from "next/navigation"
import MenteeCard from "./MenteeCard"
import Spinner from "@/components/common/layout/Spinner"

export const columns: ColumnDef<AlumniStudentCard>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourMentees = () => {
  const [mentees, setMentees] = useState<AlumniStudentCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true)
        const response = await alumniService.getMyMentees()

        if (response.status === "success") {
          setMentees(response.data ?? [])
        }
      } catch (error) {
        console.error("Failed to fetch mentees", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMentees()
  }, [])

  const handleEnded = (recordId: string) => {
    setMentees((prev) => prev.filter((mentee) => mentee.recordId !== recordId))
  }

  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Mentees</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;re currently mentoring
        </p>
      </div>

      {loading && (
       <Spinner content="Loading mentees..." />
      )}

      {!loading && mentees.length === 0 && (
        <div className="mb-5 text-sm text-muted-foreground">
          No active mentees at the moment.
        </div>
      )}

      {!loading && mentees.length > 0 && (
        <CardDataTable
          columns={columns}
          data={mentees}
          pageSize={9}
          renderCard={(row) => (
            <MenteeCard key={row.id} row={row} onEnded={handleEnded} />
          )}
        />
      )}
    </div>
  )
}

export default YourMentees