"use client"

import AuthCard from "./AuthCard"
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPasswordRequestSchema } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const form = useForm<z.infer<typeof resetPasswordRequestSchema>>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  })

  const { formState: { isSubmitting } } = form

  async function onSubmit(data: z.infer<typeof resetPasswordRequestSchema>) {
    try {
      const response = await authService.forgetPassword(data)
      if (response?.status === "error") {
        form.setError("root", { type: "server", message: response?.message ?? "Something went wrong" })
        return
      }
      setSent(true)
      toast.success("Reset link sent. Check your email.")
    } catch (error) {
      const serverError = (error as { response?: { data?: { message?: string } } })?.response?.data
      console.error("Forgot password form error:", serverError)
      form.setError("root", { type: "server", message: serverError?.message ?? "Something went wrong" })
    }
  }

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle="We sent you a password reset link. It expires in 10 minutes.">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <p className="text-sm text-gray-600">
            {"Didn't"} receive it? Check your spam folder or try again.
          </p>
        </div>
        <Field orientation="horizontal" className="mt-4">
          <Button type="button" onClick={() => setSent(false)} variant="outline" className="h-11 w-full">
            Resend link
          </Button>
        </Field>
        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-[#2D7EE2] hover:underline"
          >
            Back to login
          </Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password?" subtitle="Enter your email and we'll send you a reset link.">
      <form id="form-rhf-resetpass" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  type="email"
                  placeholder="name@example.com"
                  required
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
        <Button type="submit" form="form-rhf-resetpass" disabled={isSubmitting} className="h-11 w-full bg-[#1A216D] hover:bg-[#151b54] text-white">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          ) : (
            "Send reset link"
          )}
        </Button>
      </Field>
      {form.formState.errors.root && (
        <p className="mt-3 text-center text-sm text-red-600">{form.formState.errors.root.message}</p>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-[#2D7EE2] hover:underline"
        >
          Back to login
        </Link>
      </p>
    </AuthCard>
  )
}
