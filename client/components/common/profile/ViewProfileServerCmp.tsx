import { useState } from "react"
import Image from "next/image"
import { Profile, ProfileRelationRow } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import Certifications from "@/components/common/layout/Certifications"
import ProfileRecognitionsCard from "./ProfileRecognitionsCard"
import { Briefcase, LinkIcon, User, Building2, Mail, CheckCircle, GraduationCap, Sparkles, Users, Handshake, ChevronLeft, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ProfileCardHeader from "./ProfileCardHeader"
import { getProficiencyColor } from "@/utils/skill"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import NoProfileCreated from "./NoProfileCreated"

interface ViewProfileProps {
  profile?: Profile | null
  /** Admin drill-down only: gate for the privacy-sensitive student ID. */
  showStudentId?: boolean
}

interface RelationCardProps {
  icon: LucideIcon
  title: string
  rows?: ProfileRelationRow[] | null
}

const RELATION_PAGE_SIZE = 3

const RelationCard = ({ icon, title, rows }: RelationCardProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const items = rows ?? []

  if (items.length === 0) {
    return null
  }

  const totalPages = Math.ceil(items.length / RELATION_PAGE_SIZE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const startIndex = (safePage - 1) * RELATION_PAGE_SIZE
  const currentItems = items.slice(startIndex, startIndex + RELATION_PAGE_SIZE)

  return (
    <Card className="rounded-2xl p-6">
      <ProfileCardHeader icon={icon} title={title} />
      <div className="space-y-4">
        {currentItems.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-2.5 border-b border-border pb-3 last:border-none last:pb-0"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {row.profilePicture ? (
                <Image
                  src={row.profilePicture}
                  alt={row.fullName}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">{row.fullName}</p>
              {row.subtitle && (
                <p className="truncate text-[10px] text-muted-foreground">{row.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="text-[11px] text-muted-foreground">
            Page {safePage} of {totalPages}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

const ViewProfileServerCmp = ({ profile, showStudentId = false }: ViewProfileProps) => {
  if (!profile) {
    return (
      <NoProfileCreated error="No profile created"/>
    )
  }

  const coreSkills =
    profile.skills?.filter((s) => s.type === "SOFT_SKILL") || []
  const techSkills =
    profile.skills?.filter(
      (s) => s.type === "HARD_SKILL" || s.type === "OTHER_HARD_SKILL"
    ) || []
  const otherSkills = profile.skills?.filter((s) => !s.type) || []

  const isAlumni = profile.user?.role === "ALUMNI" || Boolean(profile.graduatedYear)
  const isStudent = !isAlumni

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Header - Full Width */}
          <div className="lg:col-span-12">
            <Card className="relative flex flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl p-5 sm:p-6 md:flex-row md:items-center md:gap-6 md:p-8">
              <div className="z-10 flex w-full min-w-0 flex-col items-center gap-5 md:w-auto md:flex-row md:items-center md:gap-6">
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

                {/* Info */}
                <div className="min-w-0 text-center md:text-left">
                  <div className="mb-2 flex flex-col items-center gap-3 md:flex-row md:items-center">
                    <h1 className="break-words text-2xl font-bold text-foreground sm:text-3xl">
                      {profile.fullName || "Unnamed User"}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      <GraduationCap className="h-4 w-4" />
                      {isAlumni
                        ? `Alumni ${profile.graduatedYear ? `(${profile.graduatedYear})` : ""}`
                        : "Student"}
                    </span>
                  </div>

                  <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted-foreground md:text-left">
                    {/* Privacy: student ID renders for admin viewers only
                        (see showStudentId). The backend also strips the field
                        for non-admins, so a stale cache can never leak it. */}
                    {isStudent && showStudentId && profile.user?.student_id_number && (
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
                        <span className="truncate">
                          {isAlumni ? "LinkedIn" : "GitHub"}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Left Column: About & Skills */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-8">
            {/* About */}
            <Card className="rounded-2xl p-6 md:p-8">
              <ProfileCardHeader icon={User} title="About" />
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {profile.aboutMe || "No bio provided."}
              </p>
            </Card>

            {/* Skills */}
            <Card className="rounded-2xl p-6 md:p-8">
              <ProfileCardHeader icon={Sparkles} title="Skills" />

              <div className="space-y-8">
                {/* Core Skills */}
                <div>
                  <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">
                    Core Skills
                  </h3>
                  {coreSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {coreSkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex rounded-md bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
                        >
                          {skill.name || skill.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">No core skills added yet</p>
                  )}
                </div>

                {/* Tools & Technology */}
                <div>
                  <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">
                    Tools & Technology
                  </h3>
                  {techSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {techSkills.map((skill) => {
                        const levelNum =
                          typeof skill.level === "number" ? skill.level : undefined
                        const tooltipText =
                          skill.description ||
                          (levelNum !== undefined ? `Proficiency Level: ${levelNum}` : null)

                        return (
                          <span
                            key={skill.id}
                            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-muted-foreground"
                          >
                            {skill.name || skill.title}
                            {tooltipText ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="h-2 w-2 cursor-pointer rounded-full"
                                    style={{ backgroundColor: getProficiencyColor(levelNum) }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{tooltipText}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              levelNum !== undefined && (
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: getProficiencyColor(levelNum) }}
                                />
                              )
                            )}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">No tools added yet</p>
                  )}
                </div>

                {/* Others */}
                <div>
                  <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">
                    Others
                  </h3>
                  {otherSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {otherSkills.map((skill) => {
                        const levelNum =
                          typeof skill.level === "number" ? skill.level : undefined
                        const tooltipText =
                          skill.description ||
                          (levelNum !== undefined ? `Proficiency Level: ${levelNum}` : null)

                        return (
                          <span
                            key={skill.id}
                            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-muted-foreground"
                          >
                            {skill.name || skill.title}
                            {tooltipText ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="h-2 w-2 cursor-pointer rounded-full"
                                    style={{ backgroundColor: getProficiencyColor(levelNum) }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{tooltipText}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              levelNum !== undefined && (
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: getProficiencyColor(levelNum) }}
                                />
                              )
                            )}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">No other skills added yet</p>
                  )}
                </div>

                {(!profile.skills || profile.skills.length === 0) && (
                  <p className="text-sm text-muted-foreground">No skills added yet.</p>
                )}
              </div>

              <ProfiecienyScale />
            </Card>
          </div>

          {/* Right Column: Recognitions & Certifications */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-4">
            {isAlumni && (
              <ProfileRecognitionsCard recognitions={profile.user?.receivedRecognitions} />
            )}
            {isStudent && (
              <Card className="rounded-2xl p-6">
                <ProfileCardHeader
                  icon={CheckCircle}
                  title="Available for Collaboration"
                  description={
                    profile.isAvailableForCollaboration === false
                      ? "Not accepting collaboration invites"
                      : "Open to collaboration invites"
                  }
                />
              </Card>
            )}
            {isStudent && (
              <RelationCard icon={Users} title="Current Mentors" rows={profile.mentors} />
            )}
            {isAlumni && (
              <RelationCard icon={Users} title="Current Mentees" rows={profile.mentees} />
            )}
            {isAlumni && (
              <RelationCard icon={Handshake} title="Collaborations" rows={profile.collaborations} />
            )}
            <Certifications certifications={profile.certifications} ownerUserId={profile.userId} />
          </div>
        </div>
  )
}

export default ViewProfileServerCmp
