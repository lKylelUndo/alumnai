"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Profile } from "@/lib/types/profile"
import { profileService } from "@/services/profile.service"
import { skillService } from "@/services/skill.service"
import { collaborationService } from "@/services/collaboration.service"
import { mentorshipService } from "@/services/mentorship.service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Certifications from "@/components/common/layout/Certifications"
import ViewProfileHeaderCard from "@/components/common/profile/ViewProfileHeaderCard"
import InviteDialog from "@/components/common/dialogs/InviteDialog"
import GithubSkillIndexResultCmp, { GithubSkillIndexResultData } from "@/components/common/skills/GithubSkillIndexResultCmp"
import ProfileRecognitionsCard from "./ProfileRecognitionsCard"
import { RefreshCw, ArrowLeft, Award, Users, Loader2 } from "lucide-react"
import { getProficiencyColor } from "@/utils/skill"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import NoProfileCreated from "./NoProfileCreated"
import ViewProfileLoading from "./ViewProfileLoading"

interface ViewProfileClientCmpProps {
  userId?: string
}

export default function ViewProfileClientCmp({ userId: propUserId }: ViewProfileClientCmpProps) {
  const params = useParams()
  const router = useRouter()
  const targetUserId = propUserId || (params?.userId as string)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Invite state
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")
  const [sendingInvite, setSendingInvite] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [alreadyInvited, setAlreadyInvited] = useState(false)

  // GitHub Skill Indexing state
  const [analyzingGithub, setAnalyzingGithub] = useState(false)
  const [githubResult, setGithubResult] = useState<{
    username: string
    reposAnalyzed: number
    skills: GithubSkillIndexResultData
  } | null>(null)
  const [githubError, setGithubError] = useState<string | null>(null)

  useEffect(() => {
    if (!targetUserId) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await profileService.viewProfile({ id: targetUserId })

        if (response.status === "success" && response.profile) {
          setProfile(response.profile)
        } else {
          setError(response.message || "Failed to load profile.")
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err)
        setError("Unable to load profile data.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [targetUserId])

  if (loading) {
    return (
     <ViewProfileLoading />
    )
  }

  if (error || !profile) {
    return (
      <NoProfileCreated error={error} />
    )
  }

  const role = profile.user?.role
  const isStudent = role === "STUDENT" || (!profile.graduatedYear && role !== "ALUMNI")
  const isAlumni = role === "ALUMNI" || Boolean(profile.graduatedYear)

  const coreSkills = profile.skills?.filter((s) => s.type === "SOFT_SKILL") || []
  const techSkills = profile.skills?.filter((s) => s.type === "HARD_SKILL" || s.type === "OTHER_HARD_SKILL") || []
  const otherSkills = profile.skills?.filter((s) => !s.type) || []

  // Check if the student has a GitHub URL set in their profile
  const hasGithubUrl = Boolean(
    profile.socialLink &&
    (profile.socialLink.includes("github.com") || profile.socialLink.includes("github"))
  )

  const getGithubUrl = () => {
    const raw = profile.socialLink || ""
    if (!raw) return ""
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
    if (raw.includes("github.com")) return `https://${raw}`
    return `https://github.com/${raw}`
  }

  const handleAnalyzeGithub = async () => {
    if (!hasGithubUrl) {
      setGithubError(
        "This student has not added their GitHub account yet. They can add it from their profile settings."
      )
      return
    }

    const targetUrl = getGithubUrl()

    try {
      setAnalyzingGithub(true)
      setGithubError(null)
      setGithubResult(null)
      const res = await skillService.githubSkillIndex(targetUrl)

      if (res.status === "success" && res.data) {
        setGithubResult(res.data)
      } else {
        setGithubError(res.message || "Failed to analyze GitHub profile.")
      }
    } catch (err: any) {
      console.error("Failed to analyze github skills", err)
      const msg =
        err?.response?.data?.message || err?.message || "Unable to index skills from GitHub."
      setGithubError(msg)
    } finally {
      setAnalyzingGithub(false)
    }
  }

  const handleSendInvite = async () => {
    if (!inviteMessage.trim()) {
      setInviteError("Please enter a message.")
      return
    }

    setSendingInvite(true)
    setInviteError(null)

    try {
      if (isStudent) {
        // Send Collaboration Invite to Student
        await collaborationService.sendCollabInvite({
          toStudentId: profile.userId,
          message_details: inviteMessage,
        })
      } else {
        // Send Mentorship Invite to Alumni
        await mentorshipService.sendMentorshipInvite({
          toAlumniId: profile.userId,
          message_details: inviteMessage,
        })
      }

      setInviteSuccess(true)
      setAlreadyInvited(true)
      setTimeout(() => {
        setInviteDialogOpen(false)
        setInviteSuccess(false)
        setInviteMessage("")
      }, 1500)
    } catch (err: any) {
      console.error("Failed to send invite", err)
      const msg =
        err?.response?.data?.message || "Failed to send invitation. Please try again."
      setInviteError(msg)
    } finally {
      setSendingInvite(false)
    }
  }

  const openInviteModal = () => {
    setInviteError(null)
    setInviteSuccess(false)
    setInviteMessage(
      isStudent
        ? `Hi ${profile.fullName || "there"}, I'd like to invite you to collaborate on a project!`
        : `Hi ${profile.fullName || "there"}, I am interested in applying for mentorship with you!`
    )
    setInviteDialogOpen(true)
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] p-4 md:p-8">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A216D] hover:text-[#1877F2] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isAlumni ? "Back to Find Mentors" : "Back to Find Collaborators"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Top Profile Header Card */}
          <ViewProfileHeaderCard
            profile={profile}
            isStudent={isStudent}
            isAlumni={isAlumni}
            alreadyInvited={alreadyInvited}
            mentorshipStatus={isAlumni ? profile.mentorshipStatus : null}
            onOpenInviteModal={openInviteModal}
          />

          {/* About & Skills Card */}
          <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm md:p-8">
            {/* About */}
            <h2 className="mb-3 text-2xl font-bold text-[#1A216D]">About</h2>
            <p className="mb-8 text-sm leading-relaxed whitespace-pre-line text-gray-700">
              {profile.aboutMe || "No bio provided."}
            </p>

            {/* Skills Header & Action */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold text-[#1A216D]">Skills</h2>

              {/* Analyze Github Skill Index Button - ONLY FOR STUDENT PROFILES */}
              {isStudent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeGithub()}
                  disabled={analyzingGithub}
                  className="inline-flex items-center gap-2 rounded-lg border-[#1877F2]/40 bg-[#F0F4FF] text-xs font-semibold text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
                >
                  {analyzingGithub ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing GitHub...
                    </>
                  ) : (
                    <>
                      <span>Analyze Github Skill Index</span>
                      <RefreshCw className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Skills Content */}
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

              {/* Fallback All Skills */}
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
                  No skills listed yet.
                </p>
              )}
            </div>

            {/* Proficiency Scale Legend */}
            <ProfiecienyScale />
          </Card>

          {/* GitHub Skill Indexing Result Error Display */}
          {githubError && (
            <Card className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
              <p className="text-sm font-semibold">{githubError}</p>
            </Card>
          )}

          {/* GitHub Skill Indexing Result Component */}
          {githubResult && (
            <GithubSkillIndexResultCmp githubResult={githubResult} />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          {/* Recognitions or Mentors overview card */}
          {isAlumni ? (
            <ProfileRecognitionsCard recognitions={profile.user?.receivedRecognitions} />
          ) : (
            <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-[#1877F2]" />
                <div>
                  <h3 className="font-bold text-[#1A216D]">Current Mentors</h3>
                  <p className="text-xs text-gray-500">
                    Student mentorship connections
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4 text-center text-xs text-gray-500">
                No active mentors connected yet.
              </div>
            </Card>
          )}

          {/* Certifications Card */}
          <Certifications certifications={profile.certifications} />
        </div>
      </div>

      {/* Invite Dialog Component */}
      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        isStudent={isStudent}
        fullName={profile.fullName}
        inviteMessage={inviteMessage}
        onMessageChange={setInviteMessage}
        sendingInvite={sendingInvite}
        inviteSuccess={inviteSuccess}
        inviteError={inviteError}
        onSendInvite={handleSendInvite}
      />
    </div>
  )
}