"use client"
import ProfileActions from "@/components/common/profile/ProfileActions"
import { Card } from "@/components/ui/card"
import { LinkIcon, Mail, User, CheckCircle } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import Image from "next/image"

const StudentProfileHeader = () => {
  const { user } = useAuthContext()

  return (
    <Card className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl p-6 md:flex-row md:items-center md:p-8">
      <div className="z-10 flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:items-center">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-muted">
          {user?.profile?.profilePicture ? (
            <Image
              src={user.profile.profilePicture}
              alt="profile picture"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 text-center md:text-left">
          <div className="mb-2 flex flex-col items-center gap-3 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold text-foreground">
              {user?.profile?.fullName || ""}
            </h1>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Student
            </span>
            {user?.profile?.isAvailableForCollaboration !== false && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
                <CheckCircle className="h-4 w-4" />
                Available for Collaboration
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
            <span className="flex min-w-0 items-center gap-1">
              <Mail className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{user?.email || ""}</span>
            </span>
            {user?.profile?.socialLink && (
              <a
                href={user.profile.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-1 transition-colors hover:text-primary"
              >
                <LinkIcon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <ProfileActions updateProfileURL="/student/profile/update" />
    </Card>
  )
}

export default StudentProfileHeader
