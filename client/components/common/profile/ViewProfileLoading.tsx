import { Loader2 } from "lucide-react"

const ViewProfileLoading = () => {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-[1200px] items-center justify-center p-8">
      <div className="flex items-center gap-3 text-[#1A216D]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1877F2]" />
        <span className="font-medium text-gray-700">
          Loading profile details...
        </span>
      </div>
    </div>
  )
}

export default ViewProfileLoading
