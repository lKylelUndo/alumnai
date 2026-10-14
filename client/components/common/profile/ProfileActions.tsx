"use client"
import Link from "next/link"
import { Button } from "../../ui/button"
import { Download, Edit3 } from "lucide-react"

const ProfileActions = ({ updateProfileURL }: { updateProfileURL: string }) => {
  return (
    <div className="z-10 mt-4 flex w-full flex-col items-center gap-3 print:hidden md:mt-0 md:w-auto md:flex-row md:items-end">
      <button
        onClick={() => window.print()}
        className="download-btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted md:w-auto"
      >
        <Download className="h-[18px] w-[18px]" />
        Download Profile
      </button>
      <Link href={updateProfileURL} className="w-full md:w-auto">
        <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-sm text-white shadow-sm transition hover:opacity-90 md:w-auto">
          <Edit3 className="h-[18px] w-[18px]" />
          Update Profile
        </Button>
      </Link>
    </div>
  )
}

export default ProfileActions
