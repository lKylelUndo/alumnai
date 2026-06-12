import Link from "next/link";
import AuthCard from "./AuthCard";

export default function RegisterForm() {
  return (
    <AuthCard
      title="Create an Account"
      subtitle="Register as a student to get started"
    >
      <form className="space-y-5">
        
        <div>
          <label className="block mb-2 font-medium text-[#232C77]">
            Student ID Number
          </label>

          <input
            type="text"
            placeholder="2023-00001"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

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

        <div>
          <label className="block mb-2 font-medium text-[#232C77]">
            Confirm Password
          </label>

          <input
            type="password"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#3478E5] text-white py-3 rounded-lg font-medium"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#3478E5]"
        >
          Sign in here
        </Link>
      </p>
    </AuthCard>
  );
}