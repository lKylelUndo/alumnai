"use client"

import { useEffect, useRef } from "react"
import { useSocketContext } from "@/context/SocketContext"

type AdminRefreshTarget = "stats" | "unverified-users" | "all-users" | "alumni-requests" | "top-mentors"

interface UseAdminSocketOptions {
  target: AdminRefreshTarget
  onRefresh: (data?: { targets: AdminRefreshTarget[]; message?: string }) => void
}

export function useAdminSocket({ target, onRefresh }: UseAdminSocketOptions) {
  const { socket, isConnected } = useSocketContext()
  const onRefreshRef = useRef(onRefresh)

  // Keep latest callback reference without triggering re-subscription
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data: { targets: AdminRefreshTarget[]; message?: string }) => {
      if (data?.targets?.includes(target)) {
        onRefreshRef.current?.(data)
      }
    }

    socket.on("admin:refresh", handleRefresh)

    return () => {
      socket.off("admin:refresh", handleRefresh)
    }
  }, [socket, target])

  return { isConnected }
}
