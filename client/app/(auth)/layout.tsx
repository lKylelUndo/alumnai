import Header from "@/components/common/Header";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="GUEST">
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* Content */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 w-full">
          {/* Left Column: Image Background - Hidden on mobile, full width on desktop */}
          <div className="hidden lg:block relative w-full h-full min-h-[calc(100vh-80px)] bg-[#1A216D]">
            <Image
              src="/images/login4.jpg"
              alt="Auth Background"
              fill
              className="object-cover opacity-65"
              sizes="50vw"
              priority
            />
          </div>

          {/* Right Column: Form Container */}
          <div className="w-full flex items-center justify-center p-6 sm:p-10 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}