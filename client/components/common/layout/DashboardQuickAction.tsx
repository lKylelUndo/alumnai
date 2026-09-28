import {
  Briefcase,
  SquareUserRound,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

type DashboardQuickActionTypes = {
  profileRoute: string;
  updateProfileRoute: string;
  featureRoute: string;
  featureLabel: string;
};

const actions = [
  { key: "profile", icon: SquareUserRound, label: "View My Profile" },
  { key: "edit", icon: Briefcase, label: "Edit Profile" },
  { key: "feature", icon: Users, label: "featureLabel" },
] as const;

const DashboardQuickAction = ({
  profileRoute,
  updateProfileRoute,
  featureRoute,
  featureLabel,
}: DashboardQuickActionTypes) => {
  const routeMap: Record<string, string> = {
    profile: profileRoute,
    edit: updateProfileRoute,
    feature: featureRoute,
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-5">
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Target className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-col">
        {actions.map((action) => (
          <Link
            key={action.key}
            href={routeMap[action.key]}
            className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2.5 text-center text-[11px] leading-tight font-medium text-foreground transition-all hover:border-primary/20 hover:bg-primary/[0.03] sm:min-h-0 sm:flex-row sm:gap-3 sm:px-4 sm:py-2.5 sm:text-left sm:text-sm"
          >
            <action.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0">{action.key === "feature" ? featureLabel : action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickAction;
