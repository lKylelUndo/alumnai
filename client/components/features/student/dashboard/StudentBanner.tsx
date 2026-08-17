import Image from "next/image"
import StudentStatCards from "./StudentStatCards"
import StudentWelcomeHeader from "./StudentWelcomeHeader"
import { studentService } from "@/services/student.service"

const StudentBanner = async () => {
  let dashboardStats = null;

  try {
    const response = await studentService.getDashboardStats();
    dashboardStats = response?.data;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Failed to fetch student stats", error);
  }

  return (
    <section className="mt-2">
      <div className="flex items-center gap-x-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 p-2 shadow-xs">
          <Image
            src="/images/alumniicon.png"
            alt="Alumni dashboard icon"
            width={60}
            height={60}
            className="h-full w-full object-contain"
          />
        </div>

        <StudentWelcomeHeader />
      </div>

      <StudentStatCards dashboardStats={dashboardStats} />
    </section>
  )
}

export default StudentBanner

