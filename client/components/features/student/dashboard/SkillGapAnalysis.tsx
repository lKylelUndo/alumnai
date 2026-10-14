"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, Target, Sparkles, Loader2, Code, Database, Box, Layers, Globe, Server, CheckCircle } from "lucide-react"
import { skillService } from "@/services/skill.service"
import { useAuthContext } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

type SkillGapItem = {
  name: string
  alumniCount: number
  recommendation: string
}

type SkillGapAnalysisData = {
  overview: string
  missingSkills: SkillGapItem[]
  matchingSkills: Array<{ name: string; alumniCount: number }>
  workField: string
}

export default function SkillGapAnalysis() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SkillGapAnalysisData | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading: authLoading } = useAuthContext()
  const workField = user?.profile?.work_field?.trim()

  const handleAnalyze = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      const res = await skillService.analyzeSkillGap(forceRefresh)
      if (res.code === 200 && res.data) {
        setData(res.data)
        setHasAnalyzed(true)
      } else {
        setError(res.message || "Failed to analyze skill gap")
      }
    } catch (err: any) {
      console.error("Skill Gap Analysis error:", err)
      setError(err.response?.data?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Get dynamic icon based on skill name
  const getSkillIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes("docker") || lower.includes("container") || lower.includes("kubernetes")) {
      return <Box className="h-6 w-6 text-sky-500" />
    }
    if (lower.includes("word") || lower.includes("press") || lower.includes("cms")) {
      return <Globe className="h-6 w-6 text-blue-600" />
    }
    if (lower.includes("sql") || lower.includes("data") || lower.includes("mongo") || lower.includes("postgres")) {
      return <Database className="h-6 w-6 text-indigo-500" />
    }
    if (lower.includes("server") || lower.includes("aws") || lower.includes("cloud") || lower.includes("node")) {
      return <Server className="h-6 w-6 text-amber-500" />
    }
    if (lower.includes("react") || lower.includes("vue") || lower.includes("frontend") || lower.includes("next")) {
      return <Layers className="h-6 w-6 text-cyan-500" />
    }
    return <Code className="h-6 w-6 text-primary" />
  }

  // The analysis compares against alumni in the student's specialization —
  // without one there is nothing meaningful (or honest) to compare, so stop
  // here instead of burning an AI call against the backend's fallback field.
  if (!authLoading && !workField) {
    return (
      <div className="w-full space-y-4">
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Specialization required</h2>
                <p className="text-sm text-muted-foreground">
                  Set your Specialization / IT Field in your profile first — the analysis compares your skills against alumni in your field.
                </p>
              </div>
            </div>
            <Button asChild className="w-full sm:w-auto bg-[#1e2356] hover:bg-[#151940] text-white px-6 py-2.5 rounded-xl font-medium">
              <Link href="/student/profile/update">Update Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Analysis Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Settings className="h-6 w-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Skill Gap Analysis</h2>
              <p className="text-sm text-muted-foreground">
                {hasAnalyzed && data?.workField
                  ? `Compare your skills with successful alumni in ${data.workField}.`
                  : "Compare your skills with successful alumni in your chosen field."}
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleAnalyze(hasAnalyzed)}
            disabled={loading}
            className="w-full sm:w-auto bg-[#1e2356] hover:bg-[#151940] text-white px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : hasAnalyzed ? (
              <>
                <Target className="h-4 w-4" />
                Analyze Again
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Analyze Skill Gap
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Results Section */}
        {hasAnalyzed && data && (
          <div className="mt-6 space-y-6 pt-4 border-t border-border/60">
            {/* AI Overview Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>AI Overview</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                {data.overview}
              </p>
            </div>

            {/* Missing Skills Recommendations List */}
            {data.missingSkills && data.missingSkills.length > 0 ? (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Recommended Skills to Acquire
                </h3>
                <div className="space-y-3">
                  {data.missingSkills.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 rounded-xl border border-border/60 bg-background/50 p-4 transition-all hover:bg-muted/30"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                        {getSkillIcon(item.name)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">
                  Great job! You possess all the top skills commonly used by alumni in your field.
                </p>
              </div>
            )}

            {/* Matching Skills */}
            {data.matchingSkills && data.matchingSkills.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Matching Skills with Alumni
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.matchingSkills.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {item.name} ({item.alumniCount} alumni)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
