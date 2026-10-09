"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { CardDataTable } from "@/components/common/tables/CardDataTable"
import { AlumniSentCollabInvite } from "@/lib/types/collaboration"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { MessageSquare, User, UserCircle2 } from "lucide-react"

import { useState, useEffect, useCallback } from "react"
import { useAlumniSocket } from "@/hooks/useAlumniSocket"
import { collaborationService } from "@/services/collaboration.service"

export const columns: ColumnDef<AlumniSentCollabInvite>[] = [
  { accessorKey: "studentName", header: "Name" },
]

function SentCollabInviteCard({ row }: { row: Row<AlumniSentCollabInvite> }) {
  const invite = row.original
  const router = useRouter()
  const [messageOpen, setMessageOpen] = useState(false)

  return (
    <>
      <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
            {invite.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invite.profilePicture}
                alt={invite.studentName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#1A216D]/60">
                <User />
              </span>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm leading-tight font-bold text-[#1A216D]">
              {invite.studentName}
            </p>
            <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#4F5EBD]">
              {invite.track || "NONE"}
            </p>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {invite.yearLevel || "N/A"}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
          {invite.message || "No message provided."}
        </p>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            Pending
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            id={`view-profile-sent-invite-${invite.toStudentId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-3 py-1.5 min-h-10 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
            onClick={() => router.push(`/alumni/profile/view/${invite.toStudentId}`)}
          >
            <UserCircle2 className="h-3.5 w-3.5" />
            View Profile
          </button>
          <button
            id={`view-message-sent-invite-${invite.collaborationId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1A216D] px-3 py-1.5 min-h-10 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#1A216D]/85 active:scale-95"
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
            <DialogTitle>Collaboration Invite</DialogTitle>
            <DialogDescription>
              Message from {invite.studentName}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {invite.message || "No message provided."}
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

const SentCollabInvites = ({ invites: initialInvites }: { invites: AlumniSentCollabInvite[] }) => {
  const [invites, setInvites] = useState<AlumniSentCollabInvite[]>(initialInvites ?? [])
  const [prevInitialInvites, setPrevInitialInvites] = useState(initialInvites)

  const refetchInvites = useCallback(() => {
    collaborationService.getSentCollabInvites()
      .then((res) => {
        if (Array.isArray(res?.data)) setInvites(res.data)
      })
      .catch((err) => console.error("Refetch sent collaboration invites failed:", err))
  }, [])

  useAlumniSocket({
    target: "manage-mentorships",
    onRefresh: () => {
      refetchInvites()
    },
  })

  if (prevInitialInvites !== initialInvites) {
    setPrevInitialInvites(initialInvites)
    if (initialInvites) setInvites(initialInvites)
  }

  useEffect(() => {
    if (invites.length === 0) refetchInvites()
  }, [invites.length, refetchInvites])

  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Sent Collaboration Invites</h2>
        <p className="text-xs text-muted-foreground">
          Students you&apos;ve invited to collaborate
        </p>
      </div>

      <CardDataTable
        emptyMessage="No sent collaboration invites yet."
        columns={columns}
        data={invites}
        pageSize={9}
        renderCard={(row) => <SentCollabInviteCard key={row.id} row={row} />}
      />
    </div>
  )
}

export default SentCollabInvites
