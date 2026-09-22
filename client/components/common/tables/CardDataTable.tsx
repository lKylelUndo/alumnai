"use client";

import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, Row, useReactTable } from "@tanstack/react-table"
import { PaginationControls } from "./PaginationControls"

interface CardDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  
  pageSize?: number
  renderCard: (row: Row<TData>) => React.ReactNode
  emptyState?: React.ReactNode
  emptyMessage?: string
}

export function CardDataTable<TData, TValue>({
  columns,
  data,

  pageSize = 9,
  renderCard,
  emptyState,
  emptyMessage
}: CardDataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize },
    },
    
  })

  const rows = table.getRowModel().rows
  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div>
      {/* Card Grid */}
      {rows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => renderCard(row))}
        </div>
      ) : (
        emptyState ?? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF0FB]">
              <svg
                className="h-8 w-8 text-[#1A216D]/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#1A216D]">
              {emptyMessage}
            </p>
          </div>
        )
      )}

      {/* Pagination — compact sliding window shared with admin tables */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
            onPreviousPage={() => table.previousPage()}
            onNextPage={() => table.nextPage()}
            onSelectPage={(pageIdx) => table.setPageIndex(pageIdx)}
          />
        </div>
      )}
    </div>
  )
}
