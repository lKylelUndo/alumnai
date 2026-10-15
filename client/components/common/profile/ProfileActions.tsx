"use client"
import Link from "next/link"
import { Button } from "../../ui/button"
import { Download, Edit3 } from "lucide-react"

const ProfileActions = ({ updateProfileURL }: { updateProfileURL: string }) => {
  return (
    <div className="z-10 mt-4 flex w-full flex-col items-center gap-3 print:hidden md:mt-0 md:w-auto md:flex-row md:items-end md:self-start">
      <button
        onClick={() => window.print()}
        className="download-btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted md:w-auto"
      >
        <Download className="h-4 w-4" />
        Download Profile
      </button>
      <Link href={updateProfileURL} className="w-full md:w-auto">
        <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-1.5 font-semibold text-xs text-white shadow-sm transition hover:opacity-90 md:w-auto">
          <Edit3 className="h-4 w-4" />
          Update Profile
        </Button>
      </Link>
    </div>
  )
}

export default ProfileActions
