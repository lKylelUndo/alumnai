"use client"

import { useState, useRef } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XIcon, PaperclipIcon, Trash2Icon } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { addTechOrToolsSchema, PROFICIENCY_OPTIONS, type AddTechOrToolsFormValues, type AddTechOrToolsDialogProps } from "@/schema/skill"

export default function AddTechOrToolsDialog({ open, onOpenChange, techTags, onSave }: AddTechOrToolsDialogProps) {
  const [tags, setTags]         = useState<string[]>(techTags)
  const [tagInput, setTagInput] = useState("")
  const fileInputRefs           = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<AddTechOrToolsFormValues>({
    resolver: zodResolver(addTechOrToolsSchema),
    defaultValues: {
      name:           "",
      level:          "",
      description:    "",
      others:         "",
      certifications: [{ name: "", issuer: "", fileBase64: "", fileName: "" }],
    },
  })

  const { fields, append, remove, update } = useFieldArray({ 
    control: form.control, 
    name: "certifications" 
  })

  const watchedCerts = useWatch({ control: form.control, name: "certifications" })

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      update(index, {
        ...(form.getValues(`certifications.${index}`) ?? {}),
        fileBase64: reader.result as string,
        fileName:   file.name,
      })
    }
    reader.readAsDataURL(file)
  }

  const clearFile = (index: number) => {
    update(index, {
      ...(form.getValues(`certifications.${index}`) ?? {}),
      fileBase64: "",
      fileName:   "",
    })
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = ""
    }
  }

  const onSubmit = (values: AddTechOrToolsFormValues) => {
    const levelNumber = parseInt(values.level, 10)

    // Merge the skill name and "others" field into tech tags
    const newTags = [...new Set([
      ...tags,
      values.name,
      ...(values.others ? [values.others] : []),
    ])]

    onSave({
      skill: {
        name:        values.name,
        level:       levelNumber,
        description: values.description,
        type:        "HARD_SKILL",
      },
      certifications: (values.certifications ?? [])
        .filter((c) => c.name || c.issuer || c.fileBase64)
        .map((c) => ({
          name:       c.name    ?? "",
          issuer:     c.issuer  ?? "",
          fileBase64: c.fileBase64,
          fileName:   c.fileName,
        })),
      techTags: newTags,
    })

    // Reset dialog state
    form.reset()
    setTags(techTags)
    setTagInput("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    form.reset()
    setTags(techTags)
    setTagInput("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="lg:max-w-[800px] max-w-2xl gap-0 overflow-y-auto p-0"
        style={{ maxHeight: "90vh" }}
        showCloseButton={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-bold text-primary">
            Add Tech or Tools
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5 px-6 py-5">

            {/* ── Tech or Tools tag input ────────────────────────────────── */}
            <Field>
              <FieldLabel
                htmlFor="dialog-tech-tag-input"
                className="text-sm font-semibold text-primary"
              >
                Tech or Tools
              </FieldLabel>

              {/* Search / add bar */}
              <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  id="dialog-tech-tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Type and press Enter to add…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={13} />
                </button>
              </div>

              {/* Tag chips */}
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                  {/* "+" chip to focus the input */}
                  <button
                    type="button"
                    onClick={() => document.getElementById("dialog-tech-tag-input")?.focus()}
                    className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    <PlusIcon size={10} />
                  </button>
                </div>
              )}
            </Field>

            {/* ── Skill detail: name + proficiency + description ─────────── */}
            <div className="grid grid-cols-[1fr_auto_2fr] items-start gap-3">

              {/* name — backend: Skill.name */}
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

              {/* level — backend: Skill.level (Float? 0–100) */}
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

              {/* description — backend: Skill.description (String?) */}
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

            {/* ── Others (Optional) — free-text tag ─────────────────────── */}
            <Controller
              name="others"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel
                    htmlFor="dialog-skill-others"
                    className="text-sm font-semibold text-primary"
                  >
                    Others{" "}
                    <span className="font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="dialog-skill-others"
                    placeholder="e.g. Figma"
                    autoComplete="off"
                  />
                </Field>
              )}
            />

            {/* ── Certifications ─────────────────────────────────────────── */}
            {/* backend: Profile.certifications (Json? — updated via /api/profile/v1/update-profile) */}
            <div className="space-y-3">
              {/* Column headers */}
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

              {/* Certification rows */}
              {fields.map((certField, index) => {
                const currentFileName = watchedCerts?.[index]?.fileName ?? ""
                return (
                  <div
                    key={certField.id}
                    className="grid grid-cols-3 items-center gap-3"
                  >
                    {/* Cert name */}
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

                    {/* Cert issuer */}
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

                    {/* File upload cell */}
                    <div className="flex items-center gap-2">
                      {currentFileName ? (
                        // Show uploaded file name with trash
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
                        // Upload trigger
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

                      {/* Remove row — only if more than one */}
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

              {/* Add another certification row */}
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

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <DialogFooter className="gap-3 px-6 py-4">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
