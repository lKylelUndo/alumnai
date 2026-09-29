"use client"

import { useAuthContext } from "@/context/AuthContext"

const AdminWelcomeHeader = () => {
  const { user } = useAuthContext()

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        Welcome back,{" "}
        {user?.profile?.fullName?.split(" ")[0] ||
          user?.email?.split("@")[0] ||
          "Admin"}
      </h1>
      <p className="text-sm text-muted-foreground">
        Review student verifications, mentor activity, and alumni requests.
      </p>
    </div>
  )
}

export default AdminWelcomeHeader
