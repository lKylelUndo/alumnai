"use client"

import { useState } from "react"
import { FileBadge, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "../ui/card"
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
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-start gap-3">
        <div className="rounded-full bg-[#F0F4FF] p-2 text-[#1A216D]">
          <FileBadge className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A216D]">Certifications</h2>
          <p className="mt-0 text-xs text-gray-500">
            Certifications from verified organizations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {paginatedCerts.length > 0 ? (
          paginatedCerts.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between rounded-lg bg-[#F5F5F5] p-4"
            >
              <div>
                <p className="text-sm font-bold text-[#1A216D]">{cert.name}</p>
                <p className="mt-1 text-xs text-gray-600">{cert.issuer}</p>
              </div>
              {cert.fileUrl && (
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition"
                  title="View/Download Certificate"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No certifications added yet.
          </p>
        )}
      </div>

      {/* Pagination controls — only show if more than 1 page */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-xs text-muted-foreground">
            {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, certs.length)} of {certs.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 0}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
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