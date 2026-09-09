"use client"

import AuthCard from "./AuthCard"
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPasswordRequestSchema } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof resetPasswordRequestSchema>>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof resetPasswordRequestSchema>) {
    // Do something with the form values.
    console.log("submit", data)
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
        <Button type="submit" form="form-rhf-resetpass" className="h-11 w-full bg-[#1A216D] hover:bg-[#151b54] text-white">
          Send reset link
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
