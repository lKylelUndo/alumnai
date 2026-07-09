"use client"

import Spinner from "@/components/common/Spinner"
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

  // only show spinner while auth state is being determined
  if (isLoading) {
    return <Spinner content="Verifying session..." />
  }

  // not authenticated — render nothing para walay makita na glimpse of UI while redirect happens
  if (!isAuthenticated && mode !== "GUEST") return <Spinner content="Redirecting..."/>

  // role mismatch auth routes — render redirect spinner
  if (mode !== "GUEST" && user?.role !== mode) return <Spinner content="Redirecting..."/>

  // guest pages but user is logged in — render nothing while redirect happens
  if (mode === "GUEST" && isAuthenticated) return <Spinner content="Redirecting..."/>

  return <>{children}</>
}
