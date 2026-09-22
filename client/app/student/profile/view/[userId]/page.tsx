import ViewProfileClientCmp from "@/components/common/profile/ViewProfileClientCmp"

export const revalidate = 3600

export default async function ViewProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return <ViewProfileClientCmp userId={userId} />
}