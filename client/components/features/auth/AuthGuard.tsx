"use client"

import { ReactNode } from "react"

interface AuthGuardProps {
  children: ReactNode
  mode?: "GUEST" | "ADMIN" | "STUDENT" | "ALUMNI"
}

export function AuthGuard({ children, mode = "GUEST" }: AuthGuardProps) {
  return <>{children}</>
}
