"use client";

import Image from "next/image"
import AlumniStatCards from "./AlumniStatCards"
import { useAuthContext } from "@/context/AuthContext"

const AlumniBanner = () => {
  const { user } = useAuthContext();

  return (
    <section className="mt-4 lg:mt-8">
      <div className="flex items-center gap-x-4 px-4 md:px-0">
        <Image
          src="/images/alumniicon.png"
          alt="Alumni dashboard icon"
          width={70}
          height={70}
        />

        <div>
          <h1 className="text-2xl font-semibold text-primary lg:text-4xl">
            Welcome back, {user?.profile?.fullName || user?.email || "Alumni"}
          </h1>
          <p className="text-[14px] text-muted-foreground md:text-[16px]">
            Manage mentorships, connect with mentees, and collaborate with projects.
          </p>
        </div>
      </div>

      <AlumniStatCards />
    </section>
  )
}

export default AlumniBanner
