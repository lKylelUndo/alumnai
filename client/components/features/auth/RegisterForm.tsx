"use client"

import { Button } from "@/components/ui/button"
import AuthCard from "./AuthCard"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input, PasswordInput } from "@/components/ui/input"
import { signupSchema } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterForm() {
  const { signup } = useAuthContext();
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      studentIdNumber: "",
      name: "",
      email: "",
      password: "",
    },
  })

  const { formState: { isSubmitting } } = form;

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    try {
      await signup(data);
    } catch (error: any) {
      const serverError = error?.response?.data
      console.error("Signup form error:", serverError)

      if (serverError?.path && serverError?.message) {
        form.setError(serverError.path, { type: "server", message: serverError.message })
      } else {
        // No field to attach to — surface it as a toast
        // since nothing on the form renders the root error.
        toast.error(serverError?.message ?? "Something went wrong")
      }
    }
  }

  return (
    <AuthCard
      title="Start your journey"
      subtitle="Create your verified skill profile in minutes."
    >
      <form id="form-rhf-signup" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="studentIdNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-studentidnumber">
                    Student ID Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-studentidnumber"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text"
                    placeholder="20180001"
                    inputMode="numeric"
                    maxLength={8}
                    pattern="[0-9]*"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-email-address">
                  Email Address
                </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-email-address"
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

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="form-rhf-password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
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
        <Button type="submit" form="form-rhf-signup" disabled={isSubmitting} className="h-11 w-full bg-[#1A216D] hover:bg-[#151b54] text-white">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
          ) : (
            "Register"
          )}
        </Button>
      </Field>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#2D7EE2] hover:underline"
        >
          Log In
        </Link>
      </p>
    </AuthCard>
  )
}
