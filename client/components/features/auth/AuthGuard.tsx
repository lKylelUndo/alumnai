"use client"

import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface AuthGuardProps {
  children: ReactNode
  mode?: "GUEST" | "ADMIN" | "STUDENT" | "ALUMNI"
}

export function AuthGuard({ children, mode = "GUEST" }: AuthGuardProps) {
  const { isLoading, isAuthenticated, user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return  // wait until auth is mahuman fetch

    // not logged in — redirect to login
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // role mismatch — redirect to their correct dashboard
    if (mode === "ALUMNI" && user?.role !== "ALUMNI") {
      router.push("/")
      return;
    }
    if (mode === "STUDENT" && user?.role !== "STUDENT") {
      router.push("/")
      return
    }
    if (mode === "ADMIN" && user?.role !== "ADMIN") {
      router.push("/")
      return
    }

    // logged in user trying to access guest-only page (login/register)
    if (mode === "GUEST" && isAuthenticated) {
      if (user?.role === "ALUMNI") router.push("/alumni/dashboard")
      else if (user?.role === "STUDENT") router.push("/student/dashboard")
      else if (user?.role === "DEAN") router.push("/admin/dashboard")
    }
  }, [isLoading, isAuthenticated, user, mode])

  // only show spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying session...</p>
        </div>
      </div>
    )
  }

  // not authenticated — render nothing para walay makita na glimpse of UI while redirect happens
  if (!isAuthenticated && mode !== "GUEST") return null

  // role mismatch — render nothing para wala kay makita na glimpse of UI while redirect happens
  if (mode === "ALUMNI" && user?.role !== "ALUMNI") return null
  if (mode === "STUDENT" && user?.role !== "STUDENT") return null
  if (mode === "ADMIN" && user?.role !== "ADMIN") return null

  // guest page but user is logged in — render nothing while redirect happens
  if (mode === "GUEST" && isAuthenticated) return null

  return <>{children}</>
}
