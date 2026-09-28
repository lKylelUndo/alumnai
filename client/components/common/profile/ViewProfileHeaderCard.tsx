"use client"

import Image from "next/image"
import { Profile } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap, LinkIcon, User, Building2, Mail, CheckCircle } from "lucide-react"

interface ViewProfileHeaderCardProps {
  profile: Profile
  isStudent: boolean
  isAlumni: boolean
  alreadyInvited: boolean
  mentorshipStatus?: "PENDING" | "ACTIVE" | null
  onOpenInviteModal: () => void
}

export default function ViewProfileHeaderCard({
  profile,
  isStudent,
  isAlumni,
  alreadyInvited,
  mentorshipStatus,
  onOpenInviteModal,
}: ViewProfileHeaderCardProps) {
  const mentorshipUnavailable = mentorshipStatus === "ACTIVE" || mentorshipStatus === "PENDING" || profile.isAvailableForMentorship === false
  const collaborationUnavailable = isStudent && profile.isAvailableForCollaboration === false

  return (
    <Card className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl p-6 md:flex-row md:items-center md:p-8">
      <div className="z-10 flex w-full flex-col items-center gap-6 md:w-auto md:flex-row">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-muted">
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
            <h1 className="text-3xl font-bold text-foreground">
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

          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
            {/* Role specific lines */}
            {isStudent && profile.user?.student_id_number && (
              <span className="font-semibold text-foreground">
                Student ID: {profile.user.student_id_number}
              </span>
            )}

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
                <span className="truncate">LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="z-10 mt-4 flex w-full shrink-0 flex-col gap-3 sm:flex-row md:mt-0 md:w-auto">
        <Button
          id="profile-action-invite-btn"
          onClick={onOpenInviteModal}
          disabled={alreadyInvited || mentorshipUnavailable || collaborationUnavailable}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {mentorshipStatus === "ACTIVE"
            ? "Mentorship Active"
            : mentorshipStatus === "PENDING" || alreadyInvited
            ? "Request Pending"
            : isStudent
            ? "Send Collaboration Invite"
            : "Apply for Mentorship"}
        </Button>
      </div>
    </Card>
  )
}
