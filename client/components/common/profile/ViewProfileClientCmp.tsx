"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Profile } from "@/lib/types/profile"
import { profileService } from "@/services/profile.service"
import { skillService } from "@/services/skill.service"
import { collaborationService } from "@/services/collaboration.service"
import { mentorshipService } from "@/services/mentorship.service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Certifications from "@/components/common/layout/Certifications"
import ViewProfileHeaderCard, {
  PendingMentorshipRequest,
} from "@/components/common/profile/ViewProfileHeaderCard"
import InviteDialog from "@/components/common/dialogs/InviteDialog"
import GithubSkillIndexResultCmp, { GithubSkillIndexResultData } from "@/components/common/skills/GithubSkillIndexResultCmp"
import ProfileRecognitionsCard from "./ProfileRecognitionsCard"
import { RefreshCw, ArrowLeft, Users, Loader2, User, Sparkles } from "lucide-react"
import Image from "next/image"
import ProfileCardHeader from "./ProfileCardHeader"
import { getProficiencyColor } from "@/utils/skill"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import NoProfileCreated from "./NoProfileCreated"
import ViewProfileLoading from "./ViewProfileLoading"

interface ViewProfileClientCmpProps {
  userId?: string
}

type ViewableProfile = Profile & {
  alreadyInvitedCollaboration: boolean
  pendingMentorshipRequest: PendingMentorshipRequest | null
}

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: { message?: string } } }).response?.data
    if (typeof data?.message === "string") return data.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export default function ViewProfileClientCmp({ userId: propUserId }: ViewProfileClientCmpProps) {
  const params = useParams()
  const targetUserId = propUserId || (params?.userId as string)

  const [profile, setProfile] = useState<ViewableProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Invite state
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")
  const [sendingInvite, setSendingInvite] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const [mentorshipRequestPending, setMentorshipRequestPending] = useState(false)

  // Mentors of the viewed student (visitor-safe endpoint — works for alumni,
  // student, and admin viewers alike). Same shape as getMyMentors.
  interface ViewedMentor {
    toAlumniId: string
    fullName: string
    currentPosition?: string | null
    companyName?: string | null
    profilePicture?: string | null
  }

  const [viewedMentors, setViewedMentors] = useState<ViewedMentor[]>([])
  const [mentorsLoading, setMentorsLoading] = useState(false)

  // GitHub Skill Indexing state
  const [analyzingGithub, setAnalyzingGithub] = useState(false)
  const [githubResult, setGithubResult] = useState<{
    username: string
    reposAnalyzed: number
    skills: GithubSkillIndexResultData
  } | null>(null)
  const [githubError, setGithubError] = useState<string | null>(null)

  const fetchProfileRef = useRef<((silent?: boolean) => Promise<void>) | null>(null)

  useEffect(() => {
    if (!targetUserId) return

    const fetchProfile = async (silent = false) => {
      try {
        if (!silent) setLoading(true)
        setError(null)
        const response = await profileService.viewProfile({ id: targetUserId })

        if (response.status === "success" && response.profile) {
          setProfile(response.profile)
        } else if (!silent) {
          setError(response.message || "Failed to load profile.")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        if (!silent) setError("Unable to load profile data.")
      } finally {
        if (!silent) setLoading(false)
      }
    }

    fetchProfileRef.current = fetchProfile
    fetchProfile()

    return () => {
      fetchProfileRef.current = null
    }
  }, [targetUserId])

  // Fetch the viewed student's mentors once the profile loads and we know
  // it's a student. Alumni viewers previously saw a hardcoded empty card.
  useEffect(() => {
    if (!targetUserId || !profile) return
    const role = profile.user?.role
    const viewingStudent = role === "STUDENT" || (!profile.graduatedYear && role !== "ALUMNI")
    if (!viewingStudent) return

    const fetchMentors = async () => {
      try {
        setMentorsLoading(true)
        const res = await mentorshipService.getStudentMentors(profile.userId)
        if (res.status === "success" && Array.isArray(res.data)) {
          setViewedMentors(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch viewed student mentors:", err)
      } finally {
        setMentorsLoading(false)
      }
    }
    fetchMentors()
  }, [targetUserId, profile])

  const refreshProfile = useCallback(async () => {
    await fetchProfileRef.current?.(true)
  }, [])

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
  const otherSkills = profile.skills?.filter((s) => s.type === "OTHER_HARD_SKILL") || []

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
    } catch (error) {
      console.error("Failed to analyze github skills", error)
      setGithubError(getApiErrorMessage(error, "Unable to index skills from GitHub."))
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
        await collaborationService.sendCollabInvite({
          toStudentId: profile.userId,
          message_details: inviteMessage,
        })
      } else {
        await mentorshipService.sendMentorshipInvite({
          toAlumniId: profile.userId,
          message_details: inviteMessage,
        })
      }

      setInviteSuccess(true)
      setTimeout(() => {
        setInviteDialogOpen(false)
        setInviteSuccess(false)
        setInviteMessage("")
      }, 1500)
      await refreshProfile()
    } catch (error) {
      console.error("Failed to send invite", error)
      setInviteError(getApiErrorMessage(error, "Failed to send invitation. Please try again."))
    } finally {
      setSendingInvite(false)
    }
  }

  const handleMentorshipRequestAction = async (action: "ACCEPT" | "REJECT") => {
    const request = profile.pendingMentorshipRequest
    if (!request || mentorshipRequestPending) return

    setMentorshipRequestPending(true)
    try {
      const response =
        action === "ACCEPT"
          ? await mentorshipService.acceptMentorship({
              mentorshipRecordId: request.mentorshipRecordId,
            })
          : await mentorshipService.declineMentorship({
              mentorshipRecordId: request.mentorshipRecordId,
            })

      if (response.status === "success") {
        toast.success(
          action === "ACCEPT" ? "Mentorship request accepted" : "Mentorship request declined"
        )
        await refreshProfile()
      }
    } catch (error) {
      console.error("Failed to update mentorship request:", error)
    } finally {
      setMentorshipRequestPending(false)
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
    <div className="bg-muted/40 lg:min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:py-16">
        {/* Back Button */}
        <div className="mb-4 print:hidden">
          <Link
            href={isAlumni ? "/student/find-mentors" : "/alumni/find-collaborators"}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAlumni ? "Back to Find Mentors" : "Back to Find Collaborators"}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Header / Hero Section - Full Width */}
          <div className="lg:col-span-12">
            <ViewProfileHeaderCard
              profile={profile}
              isStudent={isStudent}
              isAlumni={isAlumni}
              alreadyInvited={profile.alreadyInvitedCollaboration}
              mentorshipStatus={isAlumni ? profile.mentorshipStatus : null}
              pendingMentorshipRequest={profile.pendingMentorshipRequest}
              requestActionPending={mentorshipRequestPending}
              onOpenInviteModal={openInviteModal}
              onAcceptMentorshipRequest={() => handleMentorshipRequestAction("ACCEPT")}
              onRejectMentorshipRequest={() => handleMentorshipRequestAction("REJECT")}
            />
          </div>

          {/* Left Column: About & Skills */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-8">
            {/* About Section */}
            <Card className="rounded-2xl p-6 md:p-8">
              <ProfileCardHeader icon={User} title="About" />
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {profile.aboutMe || "No bio provided."}
              </p>
            </Card>

            {/* Skills Section */}
            <Card className="rounded-2xl p-6 md:p-8">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <ProfileCardHeader icon={Sparkles} title="Skills" />

                {isStudent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyzeGithub()}
                    disabled={analyzingGithub}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-primary/30 bg-primary/10 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground print:hidden"
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

                {/* Tools & Technology / Hard Skills */}
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
              </div>

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

          {/* Right Column */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-4">
            {/* Recognitions or Mentors overview card */}
            {isAlumni ? (
              <ProfileRecognitionsCard recognitions={profile.user?.receivedRecognitions} />
            ) : (
              <Card className="rounded-2xl p-6">
                <ProfileCardHeader
                  icon={Users}
                  title="Current Mentors"
                  description={
                    mentorsLoading
                      ? "Loading mentors..."
                      : viewedMentors.length > 0
                      ? `Currently have ${viewedMentors.length} mentor${viewedMentors.length > 1 ? "s" : ""}`
                      : "Student mentorship connections"
                  }
                />
                {viewedMentors.length > 0 ? (
                  <div className="space-y-4">
                    {viewedMentors.map((mentor) => (
                      <div
                        key={mentor.toAlumniId}
                        className="flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            {mentor.profilePicture ? (
                              <Image
                                src={mentor.profilePicture}
                                alt={mentor.fullName}
                                width={40}
                                height={40}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold leading-tight text-foreground">
                              {mentor.fullName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {mentor.currentPosition || "Mentor"}
                              {mentor.companyName ? ` @ ${mentor.companyName}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !mentorsLoading && (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                      <Users className="mb-2 h-10 w-10 text-muted-foreground/50" />
                      <p className="text-sm">No active mentors connected yet.</p>
                    </div>
                  )
                )}
              </Card>
            )}

            {/* Certifications Card */}
            <Certifications certifications={profile.certifications} ownerUserId={profile.userId} />
          </div>
        </div>
      </main>

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
