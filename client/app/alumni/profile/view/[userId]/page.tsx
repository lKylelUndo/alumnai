import ViewProfileClientCmp from "@/components/common/ViewProfileClientCmp"

export default async function ViewProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return (
    <ViewProfileClientCmp />
  )
}

