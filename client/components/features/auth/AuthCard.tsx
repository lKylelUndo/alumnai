import { ReactNode } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { roboto_slab } from "@/lib/fonts";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="text-sm text-[#232C77]"
      >
        ← Back to Homepage
      </Link>

      <div className="mt-4 border-[3px] border-[#232C77] bg-white p-10">
        
        <div className="flex items-center justify-center gap-2 mb-4">
            <Brain size={28} color="#2D7EE2"/>
             <h3 className={`${roboto_slab.className} text-[#1A216D] font-bold text-2xl`}>
                alumnAI
             </h3>
          </div>  

        <h2 className="text-2xl font-extrabold text-[#232C77]">
          {title}
        </h2>

        <p className="text-gray-500 mb-8 text-sm">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}