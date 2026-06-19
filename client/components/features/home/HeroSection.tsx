import Image from "next/image";
import { Brain } from "lucide-react";
import { roboto_slab } from "@/lib/fonts";


export default function HeroSection() {
  return (
    <section className="bg-[#EFF4F3]">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        
        <div className="text-center">
            
          <div className="flex items-center justify-center gap-2">
            <Brain size={30} color="#2D7EE2"/>
             <h3 className={`${roboto_slab.className} text-[#1A216D] font-bold text-3xl`}>
                alumnAI
             </h3>
          </div>  

          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Bridge the Gap Between
            <br />
            <span className="text-blue-600">
              Students <span className="text-slate-900">and</span> Alumni
            </span>
          </h1>

          <p className="mt-6 text-base text-slate-600 max-w-xl">
            An AI-powered institutional platform that connects
            computing students with alumni through repository-based
            skill indexing, intelligent matching, and data-driven
            curriculum insights.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/portal.png"
            alt="Hero Illustration"
            width={350}
            height={350}
          />
        </div>
      </div>
    </section>
  );
}