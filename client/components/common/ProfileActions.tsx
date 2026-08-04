"use client"
import Link from "next/link"
import { Button } from "../ui/button"
import { Download, Edit3 } from "lucide-react"

const ProfileActions = ({ updateProfileURL }: { updateProfileURL: string }) => {
  return (
    <div className="flex flex-col items-end justify-between self-stretch">
      <Button
        onClick={() => window.print()}
        variant="ghost"
        className="download-btn px-0 font-semibold text-[#1A216D] hover:bg-transparent"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Profile
      </Button>
      <Link href={updateProfileURL}>
        <Button className="mt-4 rounded-full bg-[#1877F2] px-4 text-white hover:bg-[#1877F2]/90 md:mt-0">
          <Edit3 className="mr-2 h-4 w-4" />
          Update Profile
        </Button>
      </Link>
    </div>
  )
}

export default ProfileActions
