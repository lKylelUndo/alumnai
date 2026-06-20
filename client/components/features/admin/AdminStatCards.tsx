import { BookOpen, GraduationCap, Handshake, Users2 } from "lucide-react"

const AdminStatCards = () => {
  return (
    <section className="mt-6 grid grid-cols-1 gap-x-4 gap-y-2 p-4 md:grid-cols-2 md:p-0 lg:grid-cols-4">
      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <Users2 />
        <h1 className="text-xl font-semibold text-primary">Total Students</h1>
        <h3 className="text-2xl font-bold">1,247</h3>
        <p className="text-[14px] text-muted-foreground">Students</p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <GraduationCap />
        <h1 className="text-xl font-semibold text-primary">Verified Alumni</h1>
        <h3 className="text-2xl font-bold">345</h3>
        <p className="text-[14px] text-muted-foreground">Students</p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <BookOpen />
        <h1 className="text-xl font-semibold text-primary">
          Active Mentorships
        </h1>
        <h3 className="text-2xl font-bold">32</h3>
        <p className="text-[14px] text-muted-foreground">Students</p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <Handshake />
        <h1 className="text-xl font-semibold text-primary">
          Active Collaborations
        </h1>
        <h3 className="text-2xl font-bold">11</h3>
        <p className="text-[14px] text-muted-foreground">Students</p>
      </div>
    </section>
  )
}

export default AdminStatCards
