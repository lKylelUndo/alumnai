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
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const { login } = useAuthContext();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { formState: { isSubmitting } } = form;

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      await login(data);
    } catch (error: any) {
      const serverError = error?.response?.data
      console.error("Login form error:", serverError)

      if (serverError?.path && serverError?.message) {
        form.setError(serverError.path, { type: "server", message: serverError.message })
      } else {
        // Fallback: set a generic root error
        form.setError("root", { type: "server", message: serverError?.message ?? "Something went wrong" })
      }    
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue building real connections."
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
          className="text-xs text-slate-500 hover:text-[#1A216D] hover:underline"
        >
          Forgot password?
        </Link>
      </form>

      <Field orientation="horizontal" className="mt-4">
        <Button type="submit" form="form-rhf-login" disabled={isSubmitting} className="w-full bg-[#1A216D] hover:bg-[#151b54] text-white">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
          ) : (
            "Login"
          )}
        </Button>
      </Field>

      <p className="mt-6 text-center text-sm text-gray-600">
        {"Don't"} have an account?{" "}
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
