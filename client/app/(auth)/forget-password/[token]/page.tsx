import ForgetPasswordForm from "@/components/features/auth/ForgetPasswordForm"

export default async function ForgetPasswordPage({ params}: { params: Promise<{ token: string }>}) {
  const { token } = await params

  return (
    <>
      <ForgetPasswordForm token={token} />
    </>
  )
}
