import Image from "next/image"
import { Profile } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import Certifications from "@/components/common/layout/Certifications"
import ProfileRecognitionsCard from "./ProfileRecognitionsCard"
import { Briefcase, LinkIcon, User, Building2, Mail, CheckCircle, GraduationCap, Sparkles } from "lucide-react"
import ProfileCardHeader from "./ProfileCardHeader"
import { getProficiencyColor } from "@/utils/skill"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import NoProfileCreated from "./NoProfileCreated"

interface ViewProfileProps {
  profile?: Profile | null
}

const ViewProfileServerCmp = ({ profile }: ViewProfileProps) => {
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
            <Certifications certifications={profile.certifications} />
          </div>
        </div>
  )
}

export default ViewProfileServerCmp
