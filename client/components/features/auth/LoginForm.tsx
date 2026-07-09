"use client"

import { Button } from "@/components/ui/button"
import AuthCard from "./AuthCard"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"

export default function LoginForm() {
  const { login } = useAuthContext();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    console.log("submit", data)
    await login(data);
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form id="form-rhf-login" onSubmit={form.handleSubmit(onSubmit)}>
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

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  type="password"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Link
          href={"/forgot-password"}
          className="text-xs text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </form>

      <Field orientation="horizontal" className="mt-4">
        <Button type="submit" form="form-rhf-login" className="w-full">
          Login
        </Button>
      </Field>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#2D7EE2] hover:underline"
        >
          Register here
        </Link>
      </p>
    </AuthCard>
  )
}
