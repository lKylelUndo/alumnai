"use client";

import { ArrowLeft, UserX } from "lucide-react"
import { Card } from "../../ui/card"
import { Button } from "../../ui/button"
import { useRouter } from "next/navigation"

const NoProfileCreated = ({ error }: { error: string | null }) => {
  const router = useRouter()
  return (
    <div className="mx-auto mt-8 w-full max-w-[1200px] p-4 md:p-8">
      <Card className="flex flex-col items-center justify-center rounded-xl border border-[#A4B1CC] bg-white p-12 text-center shadow-sm">
        <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
          <UserX className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A216D]">
          {error || "No Profile Found"}
        </h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          This user has not created a profile yet or the profile data could not
          be fetched.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </Card>
    </div>
  )
}

export default NoProfileCreated
