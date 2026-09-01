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
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Target className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
      </div>

      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <Link
            key={action.key}
            href={routeMap[action.key]}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/20 hover:bg-primary/[0.03]"
          >
            <action.icon className="h-4 w-4 text-muted-foreground" />
            <span>{action.key === "feature" ? featureLabel : action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickAction;
