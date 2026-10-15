"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import { Users, User, ChevronLeft, ChevronRight } from "lucide-react"
import { mentorshipService } from "@/services/mentorship.service"
import Image from "next/image"

interface Mentee {
  mentorshipRecordId: string
  fullName: string
  track?: string | null
  yearLevel?: string | null
  profilePicture?: string | null
}

// Mirrors the RelationCard subtitle mapping used when viewing other profiles:
// "N/A"/"GENERAL" placeholders never say anything about a person.
const PLACEHOLDER_SUBTITLES = new Set(["N/A", "GENERAL"])

const getSubtitle = (item: { track?: string | null; yearLevel?: string | null }) =>
  [item.yearLevel, item.track]
    .filter((part): part is string => part != null && part !== "" && !PLACEHOLDER_SUBTITLES.has(part))
    .join(" • ")

const RELATION_PAGE_SIZE = 3

const AlumniCurrentMentees = () => {
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const res = await mentorshipService.getMyMentees()
        if (res.status === "success" && Array.isArray(res.data)) {
          setMentees(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch mentees:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMentees()
  }, [])

  const totalPages = Math.ceil(mentees.length / RELATION_PAGE_SIZE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const startIndex = (safePage - 1) * RELATION_PAGE_SIZE
  const currentItems = mentees.slice(startIndex, startIndex + RELATION_PAGE_SIZE)

  const subtitleOf = (mentee: Mentee) => getSubtitle(mentee)

  return (
    <Card className="rounded-2xl p-6">
      <ProfileCardHeader
        icon={Users}
        title="Current Mentees"
        description={
          loading
            ? "Loading mentees..."
            : mentees.length > 0
            ? `Currently have ${mentees.length} mentee${mentees.length > 1 ? "s" : ""}`
            : "No active mentees yet"
        }
      />

      {mentees.length > 0 && (
        <div className="space-y-4">
          {currentItems.map((mentee) => (
            <div
              key={mentee.mentorshipRecordId}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {mentee.profilePicture ? (
                    <Image
                      src={mentee.profilePicture}
                      alt={mentee.fullName || ""}
                      width={40}
                      height={40}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight text-foreground">
                    {mentee.fullName || ""}
                  </p>
                  {subtitleOf(mentee) && (
                    <p className="truncate text-xs text-muted-foreground">
                      {subtitleOf(mentee)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="text-[11px] text-muted-foreground">
            Page {safePage} of {totalPages}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safePage === totalPages}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {!loading && mentees.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <Users className="mb-2 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm">No active mentees yet.</p>
        </div>
      )}
    </Card>
  )
}

export default AlumniCurrentMentees
