import ViewProfileServerCmp from "@/components/common/profile/ViewProfileServerCmp"
import { profileService } from "@/services/profile.service"

export const revalidate = 3600

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
