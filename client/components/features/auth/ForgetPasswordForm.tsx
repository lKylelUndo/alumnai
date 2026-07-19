"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
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
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-forgetpassword">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export default ResetPasswordForm
