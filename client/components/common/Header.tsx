import { Brain } from "lucide-react";
import { roboto_slab } from "@/lib/fonts";
import Link from "next/link";

export default function Header(){
    return(
    <>
        <header className="w-full bg-[#FFFFFF] text-[#1A216D] shadow-md p-2 md:p-3">
            <div className="max-w-7xl mx-12 flex items-center justify-between">
               <div className="flex items-center gap-2 md:pl-6">
                   <Brain size={28} color="#2D7EE2"  />
                   <h1 className={`${roboto_slab.className} text-md md:text-2xl font-bold`}>
                    alumnAI
                    </h1>
                 </div>

                 <div className="flex items-center gap-6">
                    <Link href="/login" className="font-medium">
                    Login
                    </Link>

                    <Link
                     href="/register"
                    className="px-4 py-1.5 rounded-lg bg-[#2D7EE2] text-white hover:bg-blue-700 transition">
                    Get Started
                    </Link>
                </div> 
            </div>
        </header>

    </>
    );
}