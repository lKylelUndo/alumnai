import { ReactNode } from "react";
import Link from "next/link";
import { Brain } from "lucide-react"
import { roboto_slab } from "@/lib/fonts";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <Link href="/"className="text-sm text-[#232C77]">
        ← Back to Homepage
      </Link>

      <div className="mt-4 border border-[#1A216D] border-2 bg-white p-10 rounded-sm">
       <div className="">

          {/* Change to logo once logo design is finished */}
          <div className="flex items-center justify-center gap-2 md:pl-2 mb-6">
            <Brain size={28} color="#2D7EE2" />
            <Link href="/" className={`${roboto_slab.className} text-md text-[#1A216D] md:text-2xl font-bold`}>
             alumnAI
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold text-[#232C77]">
            {title}
          </h2>
  
          <p className="text-gray-500 mb-8 text-sm">
            {subtitle}
          </p>
       </div>

        {children}
      </div>
    </div>
  );
}