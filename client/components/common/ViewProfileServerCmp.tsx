import Image from "next/image"
import { Profile } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import Certifications from "@/components/common/Certifications"
import { Briefcase, GraduationCap, LinkIcon, User, UserX, Building2 } from "lucide-react"
import { getProficiencyColor } from "@/utils/skill"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ProfiecienyScale from "./ProficiencyScale"

interface ViewProfileProps {
  profile?: Profile | null
}

const ViewProfileServerCmp = ({ profile }: ViewProfileProps) => {
  if (!profile) {
    return (
      <div className="mx-auto mt-8 w-full max-w-[1200px] p-4 md:p-8">
        <Card className="flex flex-col items-center justify-center rounded-xl border border-[#A4B1CC] bg-white p-12 text-center shadow-sm">
          <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
            <UserX className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A216D]">
            No Profile Found
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            This user has not created a profile yet or the profile data could
            not be fetched.
          </p>
        </Card>
      </div>
    )
  }

  // Separate skills if type property is present, otherwise display all
  const coreSkills =
    profile.skills?.filter((s) => s.type === "SOFT_SKILL") || []
  const techSkills =
    profile.skills?.filter(
      (s) => s.type === "HARD_SKILL" || s.type === "OTHER_HARD_SKILL"
    ) || []
  const otherSkills = profile.skills?.filter((s) => !s.type) || []

  const isAlumni = Boolean(profile.graduatedYear)

  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] p-4 md:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
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
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1A216D] px-3 py-1 text-xs font-medium text-white">
                        <GraduationCap className="h-4 w-4" />
                        Alumni ({profile.graduatedYear})
                      </span>
                    ) : profile.yearLevel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1877F2] px-3 py-1 text-xs font-medium text-white">
                        <GraduationCap className="h-4 w-4" />
                        {profile.yearLevel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-3 py-1 text-xs font-medium text-white">
                        User Profile
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {profile.current_position && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 shrink-0 text-[#1A216D]" />
                        <span className="font-medium text-gray-800">
                          {profile.current_position}
                        </span>
                        {profile.companyName && (
                          <span className="text-gray-500">
                            at {profile.companyName}
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

                    {profile.socialLink && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 shrink-0 text-[#1877F2]" />
                        <a
                          href={profile.socialLink}
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
            </div>
          </Card>

          {/* About & Skills Card */}
          <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm md:p-8">
            {/* About */}
            <h2 className="mb-3 text-2xl font-bold text-[#1A216D]">About</h2>
            <p className="mb-8 text-sm leading-relaxed whitespace-pre-line text-gray-700">
              {profile.aboutMe || "No bio provided."}
            </p>

            {/* Skills */}
            <h2 className="mb-6 text-2xl font-bold text-[#1A216D]">Skills</h2>

            <div className="space-y-6">
              {/* Core Skills */}
              {coreSkills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">
                    Core Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coreSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex rounded-md bg-[#F0F4FF] px-4 py-1.5 text-xs font-semibold text-[#1A216D]"
                      >
                        {skill.name || skill.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools & Technology / Hard Skills */}
              {techSkills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">
                    Tools & Technology
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techSkills.map((skill) => {
                      const levelNum =
                        typeof skill.level === "number"
                          ? skill.level
                          : undefined
                      const tooltipText =
                        skill.description ||
                        (levelNum !== undefined
                          ? `Proficiency Level: ${levelNum}`
                          : null)

                      return (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700"
                        >
                          {skill.name || skill.title}
                          {tooltipText ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="h-2 w-2 cursor-pointer rounded-full"
                                  style={{
                                    backgroundColor:
                                      getProficiencyColor(levelNum),
                                  }}
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
                                style={{
                                  backgroundColor:
                                    getProficiencyColor(levelNum),
                                }}
                              />
                            )
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Fallback All Skills (if not categorized by type) */}
              {otherSkills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {otherSkills.map((skill) => {
                      const levelNum =
                        typeof skill.level === "number"
                          ? skill.level
                          : undefined
                      const tooltipText =
                        skill.description ||
                        (levelNum !== undefined
                          ? `Proficiency Level: ${levelNum}`
                          : null)

                      return (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700"
                        >
                          {skill.name || skill.title}
                          {tooltipText ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="h-2 w-2 cursor-pointer rounded-full"
                                  style={{
                                    backgroundColor:
                                      getProficiencyColor(levelNum),
                                  }}
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
                                style={{
                                  backgroundColor:
                                    getProficiencyColor(levelNum),
                                }}
                              />
                            )
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {(!profile.skills || profile.skills.length === 0) && (
                <p className="text-xs text-muted-foreground">
                  No skills added yet.
                </p>
              )}
            </div>

            {/* Proficiency Scale Legend */}
            <ProfiecienyScale />
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          <Certifications certifications={profile.certifications} />
        </div>
      </div>
    </div>
  )
}

export default ViewProfileServerCmp
