"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { axiosInstance } from "@/lib/axios"
import { SkillAnalyticsData } from "@/lib/types/analytics"

const ChartPie = dynamic(
  () => import("./PieChart").then((mod) => mod.ChartPie),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] animate-pulse rounded-xl bg-muted sm:h-[300px]" />
    ),
  }
)

const Analytics = ({ data }: { data?: SkillAnalyticsData }) => {
  const [analytics, setAnalytics] = useState<SkillAnalyticsData | null>(
    data ?? null
  )
  const [isLoading, setIsLoading] = useState(!data)
  const [loadError, setLoadError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Lazy client-side load so a cold-cache AI run never blocks the rest of the dashboard
  useEffect(() => {
    if (data) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await axiosInstance.get(
          "/api/skill/v1/get-top-alumni-skills"
        )
        if (!cancelled && res.data?.data?.skills) {
          setAnalytics(res.data.data.skills)
        } else if (!cancelled) {
          setLoadError(true)
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load skill analytics:", error)
          setLoadError(true)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [data])

  const handleRefreshAnalytics = async () => {
    try {
      setIsRefreshing(true)
      const res = await axiosInstance.get(
        "/api/skill/v1/get-top-alumni-skills?refresh=true"
      )
      if (res.data?.data?.skills) {
        setAnalytics(res.data.data.skills)
        setLoadError(false)
      }
    } catch (error) {
      console.error("Failed to refresh AI analytics:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading || !analytics) {
    return (
      <div className="space-y-4">
        <div className="h-[76px] animate-pulse rounded-2xl border border-border/80 bg-card" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[320px] animate-pulse rounded-2xl border border-border/80 bg-card sm:h-[420px]" />
          <div className="h-[320px] animate-pulse rounded-2xl border border-border/80 bg-card sm:h-[420px]" />
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/80 bg-card p-6 text-center shadow-xs sm:p-10">
        <p className="text-sm font-semibold text-primary">
          Couldn&apos;t load skill analytics
        </p>
        <p className="text-xs text-muted-foreground">
          Check your connection and try again.
        </p>
        <Button
          onClick={handleRefreshAnalytics}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="h-11 w-full gap-2 rounded-xl text-xs font-semibold sm:w-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Retrying..." : "Retry"}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-4">
      {/* Top Header Bar with Refresh Trigger */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground">
                AI Skill Trend Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Analysis is cached for 7 days to optimize performance and AI
                requests.
                {analytics.lastUpdated && (
                  <span className="mt-0.5 block font-medium text-primary/80 sm:mt-0 sm:ml-1 sm:inline">
                    • Last updated:{" "}
                    {new Date(analytics.lastUpdated).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>

          <Button
            onClick={handleRefreshAnalytics}
            disabled={isRefreshing}
            className="h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 font-medium shadow-sm transition-all sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Analyzing with AI..." : "Refresh AI Analytics"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Card: Most Used Alumni Skills */}
        {analytics.pieChart.length > 0 ? (
          <ChartPie data={analytics.pieChart} />
        ) : (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-xs sm:min-h-[420px]">
            <p className="text-sm font-semibold text-primary">
              No alumni hard skills yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Skills will appear here once alumni add them to their profiles.
            </p>
          </div>
        )}

        {/* Right Card: Key Insights */}
        <div className="flex h-full min-h-[320px] flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs sm:min-h-[420px] sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-primary">Key Insights</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Summary of skill trends and recommendations
            </p>

            <div className="mt-6 sm:mt-8">
              <h3 className="text-base font-bold text-primary">
                Overall Top Skills
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {analytics.topSkills?.map((item, idx) => (
                  <div key={idx} className="min-w-0">
                    <p className="mb-3 text-xs font-semibold text-primary/90">
                      {item.field}
                    </p>
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white shadow-xs"
                        style={{ backgroundColor: item.bgColor || "#007ACC" }}
                      >
                        {item.abbreviation}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold break-words text-foreground">
                          {item.skill}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Used by {item.percentage}% of alumni
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Insight Badges */}
          <div className="mt-8 rounded-xl border border-border/40 bg-muted/50 p-4">
            <p className="text-xs font-semibold text-primary">
              Skill Growth Recommendation
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {analytics.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
