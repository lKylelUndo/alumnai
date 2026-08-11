"use client"

import { useEffect, useState } from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { MessageSquare, UserCircle2 } from "lucide-react"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniStudentCard } from "@/constants/alumni"
import { alumniService } from "@/services/alumni.service"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export const columns: ColumnDef<AlumniStudentCard>[] = [
  { accessorKey: "name", header: "Name" },
]

function MentorshipRequestCard({ row }: { row: Row<AlumniStudentCard> }) {
  const request = row.original
  const initials = request.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const router = useRouter()
  const [messageOpen, setMessageOpen] = useState(false)

  return (
    <>
      <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
            {request.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={request.profilePicture}
                alt={request.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#1A216D]/60">
                {initials}
              </span>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold leading-tight text-[#1A216D]">
              {request.name}
            </p>
            <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#4F5EBD]">
              {request.track}
            </p>
            <p className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
              {request.year}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            id={`view-profile-request-${request.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
            onClick={() => router.push(`/alumni/profile/view/${request.id}`)}
          >
            <UserCircle2 className="h-3.5 w-3.5" />
            View Profile
          </button>
          <button
            id={`view-message-request-${request.recordId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1A216D] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#1A216D]/85 active:scale-95"
            onClick={() => setMessageOpen(true)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            View Message
          </button>
        </div>
      </div>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mentorship Request</DialogTitle>
            <DialogDescription>
              Message from {request.name}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {request.message || "No message provided."}
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
