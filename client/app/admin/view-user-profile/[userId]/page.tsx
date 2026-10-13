import ViewProfileServerCmp from "@/components/common/profile/ViewProfileServerCmp"
import { profileService } from "@/services/profile.service"

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
    <>
      <ViewProfileServerCmp profile={profileData?.profile} />
    </>
  )
}
