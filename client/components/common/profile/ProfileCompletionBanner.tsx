"use client";

import Link from "next/link";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { getProfileChecklist } from "@/lib/profile-completeness";

type ProfileCompletionBannerProps = {
  role: "STUDENT" | "ALUMNI";
};

const copy: Record<
  ProfileCompletionBannerProps["role"],
  { title: string; hint: string; href: string }
> = {
  STUDENT: {
    title: "Complete your profile",
    hint: "Add these details so other users can see who you are.",
    href: "/student/profile/update",
  },
  ALUMNI: {
    title: "Welcome, alumni! Finish setting up your profile",
    hint: "Add your graduation details so students can find and recognize you.",
    href: "/alumni/profile/update",
  },
};

// Encouragement nudge, not enforcement: renders nothing while auth loads
// and disappears on its own once the checklist is empty.
const ProfileCompletionBanner = ({ role }: ProfileCompletionBannerProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading || !user) return null;

  const missing = getProfileChecklist(user.profile, role);
  if (missing.length === 0) return null;

  const { title, hint, href } = copy[role];

  return (
    <section
      aria-label="Complete your profile"
      className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UserCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {missing.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-amber-500"
                />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button asChild className="shrink-0 bg-[#1A216D] text-white hover:bg-[#131b2e]">
        <Link href={href}>Update Profile</Link>
      </Button>
    </section>
  );
};

export default ProfileCompletionBanner;
