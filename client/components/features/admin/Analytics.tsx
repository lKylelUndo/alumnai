"use client"

import { ChartPie } from "./PieChart"

const Analytics = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Card: Most Used Alumni Skills */}
      <ChartPie />

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
              {/* Fullstack Web Development - TypeScript */}
              <div>
                <p className="text-xs font-semibold text-primary/90 mb-3">
                  Fullstack Web Development
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#007ACC] text-white font-black text-sm shadow-xs shrink-0">
                    TS
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">TypeScript</h4>
                    <p className="text-xs text-muted-foreground">Used by 40% of alumni</p>
                  </div>
                </div>
              </div>

              {/* Backend Web Development - PHP */}
              <div>
                <p className="text-xs font-semibold text-primary/90 mb-3">
                  Backend Web Development
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#777BB4] text-white font-bold text-xs shadow-xs shrink-0 italic">
                    php
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">PHP</h4>
                    <p className="text-xs text-muted-foreground">Used by 10% of alumni</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insight Badges */}
        <div className="mt-8 rounded-xl bg-muted/50 p-4 border border-border/40">
          <p className="text-xs font-semibold text-primary">Skill Growth Recommendation</p>
          <p className="text-xs text-muted-foreground mt-1">
            TypeScript continues to lead industry adoption. Consider adding advanced Fullstack TypeScript workshops for graduating students.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
