"use client"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ProfileStep } from "./profileSteps"

interface ProfileStepperProps {
  steps: ProfileStep[]
  currentIndex: number
  /**
   * Highest step the user has reached. Anything at or below it stays
   * clickable so they can go back and correct an earlier answer; anything
   * above it is locked.
   */
  furthestIndex: number
  onStepSelect: (index: number) => void
}

type StepState = "done" | "current" | "locked"

const stepStateOf = (
  index: number,
  currentIndex: number,
  furthestIndex: number
): StepState => {
  if (index === currentIndex) return "current"
  return index <= furthestIndex ? "done" : "locked"
}

const ProfileStepper = ({
  steps,
  currentIndex,
  furthestIndex,
  onStepSelect,
}: ProfileStepperProps) => {
  const currentStep = steps[currentIndex]
  const progress = ((currentIndex + 1) / steps.length) * 100

  return (
    <div>
      {/* Compact: the numbered row cannot hold three labels without crowding
          a narrow screen, so below md it becomes a caption plus a bar. */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="shrink-0 text-sm text-muted-foreground">
            Step{" "}
            <span className="font-semibold text-foreground">
              {currentIndex + 1}
            </span>{" "}
            of {steps.length}
          </p>
          <p className="min-w-0 truncate text-sm font-semibold text-foreground">
            {currentStep.label}
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Profile update progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentIndex + 1}
          className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          {/* Scale rather than width, so the bar never reflows its siblings. */}
          <div
            className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>

      <ol className="hidden md:flex md:items-center md:gap-6">
        {steps.map((step, index) => {
          const state = stepStateOf(index, currentIndex, furthestIndex)
          const isLast = index === steps.length - 1

          return (
            <li
              key={step.id}
              className={cn(
                "flex min-w-0 items-center gap-3",
                isLast ? "shrink-0" : "flex-1"
              )}
            >
              <button
                type="button"
                onClick={() => onStepSelect(index)}
                disabled={state === "locked"}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-2.5 rounded-lg text-left outline-none",
                  "focus-visible:ring-3 focus-visible:ring-primary/20",
                  state === "locked" && "cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    state === "current" && "border-primary bg-primary text-primary-foreground",
                    state === "done" &&
                      "border-primary/25 bg-primary/10 text-primary",
                    state === "locked" &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {state === "done" ? (
                    <CheckIcon className="size-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "truncate text-sm",
                    state === "current" && "font-semibold text-foreground",
                    state === "done" && "font-medium text-foreground",
                    state === "locked" && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px min-w-6 flex-1 transition-colors",
                    index < furthestIndex ? "bg-primary/30" : "bg-border"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default ProfileStepper
