"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import { Handshake, User, ChevronLeft, ChevronRight } from "lucide-react"
import { collaborationService } from "@/services/collaboration.service"
import Image from "next/image"

interface Collaborator {
  collaborationId: string
  fullName: string
  currentPosition?: string | null
  companyName?: string | null
  profilePicture?: string | null
}

const RELATION_PAGE_SIZE = 3

const StudentCurrentCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const res = await collaborationService.getMyStudentCollaborations()
        if (res.status === "success" && Array.isArray(res.data)) {
          setCollaborators(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch collaborators:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCollaborators()
  }, [])

  const totalPages = Math.ceil(collaborators.length / RELATION_PAGE_SIZE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const startIndex = (safePage - 1) * RELATION_PAGE_SIZE
  const currentItems = collaborators.slice(startIndex, startIndex + RELATION_PAGE_SIZE)

  return (
    <Card className="rounded-2xl p-6">
      <ProfileCardHeader
        icon={Handshake}
        title="Current Collaborators"
        description={
          loading
            ? "Loading collaborators..."
            : collaborators.length > 0
            ? `Currently have ${collaborators.length} collaborator${
                collaborators.length > 1 ? "s" : ""
              }`
            : "No active collaborators yet"
        }
      />

      {collaborators.length > 0 && (
        <div className="space-y-4">
          {currentItems.map((collaborator) => (
            <div
              key={collaborator.collaborationId}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {collaborator.profilePicture ? (
                    <Image
                      src={collaborator.profilePicture}
                      alt={collaborator.fullName || ""}
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
                    {collaborator.fullName || ""}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {collaborator.currentPosition || "Collaborator"}
                    {collaborator.companyName ? ` @ ${collaborator.companyName}` : ""}
                  </p>
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

      {!loading && collaborators.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <Handshake className="mb-2 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm">No active collaborators yet.</p>
        </div>
      )}
    </Card>
  )
}

export default StudentCurrentCollaborators
