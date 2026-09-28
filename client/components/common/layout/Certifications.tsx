"use client"

import { useState } from "react"
import { Award, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "../../ui/card"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import { useAuthContext } from "@/context/AuthContext"

interface CertificationsProps {
  certifications?: any[]
}

const ITEMS_PER_PAGE = 2

const Certifications = ({ certifications }: CertificationsProps) => {
  const { user } = useAuthContext()
  const certs = certifications ?? user?.profile?.certifications ?? []
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(certs.length / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const paginatedCerts = certs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0))
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))

  return (
    <Card className="flex min-h-[250px] flex-col rounded-2xl p-6">
      <ProfileCardHeader
        icon={Award}
        title="Certifications"
        description="Certifications from verified organizations"
      />

      {paginatedCerts.length > 0 ? (
        <div className="flex-grow space-y-3">
          {paginatedCerts.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{cert.name}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{cert.issuer}</p>
              </div>
              {cert.fileUrl && (
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 cursor-pointer text-primary transition hover:text-primary/80"
                  title="View/Download Certificate"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
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
              disabled={currentPage === 0}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#434657] transition cursor-pointer hover:border-[#1A216D] hover:text-[#1A216D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#434657] transition cursor-pointer hover:border-[#1A216D] hover:text-[#1A216D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default Certifications
