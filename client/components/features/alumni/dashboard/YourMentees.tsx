"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentMentorshipCardTypes } from "@/lib/types/mentorship"
import MenteeCard from "./MenteeCard"

import { useRouter } from "next/navigation"
import { useAlumniSocket } from "@/hooks/useAlumniSocket"
import { toast } from "sonner"

export const columns: ColumnDef<AlumniStudentMentorshipCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
]

const YourMentees = ({ mentees }: { mentees: AlumniStudentMentorshipCardTypes[] }) => {
  const router = useRouter()

  useAlumniSocket({
    target: "your-mentees",
    onRefresh: (data) => {
      if (data?.message) toast.info(data.message)
      router.refresh()
    },
  })
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
            <MenteeCard key={row.id} row={row} />
          )}
        />
    </div>
  )
}

export default YourMentees