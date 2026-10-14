"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"

import { SkillAutocomplete } from "@/components/common/skills/SkillAutocomplete"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { AddSkillInput } from "@/schema/skill"
import {
  PROFILE_ADD_BUTTON_CLASS,
  PROFILE_AUTOCOMPLETE_CLASS,
  PROFILE_CONTROL_CLASS,
  PROFILE_DANGER_ICON_BUTTON_CLASS,
  PROFILE_ICON_BUTTON_CLASS,
  PROFILE_LABEL_CLASS,
  PROFILE_TAG_CLASS,
  PROFILE_TAG_REMOVE_CLASS,
} from "./profileSteps"

interface ProfileSkillsStepProps {
  /** Staged skills. This is the exact array the page submits. */
  skills: AddSkillInput[]
  onSkillsChange: (next: AddSkillInput[]) => void
  profileId: string
}

interface TechDraft {
  name: string
  level: string
  description: string
}

const EMPTY_TECH_DRAFT: TechDraft = { name: "", level: "", description: "" }

const ProfileSkillsStep = ({
  skills,
  onSkillsChange,
  profileId,
}: ProfileSkillsStepProps) => {
  const [techDraft, setTechDraft] = useState<TechDraft>(EMPTY_TECH_DRAFT)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [softInput, setSoftInput] = useState("")
  const [otherInput, setOtherInput] = useState("")

  const hardSkills = skills.filter((s) => s.type === "HARD_SKILL")
  const softSkills = skills.filter((s) => s.type === "SOFT_SKILL")
  const otherSkills = skills.filter((s) => s.type === "OTHER_HARD_SKILL")

  // Mirrors the ordering the dialog used to hand skills back: hard, then
  // soft, then other.
  const commit = (
    nextHard: AddSkillInput[],
    nextSoft: AddSkillInput[],
    nextOther: AddSkillInput[]
  ) => {
    onSkillsChange([...nextHard, ...nextSoft, ...nextOther])
  }

  const handleSubmitTech = () => {
    const name = techDraft.name.trim()
    if (!name) return

    const next: AddSkillInput = {
      profileId,
      name,
      level: techDraft.level ? parseFloat(techDraft.level) : undefined,
      description: techDraft.description,
      type: "HARD_SKILL",
    }

    const nextHard = [...hardSkills]
    if (editingIndex !== null && nextHard[editingIndex]) {
      nextHard[editingIndex] = next
    } else {
      const existingIndex = nextHard.findIndex((s) => s.name === name)
      if (existingIndex >= 0) nextHard[existingIndex] = next
      else nextHard.push(next)
    }

    commit(nextHard, softSkills, otherSkills)
    setTechDraft(EMPTY_TECH_DRAFT)
    setEditingIndex(null)
  }

  const handleEditTech = (index: number) => {
    const skill = hardSkills[index]
    if (!skill) return
    setEditingIndex(index)
    setTechDraft({
      name: skill.name,
      level: skill.level != null ? String(skill.level) : "",
      description: skill.description ?? "",
    })
  }

  const handleRemoveTech = (index: number) => {
    commit(
      hardSkills.filter((_, i) => i !== index),
      softSkills,
      otherSkills
    )
    if (editingIndex === index) {
      setEditingIndex(null)
      setTechDraft(EMPTY_TECH_DRAFT)
    }
  }

  const handleAddSoftTag = (skillName?: string) => {
    const trimmed = (skillName ?? softInput).trim()
    if (trimmed && !softSkills.some((s) => s.name === trimmed)) {
      commit(
        hardSkills,
        [...softSkills, { profileId, name: trimmed, type: "SOFT_SKILL" }],
        otherSkills
      )
    }
    setSoftInput("")
  }

  const handleRemoveSoftTag = (name: string) => {
    commit(
      hardSkills,
      softSkills.filter((s) => s.name !== name),
      otherSkills
    )
  }

  const handleAddOtherTag = (skillName?: string) => {
    const trimmed = (skillName ?? otherInput).trim()
    if (trimmed && !otherSkills.some((s) => s.name === trimmed)) {
      commit(
        hardSkills,
        softSkills,
        [...otherSkills, { profileId, name: trimmed, type: "OTHER_HARD_SKILL" }]
      )
    }
    setOtherInput("")
  }

  const handleRemoveOtherTag = (name: string) => {
    commit(
      hardSkills,
      softSkills,
      otherSkills.filter((s) => s.name !== name)
    )
  }

  const tagInputOnKeyDown =
    (add: (name?: string) => void) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        add()
      }
    }

  // Plain text inputs have no Enter action — suppress only, so Enter can
  // never implicitly submit the stepper form. Matches the tag inputs above.
  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault()
  }

  return (
    <div className="space-y-7">
      {skills.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nothing added yet. Add a tool below, or tag your core and other
          skills. Everything you add here is saved together when you finish.
        </p>
      )}

      {/* Tech or Tools */}
      <section>
        <h3 className="text-sm font-semibold text-primary">Tech or Tools</h3>
        <div
          aria-hidden="true"
          className="mt-2.5 h-px w-full border-t border-dashed border-border/70"
        />
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_9rem]">
            <Field>
              <FieldLabel htmlFor="update-profile-tech-name" className={PROFILE_LABEL_CLASS}>
                Tech/Tool Name
              </FieldLabel>
              <SkillAutocomplete
                id="update-profile-tech-name"
                value={techDraft.name}
                onChange={(name) =>
                  setTechDraft((prev) => ({ ...prev, name }))
                }
                placeholder="e.g. React"
                inputClassName={PROFILE_AUTOCOMPLETE_CLASS}
                onKeyDown={preventEnterSubmit}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="update-profile-tech-level" className={PROFILE_LABEL_CLASS}>
                Proficiency Level (1-5)
              </FieldLabel>
              <Input
                id="update-profile-tech-level"
                type="number"
                min={1}
                max={5}
                step={1}
                value={techDraft.level}
                onChange={(e) =>
                  setTechDraft((prev) => ({ ...prev, level: e.target.value }))
                }
                placeholder="e.g. 3"
                className={PROFILE_CONTROL_CLASS}
                onKeyDown={preventEnterSubmit}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="update-profile-tech-desc" className={PROFILE_LABEL_CLASS}>
              Short Skill Description
            </FieldLabel>
            <Input
              id="update-profile-tech-desc"
              value={techDraft.description}
              onChange={(e) =>
                setTechDraft((prev) => ({ ...prev, description: e.target.value }))
              }
                placeholder="e.g. Used in creating Interactive Web Pages"
                autoComplete="off"
                className={PROFILE_CONTROL_CLASS}
                onKeyDown={preventEnterSubmit}
              />
          </Field>
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-1.5"
            onClick={handleSubmitTech}
            disabled={!techDraft.name.trim()}
          >
            <PlusIcon className="size-4" />
            {editingIndex !== null ? "Update skill" : "Add skill"}
          </Button>

          {hardSkills.length > 0 && (
            <ul className="space-y-2">
              {hardSkills.map((skill, index) => (
                <li
                  key={`${skill.name}-${index}`}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {skill.name}
                    </p>
                    {skill.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {skill.description}
                      </p>
                    )}
                  </div>
                  {skill.level != null && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      Level {skill.level}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditTech(index)}
                    aria-label={`Edit ${skill.name}`}
                    className={PROFILE_ICON_BUTTON_CLASS}
                  >
                    <PencilIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(index)}
                    aria-label={`Remove ${skill.name}`}
                    className={PROFILE_DANGER_ICON_BUTTON_CLASS}
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Core / Soft Skills */}
      <section>
        <h3 className="text-sm font-semibold text-primary">Core / Soft Skills</h3>
        <div
          aria-hidden="true"
          className="mt-2.5 h-px w-full border-t border-dashed border-border/70"
        />
        <div className="mt-4 space-y-3">
          <div className="flex items-stretch gap-2">
            <SkillAutocomplete
              id="update-profile-soft-tag-input"
              value={softInput}
              onChange={setSoftInput}
              onSelectSkill={handleAddSoftTag}
              onKeyDown={tagInputOnKeyDown(handleAddSoftTag)}
              placeholder="Type and press Enter or pick a suggestion…"
              inputClassName={PROFILE_AUTOCOMPLETE_CLASS}
            />
            <button
              type="button"
              onClick={() => handleAddSoftTag()}
              aria-label="Add soft skill"
              className={PROFILE_ADD_BUTTON_CLASS}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          {softSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <span key={skill.name} className={PROFILE_TAG_CLASS}>
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSoftTag(skill.name)}
                    aria-label={`Remove ${skill.name}`}
                    className={PROFILE_TAG_REMOVE_CLASS}
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other Skills */}
      <section>
        <h3 className="text-sm font-semibold text-primary">Other Skills</h3>
        <div
          aria-hidden="true"
          className="mt-2.5 h-px w-full border-t border-dashed border-border/70"
        />
        <div className="mt-4 space-y-3">
          <div className="flex items-stretch gap-2">
            <SkillAutocomplete
              id="update-profile-other-tag-input"
              value={otherInput}
              onChange={setOtherInput}
              onSelectSkill={handleAddOtherTag}
              onKeyDown={tagInputOnKeyDown(handleAddOtherTag)}
              placeholder="Type and press Enter or pick a suggestion…"
              inputClassName={PROFILE_AUTOCOMPLETE_CLASS}
            />
            <button
              type="button"
              onClick={() => handleAddOtherTag()}
              aria-label="Add other skill"
              className={PROFILE_ADD_BUTTON_CLASS}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          {otherSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherSkills.map((skill) => (
                <span key={skill.name} className={PROFILE_TAG_CLASS}>
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveOtherTag(skill.name)}
                    aria-label={`Remove ${skill.name}`}
                    className={PROFILE_TAG_REMOVE_CLASS}
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs leading-snug text-muted-foreground">
            (e.g. Networking, Sound System Setup, Photography)
          </p>
        </div>
      </section>
    </div>
  )
}

export default ProfileSkillsStep
