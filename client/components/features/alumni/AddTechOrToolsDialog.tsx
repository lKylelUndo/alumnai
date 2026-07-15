"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XIcon, PaperclipIcon, Trash2Icon } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {addTechOrToolsSchema,PROFICIENCY_OPTIONS,type AddTechOrToolsFormValues,type AddTechOrToolsDialogProps } from "@/schema/skill"

export default function AddTechOrToolsDialog({open, onOpenChange, techTags, coreSkills, otherSkills: otherSkillsProp, onSave }: AddTechOrToolsDialogProps) {
  const [tags, setTags] = useState<string[]>(techTags)
  const [tagInput, setTagInput] = useState("")

  const [coreSkillsTags, setCoreSkillsTags] = useState<string[]>(coreSkills)
  const [coreSkillsInput, setCoreSkillsInput] = useState("")

  const [otherSkillsTags, setOtherSkillsTags] = useState<string[]>(otherSkillsProp ?? [])
  const [otherSkillsInput, setOtherSkillsInput] = useState("")

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
      setTags(techTags)
      setCoreSkillsTags(coreSkills)
      setOtherSkillsTags(otherSkillsProp ?? [])
      setTagInput("")
      setCoreSkillsInput("")
      setOtherSkillsInput("")
    }
  }, [open, techTags, coreSkills, otherSkillsProp])

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag))

  const addCoreSkillTag = () => {
    const trimmed = coreSkillsInput.trim()
    if (trimmed && !coreSkillsTags.includes(trimmed)) {
      setCoreSkillsTags((prev) => [...prev, trimmed])
    }
    setCoreSkillsInput("")
  }

  const removeCoreSkillTag = (tag: string) =>
    setCoreSkillsTags((prev) => prev.filter((t) => t !== tag))

  const addOtherSkillTag = () => {
    const trimmed = otherSkillsInput.trim()
    if (trimmed && !otherSkillsTags.includes(trimmed)) {
      setOtherSkillsTags((prev) => [...prev, trimmed])
    }
    setOtherSkillsInput("")
  }

  const removeOtherSkillTag = (tag: string) =>
    setOtherSkillsTags((prev) => prev.filter((t) => t !== tag))

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
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = ""
    }
  }

  const onSubmit = (values: AddTechOrToolsFormValues) => {
    const newTags = [
      ...new Set([
        ...tags,
        values.name,
      ]),
    ]

     onSave({
        // hard skill — the named tech/tool with level
        skill: {
            name: values.name,
            level: parseFloat(values.level),
            description: values.description,
            type: "HARD_SKILL",  // ← always HARD_SKILL for tech/tools
        },

        // soft skills — everything in coreSkillsTags
        coreSkills: coreSkillsTags,

        // other hard skills — non-tech abilities (networking, sound setup, etc.)
        otherSkills: otherSkillsTags,

        certifications: (values.certifications ?? [])
            .filter((c) => c.name || c.issuer || c.fileBase64)
            .map((c) => ({
                name: c.name ?? "",
                issuer: c.issuer ?? "",
                fileBase64: c.fileBase64,
                fileName: c.fileName,
            })),

        techTags: newTags,
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
            <Field>
              <FieldLabel
                htmlFor="dialog-coreskills-tag-input"
                className="text-sm font-semibold text-primary"
              >
                Core Skills
              </FieldLabel>
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
                  id="dialog-coreskills-tag-input"
                  value={coreSkillsInput}
                  onChange={(e) => setCoreSkillsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCoreSkillTag()
                    }
                  }}
                  placeholder="Type and press Enter to add core skill…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={addCoreSkillTag}
                  className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={13} />
                </button>
              </div>

              {coreSkillsTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {coreSkillsTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeCoreSkillTag(tag)}
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("dialog-coreskills-tag-input")
                        ?.focus()
                    }
                    className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    <PlusIcon size={10} />
                  </button>
                </div>
              )}
            </Field>

            {/* ── Other Skills ─────────────────────────────────── */}
            <Field>
              <FieldLabel
                htmlFor="dialog-otherskills-tag-input"
                className="text-sm font-semibold text-primary"
              >
                Other Skills
                <span className="ml-1.5 font-normal text-muted-foreground text-xs">
                  (e.g. Networking, Sound System Setup, Photography)
                </span>
              </FieldLabel>
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
                  id="dialog-otherskills-tag-input"
                  value={otherSkillsInput}
                  onChange={(e) => setOtherSkillsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addOtherSkillTag()
                    }
                  }}
                  placeholder="Type and press Enter to add other skill…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={addOtherSkillTag}
                  className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <PlusIcon size={13} />
                </button>
              </div>

              {otherSkillsTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {otherSkillsTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeOtherSkillTag(tag)}
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("dialog-otherskills-tag-input")
                        ?.focus()
                    }
                    className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    <PlusIcon size={10} />
                  </button>
                </div>
              )}
            </Field>

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
