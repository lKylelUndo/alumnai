import Header from "@/components/common/Header";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
     
     <Header />
     
      {/* Content */}
      <main className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left Image */}
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

        {/* Form Area */}
        <div className="flex items-center justify-center px-6 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}