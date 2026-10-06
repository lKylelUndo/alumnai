"use client"

import Spinner from "@/components/common/layout/Spinner"
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

    // not logged in on a protected page — redirect to login.
    // GUEST pages (login/register/forgot/reset) are public by design,
    // so logged-out visitors must be allowed to stay (e.g. reset links
    // opened from email while logged out).
    if (!isAuthenticated && mode !== "GUEST") {
      router.push("/login")
      return
    }

    // role mismatch authenticated routes — redirect to their respective dashboard
    if (mode !== "GUEST" && user?.role !== mode) {
      if (user?.role === "ALUMNI") router.push("/alumni/dashboard")
      else if (user?.role === "STUDENT") router.push("/student/dashboard")
      else if (user?.role === "ADMIN") router.push("/admin/dashboard")
      else router.push("/")
      return
    }

    // logged in user trying to access guest-only page (login/register)
    if (mode === "GUEST" && isAuthenticated) {
      if (user?.role === "ALUMNI") router.push("/alumni/dashboard")
      else if (user?.role === "STUDENT") router.push("/student/dashboard")
      else if (user?.role === "ADMIN") router.push("/admin/dashboard")
    }
  }, [isLoading, isAuthenticated, user, mode])

  // guest pages render immediately — no need to verify auth before showing login/register
  if (mode === "GUEST") {
    // logged-in user on guest page — replace content with the loader, never
    // stack it below the form (the loader is min-h-screen and would double
    // the document height).
    if (isAuthenticated) {
      return <Spinner content="Redirecting..." />
    }
    return <>{children}</>
  }

  // only show spinner while auth state is being determined for protected routes
  if (isLoading) {
    return <Spinner content="Verifying session..." />
  }

  // not authenticated — render nothing para walay makita na glimpse of UI while redirect happens
  if (!isAuthenticated) return <Spinner content="Redirecting..."/>

  // role mismatch auth routes — render redirect spinner
  if (user?.role !== mode) return <Spinner content="Redirecting..."/>

  return <>{children}</>
}
