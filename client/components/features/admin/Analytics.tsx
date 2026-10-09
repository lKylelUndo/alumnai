"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminService } from "@/services/admin.service"
import { SkillAnalyticsData } from "@/lib/types/analytics"

const ChartPie = dynamic(() => import("./PieChart").then((mod) => mod.ChartPie), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse bg-muted rounded-xl" />,
})

const Analytics = ({ data }: { data?: SkillAnalyticsData }) => {
  const [analytics, setAnalytics] = useState<SkillAnalyticsData | null>(data ?? null)
  const [isLoading, setIsLoading] = useState(!data)
  const [loadError, setLoadError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Lazy client-side load so a cold-cache AI run never blocks the rest of the dashboard
  useEffect(() => {
    if (data) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await adminService.getSkillTrendAnalytics()
        if (!cancelled && res.data?.skills) {
          setAnalytics(res.data.skills)
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
      const res = await adminService.getSkillTrendAnalytics(true)
      if (res.data?.skills) {
        setAnalytics(res.data.skills)
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
          <div className="h-[420px] animate-pulse rounded-2xl border border-border/80 bg-card" />
          <div className="h-[420px] animate-pulse rounded-2xl border border-border/80 bg-card" />
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/80 bg-card p-10 text-center shadow-xs">
        <p className="text-sm font-semibold text-primary">Couldn&apos;t load skill analytics</p>
        <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
        <Button
          onClick={handleRefreshAnalytics}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Retrying..." : "Retry"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top Header Bar with Refresh Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            AI Skill Trend Analytics
          </h2>
          <p className="text-xs text-muted-foreground">
            Analysis is cached for 7 days to optimize performance and AI requests.
            {analytics.lastUpdated && (
              <span className="ml-1 text-primary/80 font-medium">
                • Last updated: {new Date(analytics.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>

        <Button
          onClick={handleRefreshAnalytics}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Analyzing with AI..." : "Refresh AI Analytics"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Card: Most Used Alumni Skills */}
        {analytics.pieChart.length > 0 ? (
          <ChartPie data={analytics.pieChart} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 shadow-xs h-full min-h-[420px] text-center">
            <p className="text-sm font-semibold text-primary">No alumni hard skills yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Skills will appear here once alumni add them to their profiles.
            </p>
          </div>
        )}

        {/* Right Card: Key Insights */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs h-full min-h-[420px]">
          <div>
            <h2 className="text-xl font-bold text-primary">Key Insights</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Summary of skill trends and recommendations
            </p>

            <div className="mt-8">
              <h3 className="text-base font-bold text-primary">Overall Top Skills</h3>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {analytics.topSkills?.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-semibold text-primary/90 mb-3">
                      {item.field}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-white font-black text-sm shadow-xs shrink-0"
                        style={{ backgroundColor: item.bgColor || "#007ACC" }}
                      >
                        {item.abbreviation}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-foreground">{item.skill}</h4>
                        <p className="text-xs text-muted-foreground">Used by {item.percentage}% of alumni</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Insight Badges */}
          <div className="mt-8 rounded-xl bg-muted/50 p-4 border border-border/40">
            <p className="text-xs font-semibold text-primary">Skill Growth Recommendation</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics