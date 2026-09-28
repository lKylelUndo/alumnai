import AlumniStatCards from "./AlumniStatCards"
import AlumniWelcomeHeader from "./AlumniWelcomeHeader"
import { alumniService } from "@/services/alumni.service"

const AlumniBanner = async () => {
  let dashboardStats = null;

  try {
    const response = await alumniService.getDashboardStats();
    dashboardStats = response?.data;
  } catch (error) {
    if (error instanceof Error && "digest" in error && error.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Failed to fetch alumni stats", error);
  }

  return (
    <section>
      <AlumniWelcomeHeader />
      <AlumniStatCards dashboardStats={dashboardStats} />
    </section>
  )
}

export default AlumniBanner
