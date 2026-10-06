"use client"

import { useEffect, useState } from "react"
import { useSocketContext } from "@/context/SocketContext"
import { adminService } from "@/services/admin.service"
import { collaborationService } from "@/services/collaboration.service"
import { mentorshipService } from "@/services/mentorship.service"

export type PendingCountSource =
  | "unverified"
  | "alumni-requests"
  | "collab-invites"
  | "mentorship-requests"

// Which realtime event keeps each count fresh. Mirrors the target each
// tab's own list already listens to — the badge just recounts on it.
const SOURCE_SUBSCRIPTION: Record<
  PendingCountSource,
  { event: "admin:refresh" | "student:refresh" | "alumni:refresh"; target: string }
> = {
  unverified: { event: "admin:refresh", target: "unverified-users" },
  "alumni-requests": { event: "admin:refresh", target: "alumni-requests" },
  "collab-invites": { event: "student:refresh", target: "collaboration-invites" },
  "mentorship-requests": { event: "alumni:refresh", target: "manage-mentorships" },
}

// Module-level in-flight cache: dedupes StrictMode double-mounts and
// multiple badges watching the same source into one request.
const inflight = new Map<PendingCountSource, Promise<number>>()

// Returns the live count, or -1 when it cannot be determined (caller keeps
// whatever it already shows). Extraction mirrors each tab's own list logic.
async function fetchCount(source: PendingCountSource): Promise<number> {
  const existing = inflight.get(source)
  if (existing) return existing

  const task = (async () => {
    try {
      switch (source) {
        case "unverified": {
          const res = await adminService.getUnverifiedUsers()
          const users = res?.data?.users
          return Array.isArray(users) ? users.length : -1
        }
        case "alumni-requests": {
          const res = await adminService.getAlumniRequest()
          const requests = res?.data?.requests
          return Array.isArray(requests) ? requests.length : -1
        }
        case "collab-invites": {
          const res = await collaborationService.getCollabRequests()
          return Array.isArray(res?.data) ? res.data.length : -1
        }
        case "mentorship-requests": {
          const res = await mentorshipService.getMentorshipRequests()
          return Array.isArray(res?.data) ? res.data.length : -1
        }
      }
    } catch {
      return -1
    } finally {
      inflight.delete(source)
    }
  })()

  inflight.set(source, task)
  return task
}

type PendingCountBadgeProps = {
  // Server-rendered count: shows instantly where SSR works, corrected below.
  initial: number
  source: PendingCountSource
  // completes the aria-label, e.g. "pending mentorship requests"
  label: string
}

const PendingCountBadge = ({ initial, source, label }: PendingCountBadgeProps) => {
  const [count, setCount] = useState(initial)
  const [prevInitial, setPrevInitial] = useState(initial)
  const { socket } = useSocketContext()

  // Stay in step when SSR / router.refresh() delivers a new count.
  // Adjusted during render (same pattern as AlumniStatCards) so no
  // effect-sync is needed — useState(initial) alone only seeds mount.
  if (prevInitial !== initial) {
    setPrevInitial(initial)
    setCount(initial)
  }

  useEffect(() => {
    let cancelled = false
    // Fires immediately on mount (parallel across badges); on failure the
    // current count is kept so a server-rendered badge is never hidden.
    fetchCount(source).then((live) => {
      if (!cancelled && live >= 0) setCount(live)
    })
    return () => {
      cancelled = true
    }
  }, [source])

  // Recount whenever the owning tab's list would refresh, so the pill
  // and the table can never disagree (e.g. after verify/reject/approve).
  useEffect(() => {
    if (!socket) return
    const { event, target } = SOURCE_SUBSCRIPTION[source]

    const handleRefresh = (data?: { targets?: string[] }) => {
      if (data?.targets?.includes(target)) {
        fetchCount(source).then((live) => {
          if (live >= 0) setCount(live)
        })
      }
    }

    socket.on(event, handleRefresh)

    return () => {
      socket.off(event, handleRefresh)
    }
  }, [socket, source])

  if (count <= 0) return null

  return (
    <span
      aria-label={`${count} ${label}`}
      className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-white"
    >
      {count}
    </span>
  )
}

export default PendingCountBadge
