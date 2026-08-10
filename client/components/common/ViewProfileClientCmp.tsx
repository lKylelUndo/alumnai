"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Profile } from "@/lib/types/profile"
import { profileService } from "@/services/profile.service"
import { skillService } from "@/services/skill.service"
import { collaborationService } from "@/services/collaboration.service"
import { mentorshipService } from "@/services/mentorship.service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Certifications from "@/components/common/Certifications"
import { Briefcase,GraduationCap,LinkIcon,User,UserX,Building2,Mail,RefreshCw,ArrowLeft,CheckCircle2,Award,Users,Code2,Loader2,Sparkles,} from "lucide-react"
import { getProficiencyColor } from "@/utils/skill"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ProfiecienyScale from "./ProficiencyScale"

interface ViewProfileClientCmpProps {
  userId?: string
}

export interface GithubSkillIndexResult {
  hardSkills: string[]
  softSkills: string[]
  domainFocus: string[]
  summary: string
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
    skills: GithubSkillIndexResult
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
      <div className="mx-auto mt-8 flex w-full max-w-[1200px] items-center justify-center p-8">
        <div className="flex items-center gap-3 text-[#1A216D]">
          <Loader2 className="h-6 w-6 animate-spin text-[#1877F2]" />
          <span className="font-medium text-gray-700">Loading profile details...</span>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto mt-8 w-full max-w-[1200px] p-4 md:p-8">
        <Card className="flex flex-col items-center justify-center rounded-xl border border-[#A4B1CC] bg-white p-12 text-center shadow-sm">
          <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
            <UserX className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A216D]">
            {error || "No Profile Found"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            This user has not created a profile yet or the profile data could not be fetched.
          </p>
          <Button
            variant="outline"
            className="mt-6 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const role = profile.user?.role
  const isStudent = role === "STUDENT" || (!profile.graduatedYear && role !== "ALUMNI")
  const isAlumni = role === "ALUMNI" || Boolean(profile.graduatedYear)

  const coreSkills = profile.skills?.filter((s) => s.type === "SOFT_SKILL") || []
  const techSkills =
    profile.skills?.filter(
      (s) => s.type === "HARD_SKILL" || s.type === "OTHER_HARD_SKILL"
    ) || []
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
      setGithubError("This student has not added their GitHub account yet. They can add it from their profile settings.")
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
                  onClick={openInviteModal}
                  disabled={alreadyInvited}
                  className="rounded-full bg-[#1877F2] hover:bg-[#1565C0] px-6 py-2.5 font-semibold text-white shadow-sm transition-all"
                >
                  {alreadyInvited
                    ? "Invitation Sent"
                    : isStudent
                    ? "Send Collaboration Invite"
                    : "Apply for Mentorship"}
                </Button>
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

          {/* GitHub Skill Indexing Result Section */}
          {githubResult && (
            <Card className="rounded-xl border border-[#1877F2]/30 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1A216D]">
                    GitHub Skill Indexing Result
                  </h2>
                  <p className="text-xs text-gray-500">
                    Analyzed GitHub User:{" "}
                    <span className="font-semibold text-gray-700">@{githubResult.username}</span>{" "}
                    ({githubResult.reposAnalyzed} repositories detected)
                  </p>
                </div>
              </div>

              {/* Summary */}
              {githubResult.skills.summary && (
                <div className="mb-6 rounded-lg bg-[#F8FAFC] p-4 border border-slate-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {githubResult.skills.summary}
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {/* Domain Focus */}
                {githubResult.skills.domainFocus?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Domain Focus
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {githubResult.skills.domainFocus.map((domain, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-[#1A216D] px-3 py-1 text-xs font-semibold text-white"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hard Skills */}
                {githubResult.skills.hardSkills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Detected Hard Skills & Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {githubResult.skills.hardSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#1877F2]/30 bg-[#F0F4FF] px-3.5 py-1 text-xs font-semibold text-[#1877F2]"
                        >
                          <Sparkles className="h-3 w-3 text-[#1877F2]" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Soft Skills */}
                {githubResult.skills.softSkills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Inferred Competencies & Soft Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {githubResult.skills.softSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          {/* Recognitions or Mentors overview card */}
          {isAlumni ? (
            <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-5 w-5 text-[#1877F2]" />
                <div>
                  <h3 className="font-bold text-[#1A216D]">My Recognitions</h3>
                  <p className="text-xs text-gray-500">
                    Recognitions and thank-you notes from students you helped
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4 text-center text-xs text-gray-500">
                No public recognitions listed yet.
              </div>
            </Card>
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

      {/* Invite Dialog Modal */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1A216D]">
              {isStudent ? "Send Collaboration Invite" : "Apply for Mentorship"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Send an invitation message to{" "}
              <span className="font-semibold text-gray-700">
                {profile.fullName || "User"}
              </span>
            </DialogDescription>
          </DialogHeader>

          {inviteSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="font-semibold text-emerald-700">
                {isStudent ? "Collaboration Invite Sent!" : "Mentorship Request Sent!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Write a message..."
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={4}
                className="w-full text-sm border-gray-300 focus:border-[#1877F2]"
              />

              {inviteError && (
                <p className="text-xs text-red-600 font-medium">{inviteError}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setInviteDialogOpen(false)}
                  disabled={sendingInvite}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  disabled={sendingInvite}
                  className="bg-[#1877F2] hover:bg-[#1565C0] text-white"
                >
                  {sendingInvite ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : isStudent ? (
                    "Send Collaboration Invite"
                  ) : (
                    "Apply for Mentorship"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  )
}