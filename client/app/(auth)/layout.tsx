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
          <div className="md:w-2/3 lg:block relative bg-[#1A216D]">
            <Image
              src="/images/login4.jpg"
              alt="Auth Background"
              fill
              className="object-cover opacity-65"
              sizes="(min-width: 768px) 50vw"
              priority
            />
  
            {/* <div className="absolute inset-0 " /> */}
          </div>
  
          {/* Form Ari*/}
          <div className="md:w-2/3  flex justify-center px-6 py-10">
            {children}
          </div>
  
        </main>
      </div>
    </AuthGuard>
  );
}