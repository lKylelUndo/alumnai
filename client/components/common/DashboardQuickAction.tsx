import { Briefcase, SquareUserRound, Target, Users } from "lucide-react"
import Link from "next/link";

type DashboardQuickActionTypes = {
  profileRoute: string;
  updateProfileRoute: string;
  featureRoute: string
}

const DashboardQuickAction = ({ profileRoute, updateProfileRoute, featureRoute }: DashboardQuickActionTypes) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs lg:col-span-1">
      <div className="space-y-4">
        <div className="flex items-center gap-x-2 font-semibold text-foreground">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold">Quick Actions</h2>
        </div>
        <div className="flex flex-col gap-y-2">
          <Link href={profileRoute}>
            <button className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground/35 hover:bg-muted">
              <SquareUserRound className="h-4 w-4 text-muted-foreground" />
              <span>View My Profile</span>
            </button>
          </Link>
          <Link href={updateProfileRoute}>
            <button className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground/35 hover:bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Edit Profile</span>
            </button>
          </Link>
         <Link href={featureRoute}>
            <button className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground/35 hover:bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Find Collaborators</span> 
              {/* unya ug student saon man */}
            </button>
         </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardQuickAction
