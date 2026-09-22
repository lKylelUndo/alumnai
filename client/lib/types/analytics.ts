import { PieChartItem } from "@/components/features/admin/PieChart"

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
  lastUpdated?: string
}