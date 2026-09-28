import StudentStatCards from "./StudentStatCards"
import StudentWelcomeHeader from "./StudentWelcomeHeader"
import { studentService } from "@/services/student.service"

const StudentBanner = async () => {
  let dashboardStats = null;

  try {
    const response = await studentService.getDashboardStats();
    dashboardStats = response?.data;
  } catch (error) {
    if (error instanceof Error && "digest" in error && error.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Failed to fetch student stats", error);
  }

  return (
    <section>
      <StudentWelcomeHeader />
      <StudentStatCards dashboardStats={dashboardStats} />
    </section>
  )
}

export default StudentBanner
