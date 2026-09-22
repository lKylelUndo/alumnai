import AlumniStatCards from "./AlumniStatCards"
import AlumniWelcomeHeader from "./AlumniWelcomeHeader"
import { alumniService } from "@/services/alumni.service"

const AlumniBanner = async () => {
  let dashboardStats = null;

  try {
    const response = await alumniService.getDashboardStats();
    dashboardStats = response?.data;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Failed to fetch alumni stats", error);
  }

  return (
    <section className="rounded-2xl bg-primary/[0.03] p-6">
      <AlumniWelcomeHeader />
      <AlumniStatCards dashboardStats={dashboardStats} />
    </section>
  )
}

export default AlumniBanner
