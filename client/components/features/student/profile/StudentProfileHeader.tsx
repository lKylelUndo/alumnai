"use client";
import ProfileActions from "@/components/common/ProfileActions"
import { Card } from "@/components/ui/card"
import { Briefcase, GraduationCap, LinkIcon, Mail, User } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import Image from "next/image"

const StudentProfileHeader = () => {
  const { user } = useAuthContext();

  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-200">
            <Image src={user?.profile?.profilePicture || ""} alt="profile picture" fill className="object-cover object-center" />
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#1A216D]">{user?.profile?.fullName || ""}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1877F2] px-3 py-1 text-xs font-medium text-white">
                <GraduationCap className="h-4 w-4" />
                Student
              </span>
              <span className="inline-flex items-center rounded-full border border-[#00B050] bg-white px-3 py-1 text-xs font-medium text-[#00B050]">
                Available for Mentoring
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>{user?.profile?.current_position || ""}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{user?.email || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  <span>{user?.profile?.socialLink || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <ProfileActions />
      </div>
    </Card>
  )
}

export default StudentProfileHeader
