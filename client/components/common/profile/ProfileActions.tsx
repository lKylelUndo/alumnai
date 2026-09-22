"use client"
import Link from "next/link"
import { Button } from "../../ui/button"
import { Download, Edit3 } from "lucide-react"

const ProfileActions = ({ updateProfileURL }: { updateProfileURL: string }) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full md:w-auto md:items-end z-10 mt-4 md:mt-0">
      <button
        onClick={() => window.print()}
        className="download-btn flex items-center justify-center gap-2 px-4 py-2 text-[#434657] hover:bg-[#F1F5F9] rounded transition-all font-semibold text-sm cursor-pointer"
      >
        <Download className="h-[18px] w-[18px]" />
        Download Profile
      </button>
      <Link href={updateProfileURL} className="w-full md:w-auto">
        <Button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 rounded font-semibold text-sm text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, #0047FF, #002994)" }}
        >
          <Edit3 className="h-[18px] w-[18px]" />
          Update Profile
        </Button>
      </Link>
    </div>
  )
}

export default ProfileActions
