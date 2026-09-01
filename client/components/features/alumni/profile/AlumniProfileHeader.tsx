"use client";
import ProfileActions from "@/components/common/profile/ProfileActions"
import { Card } from "@/components/ui/card"
import { Briefcase, LinkIcon, Mail, User, CheckCircle, GraduationCap } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import Image from "next/image"

const AlumniProfileHeader = () => {
  const { user } = useAuthContext();

  return (
    <Card className="relative bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8 flex flex-col items-center md:flex-row md:items-center justify-between gap-6 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#dde1ff]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center md:flex-row md:items-center gap-6 z-10 w-full md:w-auto">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-[#F1F5F9] border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
          {user?.profile?.profilePicture ? (
            <Image src={user.profile.profilePicture} alt="profile picture" width={96} height={96} className="h-full w-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-[#A4B1CC]" />
          )}
        </div>

        {/* Info */}
        <div className="text-center md:text-left">
          <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#131b2e]">{user?.profile?.fullName || ""}</h1>
            <span className="bg-[#0035c5]/10 text-[#0035c5] text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
              <GraduationCap className="inline h-4 w-4 mr-1" />
              Alumni
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
            <span className="flex items-center gap-1 text-[#004e71] text-xs bg-[#006794]/10 px-2 py-1 rounded-full border border-[#004e71]/20">
              <CheckCircle className="h-4 w-4" />
              Available for Mentoring
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-[#434657] text-sm">
            {user?.profile?.current_position && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-[18px] w-[18px]" />
                {user.profile.current_position}
              </span>
            )}
            {user?.profile?.current_position && <span className="hidden sm:inline text-[#A4B1CC]">&#8226;</span>}
            <span className="flex items-center gap-1">
              <Mail className="h-[18px] w-[18px]" />
              {user?.email || ""}
            </span>
            {user?.profile?.socialLink && (
              <>
                <span className="hidden sm:inline text-[#A4B1CC]">&#8226;</span>
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-[18px] w-[18px]" />
                  {user.profile.socialLink}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <ProfileActions updateProfileURL={"/alumni/profile/update"} />
    </Card>
  );
};

export default AlumniProfileHeader
