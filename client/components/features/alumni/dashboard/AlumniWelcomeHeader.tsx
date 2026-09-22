"use client";

import { useAuthContext } from "@/context/AuthContext";

const AlumniWelcomeHeader = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-primary lg:text-3xl">
        Hey, {user?.profile?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "Alumni"} 👋
      </h1>
      <p className="text-xs text-muted-foreground md:text-sm">
        Manage mentorships, connect with mentees, and collaborate with projects.
      </p>
    </div>
  );
};

export default AlumniWelcomeHeader;
