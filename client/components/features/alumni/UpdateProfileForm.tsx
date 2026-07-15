"use client"

import { useEffect, useState } from "react"
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
import { profileService } from "@/services/profile.service"
import { useRouter } from "next/navigation"
import { skillService } from "@/services/skill.service"
import { getProfileFormDefaultValues, mergeSavedSkills, saveProfileSkills, User } from "@/utils/profile"

const UpdateProfileForm = () => {
  const { user } = useAuthContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [techTags, setTechTags] = useState<string[]>([])
  const [savedSkills, setSavedSkills] = useState<SavedSkill[]>([])
  const [otherSkills, setOtherSkills] = useState<string[]>([])

  const router = useRouter();

  // this is responsible sa profile update
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: getProfileFormDefaultValues(user as User),
  })

  // Re-populate the form once AuthContext finishes loading user from the DB
  useEffect(() => {
    if (!user) return
    form.reset(getProfileFormDefaultValues(user as User))
  }, [user])

  const handleDialogSave: HandleDialogSave = (data) => {
    setTechTags(data.techTags)
    setOtherSkills(data.otherSkills)
    form.setValue("coreSkills", data.coreSkills)

    setSavedSkills((prev) => mergeSavedSkills(prev, data.skill, data.coreSkills, data.otherSkills))

    if (data.certifications.length > 0) {
      form.setValue(
        "certifications",
        data.certifications.map((c) => c.name).filter(Boolean)
      )
    }
  }

  // Submit function
  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    console.log("submit")
    console.log("Profile update payload:", data)
    console.log("Skills to submit separately:", savedSkills)
    try {
      const profileUpdateResponse = await profileService.updateProfile(data)
      console.log("Profile update response:", profileUpdateResponse)

      // const profileId = user?.profile?.id
      // if (profileId) {
      //   await saveProfileSkills(savedSkills, profileId, skillService.addSkill)
      // }

      router.back();
      
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
        otherSkills={otherSkills}
        onSave={handleDialogSave}
      />
    </div>
  )
}

export default UpdateProfileForm
