"use client"

import { useEffect } from "react"
import { useSocketContext } from "@/context/SocketContext"

type AdminRefreshTarget = "stats" | "unverified-users" | "all-users" | "alumni-requests" | "top-mentors"

interface UseAdminSocketOptions {
  target: AdminRefreshTarget
  onRefresh: (data?: { targets: AdminRefreshTarget[]; message?: string }) => void
}

export function useAdminSocket({ target, onRefresh }: UseAdminSocketOptions) {
  const { socket, isConnected } = useSocketContext()

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data: { targets: AdminRefreshTarget[]; message?: string }) => {
      // Only re-fetch if this component's target is in the list
      if (data.targets?.includes(target)) {
        onRefresh(data)
      }
    }

    socket.on("admin:refresh", handleRefresh)

    return () => {
      socket.off("admin:refresh", handleRefresh)
    }
  }, [socket, target, onRefresh])

  return { isConnected }
}
