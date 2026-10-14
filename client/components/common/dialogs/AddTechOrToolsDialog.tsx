"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XIcon, PaperclipIcon, Trash2Icon, WrenchIcon } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { addTechOrToolsSchema, type AddTechOrToolsFormValues } from "@/schema/skill"
import { addSkillSchema } from "@/schema/skill"
import { SkillAutocomplete } from "@/components/common/skills/SkillAutocomplete"
import { z } from "zod"

type Skill = z.infer<typeof addSkillSchema>

/* ── Shared visual language ──────────────────────────────────────────────
   The dialog is one system, not a stack of stock widgets: every text
   control gets the same 44px soft box, the same hairline, and the same
   navy focus treatment. `text-base md:text-sm` keeps mobile type at 16px
   so iOS Safari never zooms the viewport on focus. */
const CONTROL_CLASS =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-base transition-colors placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-3 focus-visible:ring-primary/15 md:text-sm"

/* SkillAutocomplete renders its own input shell; drop its shadow so it
   sits flush beside the shadcn Inputs instead of reading as raised. */
const AUTOCOMPLETE_INPUT_CLASS = `${CONTROL_CLASS} shadow-none`

/* Field only receives data-invalid, so mirror that onto the control itself —
   otherwise the red FieldError is the only error signal on screen. */
const FIELD_CLASS = "data-[invalid=true]:[&_input]:border-destructive/50"

const TAG_CLASS =
  "flex items-center gap-1 rounded-full border border-border/70 bg-muted py-0.5 pr-0.5 pl-2.5 text-xs font-medium text-foreground"

const TAG_REMOVE_CLASS =
  "-my-1 flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-primary/20"

/** Bold section title trailed by a hairline dashed rule — the dialog's
    spine, mirroring the Recipient / Requester / Request Details grouping of
    the reference. One step below the dialog title, one step above the field
    labels, so the three tiers never read as the same thing. The rule is
    decorative, so it stays out of the a11y tree. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 text-base font-semibold text-foreground">
      <span className="shrink-0">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-border/70" />
    </h3>
  )
}

interface AddTechOrToolsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skills: Skill[]
  onSave: (data: {
    skill: Omit<Skill, "profileId"> | null
    softSkillTags: string[]
    otherHardSkillTags: string[]
    certifications: Array<{
      name: string
      issuer: string
      fileBase64?: string
      fileName?: string
    }>
  }) => void
}

export default function AddTechOrToolsDialog({ open, onOpenChange, skills, onSave }: AddTechOrToolsDialogProps) {
  const existingSoftSkills = skills.filter((s) => s.type === "SOFT_SKILL").map((s) => s.name)
  const existingOtherHardSkills = skills.filter((s) => s.type === "OTHER_HARD_SKILL").map((s) => s.name)

  const [softSkillTags, setSoftSkillTags] = useState<string[]>(existingSoftSkills)
  const [softSkillInput, setSoftSkillInput] = useState("")

  const [otherHardSkillTags, setOtherHardSkillTags] = useState<string[]>(existingOtherHardSkills)
  const [otherHardSkillInput, setOtherHardSkillInput] = useState("")

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<AddTechOrToolsFormValues>({
    resolver: zodResolver(addTechOrToolsSchema),
    defaultValues: {
      name: "",
      level: "",
      description: "",
      certifications: [{ name: "", issuer: "", fileBase64: "", fileName: "" }],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "certifications",
  })

  const watchedCerts = useWatch({
    control: form.control,
    name: "certifications",
  })

  useEffect(() => {
    if (open) {
      setSoftSkillTags(existingSoftSkills)
      setOtherHardSkillTags(existingOtherHardSkills)
      setSoftSkillInput("")
      setOtherHardSkillInput("")
    }
  }, [open])

  const addSoftSkillTag = (skillName?: string) => {
    const raw = skillName ?? softSkillInput
    const trimmed = raw.trim()
    if (trimmed && !softSkillTags.includes(trimmed))
      setSoftSkillTags((prev) => [...prev, trimmed])
    setSoftSkillInput("")
  }

  const removeSoftSkillTag = (tag: string) =>
    setSoftSkillTags((prev) => prev.filter((t) => t !== tag))

  const addOtherHardSkillTag = (skillName?: string) => {
    const raw = skillName ?? otherHardSkillInput
    const trimmed = raw.trim()
    if (trimmed && !otherHardSkillTags.includes(trimmed))
      setOtherHardSkillTags((prev) => [...prev, trimmed])
    setOtherHardSkillInput("")
  }

  const removeOtherHardSkillTag = (tag: string) =>
    setOtherHardSkillTags((prev) => prev.filter((t) => t !== tag))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024 * 5) {
      form.setError(`certifications.${index}.fileBase64`, {
        type: "manual",
        message: "File size must be less than 5MB",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      update(index, {
        ...(form.getValues(`certifications.${index}`) ?? {}),
        fileBase64: reader.result as string,
        fileName: file.name,
      })
    }

    reader.readAsDataURL(file)
  }

  const clearFile = (index: number) => {
    update(index, {
      ...(form.getValues(`certifications.${index}`) ?? {}),
      fileBase64: "",
      fileName: "",
    })
    if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = ""
  }

  const onSubmit = (values: AddTechOrToolsFormValues) => {
    console.log("🔥 Dialog submitting:", { softSkillTags, otherHardSkillTags })

    const hasSkillName = values.name && values.name.trim().length > 0

    onSave({
      skill: hasSkillName
        ? {
            name: values.name!.trim(),
            level: values.level ? parseFloat(values.level) : undefined,
            description: values.description,
            type: "HARD_SKILL",
          }
        : null,
      softSkillTags,
      otherHardSkillTags,
      certifications: (values.certifications ?? [])
        .filter((c) => c.name || c.issuer || c.fileBase64)
        .map((c) => ({
          name: c.name ?? "",
          issuer: c.issuer ?? "",
          fileBase64: c.fileBase64,
          fileName: c.fileName,
        })),
    })

    form.reset()
    onOpenChange(false)
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Three width tiers, in order. Under 640px the base
          `max-w-[calc(100%-2rem)]` wins, so the card tracks the viewport and
          stays usable at 360px. The `sm:` tier replaces DialogContent's own
          `sm:max-w-sm`, which otherwise clamps the card to 384px between
          640px and 1024px while the grids below are already two-column —
          capped by the viewport so it never overflows a small tablet. */}
      <DialogContent
        className="gap-0 rounded-2xl p-0 sm:max-w-[min(var(--container-2xl),calc(100%-2rem))] lg:max-w-[800px]"
        showCloseButton={false}
      >
        <DialogHeader className="sticky top-0 z-10 flex-row items-start gap-3.5 rounded-t-2xl border-b border-border/60 bg-popover px-5 py-5 pr-16 sm:px-7 sm:py-6 sm:pr-20">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <WrenchIcon className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <DialogTitle className="text-lg leading-tight font-semibold text-foreground">
              Add Tech or Tools
            </DialogTitle>
            <p className="text-sm leading-snug text-muted-foreground">
              Every field is optional.
            </p>
          </div>
          {/* Own close button: the stock one is absolutely positioned with
              z-auto, so this sticky header's background would paint over it. */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 text-muted-foreground hover:bg-primary/10 hover:text-primary sm:top-5 sm:right-5"
            >
              <XIcon className="size-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-7">
            {/* Technical skill */}
            <section className="space-y-4">
              <SectionHeading>Technical Skill</SectionHeading>
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                      <FieldLabel
                        htmlFor="dialog-skill-name"
                        className="text-sm font-semibold text-primary"
                      >
                        Tech/Tool Name
                      </FieldLabel>
                      <SkillAutocomplete
                        id="dialog-skill-name"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="e.g. React"
                        inputClassName={AUTOCOMPLETE_INPUT_CLASS}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="level"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                      <FieldLabel
                        htmlFor="dialog-skill-level"
                        className="text-sm font-semibold text-primary"
                      >
                        Proficiency Level (1-5)
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={5}
                        step={1}
                        id="dialog-skill-level"
                        placeholder="e.g. 3"
                        className={CONTROL_CLASS}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel
                      htmlFor="dialog-skill-desc"
                      className="text-sm font-semibold text-primary"
                    >
                      Short Skill Description
                    </FieldLabel>
                    <Input
                      {...field}
                      id="dialog-skill-desc"
                      placeholder="e.g. Used in creating Interactive Web Pages"
                      autoComplete="off"
                      className={CONTROL_CLASS}
                    />
                  </Field>
                )}
              />
            </section>

            {/* Tags */}
            <section className="space-y-4">
              <SectionHeading>Tags</SectionHeading>
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="dialog-softskills-tag-input"
                    className="text-sm font-semibold text-primary"
                  >
                    Core / Soft Skills
                  </FieldLabel>
                  <div className="flex items-stretch gap-2">
                    <SkillAutocomplete
                      id="dialog-softskills-tag-input"
                      value={softSkillInput}
                      onChange={setSoftSkillInput}
                      onSelectSkill={(name) => addSoftSkillTag(name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addSoftSkillTag()
                        }
                      }}
                      placeholder="Type and press Enter or pick a suggestion…"
                      inputClassName={AUTOCOMPLETE_INPUT_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => addSoftSkillTag()}
                      aria-label="Add soft skill"
                      className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/20"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  {softSkillTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {softSkillTags.map((tag) => (
                        <span key={tag} className={TAG_CLASS}>
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeSoftSkillTag(tag)}
                            aria-label={`Remove ${tag}`}
                            className={TAG_REMOVE_CLASS}
                          >
                            <XIcon className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="dialog-otherskills-tag-input"
                    className="text-sm font-semibold text-primary"
                  >
                    Other Skills
                  </FieldLabel>
                  <div className="flex items-stretch gap-2">
                    <SkillAutocomplete
                      id="dialog-otherskills-tag-input"
                      value={otherHardSkillInput}
                      onChange={setOtherHardSkillInput}
                      onSelectSkill={(name) => addOtherHardSkillTag(name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addOtherHardSkillTag()
                        }
                      }}
                      placeholder="Type and press Enter or pick a suggestion…"
                      inputClassName={AUTOCOMPLETE_INPUT_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => addOtherHardSkillTag()}
                      aria-label="Add other skill"
                      className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/20"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  {otherHardSkillTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {otherHardSkillTags.map((tag) => (
                        <span key={tag} className={TAG_CLASS}>
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeOtherHardSkillTag(tag)}
                            aria-label={`Remove ${tag}`}
                            className={TAG_REMOVE_CLASS}
                          >
                            <XIcon className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Helper text sits under the control rather than inside the
                      label so both tag inputs keep a single-line label and stay
                      vertically aligned side by side. */}
                  <p className="text-xs leading-snug text-muted-foreground">
                    (e.g. Networking, Sound System Setup, Photography)
                  </p>
                </Field>
              </div>
            </section>

            {/* Certifications */}
            <section className="space-y-4">
              <SectionHeading>Certifications</SectionHeading>
              <div className="space-y-3">
                {/* Column labels only make sense where columns exist (desktop).
                    On mobile the inputs stack full-width and each carries its
                    own placeholder label, so showing this row would detach the
                    labels from their inputs. */}
                <div className="hidden gap-3 sm:grid sm:grid-cols-2">
                  <span className="text-sm font-semibold text-primary">
                    Certification{" "}
                    <span className="font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    Certificate Issuer
                  </span>
                  <span className="col-span-2 text-sm font-semibold text-primary">
                    Upload File
                  </span>
                </div>
                {fields.map((certField, index) => {
                  const currentFileName = watchedCerts?.[index]?.fileName ?? ""
                  return (
                    <div
                      key={certField.id}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      <Controller
                        name={`certifications.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Name of Certification"
                            autoComplete="off"
                            className={CONTROL_CLASS}
                          />
                        )}
                      />
                      <Controller
                        name={`certifications.${index}.issuer`}
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Name of Issuer"
                            autoComplete="off"
                            className={CONTROL_CLASS}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2 sm:col-span-2">
                        {currentFileName ? (
                          <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3">
                            <PaperclipIcon
                              size={14}
                              className="shrink-0 text-muted-foreground"
                            />
                            <span className="flex-1 truncate text-sm">
                              {currentFileName}
                            </span>
                            <button
                              type="button"
                              onClick={() => clearFile(index)}
                              aria-label="Remove uploaded file"
                              className="-m-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-primary/20"
                            >
                              <Trash2Icon size={14} />
                            </button>
                          </div>
                        ) : (
                          /* The input is sr-only, so focus-within carries the
                             focus ring onto this box — otherwise keyboard users
                             tab to an invisible control. */
                          <label className="flex h-11 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary focus-within:border-primary/70 focus-within:ring-3 focus-within:ring-primary/15">
                            <PaperclipIcon size={14} className="shrink-0" />
                            <span className="flex-1 truncate text-sm">
                              Insert File Here
                            </span>
                            <PlusIcon size={14} className="shrink-0" />
                            <input
                              ref={(el) => {
                                fileInputRefs.current[index] = el
                              }}
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, index)}
                            />
                          </label>
                        )}
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label="Remove certification"
                            className="-m-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-primary/20"
                          >
                            <Trash2Icon size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                <button
                  type="button"
                  onClick={() =>
                    append({ name: "", issuer: "", fileBase64: "", fileName: "" })
                  }
                  className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-primary transition-colors hover:text-primary/75 focus-visible:ring-3 focus-visible:ring-primary/20"
                >
                  <PlusIcon size={14} />
                  Add another certification
                </button>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 z-10 flex flex-col gap-3 rounded-b-2xl border-t border-border/60 bg-popover px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:pt-5 sm:pb-5">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 w-full font-semibold sm:w-auto sm:px-7"
            >
              Add Skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
