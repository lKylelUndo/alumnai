"use client"

import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"

export type PieChartItem = {
  name: string
  value: number
  color: string
}

const defaultChartData: PieChartItem[] = [
  { name: "TypeScript", value: 40, color: "#2563EB" },
  { name: "JavaScript", value: 20, color: "#F59E0B" },
  { name: "React", value: 20, color: "#06B6D4" },
  { name: "PHP", value: 10, color: "#8B5CF6" },
  { name: "C#", value: 10, color: "#EF4444" },
]

export function ChartPie({ data }: { data?: PieChartItem[] }) {
  const chartData = data && data.length > 0 ? data : defaultChartData

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs h-full min-h-[420px]">
      <div>
        <h2 className="text-xl font-bold text-primary">Most Used Alumni Skills</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Distribution of top skills among alumni
        </p>
      </div>

      <div className="relative my-6 h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                      <p className="font-semibold text-primary">{payload[0].name}</p>
                      <p className="text-muted-foreground font-medium">
                        Usage: <span className="font-bold text-foreground">{payload[0].value}%</span>
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={95}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="font-bold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
