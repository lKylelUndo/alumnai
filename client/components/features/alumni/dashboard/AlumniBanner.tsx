import Image from "next/image"
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

        <AlumniWelcomeHeader />
      </div>

      <AlumniStatCards dashboardStats={dashboardStats} />
    </section>
  )
}

export default AlumniBanner

