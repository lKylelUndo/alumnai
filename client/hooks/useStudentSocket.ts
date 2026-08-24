"use client"

import { useEffect, useRef } from "react"
import { useSocketContext } from "@/context/SocketContext"

type StudentRefreshTarget = "collaboration-invites" | "your-collaborations" | "my-mentors"

interface UseStudentSocketOptions {
  target: StudentRefreshTarget
  onRefresh: (data?: { targets: StudentRefreshTarget[]; message?: string }) => void
}

export function useStudentSocket({ target, onRefresh }: UseStudentSocketOptions) {
  const { socket, isConnected } = useSocketContext()
  const onRefreshRef = useRef(onRefresh)

  // Keep latest callback reference without triggering re-subscription
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data: { targets: StudentRefreshTarget[]; message?: string }) => {
      if (data?.targets?.includes(target)) {
        onRefreshRef.current?.(data)
      }
    }

    socket.on("student:refresh", handleRefresh)

    return () => {
      socket.off("student:refresh", handleRefresh)
    }
  }, [socket, target])

  return { isConnected }
}
