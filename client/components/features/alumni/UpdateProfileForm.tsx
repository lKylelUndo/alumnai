"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Field,FieldError,FieldGroup,FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateProfileSchema } from "@/schema/profile"
import type { SavedSkill, HandleDialogSave } from "@/schema/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import {Link2Icon,PlusIcon,UserRoundIcon,CameraIcon} from "lucide-react"
import AddTechOrToolsDialog from "@/components/features/alumni/AddTechOrToolsDialog"
import { useAuthContext } from "@/context/AuthContext"

const UpdateProfileForm = () => {
  const { user } = useAuthContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [techTags, setTechTags] = useState<string[]>([])
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const profilePicRef = useRef<HTMLInputElement>(null)

  // Skill data collected from dialog
  const [savedSkills, setSavedSkills] = useState<SavedSkill[]>([])

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      userId:           user?.id || "",
      email:            user?.email || "",
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

  // console.log("Form errors:", form.formState.errors)

  // Profile picture file change handler 
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setProfilePicPreview(base64)
      // Store as base64 string in the profilePicture field (backend: Profile.profilePicture String?)
      form.setValue("profilePicture", base64)
    }
    reader.readAsDataURL(file)
  }

  // Dialog save handler 
  const handleDialogSave: HandleDialogSave = (data) => {
    // Update tech tags displayed in the field
    setTechTags(data.techTags)

    // Sync core skills to the form state
    form.setValue("coreSkills", data.coreSkills)

    // Accumulate saved skills (will be submitted via skill endpoint)
    setSavedSkills((prev) => {
      const exists = prev.findIndex((s) => s.name === data.skill.name)
      if (exists >= 0) {
        const updated = [...prev]
        updated[exists] = data.skill
        return updated
      }
      return [...prev, data.skill]
    })

    // Update certifications in form (backend: Profile.certifications JSON)
    if (data.certifications.length > 0) {
      form.setValue(
        "certifications",
        data.certifications.map((c) => c.name).filter(Boolean)
      )
    }
  }

  // Form submit
  function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    console.log("submit");
    console.log("Profile update payload:", data)
    console.log("Skills to submit separately:", savedSkills)
    // TODO: call profileService.updateProfile(data) and skillService.addSkill for each skill
  }

  return (
    <div className="mx-auto mt-10 px-4 lg:max-w-[1000px]">
      {/* ── Page heading  */}
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
          {/* ── Profile picture upload ──────────────────────────────────────── */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition hover:border-primary"
                onClick={() => profilePicRef.current?.click()}
                style={{ cursor: "pointer" }}
                title="Upload profile picture"
              >
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRoundIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              {/* Camera badge */}
              <button
                type="button"
                onClick={() => profilePicRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary/90"
              >
                <CameraIcon size={12} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium">Profile Picture</p>
              <p className="text-xs text-muted-foreground">
                Click the avatar to upload a new photo (PNG, JPG)
              </p>
              {profilePicPreview && (
                <button
                  type="button"
                  className="mt-1 text-xs text-destructive hover:underline"
                  onClick={() => {
                    setProfilePicPreview(null)
                    form.setValue("profilePicture", "")
                    if (profilePicRef.current) profilePicRef.current.value = ""
                  }}
                >
                  Remove photo
                </button>
              )}
            </div>
            {/* Hidden file input — backend field: Profile.profilePicture (String?) */}
            <input
              ref={profilePicRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="sr-only"
              id="update-profile-picture-input"
              onChange={handleProfilePicChange}
            />
          </div>

          {/* ── Main form ────────────────────────────────────────────────────── */}
          <form
            id="form-rhf-updateprofileform"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="grid lg:grid-cols-2">
              {/* Full Name — backend: Profile.fullName */}
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-profile-fullname" className="font-semibold text-primary">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="update-profile-fullname"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Email — backend: User.email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-profile-email" className="font-semibold text-primary">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="update-profile-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="off"
                      type="email"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Company Name — backend: Profile.companyName */}
              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-profile-companyname" className="font-semibold text-primary">
                      Company Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="update-profile-companyname"
                      aria-invalid={fieldState.invalid}
                      placeholder="Acme Corp"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Current Position — backend: Profile.current_position */}
              <Controller
                name="current_position"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-profile-currentposition" className="font-semibold text-primary">
                      Current Position
                    </FieldLabel>
                    <Input
                      {...field}
                      id="update-profile-currentposition"
                      aria-invalid={fieldState.invalid}
                      placeholder="Junior Frontend Developer"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Graduation Year — backend: Profile (stored via updateProfileSchema) */}
              <Controller
                name="graduationYear"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-profile-graduationyear" className="font-semibold text-primary">
                      Graduation Year
                    </FieldLabel>
                    <Input
                      {...field}
                      id="update-profile-graduationyear"
                      aria-invalid={fieldState.invalid}
                      placeholder="2023"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Tech or Tools — opens dialog on + click */}
              {/* Skills are submitted separately via POST /api/skill/v1/add-skill */}
              <Field>
                <FieldLabel className="font-semibold text-primary">Tech or Tools</FieldLabel>
                <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring">
                  <span className="flex-1 truncate text-muted-foreground">
                    {techTags.length > 0
                      ? techTags.join(", ")
                      : "C#, React, PHP, jQuery"}
                  </span>
                  <button
                    type="button"
                    id="open-tech-tools-dialog-btn"
                    onClick={() => setDialogOpen(true)}
                    className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
                    title="Add Tech or Tools"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>
              </Field>

              {/* LinkedIn Profile — backend: Profile.socialLinks (JSON) */}
              <Controller
                name="socialLinks"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-profile-linkedin" className="font-semibold text-primary">
                      LinkedIn Profile{" "}
                      <span className="font-normal text-muted-foreground">(Optional)</span>
                    </FieldLabel>
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                      <input
                        {...field}
                        id="update-profile-linkedin"
                        aria-invalid={fieldState.invalid}
                        placeholder="Paste link here"
                        autoComplete="off"
                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                      />
                      <Link2Icon size={16} className="shrink-0 text-muted-foreground" />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
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
                setProfilePicPreview(null)
                setSavedSkills([])
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

      {/* ── Add Tech or Tools Dialog ──────────────────────────────────────────── */}
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
