import Link from "next/link";
import AuthCard from "./AuthCard";
import { Field, FieldSet, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";


export default function ForgotPasswordForm() {
  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a password reset link"
    >
      <form className="space-y-5">
        <FieldSet>
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
        </FieldSet>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#3478E5] py-2 text-white"
        >
          Send Reset Link
        </button>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
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