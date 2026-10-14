"use client"

import { useRef, useState } from "react"
import { useWatch } from "react-hook-form"
import { PaperclipIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  PROFILE_CONTROL_CLASS,
  PROFILE_DANGER_ICON_BUTTON_CLASS,
  PROFILE_LABEL_CLASS,
} from "./profileSteps"
import type { UpdateProfileValues } from "./profileSteps"
import type { UseFormReturn } from "react-hook-form"

interface ProfileCertificationsStepProps {
  form: UseFormReturn<UpdateProfileValues>
  profileId: string
}

const MAX_FILE_BYTES = 1024 * 1024 * 5

const ProfileCertificationsStep = ({
  form,
  profileId,
}: ProfileCertificationsStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [issuer, setIssuer] = useState("")
  const [fileBase64, setFileBase64] = useState<string | undefined>()
  const [fileName, setFileName] = useState<string | undefined>()
  const [fileError, setFileError] = useState<string | null>(null)

  const certifications =
    useWatch({ control: form.control, name: "certifications" }) ?? []
  const certErrors = form.formState.errors.certifications

  const resetDraft = () => {
    setName("")
    setIssuer("")
    setFileBase64(undefined)
    setFileName(undefined)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Plain text inputs have no Enter action — suppress only, so Enter can
  // never implicitly submit the stepper form. The file input is left
  // alone so keyboard users can still open the picker with Enter.
  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_BYTES) {
      setFileError("File size must be less than 5MB")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setFileError(null)
    const reader = new FileReader()
    reader.onload = () => {
      setFileBase64(reader.result as string)
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const clearFile = () => {
    setFileBase64(undefined)
    setFileName(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAdd = () => {
    if (!name.trim() || !issuer.trim()) return

    form.setValue("certifications", [
      ...certifications,
      { profileId, name, issuer, fileBase64, fileName },
    ])
    resetDraft()
  }

  const handleRemove = (index: number) => {
    form.setValue(
      "certifications",
      certifications.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      {certifications.length > 0 && (
        <ul className="space-y-3">
          {certifications.map((cert, index) => (
            <li
              key={cert.id ?? `${cert.name}-${index}`}
              className="rounded-lg border border-border/60 bg-background px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {cert.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {cert.issuer}
                  </p>
                  {(cert.fileName || cert.fileUrl) && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PaperclipIcon
                        size={12}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {cert.fileName || "File attached"}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove ${cert.name}`}
                  className={PROFILE_DANGER_ICON_BUTTON_CLASS}
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
              {certErrors?.[index]?.name && (
                <FieldError
                  className="mt-2"
                  errors={[certErrors[index]?.name]}
                />
              )}
              {certErrors?.[index]?.issuer && (
                <FieldError
                  className="mt-2"
                  errors={[certErrors[index]?.issuer]}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {certifications.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No certifications yet. Add one below, or continue without if you
          have none to show.
        </p>
      )}

      <div>
        <h3 className="text-sm font-semibold text-primary">Add a certification</h3>
        <div
          aria-hidden="true"
          className="mt-2.5 h-px w-full border-t border-dashed border-border/70"
        />

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="update-profile-cert-name" className={PROFILE_LABEL_CLASS}>
                Name of Certification
              </FieldLabel>
                <Input
                  id="update-profile-cert-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name of Certification"
                  autoComplete="off"
                  className={PROFILE_CONTROL_CLASS}
                  onKeyDown={preventEnterSubmit}
                />
            </Field>
            <Field>
              <FieldLabel htmlFor="update-profile-cert-issuer" className={PROFILE_LABEL_CLASS}>
                Name of Issuer
              </FieldLabel>
                <Input
                  id="update-profile-cert-issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Name of Issuer"
                  autoComplete="off"
                  className={PROFILE_CONTROL_CLASS}
                  onKeyDown={preventEnterSubmit}
                />
            </Field>
          </div>

          <Field>
            {/* Kept as two states rather than one box with a nested button:
                a button inside a label can forward its click to the file
                input. The input is sr-only, so focus-within carries the focus
                ring onto this box — otherwise keyboard users tab to an
                invisible control. */}
            {fileName ? (
              <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-input bg-background px-3">
                <PaperclipIcon
                  size={14}
                  className="shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {fileName}
                </span>
                <button
                  type="button"
                  onClick={clearFile}
                  aria-label="Remove uploaded file"
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-primary/20"
                >
                  <Trash2Icon size={14} />
                </button>
              </div>
            ) : (
              <label className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary focus-within:border-primary/70 focus-within:ring-3 focus-within:ring-primary/15">
                <PaperclipIcon size={14} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  Insert File Here
                </span>
                <PlusIcon size={14} className="shrink-0" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            )}
            {fileError && (
              <FieldError className="mt-1" errors={[{ message: fileError }]} />
            )}
          </Field>

          <Button
            type="button"
            variant="outline"
            className="h-11 gap-1.5"
            onClick={handleAdd}
            disabled={!name.trim() || !issuer.trim()}
          >
            <PlusIcon className="size-4" />
            Add certification
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCertificationsStep
