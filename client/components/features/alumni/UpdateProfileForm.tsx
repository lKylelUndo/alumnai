"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { updateProfileSchema } from "@/schema/profile"
import type { SavedSkill, HandleDialogSave } from "@/schema/profile"
import AddTechOrToolsDialog from "@/components/features/alumni/AddTechOrToolsDialog"
import { useAuthContext } from "@/context/AuthContext"

import ProfilePictureUpload from "./ProfilePictureUpload"
import ProfileFormFields from "./ProfileFormFields"
import { skillService } from "@/services/skill.service"
import { profileService } from "@/services/profile.service"

const UpdateProfileForm = () => {
  const { user } = useAuthContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [techTags, setTechTags] = useState<string[]>([])
  const [savedSkills, setSavedSkills] = useState<SavedSkill[]>([])

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      userId:           user?.id || "",
      profilePicture:   "",
      yearLevel:        "",
      graduationYear:   "",
      fullName:         "",
      work_field:       "",
      coreSkills:       [],
      socialLinks:      "",
      companyName:      "",
      current_position: "",
      certifications:   [],
    },
  })

  const handleDialogSave: HandleDialogSave = (data) => {
    setTechTags(data.techTags)
    form.setValue("coreSkills", data.coreSkills)

    setSavedSkills((prev) => {
      const exists = prev.findIndex((s) => s.name === data.skill.name)
      if (exists >= 0) {
        const updated = [...prev]
        updated[exists] = data.skill
        return updated
      }
      return [...prev, data.skill]
    })

    if (data.certifications.length > 0) {
      form.setValue(
        "certifications",
        data.certifications.map((c) => c.name).filter(Boolean)
      )
    }
  }

  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    console.log("submit")
    console.log("Profile update payload:", data)
    console.log("Skills to submit separately:", savedSkills)
    try {
      const profileUpdateResponse = await profileService.updateProfile(data)
      // const skillUpdateResponse = await skillService.addSkill(data)
      
      console.log("Profile update response:", profileUpdateResponse)
      // console.log("Skill update response:", skillUpdateResponse)
      
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
          <CardDescription>All changes will be reviewed from the school dean</CardDescription>
        </CardHeader>

        <CardContent>
          <ProfilePictureUpload
            value={form.watch("profilePicture")}
            onChange={(base64) => form.setValue("profilePicture", base64)}
          />

          <form id="form-rhf-updateprofileform" onSubmit={form.handleSubmit(onSubmit)}>
            <ProfileFormFields
              control={form.control}
              techTags={techTags}
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
                setTechTags([])
                setSavedSkills([])
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="form-rhf-updateprofileform" className="flex-1">
              Update
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <AddTechOrToolsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        techTags={techTags}
        coreSkills={form.watch("coreSkills") || []}
        onSave={handleDialogSave}
      />
    </div>
  )
}

export default UpdateProfileForm
