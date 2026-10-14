"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, ShieldAlert } from "lucide-react"
import { Profile } from "@/lib/types/profile"
import { profileService } from "@/services/profile.service"
import Spinner from "@/components/common/layout/Spinner"
import ViewProfileServerCmp from "@/components/common/profile/ViewProfileServerCmp"
import NoProfileCreated from "@/components/common/profile/NoProfileCreated"

type FetchError = {
  status: number | null
  message: string
}

function getErrorDetails(error: unknown): FetchError {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number; data?: { message?: string } } }).response
    return {
      status: response?.status ?? null,
      message: response?.data?.message || "Unable to load profile data.",
    }
  }
  if (error instanceof Error && error.message) {
    return { status: null, message: error.message }
  }
  return { status: null, message: "Unable to load profile data." }
}

/**
 * Admin drill-down into a single user. Fetches client-side (browser cookies)
 * instead of server-side: the auth cookie is host-bound to the API domain,
 * so a Server Component on a different host cannot see it and every failure
 * collapsed into a blank page. Client fetch works identically on localhost
 * and production.
 */
export default function AdminViewProfileClientCmp({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FetchError | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await profileService.viewProfile({ id: userId })

      if (response?.status === "success" && response?.profile) {
        setProfile(response.profile)
      } else if (response?.code === 404) {
        setError({ status: 404, message: response?.message || "Profile not found" })
      } else {
        setError({
          status: response?.code ?? null,
          message: response?.message || "Unable to load profile data.",
        })
      }
    } catch (err: unknown) {
      const details = getErrorDetails(err)
      console.error("Admin view profile fetch failed:", err)
      setError(details)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  if (loading) {
    return <Spinner content="Loading profile..." />
  }

  if (profile) {
    return <ViewProfileServerCmp profile={profile} />
  }

  // Genuinely missing row — the user never completed a profile.
  if (error?.status === 404) {
    return <NoProfileCreated error={error.message} />
  }

  // Auth / network / server failure — say so explicitly with a retry,
  // instead of the old misleading blank card.
  return (
    <div className="mx-auto mt-8 w-full max-w-[1200px] p-4 md:p-8">
      <Card className="flex flex-col items-center justify-center rounded-2xl p-12 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Couldn&apos;t load this profile
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {error?.message || "Something went wrong while fetching the profile."}
        </p>
        <Button
          onClick={fetchProfile}
          className="mt-6 inline-flex items-center gap-2 rounded-full"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      </Card>
    </div>
  )
}
