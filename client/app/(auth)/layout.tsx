import Header from "@/components/common/layout/Header";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import AuthVisual from "@/components/features/auth/AuthVisual";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="GUEST">
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* Content */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 w-full">
          {/* ── Left Column: product-mockup visual ── */}
          <div className="hidden relative w-full overflow-hidden bg-[#1A216D] lg:sticky lg:top-0 lg:block lg:h-svh lg:self-start">
            {/* Route-aware photographic backdrop (decorative) */}
            <AuthVisual />
            {/* Small decorative dots */}
            <div className="absolute left-12 top-16 h-1.5 w-1.5 rounded-full bg-white opacity-15" aria-hidden="true" />
            <div className="absolute bottom-20 right-10 h-2 w-2 rounded-full bg-white opacity-10" aria-hidden="true" />
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
