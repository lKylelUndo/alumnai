"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { updateProfileSchema } from "@/schema/profile"
import { Loader2 } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"

import ProfilePictureUpload from "./ProfilePictureUpload"
import ProfileFormFields from "./ProfileFormFields"
import ProfileCardHeader from "./ProfileCardHeader"
import ProfileStepper from "./ProfileStepper"
import ProfileSkillsStep from "./ProfileSkillsStep"
import ProfileCertificationsStep from "./ProfileCertificationsStep"
import { createProfileSteps, PROFILE_RULE_CLASS } from "./profileSteps"
import { profileService } from "@/services/profile.service"
import { useRouter } from "next/navigation"
import { getProfileFormDefaultValues, User } from "@/utils/profile"
import { addSkillSchema } from "@/schema/skill"
import { authService } from "@/services/auth.service"
import { skillService } from "@/services/skill.service"
import { toast } from "sonner"

const UpdateProfileForm = () => {
  const { user, setUser } = useAuthContext()
  const [skills, setSkills] = useState<z.infer<typeof addSkillSchema>[]>([])

  const [stepIndex, setStepIndex] = useState(0)
  const [furthestIndex, setFurthestIndex] = useState(0)
  // While Continue's async validation is in flight, the button stays
  // disabled so a second click can't land on the Save button that mounts
  // in the same footer slot after the step transition. The Skills step has
  // no fields to validate, so its transition is synchronous — without a
  // cooldown the disabled state never paints and a double-click / tap bounce
  // retargets onto Save in the identical position.
  const [advancing, setAdvancing] = useState(false)
  // Timestamp of the last step change. onSubmit refuses submits that arrive
  // within STEP_CHANGE_COOLDOWN_MS so a click that started on Continue can
  // never finish on Save.
  const lastStepChangeAtRef = useRef(0)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const STEP_CHANGE_COOLDOWN_MS = 600
  // Mirrors stepIndex for use inside goToStep without re-creating it.
  const stepIndexRef = useRef(0)

  const router = useRouter()

  // this form is responsible sa profile update
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: getProfileFormDefaultValues(user as User),
  })

  const { formState: { isSubmitting } } = form

  // butngan og initial values ang form once finished loading na ang user authcontext from the DB
  useEffect(() => {
    if (!user) return
    form.reset(getProfileFormDefaultValues(user as User))
  }, [user, form])

  // Clear any pending cooldown timer on unmount.
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [])

  const steps = useMemo(() => createProfileSteps(user?.role || ""), [user?.role])
  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1
  const profileId = user?.profile?.id ?? ""

  const goToStep = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, steps.length - 1))
      if (clamped === stepIndexRef.current) return
      stepIndexRef.current = clamped
      setStepIndex(clamped)
      setFurthestIndex((prev) => Math.max(prev, clamped))
      // Mark every programmatic step change so the submit guard can tell a
      // retargeted Continue click apart from an intentional Save press.
      lastStepChangeAtRef.current = Date.now()
    },
    [steps.length]
  )

  // Continue only gates on the step being left. Back never validates, and the
  // step indicator only unlocks a step once the one before it has passed.
  // advancing stays true through a short cooldown after the step changes so
  // the freshly mounted Save button can't catch the tail of the same click.
  const handleContinue = useCallback(async () => {
    if (advancing) return
    setAdvancing(true)
    try {
      if (currentStep.fields.length > 0) {
        const valid = await form.trigger(currentStep.fields)
        if (!valid) {
          setAdvancing(false)
          return
        }
      } else {
        // No fields to validate means no await above and no paint in
        // between — yield one frame so the disabled state actually applies
        // before the footer swaps.
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
      goToStep(stepIndexRef.current + 1)
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = setTimeout(() => {
        setAdvancing(false)
        advanceTimerRef.current = null
      }, STEP_CHANGE_COOLDOWN_MS)
    } catch {
      setAdvancing(false)
    }
  }, [advancing, currentStep, form, goToStep])

  const handleCancel = () => {
    // Discard all unsaved changes and leave the page — the form
    // unmounts, so typed text, staged skills and the picked photo
    // are dropped automatically. Same destination as Update.
    router.push(user?.role === "ALUMNI" ? "/alumni/profile" : "/student/profile")
  }

  // The final submit validates the whole form, so an error can belong to a
  // step the user is no longer looking at. Send them to the step that owns it.
  const handleInvalid = useCallback(() => {
    const errors = form.formState.errors
    const target = steps.findIndex((step) =>
      step.fields.some((path) => {
        const value = path
          .split(".")
          .reduce<unknown>(
            (acc, key) =>
              acc && typeof acc === "object"
                ? (acc as Record<string, unknown>)[key]
                : undefined,
            errors as unknown
          )
        return Boolean(value)
      })
    )
    if (target >= 0 && target !== stepIndex) goToStep(target)
  }, [form, goToStep, stepIndex, steps])

  // Submit function
  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    // Defense-in-depth: ignore submits that arrive right after a step change.
    // A retargeted Continue click lands here within milliseconds; an
    // intentional Save press can't happen that fast because the button is
    // disabled through the cooldown.
    if (Date.now() - lastStepChangeAtRef.current < STEP_CHANGE_COOLDOWN_MS) return
    console.log("submit")
    console.log("Profile update payload:", data)
    console.log("Skills to submit separately:", skills)
    try {
      const profileUpdateResponse = await profileService.updateProfile(data)
      console.log("Profile update response:", profileUpdateResponse)

      const profileId = profileUpdateResponse?.data?.profile?.id || user?.profile?.id || ""
      const savedSkills = skills.map((skill) => ({
        ...skill,
        profileId,
      }))

      const addSkillResponses = await Promise.all(
        savedSkills.map((skill) => skillService.addSkill(skill))
      )

      console.log("🚀 ~ onSubmit ~ addSkillResponse:", addSkillResponses)

      // refetch full fresh user data from backend
      const meResponse = await authService.getMe()
      if (meResponse.code === 200) {
          setUser(meResponse.data.user)
          localStorage.setItem("user", JSON.stringify(meResponse.data.user))
      }

      toast.success("Profile updated successfully")
      router.push(user?.role === "ALUMNI" ? "/alumni/profile" : "/student/profile")
    } catch (error) {
      console.error(error)
      toast.error("Couldn't update profile")
    }
  }

  return (
    <div className="mx-auto mt-10 px-4 lg:max-w-[1000px]">
      <div>
        <h1 className="font-bold text-primary lg:text-3xl">Update Profile</h1>
        <p className="text-[14px] text-muted-foreground">
          Update your information. Changes will be reviewed by the school dean.
        </p>
      </div>

      <Card className="mt-8 w-full gap-0 rounded-2xl py-0">
        <CardHeader className="px-5 pt-5 pb-4 sm:px-7 sm:pt-6 sm:pb-5">
          <ProfileStepper
            steps={steps}
            currentIndex={stepIndex}
            furthestIndex={furthestIndex}
            onStepSelect={goToStep}
          />
        </CardHeader>

        <div aria-hidden="true" className="h-px w-full bg-border/60" />

        <CardContent className="px-5 py-6 sm:px-7 sm:py-7">
          <ProfileCardHeader
            icon={currentStep.icon}
            title={currentStep.heading}
            description={currentStep.description}
          />
          <div aria-hidden="true" className={`${PROFILE_RULE_CLASS} mb-6`} />

          <form
            id="form-rhf-updateprofileform"
            onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
          >
            {/* Every step stays mounted and the inactive ones are hidden, so
                half-typed drafts and registered fields survive going back. */}
            <div hidden={currentStep.id !== "personal"}>
              <ProfilePictureUpload
                value={form.watch("profilePicture")}
                onChange={(base64) => form.setValue("profilePicture", base64)}
              />

              <ProfileFormFields
                userRole={user?.role || ""}
                control={form.control}
                skills={skills}
              />
            </div>

            <div hidden={currentStep.id !== "skills"}>
              <ProfileSkillsStep
                skills={skills}
                onSkillsChange={setSkills}
                profileId={profileId}
              />
            </div>

            <div hidden={currentStep.id !== "certifications"}>
              <ProfileCertificationsStep form={form} profileId={profileId} />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3 rounded-b-2xl bg-popover px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
          {stepIndex === 0 ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              disabled={isSubmitting}
              onClick={() => goToStep(stepIndex - 1)}
            >
              Back
            </Button>
          )}

          {/* Single stable primary button: swapping Continue/Save via props keeps
              the same DOM node, so a click that starts on Continue can never
              retarget onto a freshly mounted Save in the same slot. */}
          <Button
            type={isLastStep ? "submit" : "button"}
            form={isLastStep ? "form-rhf-updateprofileform" : undefined}
            className="h-11 w-full font-semibold sm:w-auto sm:px-7"
            onClick={isLastStep ? undefined : handleContinue}
            disabled={isLastStep ? isSubmitting || advancing : advancing}
          >
            {isLastStep ? (
              isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
              ) : (
                "Save Changes"
              )
            ) : (
              "Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UpdateProfileForm
