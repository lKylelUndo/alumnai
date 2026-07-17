"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XIcon, PaperclipIcon, Trash2Icon } from "lucide-react"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { addTechOrToolsSchema, PROFICIENCY_OPTIONS, type AddTechOrToolsFormValues } from "@/schema/skill"
import { addSkillSchema } from "@/schema/skill"
import { z } from "zod"

type Skill = z.infer<typeof addSkillSchema>

interface AddTechOrToolsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skills: Skill[]
  onSave: (data: {
    skill: Omit<Skill, "profileId">
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

  const addSoftSkillTag = () => {
    const trimmed = softSkillInput.trim()
    if (trimmed && !softSkillTags.includes(trimmed))
      setSoftSkillTags((prev) => [...prev, trimmed])
    setSoftSkillInput("")
  }

  const removeSoftSkillTag = (tag: string) =>
    setSoftSkillTags((prev) => prev.filter((t) => t !== tag))

  const addOtherHardSkillTag = () => {
    const trimmed = otherHardSkillInput.trim()
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

    onSave({
      skill: {
        name: values.name,
        level: values.level ? parseFloat(values.level) : undefined,
        description: values.description,
        type: "HARD_SKILL",
      },
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
      <DialogContent
        className="max-w-2xl gap-0 overflow-y-auto p-0 lg:max-w-[800px]"
        style={{ maxHeight: "90vh" }}
        showCloseButton={false}
      >
        <DialogHeader className="border-b px-4 pt-6 pb-4">
          <h1 className="text-xl font-bold text-primary">Add Tech or Tools</h1>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5 px-6 py-5">
            {/* Soft Skills */}
            <Field>
              <FieldLabel
                htmlFor="dialog-softskills-tag-input"
                className="text-sm font-semibold text-primary"
              >
                Core / Soft Skills
              </FieldLabel>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <input
                  id="dialog-softskills-tag-input"
                  value={softSkillInput}
                  onChange={(e) => setSoftSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSoftSkillTag()
                    }
                  }}
                  placeholder="Type and press Enter to add…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={addSoftSkillTag}
                  className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={13} />
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
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Other Hard Skills */}
            <Field>
              <FieldLabel
                htmlFor="dialog-otherskills-tag-input"
                className="text-sm font-semibold text-primary"
              >
                Other Skills
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (e.g. Networking, Sound System Setup, Photography)
                </span>
              </FieldLabel>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <input
                  id="dialog-otherskills-tag-input"
                  value={otherHardSkillInput}
                  onChange={(e) => setOtherHardSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addOtherHardSkillTag()
                    }
                  }}
                  placeholder="Type and press Enter to add…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={addOtherHardSkillTag}
                  className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={13} />
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
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Hard skill (tech/tool) */}
            <div className="grid grid-cols-[1fr_auto_2fr] items-start gap-3">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="dialog-skill-name"
                      className="text-sm font-semibold text-primary"
                    >
                      Tech/Tool Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="dialog-skill-name"
                      placeholder="e.g. React"
                      autoComplete="off"
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
                    <FieldLabel className="text-sm font-semibold text-primary">
                      Proficiency Level
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="dialog-skill-level"
                        className="w-40"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {PROFICIENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: opt.color }}
                              />
                              {opt.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      className="text-sm font-semibold text-primary"
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

            {/* Certifications */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
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
                    className="grid grid-cols-3 items-center gap-3"
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
                            className="text-muted-foreground transition hover:text-destructive"
                          >
                            <Trash2Icon size={13} />
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
                          className="shrink-0 text-muted-foreground transition hover:text-destructive"
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

          <div className="flex items-center gap-3 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
