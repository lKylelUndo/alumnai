"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/services/admin.service"
import { collaborationService } from "@/services/collaboration.service"
import { mentorshipService } from "@/services/mentorship.service"

export type PendingCountSource =
  | "unverified"
  | "alumni-requests"
  | "collab-invites"
  | "mentorship-requests"

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
