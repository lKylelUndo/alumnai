"use client"

import { useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable,  getPaginationRowModel, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PaginationControls } from "./PaginationControls"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn: string
  filterPlaceholder: string
  statusFilterColumn?: string
  statusOptions?: string[]
  pageSize?: number
}

export function DataTable<TData, TValue>({ columns, data, filterColumn, filterPlaceholder, statusFilterColumn, statusOptions, pageSize = 5 }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize
      }
    },
   
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      
      columnFilters,
    },
  })

  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div>
    
          <div className="flex items-center gap-2 py-4">
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            {statusFilterColumn && statusOptions && (
              <Select
                value={(table.getColumn(statusFilterColumn)?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) =>
                  table.getColumn(statusFilterColumn)?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[160px]">
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
        
        <div className="overflow-hidden rounded-md border">
          <Table>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination — compact sliding window shared with alumni/student tables */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 py-4">
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
