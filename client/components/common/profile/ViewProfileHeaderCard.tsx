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
    <Card className="relative bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#dde1ff]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full md:w-auto">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-[#F1F5F9] border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
          {profile.profilePicture ? (
            <Image
              src={profile.profilePicture}
              alt="profile picture"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-[#A4B1CC]" />
          )}
        </div>

        {/* Profile Details */}
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#131b2e]">
              {profile.fullName || "Unnamed User"}
            </h1>

            {isAlumni ? (
              <>
                <span className="bg-[#0035c5]/10 text-[#0035c5] text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
                  <GraduationCap className="inline h-4 w-4 mr-1" />
                  Alumni {profile.graduatedYear ? `(${profile.graduatedYear})` : ""}
                </span>
                {profile.mentorshipStatus !== "ACTIVE" && profile.mentorshipStatus !== "PENDING" && profile.isAvailableForMentorship !== false && (
                  <span className="flex items-center gap-1 text-[#004e71] text-xs bg-[#006794]/10 px-2 py-1 rounded-full border border-[#004e71]/20">
                    <CheckCircle className="h-4 w-4" />
                    Available for Mentoring
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="bg-[#0035c5]/10 text-[#0035c5] text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
                  <GraduationCap className="inline h-4 w-4 mr-1" />
                  Student
                </span>
                {profile.isAvailableForCollaboration !== false && (
                  <span className="flex items-center gap-1 text-[#004e71] text-xs bg-[#006794]/10 px-2 py-1 rounded-full border border-[#004e71]/20">
                    <CheckCircle className="h-4 w-4" />
                    Available for Collaboration
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-[#434657] text-sm">
            {/* Role specific lines */}
            {isStudent && profile.user?.student_id_number && (
              <span className="font-semibold text-[#131b2e]">
                Student ID: {profile.user.student_id_number}
              </span>
            )}

            {isAlumni && profile.current_position && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-[18px] w-[18px] text-[#1A216D]" />
                <span className="font-medium text-[#131b2e]">
                  {profile.current_position}
                </span>
                {profile.companyName && (
                  <span className="text-[#434657]">
                    @ {profile.companyName}
                  </span>
                )}
              </span>
            )}

            {profile.work_field && (
              <span className="flex items-center gap-1">
                <Building2 className="h-[18px] w-[18px] text-[#1A216D]" />
                {profile.work_field}
              </span>
            )}

            {profile.user?.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-[18px] w-[18px] text-[#1877F2]" />
                {profile.user.email}
              </span>
            )}

            {profile.socialLink && (
              <span className="flex items-center gap-1">
                <LinkIcon className="h-[18px] w-[18px] text-[#1877F2]" />
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
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10 mt-4 md:mt-0 shrink-0">
        <Button
          id="profile-action-invite-btn"
          onClick={onOpenInviteModal}
          disabled={alreadyInvited || mentorshipUnavailable || collaborationUnavailable}
          className="flex items-center justify-center gap-2 px-6 py-2 rounded font-semibold text-sm text-white shadow-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #0047FF, #002994)" }}
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
