"use client"

import { useEffect, useRef } from "react"
import { useSocketContext } from "@/context/SocketContext"

type AlumniRefreshTarget = "find-collaborators" | "your-collaborations" | "your-mentees" | "manage-mentorships" | "stats"

interface UseAlumniSocketOptions {
  target: AlumniRefreshTarget
  onRefresh: (data?: { targets: AlumniRefreshTarget[]; message?: string }) => void
}

export function useAlumniSocket({ target, onRefresh }: UseAlumniSocketOptions) {
  const { socket, isConnected } = useSocketContext()
  const onRefreshRef = useRef(onRefresh)

  // Keep latest callback reference without triggering re-subscription
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data: { targets: AlumniRefreshTarget[]; message?: string }) => {
      if (data?.targets?.includes(target)) {
        onRefreshRef.current?.(data)
      }
    }

    socket.on("alumni:refresh", handleRefresh)

    return () => {
      socket.off("alumni:refresh", handleRefresh)
    }
  }, [socket, target])

  return { isConnected }
}
