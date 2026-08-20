"use client"

import Image from "next/image"
import { Profile } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap, LinkIcon, User, Building2, Mail } from "lucide-react"

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
  const mentorshipUnavailable = mentorshipStatus === "ACTIVE" || mentorshipStatus === "PENDING"

  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-200">
            {profile.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt="profile picture"
                fill
                className="object-cover object-center"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-400">
                {profile.fullName?.charAt(0) || (
                  <User className="h-10 w-10" />
                )}
              </span>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#1A216D]">
                {profile.fullName || "Unnamed User"}
              </h1>

              {isAlumni ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1A216D] px-3 py-1 text-xs font-medium text-white">
                    <GraduationCap className="h-4 w-4" />
                    Alumni {profile.graduatedYear ? `(${profile.graduatedYear})` : ""}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-teal-500 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    Available for Mentoring
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1877F2] px-3 py-1 text-xs font-medium text-white">
                  <GraduationCap className="h-4 w-4" />
                  Student
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {/* Role specific lines */}
              {isStudent && profile.user?.student_id_number && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">
                    Student ID: {profile.user.student_id_number}
                  </span>
                </div>
              )}

              {isAlumni && profile.current_position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 shrink-0 text-[#1A216D]" />
                  <span className="font-medium text-gray-800">
                    {profile.current_position}
                  </span>
                  {profile.companyName && (
                    <span className="text-gray-500">
                      @ {profile.companyName}
                    </span>
                  )}
                </div>
              )}

              {profile.work_field && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-[#1A216D]" />
                  <span>{profile.work_field}</span>
                </div>
              )}

              {profile.user?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-[#1877F2]" />
                  <span>{profile.user.email}</span>
                </div>
              )}

              {profile.socialLink && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 shrink-0 text-[#1877F2]" />
                  <a
                    href={
                      profile.socialLink.startsWith("http")
                        ? profile.socialLink
                        : `https://${profile.socialLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1877F2] hover:underline"
                  >
                    {profile.socialLink}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 mt-4 md:mt-0">
          <Button
            id="profile-action-invite-btn"
            onClick={onOpenInviteModal}
            disabled={alreadyInvited || mentorshipUnavailable}
            className="rounded-full bg-[#1877F2] hover:bg-[#1565C0] px-6 py-2.5 font-semibold text-white shadow-sm transition-all"
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
      </div>
    </Card>
  )
}
