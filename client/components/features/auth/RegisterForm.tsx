"use client"

import { Button } from "@/components/ui/button"
import AuthCard from "./AuthCard"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signupSchema } from "@/schema/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"

export default function RegisterForm() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      studentIdNumber: "",
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof signupSchema>) {
    // Do something with the form values.
    console.log("submit", data)
  }

  return (
    <AuthCard
      title="Create an Account"
      subtitle="Register as a student to get started"
    >
      <form id="form-rhf-signup" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex justify-between gap-x-4">
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
      </form>
      <Field orientation="horizontal" className="mt-4">
        <Button type="submit" form="form-rhf-signup" className="w-full">
          Register
        </Button>
      </Field>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#2D7EE2] hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthCard>
  )
}
