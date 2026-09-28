"use client";

import { useAuthContext } from "@/context/AuthContext";

const StudentWelcomeHeader = () => {
  const { user } = useAuthContext();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        Welcome back, {user?.profile?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "Student"}
      </h1>
      <p className="text-sm text-muted-foreground">
        Track your growth, connect with mentors, and improve your career readiness.
      </p>
    </div>
  );
};

export default StudentWelcomeHeader;
