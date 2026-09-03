"use client"

import { useEffect } from "react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#131b2e]">Admin Dashboard Error</h2>
        <p className="mb-6 text-sm text-[#434657]">
          Something went wrong loading the admin dashboard. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#1A216D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#141a5a]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
