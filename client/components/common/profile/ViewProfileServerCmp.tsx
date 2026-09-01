import Image from "next/image"
import { Profile } from "@/lib/types/profile"
import { Card } from "@/components/ui/card"
import Certifications from "@/components/common/layout/Certifications"
import ProfileRecognitionsCard from "./ProfileRecognitionsCard"
import { Briefcase, LinkIcon, User, Building2, Mail, CheckCircle, GraduationCap } from "lucide-react"
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

  const isAlumni = Boolean(profile.graduatedYear)
  const isStudent = !isAlumni

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Header - Full Width */}
          <div className="lg:col-span-12">
            <Card className="relative bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#dde1ff]/30 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center md:flex-row md:items-center gap-6 z-10 w-full md:w-auto">
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

                {/* Info */}
                <div className="text-center md:text-left">
                  <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#131b2e]">
                      {profile.fullName || "Unnamed User"}
                    </h1>

                    {isAlumni ? (
                      <span className="bg-[#0035c5]/10 text-[#0035c5] text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
                        <GraduationCap className="inline h-4 w-4 mr-1" />
                        Alumni {profile.graduatedYear ? `(${profile.graduatedYear})` : ""}
                      </span>
                    ) : (
                      <span className="bg-[#0035c5]/10 text-[#0035c5] text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
                        <GraduationCap className="inline h-4 w-4 mr-1" />
                        Student
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 text-[#434657] text-sm">
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
            </Card>
          </div>

          {/* Left Column: About & Skills */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* About */}
            <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8">
              <h2 className="font-bold text-[#131b2e] text-2xl mb-4">About</h2>
              <p className="text-[#434657] leading-relaxed whitespace-pre-line">
                {profile.aboutMe || "No bio provided."}
              </p>
            </Card>

            {/* Skills */}
            <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8">
              <h2 className="font-bold text-[#131b2e] text-2xl mb-6">Skills</h2>

              <div className="space-y-8">
                {/* Core Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-[#131b2e] mb-3 border-b border-[#E2E8F0] pb-2">
                    Core Skills
                  </h3>
                  {coreSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {coreSkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex rounded-md bg-[#dde1ff] px-4 py-1.5 text-xs font-semibold text-[#1A216D]"
                        >
                          {skill.name || skill.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#434657] italic py-2">No core skills added yet</p>
                  )}
                </div>

                {/* Tools & Technology */}
                <div>
                  <h3 className="text-sm font-semibold text-[#131b2e] mb-3 border-b border-[#E2E8F0] pb-2">
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
                            className="inline-flex items-center gap-2 rounded-full bg-[#F1F5F9] px-4 py-1.5 text-xs font-semibold text-[#434657]"
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
                    <p className="text-sm text-[#434657] italic py-2">No tools added yet</p>
                  )}
                </div>

                {/* Others */}
                <div>
                  <h3 className="text-sm font-semibold text-[#131b2e] mb-3 border-b border-[#E2E8F0] pb-2">
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
                            className="inline-flex items-center gap-2 rounded-full bg-[#F1F5F9] px-4 py-1.5 text-xs font-semibold text-[#434657]"
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
                    <p className="text-sm text-[#434657] italic py-2">No other skills added yet</p>
                  )}
                </div>

                {(!profile.skills || profile.skills.length === 0) && (
                  <p className="text-sm text-[#434657] italic">No skills added yet.</p>
                )}
              </div>

              <ProfiecienyScale />
            </Card>
          </div>

          {/* Right Column: Recognitions & Certifications */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {isAlumni && (
              <ProfileRecognitionsCard recognitions={profile.user?.receivedRecognitions} />
            )}
            {isStudent && (
              <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#e0e0ff] text-[#1877F2] flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#131b2e]">Available for Mentoring</h3>
                    <p className="text-sm text-[#434657]">Student profile</p>
                  </div>
                </div>
              </Card>
            )}
            <Certifications certifications={profile.certifications} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default ViewProfileServerCmp
