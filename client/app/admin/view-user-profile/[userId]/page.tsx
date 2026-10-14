import ViewProfileServerCmp from "@/components/common/profile/ViewProfileServerCmp"
import { profileService } from "@/services/profile.service"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// The Dean must always see live account status, role and skill data when
// drilling into a user. Caching this page (it was revalidate = 3600) meant an
// admin could read a profile that was up to an hour stale, and nothing in the
// app called revalidatePath/revalidateTag to bust it.
export const dynamic = "force-dynamic"

export default async function ViewUserProfileAdminPage({ params }: {params: Promise<{ userId: string }>}) {
  const { userId } = await params

  let profileData = null
  try {
    profileData = await profileService.viewProfile({ id: userId as string })
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error
    }
    console.error("Failed to view profile:", error)
  }

  return (
    <div className="bg-muted/40 lg:min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:py-16">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <ViewProfileServerCmp profile={profileData?.profile} />
      </main>
    </div>
  )
}
