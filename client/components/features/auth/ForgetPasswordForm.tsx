"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import AuthCard from "./AuthCard"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/input"
import { resetPasswordSchema } from "@/schema/auth"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const ResetPasswordForm = ({ token }: { token: string}) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
    },
  })

  const { formState: { isSubmitting } } = form

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      const response = await authService.resetPassword(data)
      if (response?.status === "error") {
        form.setError("root", { type: "server", message: response?.message ?? "Something went wrong" })
        return
      }
      toast.success("Password reset successfully. Please log in.")
      router.push("/login")
    } catch (error) {
      const serverError = (error as { response?: { data?: { message?: string } } })?.response?.data
      console.error("Reset password form error:", serverError)
      form.setError("root", { type: "server", message: serverError?.message ?? "Something went wrong" })
    }
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password to secure your account."
    >
      <form id="form-rhf-forgetpassword" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-newPassword">
                  New Password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="form-rhf-newPassword"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Field orientation="horizontal" className="mt-4">
        <Button type="submit" form="form-rhf-forgetpassword" disabled={isSubmitting} className="h-11 w-full bg-[#1A216D] hover:bg-[#151b54] text-white">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
          ) : (
            "Reset password"
          )}
        </Button>
      </Field>
      {form.formState.errors.root && (
        <p className="mt-3 text-center text-sm text-red-600">{form.formState.errors.root.message}</p>
      )}
    </AuthCard>
  )
}

export default ResetPasswordForm
