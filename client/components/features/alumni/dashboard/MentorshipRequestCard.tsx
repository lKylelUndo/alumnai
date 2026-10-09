"use client"

import { MessageSquare, User, UserCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Row } from "@tanstack/react-table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { mentorshipService } from "@/services/mentorship.service"
import { AlumniStudentMentorshipCardTypes } from "@/lib/types/mentorship"
import { toast } from "sonner"

export default function MentorshipRequestCard({
  row,
  onRemoved,
}: {
  row: Row<AlumniStudentMentorshipCardTypes>
  onRemoved?: (id: string) => void
}) {
  const request = row.original
  const router = useRouter()
  const [messageOpen, setMessageOpen] = useState(false)

  async function acceptMentorshipRequest() {
    try {
      const response = await mentorshipService.acceptMentorship({
        mentorshipRecordId: request.mentorshipRecordId,
      })
      if (response.status === "success") {
        onRemoved?.(request.mentorshipRecordId)
        toast.success("Mentorship request accepted")
      }
    } catch (error) {
      console.error("error accepting mentorship request:", error)
    }
  }

  async function declineMentorshipRequest() {
    try {
      const response = await mentorshipService.declineMentorship({
        mentorshipRecordId: request.mentorshipRecordId,
      })
      if (response.status === "success") {
        onRemoved?.(request.mentorshipRecordId)
        toast.success("Mentorship request declined")
      }
    } catch (error) {
      console.error("error declining mentorship request:", error)
    }
  }

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
                alt={request.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#1A216D]/60">
                <User className="h-5 w-5" />
              </span>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm leading-tight font-bold text-[#1A216D]">
              {request.fullName || "STUDENT USER"}
            </p>
            <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#4F5EBD]">
              {request.track || "NONE"}
            </p>
            <p className="mt-0.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {request.yearLevel || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            id={`view-profile-request-${request.fromStudentId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-3 py-1.5 min-h-10 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
            onClick={() => router.push(`/alumni/profile/view/${request.fromStudentId}`)}
          >
            <UserCircle2 className="h-3.5 w-3.5" />
            View Profile
          </button>
          <button
            id={`view-message-request-${request.mentorshipRecordId}`}
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
            <DialogTitle>Mentorship Request</DialogTitle>
            <DialogDescription>
              Message from {request.fullName}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {request.message || "No message provided."}
          </p>
          <div className="flex w-full gap-2">
            <DialogClose asChild>
              <Button onClick={acceptMentorshipRequest}>Accept</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={declineMentorshipRequest}
                variant={"destructive"}
              >
                Decline
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
