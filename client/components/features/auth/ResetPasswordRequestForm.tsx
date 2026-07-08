"use client"

import Link from "next/link"
import AuthCard from "./AuthCard"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPasswordRequestSchema } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
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
    <AuthCard title="Forgot Password" subtitle="Enter your email well send you a link for reset password">
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
        <Button type="submit" form="form-rhf-resetpass" className="w-full">
          Submit
        </Button>
      </Field>
    </AuthCard>
  )
}
