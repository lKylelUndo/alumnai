import { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-medium text-[#1A216D] hover:underline mb-4"
      >
        ← Back to Homepage
      </Link>

      <div className="bg-white border-2 border-[#1A216D] rounded-md p-8 sm:p-10 shadow-sm">
        <div className="w-full mb-6">
          <h2 className="text-2xl font-extrabold text-[#1A216D]">
            {title}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}