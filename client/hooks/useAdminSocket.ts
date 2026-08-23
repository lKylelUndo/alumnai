"use client"

import { useEffect } from "react"
import { useSocketContext } from "@/context/SocketContext"

type AdminRefreshTarget = "stats" | "unverified-users" | "all-users" | "alumni-requests" | "top-mentors"

interface UseAdminSocketOptions {
  target: AdminRefreshTarget
  onRefresh: () => void
}

export function useAdminSocket({ target, onRefresh }: UseAdminSocketOptions) {
  const { socket, isConnected } = useSocketContext()

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data: { targets: AdminRefreshTarget[] }) => {
      // Only re-fetch if this component's target is in the list
      if (data.targets.includes(target)) {
        onRefresh()
      }
    }

    socket.on("admin:refresh", handleRefresh)

    return () => {
      socket.off("admin:refresh", handleRefresh)
    }
  }, [socket, target, onRefresh])

  return { isConnected }
}
