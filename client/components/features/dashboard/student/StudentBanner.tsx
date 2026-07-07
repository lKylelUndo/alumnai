import Image from "next/image"
import StudentStatCards from "./StudentStatCards"

const StudentBanner = () => {
  return (
    <section className="mt-4 lg:mt-8">
      <div className="flex items-center gap-x-4 px-4 md:px-0">
        <Image
          src="/images/alumniicon.png"
          alt="Student dashboard icon"
          width={70}
          height={70}
        />

        <div>
          <h1 className="text-2xl font-semibold text-primary lg:text-4xl">
            Welcome back, {"Rose"}
          </h1>
          <p className="text-[14px] text-muted-foreground md:text-[16px]">
            Track your growth, connect with mentors, and improve your career readiness.
          </p>
        </div>
      </div>

      <StudentStatCards />
    </section>
  )
}

export default StudentBanner
