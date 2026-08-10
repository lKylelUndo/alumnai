import ViewProfileClientCmp from "@/components/common/profile/ViewProfileClientCmp"

export default async function ViewProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return (
    <ViewProfileClientCmp userId={userId} />
  )
}

