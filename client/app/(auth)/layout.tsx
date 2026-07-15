import Header from "@/components/common/Header";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard mode="GUEST">
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
       
       <Header />
  
        {/* Content */}
        <main className="grid lg:grid-cols-2 flex-1">
          
          {/* Image Size To Be Adjusted ^ */}
          <div className="hidden lg:block relative">
            <Image
              src="/images/walapakayhanap.png"
              alt="Auth Background"
              fill
              className="object-cover"
              priority
            />
  
            <div className="absolute inset-0 bg-[#1A216D]/55" />
          </div>
  
          {/* Form Ari*/}
          <div className="flex justify-center px-6 py-10">
            {children}
          </div>
  
        </main>
      </div>
    </AuthGuard>
  );
}