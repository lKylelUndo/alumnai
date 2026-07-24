"use client"

import { ChartPie, PieChartItem } from "./PieChart"

export type TopSkillInsight = {
  field: string
  skill: string
  percentage: number
  abbreviation: string
  bgColor: string
}

export type SkillAnalyticsData = {
  pieChart: PieChartItem[]
  topSkills: TopSkillInsight[]
  recommendation: string
}

const defaultAnalytics: SkillAnalyticsData = {
  pieChart: [
    { name: "TypeScript", value: 40, color: "#1E64D4" },
    { name: "JavaScript", value: 20, color: "#EAB308" },
    { name: "React", value: 20, color: "#0047CB" },
    { name: "PHP", value: 10, color: "#0EA5E9" },
    { name: "C#", value: 10, color: "#EF4444" },
  ],
  topSkills: [
    {
      field: "Fullstack Web Development",
      skill: "TypeScript",
      percentage: 40,
      abbreviation: "TS",
      bgColor: "#007ACC",
    },
    {
      field: "Backend Web Development",
      skill: "PHP",
      percentage: 10,
      abbreviation: "PHP",
      bgColor: "#777BB4",
    },
  ],
  recommendation:
    "TypeScript continues to lead industry adoption. Consider adding advanced Fullstack TypeScript workshops for graduating students.",
}

const Analytics = ({ data }: { data?: SkillAnalyticsData }) => {
  const analytics = data ?? defaultAnalytics

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Card: Most Used Alumni Skills */}
      <ChartPie data={analytics.pieChart} />

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
  )
}

export default Analytics
