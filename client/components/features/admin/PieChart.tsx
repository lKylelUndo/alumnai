"use client"

import { useEffect, useRef, useState } from "react"
import {
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

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

// Below this width the outside labels collide, so the legend below the chart
// carries the names instead.
const LABEL_MIN_WIDTH = 400

export function ChartPie({ data }: { data?: PieChartItem[] }) {
  const chartData = data && data.length > 0 ? data : defaultChartData
  const frameRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState({ width: 0, height: 0 })

  // Track the drawing area so the pie scales with the card on every screen size
  useEffect(() => {
    const node = frameRef.current
    if (!node) return

    const measure = () =>
      setFrame({ width: node.clientWidth, height: node.clientHeight })

    measure()

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure)
      return () => window.removeEventListener("resize", measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const shortestSide = Math.min(frame.width, frame.height)
  const outerRadius =
    shortestSide > 0
      ? Math.max(64, Math.min(Math.round(shortestSide * 0.38), 130))
      : 95
  const showLabels = frame.width === 0 || frame.width >= LABEL_MIN_WIDTH

  return (
    <div className="flex h-full min-h-[320px] min-w-0 flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs sm:min-h-[420px] sm:p-6">
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-primary">
          Most Used Alumni Skills
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Distribution of top skills among alumni
        </p>
      </div>

      <div
        ref={frameRef}
        className="relative my-6 flex h-64 w-full items-center justify-center sm:h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                      <p className="font-semibold text-primary">
                        {payload[0].name}
                      </p>
                      <p className="font-medium text-muted-foreground">
                        Usage:{" "}
                        <span className="font-bold text-foreground">
                          {payload[0].value}%
                        </span>
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
              outerRadius={outerRadius}
              dataKey="value"
              label={
                showLabels
                  ? ({ name, value }) => `${name} ${value}%`
                  : undefined
              }
              labelLine={showLabels}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-2 text-xs">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex min-w-0 items-center gap-1.5 font-medium"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-muted-foreground">{item.name}:</span>
            <span className="font-bold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
