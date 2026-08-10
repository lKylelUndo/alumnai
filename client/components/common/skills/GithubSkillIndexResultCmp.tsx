"use client"

import { Card } from "@/components/ui/card"
import { Code2, Sparkles } from "lucide-react"

export interface GithubSkillIndexResultData {
  hardSkills: string[]
  softSkills: string[]
  domainFocus: string[]
  summary: string
}

interface GithubSkillIndexResultCmpProps {
  githubResult: {
    username: string
    reposAnalyzed: number
    skills: GithubSkillIndexResultData
  }
}

export default function GithubSkillIndexResultCmp({
  githubResult,
}: GithubSkillIndexResultCmpProps) {
  return (
    <Card className="rounded-xl border border-[#1877F2]/30 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
          <Code2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A216D]">
            GitHub Skill Indexing Result
          </h2>
          <p className="text-xs text-gray-500">
            Analyzed GitHub User:{" "}
            <span className="font-semibold text-gray-700">@{githubResult.username}</span>{" "}
            ({githubResult.reposAnalyzed} repositories detected)
          </p>
        </div>
      </div>

      {/* Summary */}
      {githubResult.skills.summary && (
        <div className="mb-6 rounded-lg bg-[#F8FAFC] p-4 border border-slate-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            {githubResult.skills.summary}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {/* Domain Focus */}
        {githubResult.skills.domainFocus?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Domain Focus
            </h4>
            <div className="flex flex-wrap gap-2">
              {githubResult.skills.domainFocus.map((domain, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-[#1A216D] px-3 py-1 text-xs font-semibold text-white"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hard Skills */}
        {githubResult.skills.hardSkills?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Detected Hard Skills & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {githubResult.skills.hardSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#1877F2]/30 bg-[#F0F4FF] px-3.5 py-1 text-xs font-semibold text-[#1877F2]"
                >
                  <Sparkles className="h-3 w-3 text-[#1877F2]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {githubResult.skills.softSkills?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Inferred Competencies & Soft Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {githubResult.skills.softSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
