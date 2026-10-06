"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XIcon, PaperclipIcon, Trash2Icon } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { addTechOrToolsSchema, type AddTechOrToolsFormValues } from "@/schema/skill"
import { addSkillSchema } from "@/schema/skill"
import { SkillAutocomplete } from "@/components/common/skills/SkillAutocomplete"
import { z } from "zod"

type Skill = z.infer<typeof addSkillSchema>

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
      <DialogContent className="max-w-2xl gap-0 p-0 lg:max-w-[800px]" showCloseButton={false}>
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-popover px-4 pt-6 pb-4 pr-12">
          <DialogTitle className="text-lg font-bold text-primary sm:text-xl">Add Tech or Tools</DialogTitle>
          {/* Own close button: the stock one is absolutely positioned with
              z-auto, so this sticky header's background would paint over it. */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close dialog"
              className="absolute top-2 right-2 z-20 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
            {/* Soft Skills */}
            <Field>
              <FieldLabel
                htmlFor="dialog-softskills-tag-input"
                className="text-xs font-semibold text-primary sm:text-sm"
              >
                Core / Soft Skills
              </FieldLabel>
              <div className="flex items-center gap-2">
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
                />
                <button
                  type="button"
                  onClick={() => addSoftSkillTag()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={15} />
                </button>
              </div>
              {softSkillTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {softSkillTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeSoftSkillTag(tag)}
                        aria-label={`Remove ${tag}`}
                        className="-m-1.5 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      >
                        <XIcon size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Hard skill (tech/tool) */}
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[1fr_auto_2fr]">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="dialog-skill-name"
                      className="text-xs font-semibold text-primary sm:text-sm"
                    >
                      Tech/Tool Name
                    </FieldLabel>
                    <SkillAutocomplete
                      id="dialog-skill-name"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="e.g. React"
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="dialog-skill-level"
                      className="text-xs font-semibold text-primary sm:text-sm"
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
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel
                      htmlFor="dialog-skill-desc"
                      className="text-xs font-semibold text-primary sm:text-sm"
                    >
                      Short Skill Description
                    </FieldLabel>
                    <Input
                      {...field}
                      id="dialog-skill-desc"
                      placeholder="e.g. Used in creating Interactive Web Pages"
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
            </div>

            {/* Other Hard Skills */}
            <Field>
              <FieldLabel
                htmlFor="dialog-otherskills-tag-input"
                className="text-xs font-semibold text-primary sm:text-sm"
              >
                Other Skills
                <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground sm:ml-1.5 sm:mt-0 sm:inline sm:text-xs">
                  (e.g. Networking, Sound System Setup, Photography)
                </span>
              </FieldLabel>
              <div className="flex items-center gap-2">
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
                />
                <button
                  type="button"
                  onClick={() => addOtherHardSkillTag()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={15} />
                </button>
              </div>
              {otherHardSkillTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {otherHardSkillTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeOtherHardSkillTag(tag)}
                        aria-label={`Remove ${tag}`}
                        className="-m-1.5 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      >
                        <XIcon size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Certifications */}
            <div className="space-y-3">
              {/* Column labels only make sense where columns exist (desktop).
                  On mobile the inputs stack full-width and each carries its
                  own placeholder label, so showing this row would detach the
                  labels from their inputs. */}
              <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-3">
                <span className="text-sm font-semibold text-primary">
                  Certification{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </span>
                <span className="text-sm font-semibold text-primary">
                  Certificate Issuer
                </span>
                <span className="text-sm font-semibold text-primary">
                  Upload File
                </span>
              </div>
              {fields.map((certField, index) => {
                const currentFileName = watchedCerts?.[index]?.fileName ?? ""
                return (
                  <div
                    key={certField.id}
                    className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3"
                  >
                    <Controller
                      name={`certifications.${index}.name`}
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Name of Certification"
                          autoComplete="off"
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
                        />
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {currentFileName ? (
                        <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm">
                          <PaperclipIcon
                            size={13}
                            className="shrink-0 text-muted-foreground"
                          />
                          <span className="flex-1 truncate text-xs">
                            {currentFileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => clearFile(index)}
                            aria-label="Remove uploaded file"
                            className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2Icon size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input bg-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
                          <PaperclipIcon size={13} className="shrink-0" />
                          <span className="flex-1 truncate text-xs">
                            Insert File Here
                          </span>
                          <PlusIcon size={13} className="shrink-0" />
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
                          className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
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
                className="flex items-center gap-1.5 text-xs text-primary transition hover:underline"
              >
                <PlusIcon size={12} />
                Add another certification
              </button>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-popover px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
