"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateProfileSchema } from "@/schema/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const UpdateProfileForm = () => {
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      userId: "",
      email: "",
      profilePicture: "",
      yearLevel: "",
      graduationYear: "",
      fullName: "",
      work_field: "",
      coreSkills: [],
      socialLinks: "",
      companyName: "",
      current_position: "",
      certifications: [],
    },
  })

  function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    // Do something with the form values.
    console.log(data)
  }

  return (
    <div className="mx-auto mt-10 lg:max-w-[1000px]">
      <div>
        <h1 className="font-bold text-primary lg:text-3xl">Update Profile</h1>
        <p className="text-[14px]">Update your profile information</p>
      </div>

      <Card className="mt-8 w-full">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="form-rhf-updateprofileform"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="grid lg:grid-cols-2">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-fullname">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-fullname"
                      aria-invalid={fieldState.invalid}
                      placeholder="Full Name"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Email Address"
                      autoComplete="off"
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-companyname">
                      Company Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-companyname"
                      aria-invalid={fieldState.invalid}
                      placeholder="Company Name"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="current_position"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-currentposition">
                      Current Position
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-currentposition"
                      aria-invalid={fieldState.invalid}
                      placeholder="Current Position"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="graduationYear"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-graduationyear">
                      Graduation Year
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-graduationyear"
                      aria-invalid={fieldState.invalid}
                      placeholder="Graduation Year"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="coreSkills"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-coreskills">
                      Core Skills
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-coreskills"
                      aria-invalid={fieldState.invalid}
                      placeholder="Core Skills"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="certifications"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-certifications">
                      Certifications
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-certifications"
                      aria-invalid={fieldState.invalid}
                      placeholder="Certifications"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="socialLinks"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-sociallinks">
                      Social Links
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-sociallinks"
                      aria-invalid={fieldState.invalid}
                      placeholder="Social Links"
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
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UpdateProfileForm
