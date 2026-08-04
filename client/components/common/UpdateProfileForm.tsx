"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { updateProfileSchema } from "@/schema/profile"
import AddTechOrToolsDialog from "@/components/common/AddTechOrToolsDialog"
import { useAuthContext } from "@/context/AuthContext"

import ProfilePictureUpload from "./ProfilePictureUpload"
import ProfileFormFields from "./ProfileFormFields"
import { profileService } from "@/services/profile.service"
import { useRouter } from "next/navigation"
import { getProfileFormDefaultValues, User } from "@/utils/profile"
import { addSkillSchema } from "@/schema/skill"
import { authService } from "@/services/auth.service"
import { skillService } from "@/services/skill.service"

const UpdateProfileForm = () => {
  const { user, setUser } = useAuthContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [skills, setSkills] = useState<z.infer<typeof addSkillSchema>[]>([])

  const router = useRouter()

  // this form is responsible sa profile update
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: getProfileFormDefaultValues(user as User),
  })

  // butngan og initial values ang form once finished loading na ang user authcontext from the DB
  useEffect(() => {
    if (!user) return
    form.reset(getProfileFormDefaultValues(user as User))
  }, [user])

  const handleDialogSave = (data: {
    skill: Omit<z.infer<typeof addSkillSchema>, "profileId"> | null
    softSkillTags: string[]
    otherHardSkillTags: string[]
    certifications: Array<{
      name: string
      issuer: string
      fileBase64?: string
      fileName?: string
    }>
  }) => {
    const profileId = user?.profile?.id ?? ""

    setSkills((prev) => {
      // Only update hard skills if the user actually entered a skill name
      const hardSkills = prev.filter((s) => s.type === "HARD_SKILL")
      let updatedHardSkills = [...hardSkills]

      if (data.skill) {
        const existsIndex = hardSkills.findIndex(
          (s) => s.name === data.skill!.name
        )
        const newHardSkill = { ...data.skill, profileId }
        if (existsIndex >= 0) updatedHardSkills[existsIndex] = newHardSkill
        else updatedHardSkills.push(newHardSkill)
      }

      const softSkills = data.softSkillTags.map((name) => ({
        profileId,
        name,
        type: "SOFT_SKILL" as const,
      }))

      const otherHardSkills = data.otherHardSkillTags.map((name) => ({
        profileId,
        name,
        type: "OTHER_HARD_SKILL" as const,
      }))

      const result = [...updatedHardSkills, ...softSkills, ...otherHardSkills]
      console.log("🔥 New skills computed:", result)
      return result
    })

    if (data.certifications.length > 0) {
      const existingCerts = form.getValues("certifications") || []
      const newCerts = data.certifications.map((c) => ({
        profileId,
        name: c.name,
        issuer: c.issuer,
        fileBase64: c.fileBase64,
        fileName: c.fileName,
      }))
      form.setValue("certifications", [...existingCerts, ...newCerts])
    }
  }
  // Submit function
  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
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

      router.push("/alumni/profile")
    } catch (error) {
      console.error(error)
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

      <Card className="mt-8 w-full">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            All changes will be reviewed from the school dean
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProfilePictureUpload
            value={form.watch("profilePicture")}
            onChange={(base64) => form.setValue("profilePicture", base64)}
          />

          <form
            id="form-rhf-updateprofileform"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ProfileFormFields
              userRole={user?.role || ""}
              control={form.control}
              skills={skills}
              onOpenDialog={() => setDialogOpen(true)}
            />
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                form.reset()
                setSkills([])
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="form-rhf-updateprofileform"
              className="flex-1"
            >
              Update
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <AddTechOrToolsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skills={skills}
        onSave={handleDialogSave}
      />
    </div>
  )
}

export default UpdateProfileForm
