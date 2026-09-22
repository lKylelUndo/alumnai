"use client"

import { Controller, type Control } from "react-hook-form"
import { Link2Icon, PlusIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { updateProfileSchema } from "@/schema/profile"
import { Textarea } from "@/components/ui/textarea"
import { AddSkillInput } from "@/schema/skill"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthContext } from "@/context/AuthContext"
import { profileService } from "@/services/profile.service"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"

interface ProfileFormFieldsProps {
  userRole: string
  control: Control<z.infer<typeof updateProfileSchema>>
  skills: AddSkillInput[]
  onOpenDialog: () => void
}

export default function ProfileFormFields({
  userRole,
  control,
  skills,
  onOpenDialog,
}: ProfileFormFieldsProps) {
  const { user, setUser } = useAuthContext()
  const [savingAvailability, setSavingAvailability] = useState(false)

  // split skills by type for display purposes ikaw og ganahan ka i apil softskills
  const hardSkills = skills.filter((s) => s.type === "HARD_SKILL")

  const isAlumni = userRole === "ALUMNI"
  const availabilityFieldName = isAlumni ? "isAvailableForMentorship" : "isAvailableForCollaboration"
  const availabilityLabel = isAlumni ? "Available for Mentoring" : "Available for Collaboration"
  const availabilityHelper = isAlumni
    ? "Turn off to pause new mentorship/collaboration requests"
    : "Turn off to pause new collaboration requests"

  const handleAvailabilityToggle = useCallback(
    async (
      next: boolean,
      fieldOnChange: (value: boolean) => void,
    ) => {
      const undoneLabel = next
        ? availabilityLabel
        : `unavailable for ${isAlumni ? "mentoring" : "collaboration"}`
      // optimistic update
      fieldOnChange(next)
      setSavingAvailability(true)
      try {
        if (!user) throw new Error("No user")
        const updateResponse = await profileService.updateProfile({ userId: user.id, [availabilityFieldName]: next })
        // the server allowlists updatable fields — verify the flag actually persisted before celebrating
        if (
          !updateResponse ||
          updateResponse.status === "error" ||
          updateResponse?.data?.profile?.[availabilityFieldName] !== next
        ) {
          throw new Error("Availability not persisted")
        }
        const meResponse = await authService.getMe()
        if (meResponse.code === 200) {
          const updatedUser = meResponse.data.user
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
        toast.success(`You are now ${undoneLabel}`)
      } catch {
        fieldOnChange(!next)
        toast.error("Couldn't update availability")
      } finally {
        setSavingAvailability(false)
      }
    },
    [user, setUser, availabilityFieldName, availabilityLabel, isAlumni],
  )

  return (
    <FieldGroup className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Controller
        name="fullName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="update-profile-fullname"
              className="font-semibold text-primary"
            >
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

      {userRole === "ALUMNI" && (
        <>
          <Controller
            name="companyName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="update-profile-companyname"
                  className="font-semibold text-primary"
                >
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

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="current_position"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="update-profile-currentposition"
                  className="font-semibold text-primary"
                >
                  Current Position
                </FieldLabel>

                <Input
                  {...field}
                  id="update-profile-currentposition"
                  aria-invalid={fieldState.invalid}
                  placeholder="Junior Frontend Developer"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}

      <Controller
        name="work_field"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="update-profile-workfield"
              className="font-semibold text-primary"
            >
              Specialization / IT Field
            </FieldLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger id="update-profile-workfield" className="w-full">
                <SelectValue placeholder="Select your IT Field" />
              </SelectTrigger>
              <SelectContent className="mt-22">
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Backend Development">
                  Backend Development
                </SelectItem>
                <SelectItem value="Full Stack Development">
                  Full Stack Development
                </SelectItem>
                <SelectItem value="DevOps & Infrastructure">
                  DevOps & Infrastructure
                </SelectItem>
                <SelectItem value="Networking & Systems">
                  Networking & Systems
                </SelectItem>
                <SelectItem value="Data Science & AI/ML">
                  Data Science & AI/ML
                </SelectItem>
                <SelectItem value="Mobile Development">
                  Mobile Development
                </SelectItem>
                <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                <SelectItem value="Other IT Field">Other IT Field</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {userRole === "ALUMNI" && (
        <>
          <Controller
            name="graduatedYear"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="update-profile-graduatedyear"
                  className="font-semibold text-primary"
                >
                  Graduation Year
                </FieldLabel>
                <Input
                  {...field}
                  id="update-profile-graduatedyear"
                  aria-invalid={fieldState.invalid}
                  placeholder="2023"
                  autoComplete="off"
                  type="text"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}

      {userRole === "STUDENT" && (
        <>
          <Controller
            name="yearLevel"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
                <FieldLabel
                  htmlFor="update-profile-yearlevel"
                  className="font-semibold text-primary"
                >
                  Year Level
                </FieldLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger id="update-profile-yearlevel" className="w-full">
                    <SelectValue placeholder="Select your Year Level" />
                  </SelectTrigger>
                  <SelectContent className="mt-8">
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}

      <Controller
        name="aboutMe"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
            <FieldLabel
              htmlFor="update-profile-about-me"
              className="font-semibold text-primary"
            >
              About Me
            </FieldLabel>
            <Textarea
              {...field}
              id="update-profile-about-me"
              aria-invalid={fieldState.invalid}
              placeholder="Tell us about yourself"
              autoComplete="off"
              rows={4}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field>
        <FieldLabel className="font-semibold text-primary">
          Tech or Tools
        </FieldLabel>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring">
          <span className="flex-1 truncate text-muted-foreground">
            {hardSkills.length > 0
              ? hardSkills.map((s) => s.name).join(", ")
              : "C#, React, PHP, jQuery"}
          </span>
          <button
            type="button"
            id="open-tech-tools-dialog-btn"
            onClick={onOpenDialog}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
            title="Add Tech or Tools"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </Field>

      <Controller
        name="socialLink"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="update-profile-linkedin"
              className="font-semibold text-primary"
            >
              {userRole === "ALUMNI" ? "LinkedIn" : "Github"}{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
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

      <Controller
        name={availabilityFieldName}
        control={control}
        render={({ field }) => (
          <Field className="lg:col-span-2">
            <div className="flex items-center justify-between rounded-lg border border-input bg-transparent px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <FieldLabel className="font-semibold text-primary cursor-pointer">
                  {availabilityLabel}
                </FieldLabel>
                <span className="text-xs text-muted-foreground">
                  {availabilityHelper}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={field.value !== false}
                onClick={() => {
                  const next = field.value === false ? true : false
                  handleAvailabilityToggle(next, field.onChange)
                }}
                disabled={savingAvailability}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  field.value !== false ? "bg-primary" : "bg-input"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    field.value !== false ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </Field>
        )}
      />
    </FieldGroup>
  )
}
