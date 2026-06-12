import Link from "next/link";
import AuthCard from "./AuthCard";

export default function LoginForm() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form className="space-y-5">
        
        <div>
          <label className="block mb-2 font-medium text-[#232C77]">
            Email Address
          </label>

          <input
            type="email"
            placeholder="youremail@email.com"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#232C77]">
            Password
          </label>

          <input
            type="password"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <Link
          href="/forgot-password"
          className="text-sm text-[#3478E5]"
        >
          Forgot Password
        </Link>

        <button
          type="submit"
          className="w-full bg-[#3478E5] text-white py-3 rounded-lg font-medium"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
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