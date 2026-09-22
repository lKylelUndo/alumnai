"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number // 0-indexed
  totalPages: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onSelectPage: (pageIndex: number) => void
}

const navPillClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E6F3] bg-white text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D]/5 disabled:cursor-not-allowed disabled:opacity-40"
const activePillClass =
  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 bg-[#1A216D] text-white shadow-md shadow-[#1A216D]/30"
const pagePillClass =
  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 border border-[#E2E6F3] bg-white text-[#1A216D] hover:border-[#1A216D] hover:bg-[#1A216D]/5"

// Two-pill sliding window anchored so two numbers show whenever possible.
function getWindowStart(currentPage: number, totalPages: number): number {
  return Math.min(Math.max(currentPage, 0), Math.max(totalPages - 2, 0))
}

export function PaginationControls({
  currentPage,
  totalPages,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  // Small sets stay fully visible — compact only when it matters.
  const showAll = totalPages <= 3
  const start = showAll ? 0 : getWindowStart(currentPage, totalPages)
  const end = showAll ? totalPages - 1 : Math.min(start + 1, totalPages - 1)
  const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const showLeadingEllipsis = !showAll && start > 0
  const showTrailingEllipsis = !showAll && end < totalPages - 1

  return (
    <>
      <Button onClick={onPreviousPage} disabled={!canPreviousPage} className={navPillClass} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showLeadingEllipsis && (
        <Button
          onClick={() => onSelectPage(Math.max(currentPage - 2, 0))}
          className={pagePillClass}
          aria-label="Previous pages"
        >
          …
        </Button>
      )}

      {visiblePages.map((pageIdx) => (
        <Button
          key={pageIdx}
          onClick={() => onSelectPage(pageIdx)}
          className={currentPage === pageIdx ? activePillClass : pagePillClass}
          aria-label={`Page ${pageIdx + 1}`}
          aria-current={currentPage === pageIdx ? "page" : undefined}
        >
          {pageIdx + 1}
        </Button>
      ))}

      {showTrailingEllipsis && (
        <Button
          onClick={() => onSelectPage(Math.min(currentPage + 2, totalPages - 1))}
          className={pagePillClass}
          aria-label="More pages"
        >
          …
        </Button>
      )}

      <Button onClick={onNextPage} disabled={!canNextPage} className={navPillClass} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  )
}
