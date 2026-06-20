import Image from "next/image"
import adminDashboardIcon from "@/public/images/admindashboardicon.svg"
import AdminStatCards from "./AdminStatCards"

const AdminBanner = () => {
  return (
    <section className="lg:mt-8 mt-4">
        <div className="flex items-center gap-x-4">
            <Image src={adminDashboardIcon} alt="" />
            <div>
                <h1 className="md:text-4xl text-2xl text-primary font-semibold">Administrative Dashboard</h1>
                <p className="text-muted-foreground md:text-[16px] text-[14px]">Monitor platform activity and manage institutional data</p>
            </div>
        </div>

        <div>
          <AdminStatCards />
        </div>
    </section>
  )
}

export default AdminBanner