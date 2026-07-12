"use client"

import { Controller, type Control } from "react-hook-form"
import { Link2Icon, PlusIcon } from "lucide-react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import { updateProfileSchema } from "@/schema/profile"

interface ProfileFormFieldsProps {
  control: Control<z.infer<typeof updateProfileSchema>>
  techTags: string[]
  onOpenDialog: () => void
}

export default function ProfileFormFields({ control, techTags, onOpenDialog }: ProfileFormFieldsProps) {
  return (
    <FieldGroup className="grid lg:grid-cols-2">
      <Controller
        name="fullName"
        control={control}
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

      <Controller
        name="companyName"
        control={control}
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

      <Controller
        name="current_position"
        control={control}
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

      <Controller
        name="graduationYear"
        control={control}
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

      <Field>
        <FieldLabel className="font-semibold text-primary">Tech or Tools</FieldLabel>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring">
          <span className="flex-1 truncate text-muted-foreground">
            {techTags.length > 0 ? techTags.join(", ") : "C#, React, PHP, jQuery"}
          </span>
          <button
            type="button"
            id="open-tech-tools-dialog-btn"
            onClick={onOpenDialog}
            className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
            title="Add Tech or Tools"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </Field>

      <Controller
        name="socialLinks"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="update-profile-linkedin" className="font-semibold text-primary">
              LinkedIn Profile <span className="font-normal text-muted-foreground">(Optional)</span>
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
  )
}
