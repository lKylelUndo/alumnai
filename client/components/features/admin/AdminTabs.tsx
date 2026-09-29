"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BarChart3, GraduationCap, UserCheck, Users } from "lucide-react"
import VerifyStudents, {
  type VerifyStudents as VerifyStudentsType,
} from "./VerifyStudents"
import TopMentors from "./TopMentors"
import AlumniRequest from "./AlumniRequest"
import UserManagement, {
  type UserManagement as UserManagementType,
} from "./UserManagement"
import Analytics from "./Analytics"
import type { TopMentors as TopMentorsType } from "@/lib/types/mentorship"
import type { AlumniRequest as AlumniRequestType } from "@/lib/types/alumni"

export const ADMIN_TABS = [
  {
    value: "verify-students",
    label: "Verify Students",
    shortLabel: "Verify",
    icon: UserCheck,
  },
  {
    value: "top-mentors",
    label: "Top Mentors",
    shortLabel: "Mentors",
    icon: Award,
  },
  {
    value: "alumni-request",
    label: "Alumni Request",
    shortLabel: "Alumni",
    icon: GraduationCap,
  },
  {
    value: "manage-users",
    label: "Manage Users",
    shortLabel: "Users",
    icon: Users,
  },
  {
    value: "analytics",
    label: "Analytics",
    shortLabel: "Analytics",
    icon: BarChart3,
  },
] as const

export type AdminTabValue = (typeof ADMIN_TABS)[number]["value"]

// The stat row (Quick Actions) and the tab panel are separate Suspense trees,
// so the selected tab lives in a provider that wraps both.
const AdminTabContext = createContext<{
  activeTab: AdminTabValue
  setActiveTab: (value: AdminTabValue) => void
} | null>(null)

export function AdminTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTabValue>("verify-students")

  return (
    <AdminTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AdminTabContext.Provider>
  )
}

export function useAdminTab() {
  const context = useContext(AdminTabContext)
  if (!context) {
    throw new Error("useAdminTab must be used inside AdminTabProvider")
  }
  return context
}

type AdminTabsProps = {
  unverifiedUsers: VerifyStudentsType[]
  topMentors: TopMentorsType[]
  alumniRequests: AlumniRequestType[]
  allUsers: UserManagementType[]
}

export function AdminTabs({
  unverifiedUsers,
  topMentors,
  alumniRequests,
  allUsers,
}: AdminTabsProps) {
  const { activeTab, setActiveTab } = useAdminTab()

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as AdminTabValue)}
      className="w-full bg-transparent"
    >
      <TabsList
        variant="none"
        aria-label="Admin dashboard sections"
        className="grid h-auto w-full auto-rows-fr grid-cols-3 gap-1 group-data-horizontal/tabs:h-auto sm:inline-flex sm:group-data-horizontal/tabs:h-8"
      >
        {ADMIN_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <tab.icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">{tab.label}</span>
            <span className="truncate text-xs sm:hidden">{tab.shortLabel}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value="verify-students"
        forceMount
        className="mt-4 bg-transparent data-[state=inactive]:hidden"
      >
        <VerifyStudents data={unverifiedUsers} />
      </TabsContent>

      <TabsContent
        value="top-mentors"
        forceMount
        className="mt-4 bg-transparent data-[state=inactive]:hidden"
      >
        <TopMentors data={topMentors} />
      </TabsContent>

      <TabsContent
        value="alumni-request"
        forceMount
        className="mt-4 bg-transparent data-[state=inactive]:hidden"
      >
        <AlumniRequest data={alumniRequests} />
      </TabsContent>

      <TabsContent
        value="manage-users"
        forceMount
        className="mt-4 bg-transparent data-[state=inactive]:hidden"
      >
        <UserManagement data={allUsers} />
      </TabsContent>

      <TabsContent
        value="analytics"
        forceMount
        className="mt-4 bg-transparent data-[state=inactive]:hidden"
      >
        {/* Loads on its own so slow AI analytics never blocks the other tabs */}
        <Analytics />
      </TabsContent>
    </Tabs>
  )
}
