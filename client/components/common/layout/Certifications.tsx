"use client"

import { useState } from "react"
import { Award, Download, ChevronLeft, ChevronRight, Eye, EyeOff, Trash2 } from "lucide-react"
import { Card } from "../../ui/card"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import ConfirmEndDialog from "@/components/common/dialogs/ConfirmEndDialog"
import { useAuthContext } from "@/context/AuthContext"
import { profileService } from "@/services/profile.service"
import { toast } from "sonner"
import { Certification } from "@/lib/types/profile"

interface CertificationsProps {
  certifications?: Certification[] | null
  ownerUserId?: string
}

const ITEMS_PER_PAGE = 2

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: { message?: string } } }).response?.data
    if (typeof data?.message === "string") return data.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

const Certifications = ({ certifications, ownerUserId }: CertificationsProps) => {
  const { user } = useAuthContext()
  const [currentPage, setCurrentPage] = useState(0)
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const [visibilityOverrides, setVisibilityOverrides] = useState<Record<string, boolean>>({})
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({})
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  // Owner viewing their own profile sees controls; everyone else sees
  // visible certifications only. When ownerUserId is provided (visitor
  // views), never fall back to the viewer's own list — an undefined prop
  // means the target simply has none.
  const isOwner = ownerUserId ? ownerUserId === user?.id : Boolean(user?.id)
  const sourceCerts =
    ownerUserId || certifications
      ? certifications ?? []
      : user?.profile?.certifications ?? []
  const isCertVisible = (cert: Certification) =>
    visibilityOverrides[cert.id] ?? cert.isVisible ?? true

  const certs = sourceCerts.filter((cert) => !removedIds.has(cert.id))

  const totalPages = Math.ceil(certs.length / ITEMS_PER_PAGE)
  const safePage = Math.min(currentPage, Math.max(totalPages - 1, 0))
  const startIndex = safePage * ITEMS_PER_PAGE
  const paginatedCerts = certs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0))
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))

  async function toggleVisibility(cert: Certification, nextVisible: boolean) {
    if (!cert.id || pendingIds[cert.id]) return

    setVisibilityOverrides((prev) => ({ ...prev, [cert.id]: nextVisible }))
    setPendingIds((prev) => ({ ...prev, [cert.id]: true }))

    try {
      const response = await profileService.setCertificationVisibility(cert.id, nextVisible)
      if (response.status === "success" && response.data) {
        setVisibilityOverrides((prev) => ({
          ...prev,
          [cert.id]: response.data?.isVisible ?? nextVisible,
        }))
        toast.success(
          nextVisible ? "Certification is now visible" : "Certification hidden from your profile"
        )
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      setVisibilityOverrides((prev) => ({ ...prev, [cert.id]: !nextVisible }))
      toast.error(getApiErrorMessage(error, "Could not update certification visibility"))
    } finally {
      setPendingIds((prev) => {
        const next = { ...prev }
        delete next[cert.id]
        return next
      })
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deletePending) return

    setDeletePending(true)
    try {
      const response = await profileService.deleteCertification(deleteTarget.id)
      if (response.status === "success") {
        setRemovedIds((prev) => new Set(prev).add(deleteTarget.id))
        setDeleteTarget(null)
        toast.success("Certification deleted")
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete certification"))
    } finally {
      setDeletePending(false)
    }
  }

  return (
    <Card className="flex min-h-[250px] flex-col rounded-2xl p-6">
      <ProfileCardHeader
        icon={Award}
        title="Certifications"
        description="Certifications from verified organizations"
      />

      {paginatedCerts.length > 0 ? (
        <div className="flex-grow space-y-3">
          {paginatedCerts.map((cert) => {
            const visible = isCertVisible(cert)
            const isPending = Boolean(pendingIds[cert.id])
            return (
              <div
                key={cert.id}
                className={`flex items-center justify-between gap-3 rounded-lg p-4 transition-opacity duration-300 ${
                  visible ? "bg-muted/50 opacity-100" : "border border-dashed border-border bg-muted/20 opacity-55"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{cert.name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{cert.issuer}</p>
                  {!visible && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      <EyeOff className="h-2.5 w-2.5" aria-hidden="true" />
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-primary transition hover:bg-primary/10"
                      title="View/Download Certificate"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleVisibility(cert, !visible)}
                        disabled={isPending}
                        aria-pressed={!visible}
                        aria-label={visible ? "Hide this certification" : "Show this certification"}
                        title={visible ? "Hide this certification" : "Show this certification"}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {visible ? (
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cert)}
                        aria-label={`Delete ${cert.name || "this certification"}`}
                        title="Delete this certification"
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-[#434657]">
          <Award className="h-10 w-10 mb-2 text-[#A4B1CC]/50" />
          <p className="text-sm italic">No certifications added yet.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
          <p className="text-xs text-[#434657]">
            {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, certs.length)} of {certs.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrevious}
              disabled={safePage === 0}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#434657] transition cursor-pointer hover:border-[#1A216D] hover:text-[#1A216D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={goToNext}
              disabled={safePage === totalPages - 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#434657] transition cursor-pointer hover:border-[#1A216D] hover:text-[#1A216D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <ConfirmEndDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={confirmDelete}
        title="Delete this certificate?"
        description={`This will permanently remove “${deleteTarget?.name || "this certificate"}” from your profile. This cannot be undone.`}
        confirmLabel="Delete Certificate"
        pendingLabel="Deleting..."
        isPending={deletePending}
      />
    </Card>
  )
}

export default Certifications
