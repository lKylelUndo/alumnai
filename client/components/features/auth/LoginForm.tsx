"use client";

import Link from "next/link";
import AuthCard from "./AuthCard";
import { Field, FieldSet, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginForm() {

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your account to continue"

    >
      <form className="space-y-5">
        <FieldSet>

        <Field>
           <FieldLabel htmlFor="email" className="text-[#1A216D]">Email Address</FieldLabel>
           <Input id="email" autoComplete="off" placeholder="youremail@email.com" />
        </Field> 

        <Field>
           <FieldLabel htmlFor="password" className="text-[#1A216D]">Password</FieldLabel>
           <Input id="password"/>
        </Field> 

        </FieldSet>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#3478E5] mb-3"
        >
          Forgot Password
        </Link>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#3478E5] py-2 mt-3 text-white"
          >
            Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-[#3478E5]"
        >
          Register here
        </Link>
      </p>
    </AuthCard>
  );
}