import AdminStatCards from "./AdminStatCards"

const AdminBanner = () => {
  return (
    <section className="mt-4 lg:mt-8">
      <div className="flex items-center gap-x-4">
        <img
          src="/images/admindashboardicon.svg"
          alt="Admin dashboard icon"
          width={40}
          height={40}
          className="h-20 w-20"
        />

        <div>
          <h1 className="text-2xl font-semibold text-primary lg:text-4xl">
            Administrative Dashboard
          </h1>
          <p className="text-[14px] text-muted-foreground md:text-[16px]">
            Monitor platform activity and manage institutional data
          </p>
        </div>
      </div>

      <AdminStatCards />
    </section>
  )
}

export default AdminBanner
