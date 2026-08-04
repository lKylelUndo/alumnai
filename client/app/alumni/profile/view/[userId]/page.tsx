export default async function ViewProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return (
    <div>
      <h1>View Profile</h1>
    </div>
  )
}

