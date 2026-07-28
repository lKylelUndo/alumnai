"use client";
import Image from "next/image"
import StudentStatCards from "./StudentStatCards"

const StudentBanner = () => {
  return (
    <section className="mt-2">
      <div className="flex items-center gap-x-4">
        
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 p-2 border border-primary/10 shadow-xs">
          <Image
            src="/images/alumniicon.png"
            alt="Alumni dashboard icon"
            width={60}
            height={60}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary lg:text-3xl">
            Welcome back, {"Student"}
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Track your growth, connect with mentors, and improve your career readiness.
          </p>
        </div>
      </div>

      <StudentStatCards />
    </section>
  )
}

export default StudentBanner

