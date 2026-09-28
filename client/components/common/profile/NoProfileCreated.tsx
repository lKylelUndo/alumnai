"use client";

import { ArrowLeft, UserX } from "lucide-react"
import { Card } from "../../ui/card"
import { Button } from "../../ui/button"
import { useRouter } from "next/navigation"

const NoProfileCreated = ({ error }: { error: string | null }) => {
  const router = useRouter()
  return (
    <div className="mx-auto mt-8 w-full max-w-[1200px] p-4 md:p-8">
      <Card className="flex flex-col items-center justify-center rounded-2xl p-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
          <UserX className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {error || "No Profile Found"}
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
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
