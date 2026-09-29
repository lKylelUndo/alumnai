"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PaginationControls } from "./PaginationControls"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn: string
  filterPlaceholder: string
  statusFilterColumn?: string
  statusOptions?: string[]
}

// Column headers are plain strings in the admin tables, so the same label
// powers the table header and the label on each card.
function getHeaderLabel<TData, TValue>(
  header: ColumnDef<TData, TValue>["header"]
): string | null {
  return typeof header === "string" ? header : null
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  statusFilterColumn,
  statusOptions,
}: DataTableProps<TData, TValue>) {
  const [pageSize] = useState(5) // fixed page size for admin tables
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const rows = table.getRowModel().rows

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder={filterPlaceholder}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          aria-label={filterPlaceholder}
          className="h-11 w-full sm:h-9 sm:max-w-sm"
        />
        {statusFilterColumn && statusOptions && (
          <Select
            value={
              (table
                .getColumn(statusFilterColumn)
                ?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn(statusFilterColumn)
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="h-11 w-full sm:h-8 sm:w-[160px]"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="mt-10">
              <SelectItem value="all">All</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Phones: one card per row, so nothing is cut off and actions get a full-width row */}
      <div className="space-y-3 md:hidden">
        {rows.length ? (
          rows.map((row) => {
            const cells = row.getVisibleCells()
            const dataCells = cells.filter(
              (cell) => cell.column.id !== "actions"
            )
            const actionCells = cells.filter(
              (cell) => cell.column.id === "actions"
            )

            return (
              <div
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="min-w-0 rounded-xl border border-border bg-card p-3.5"
              >
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2.5">
                  {dataCells.map((cell) => {
                    const label = getHeaderLabel(cell.column.columnDef.header)
                    return (
                      <div
                        key={cell.id}
                        className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1"
                      >
                        <dt className="shrink-0 text-xs font-medium text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="max-w-full min-w-0 text-right break-words">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </dd>
                      </div>
                    )
                  })}
                </dl>

                {actionCells.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    {actionCells.map((cell) => (
                      <div key={cell.id} className="min-w-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </div>

      {/* Tablet and up: the full table. The Table component scrolls sideways if needed. */}
      <div className="hidden overflow-hidden rounded-md border md:block">
        <Table className="min-w-[640px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination — compact sliding window shared with alumni/student tables.
            Pill targets are grown to 44px on phones without touching the shared control. */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 py-4 [&_button]:h-11 [&_button]:w-11 sm:[&_button]:h-9 sm:[&_button]:w-9">
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
