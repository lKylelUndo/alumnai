"use client";

import { useAuthContext } from "@/context/AuthContext";

const StudentWelcomeHeader = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-primary lg:text-3xl">
        Welcome back, {user?.profile?.fullName || user?.email || "Student"}
      </h1>
      <p className="text-xs text-muted-foreground md:text-sm">
        Track your growth, connect with mentors, and improve your career readiness.
      </p>
    </div>
  );
};

export default StudentWelcomeHeader;
