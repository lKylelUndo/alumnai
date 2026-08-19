"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { skillService } from "@/services/skill.service"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SkillOption {
  id: string
  name: string
}

interface SkillAutocompleteProps {
  id?: string
  value: string
  onChange: (value: string) => void
  onSelectSkill?: (skillName: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  disabled?: boolean
  inputClassName?: string
}

export const SkillAutocomplete = forwardRef<HTMLInputElement, SkillAutocompleteProps>(
  (
    {
      id,
      value,
      onChange,
      onSelectSkill,
      onKeyDown,
      placeholder = "Search or type a skill...",
      className,
      autoFocus,
      disabled,
      inputClassName,
    },
    ref
  ) => {
    const [suggestions, setSuggestions] = useState<SkillOption[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)

    // Debounced search
    useEffect(() => {
      const query = value.trim()
      if (!query || query.length < 1) {
        setSuggestions([])
        setIsOpen(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const timer = setTimeout(async () => {
        try {
          const res = await skillService.searchSkills(query)
          if (res?.data?.skills) {
            setSuggestions(res.data.skills)
            setIsOpen(res.data.skills.length > 0)
            setHighlightedIndex(-1)
          } else {
            setSuggestions([])
            setIsOpen(false)
          }
        } catch (err) {
          console.error("Error searching skills:", err)
          setSuggestions([])
          setIsOpen(false)
        } finally {
          setIsLoading(false)
        }
      }, 250)

      return () => clearTimeout(timer)
    }, [value])

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (skillName: string) => {
      onChange(skillName)
      if (onSelectSkill) {
        onSelectSkill(skillName)
      }
      setIsOpen(false)
      setSuggestions([])
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isOpen && suggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
          return
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
          return
        }
        if (e.key === "Enter" && highlightedIndex >= 0) {
          e.preventDefault()
          handleSelect(suggestions[highlightedIndex].name)
          return
        }
        if (e.key === "Escape") {
          setIsOpen(false)
          return
        }
      }

      if (onKeyDown) {
        onKeyDown(e)
      }
    }

    return (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            autoComplete="off"
            className={cn(
              "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              inputClassName
            )}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {isOpen && suggestions.length > 0 && (
          <ul
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
            role="listbox"
          >
            {suggestions.map((skill, index) => {
              const isHighlighted = index === highlightedIndex
              return (
                <li
                  key={skill.id}
                  onClick={() => handleSelect(skill.name)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm transition-colors",
                    isHighlighted ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50"
                  )}
                  role="option"
                  aria-selected={isHighlighted}
                >
                  <span>{skill.name}</span>
                  <span className="text-xs text-muted-foreground">official skill</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }
)

SkillAutocomplete.displayName = "SkillAutocomplete"
