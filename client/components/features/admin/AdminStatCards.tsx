import { BookOpen, GraduationCap, Handshake, Users2 } from "lucide-react"

const AdminStatCards = () => {
  return (
    <section className="mt-6 grid grid-cols-1 gap-x-4 gap-y-2 p-4 md:grid-cols-2 md:p-0 lg:grid-cols-4">
      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <div className="flex w-fit items-center justify-center rounded-lg bg-blue-100 p-2">
          <Users2 className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold text-primary">Total Students</h1>
        <h3 className="text-2xl font-bold">1,247</h3>
        <p className="text-[14px] text-muted-foreground">Students</p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <div className="flex w-fit items-center justify-center rounded-lg bg-green-100 p-2">
          <GraduationCap className="h-5 w-5 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold text-primary">Verified Alumni</h1>
        <h3 className="text-2xl font-bold">345</h3>
        <p className="text-[14px] text-muted-foreground">Alumni</p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <div className="flex w-fit items-center justify-center rounded-lg bg-purple-100 p-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
        </div>
        <h1 className="text-xl font-semibold text-primary">
          Active Mentorships
        </h1>
        <h3 className="text-2xl font-bold">32</h3>
        <p className="text-[14px] text-muted-foreground">Mentorships</p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <div className="flex w-fit items-center justify-center rounded-lg bg-orange-100 p-2">
          <Handshake className="h-5 w-5 text-orange-600" />
        </div>
        <h1 className="text-xl font-semibold text-primary">
          Active Collaborations
        </h1>
        <h3 className="text-2xl font-bold">11</h3>
        <p className="text-[14px] text-muted-foreground">Collaborations</p>
      </div>
    </section>
  )
}

export default AdminStatCards