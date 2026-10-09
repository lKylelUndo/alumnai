"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useSocketContext } from "@/context/SocketContext"

type RefreshEvent = "student:refresh" | "alumni:refresh" | "admin:refresh"

// App-wide toast listener, mounted once per role layout (next to ChatBox).
// Dashboard lists keep their own silent refetches; this component owns the
// toast, so notifications surface on every page — not just the dashboard.
const RefreshToasts = ({ event }: { event: RefreshEvent }) => {
  const { socket } = useSocketContext()

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data?: { targets?: string[]; message?: string }) => {
      if (data?.message) toast.info(data.message)
    }

    socket.on(event, handleRefresh)

    return () => {
      socket.off(event, handleRefresh)
    }
  }, [socket, event])

  return null
}

export default RefreshToasts
