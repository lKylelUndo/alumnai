"use client"

import Image from "next/image"
import { useState } from "react"
import { PendingCollaborationInvite, Profile } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Briefcase, GraduationCap, LinkIcon, User, Building2, Mail, CheckCircle } from "lucide-react"

export type PendingMentorshipRequest = {
  mentorshipRecordId: string
  fromStudentId: string
  message: string
  status: "PENDING"
}

interface ViewProfileHeaderCardProps {
  profile: Profile
  isStudent: boolean
  isAlumni: boolean
  alreadyInvited: boolean
  hasActiveMentorship?: boolean
  hasActiveCollaboration?: boolean
  mentorshipStatus?: "PENDING" | "ACTIVE" | null
  pendingMentorshipRequest?: PendingMentorshipRequest | null
  requestActionPending?: boolean
  pendingCollaborationInvite?: PendingCollaborationInvite | null
  collabActionPending?: boolean
  onOpenInviteModal: () => void
  onAcceptMentorshipRequest: () => void
  onRejectMentorshipRequest: () => void
  onAcceptCollaborationInvite: () => void
  onDeclineCollaborationInvite: () => void
}

export default function ViewProfileHeaderCard({
  profile,
  isStudent,
  isAlumni,
  alreadyInvited,
  hasActiveMentorship,
  hasActiveCollaboration,
  mentorshipStatus,
  pendingMentorshipRequest = null,
  requestActionPending = false,
  pendingCollaborationInvite = null,
  collabActionPending = false,
  onOpenInviteModal,
  onAcceptMentorshipRequest,
  onRejectMentorshipRequest,
  onAcceptCollaborationInvite,
  onDeclineCollaborationInvite,
}: ViewProfileHeaderCardProps) {
  const [messageOpen, setMessageOpen] = useState(false)
  const [collabMessageOpen, setCollabMessageOpen] = useState(false)
  const mentorshipUnavailable = mentorshipStatus === "ACTIVE" || mentorshipStatus === "PENDING" || profile.isAvailableForMentorship === false
  const collaborationUnavailable = isStudent && profile.isAvailableForCollaboration === false
  // Active relationship of the OTHER type already exists between viewer and
  // target (stale payloads may omit these flags — treat missing as false).
  // Direction mirrors the button label below: student target => mentorship
  // flag, alumni target => collaboration flag.
  const blockedByActiveMentorship = isStudent && hasActiveMentorship === true
  const blockedByActiveCollaboration = !isStudent && hasActiveCollaboration === true
  const blockedByActiveRelationship = blockedByActiveMentorship || blockedByActiveCollaboration
  // New hints only attach to the normal button labels; the pre-existing
  // "Request Already Sent", "Mentorship Active" and "Request Pending"
  // states keep rendering exactly as before.
  const normalInviteLabel =
    !alreadyInvited && mentorshipStatus !== "ACTIVE" && mentorshipStatus !== "PENDING"
  const activeRelationshipHint =
    normalInviteLabel && blockedByActiveMentorship
      ? "Already mentoring this student"
      : normalInviteLabel && blockedByActiveCollaboration
      ? "Already collaborating with this alumni"
      : null
  const primaryActionClass = "flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"

  return (
    <>
      <Card className="relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl p-5 sm:p-6 md:flex-row md:items-center md:gap-6 md:p-8">
        <div className="z-10 flex w-full min-w-0 flex-col items-center gap-5 md:w-auto md:flex-row md:gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-muted sm:h-24 sm:w-24">
            {profile.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt="profile picture"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          {/* Profile Details */}
          <div className="min-w-0 text-center md:text-left">
            <div className="mb-2 flex flex-col items-center gap-3 md:flex-row md:items-center">
              <h1 className="break-words text-2xl font-bold text-foreground sm:text-3xl">
                {profile.fullName || "Unnamed User"}
              </h1>

              {isAlumni ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    <GraduationCap className="h-4 w-4" />
                    Alumni {profile.graduatedYear ? `(${profile.graduatedYear})` : ""}
                  </span>
                  {profile.mentorshipStatus !== "ACTIVE" && profile.mentorshipStatus !== "PENDING" && profile.isAvailableForMentorship !== false && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
                      <CheckCircle className="h-4 w-4" />
                      Available for Mentoring
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </span>
                  {profile.isAvailableForCollaboration !== false && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
                      <CheckCircle className="h-4 w-4" />
                      Available for Collaboration
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted-foreground md:justify-start md:text-left">
              {isAlumni && profile.current_position && (
                <span className="flex min-w-0 items-center gap-1">
                  <Briefcase className="h-[18px] w-[18px] shrink-0 text-primary" />
                  <span className="truncate font-medium text-foreground">
                    {profile.current_position}
                  </span>
                  {profile.companyName && (
                    <span className="truncate">@ {profile.companyName}</span>
                  )}
                </span>
              )}

              {profile.work_field && (
                <span className="flex min-w-0 items-center gap-1">
                  <Building2 className="h-[18px] w-[18px] shrink-0 text-primary" />
                  <span className="truncate">{profile.work_field}</span>
                </span>
              )}

              {profile.user?.email && (
                <span className="flex min-w-0 items-center gap-1">
                  <Mail className="h-[18px] w-[18px] shrink-0 text-primary" />
                  <span className="truncate">{profile.user.email}</span>
                </span>
              )}

              {profile.socialLink && (
                <a
                  href={
                    profile.socialLink.startsWith("http")
                      ? profile.socialLink
                      : `https://${profile.socialLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  title={profile.socialLink}
                  className="flex min-w-0 items-center gap-1 transition-colors hover:text-primary"
                >
                  <LinkIcon className="h-[18px] w-[18px] shrink-0 text-primary" />
                  <span className="truncate">{isStudent ? "GitHub" : "LinkedIn"}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="z-10 mt-4 flex w-full shrink-0 flex-col gap-3 print:hidden sm:flex-row md:mt-0 md:w-auto">
          {pendingMentorshipRequest ? (
            <>
              <Button
                id="profile-action-invite-btn"
                onClick={onAcceptMentorshipRequest}
                disabled={requestActionPending}
                className={primaryActionClass}
              >
                Accept Request
              </Button>
              <Button
                variant="outline"
                onClick={onRejectMentorshipRequest}
                disabled={requestActionPending}
                className="flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                Reject Request
              </Button>
              <Button
                variant="ghost"
                onClick={() => setMessageOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-primary shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                View Message Sent
              </Button>
            </>
          ) : pendingCollaborationInvite ? (
            <>
              <Button
                id="profile-action-invite-btn"
                onClick={onAcceptCollaborationInvite}
                disabled={collabActionPending}
                className={primaryActionClass}
              >
                Accept Invite
              </Button>
              <Button
                variant="outline"
                onClick={onDeclineCollaborationInvite}
                disabled={collabActionPending}
                className="flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                Decline Invite
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCollabMessageOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-primary shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                View Message
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                id="profile-action-invite-btn"
                onClick={onOpenInviteModal}
                disabled={
                  alreadyInvited ||
                  mentorshipUnavailable ||
                  collaborationUnavailable ||
                  blockedByActiveRelationship
                }
                className={primaryActionClass}
              >
                {mentorshipStatus === "ACTIVE"
                  ? "Mentorship Active"
                  : mentorshipStatus === "PENDING"
                  ? "Request Pending"
                  : alreadyInvited
                  ? "Request Already Sent"
                  : isStudent
                  ? "Send Collaboration Invite"
                  : "Apply for Mentorship"}
              </Button>
              {alreadyInvited ? (
                <p className="max-w-[260px] text-xs text-muted-foreground">
                  You already sent a collaboration request to this student.
                </p>
              ) : activeRelationshipHint ? (
                <p className="max-w-[260px] text-xs text-muted-foreground">
                  {activeRelationshipHint}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </Card>

      {pendingMentorshipRequest && (
        <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mentorship Request</DialogTitle>
              <DialogDescription>
                Message from {profile.fullName}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pendingMentorshipRequest.message || "No message provided."}
            </p>
          </DialogContent>
        </Dialog>
      )}

      {pendingCollaborationInvite && (
        <Dialog open={collabMessageOpen} onOpenChange={setCollabMessageOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Collaboration Invite</DialogTitle>
              <DialogDescription>
                Message from {profile.fullName}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pendingCollaborationInvite.message || "No message provided."}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
