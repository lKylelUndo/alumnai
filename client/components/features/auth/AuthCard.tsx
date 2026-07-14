import { ReactNode } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { roboto_slab } from "@/lib/fonts";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="text-sm text-[#232C77]"
      >
        ← Back to Homepage
      </Link>

      <div className="mt-4  border border-2 bg-white p-6 rounded-md">
        
        {/* <div className="flex items-center justify-center gap-x-1">
            <Brain size={28} color="#2D7EE2"/>
             <h3 className={`${roboto_slab.className} text-[#1A216D] font-bold text-xl`}>
                alumnAI
             </h3>
        </div>   */}

       <div className="">
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