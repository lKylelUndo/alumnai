import ResetPasswordForm from "@/components/features/auth/ForgetPasswordForm"

export default async function ResetPasswordPage({ params}: { params: Promise<{ token: string }>}) {
  const { token } = await params

  return (
    <>
      <ResetPasswordForm token={token} />
    </>
  )
}
