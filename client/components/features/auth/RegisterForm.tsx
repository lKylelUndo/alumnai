import Link from "next/link";
import AuthCard from "./AuthCard";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  return (
    <AuthCard
      title="Create an Account"
      subtitle="Register as a student to get started"
    >
      <form
  // onSubmit={handleSubmit(onSubmit)}
  className="space-y-5"
>

  <FieldSet>
    <Field>
      <FieldLabel
        htmlFor="studentId"
        className="text-[#1A216D]"
      >
        Student ID Number
      </FieldLabel>

      <Input
        id="studentId"
        autoComplete="off"
        placeholder="20230001"
      />
    </Field>

    <Field>
      <FieldLabel
        htmlFor="email"
        className="text-[#1A216D]"
      >
        Email Address
      </FieldLabel>

      <Input
        id="email"
        type="email"
        autoComplete="off"
        placeholder="youremail@email.com"
      />
    </Field>

    <Field>
      <FieldLabel
        htmlFor="password"
        className="text-[#1A216D]"
      >
        Password
      </FieldLabel>

      <Input
        id="password"
        type="password"
      />
    </Field>

    <Field>
      <FieldLabel
        htmlFor="confirmPassword"
        className="text-[#1A216D]"
      >
        Confirm Password
      </FieldLabel>

      <Input
        id="confirmPassword"
        type="password"
      />
    </Field>
  </FieldSet>

  <button
    type="submit"
    className="w-full rounded-lg bg-[#3478E5] py-2 mt-3 text-white"
  >
    Sign Up
  </button>

  <p className="text-center text-sm text-gray-600">
    Already have an account?{" "}
    <Link
      href="/login"
      className="font-medium text-[#3478E5]"
    >
      Sign in here
    </Link>
  </p>
</form>
    </AuthCard>
  );
}