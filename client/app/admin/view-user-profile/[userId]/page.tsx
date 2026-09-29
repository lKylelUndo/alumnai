import ViewProfileServerCmp from "@/components/common/profile/ViewProfileServerCmp"
import { profileService } from "@/services/profile.service"

export const revalidate = 3600

export default async function ViewUserProfileAdminPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
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
    // Full-bleed card: the profile view brings its own padding, so trim the
    // layout gutter here and keep it from setting a min width on small screens.
    <div className="-mx-4 min-w-0 sm:-mx-6">
      <ViewProfileServerCmp profile={profileData?.profile} />
    </div>
  )
}
