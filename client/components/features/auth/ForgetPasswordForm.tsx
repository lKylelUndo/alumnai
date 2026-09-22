"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import AuthCard from "./AuthCard"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPasswordSchema } from "@/schema/auth"

const ResetPasswordForm = ({ token }: { token: string}) => {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    // Do something with the form values.
    console.log("submit", data)
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
                <Input
                  {...field}
                  id="form-rhf-newPassword"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  type="password"
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
        <Button type="submit" form="form-rhf-forgetpassword" className="h-11 w-full bg-[#1A216D] hover:bg-[#151b54] text-white">
          Reset password
        </Button>
      </Field>
    </AuthCard>
  )
}

export default ResetPasswordForm
