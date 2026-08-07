import ViewProfile from "@/components/common/ViewProfile"
import { profileService } from "@/services/profile.service";

export default async function ViewUserProfileAdminPage({ params }: { params: Promise<{ userId: string }>}) {
    const { userId } = await params

    let profileData = null;
    try {
        profileData = await profileService.viewProfile({ id: userId as string });
    } catch (error) {
        console.error('Failed to view profile:', error);
    }

    return (
        <>
        <ViewProfile profile={profileData?.profile} />
        </>
    )
}
