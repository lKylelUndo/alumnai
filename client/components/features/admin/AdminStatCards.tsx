import { BookOpen, GraduationCap, Handshake, Users2, TrendingUp } from "lucide-react"

export interface AdminDashboardStats {
  totalStudents?: number;
  newStudentsThisMonth?: number;
  verifiedAlumni?: number;
  newAlumniThisMonth?: number;
  activeMentorships?: number;
  newMentorshipsThisMonth?: number;
  activeCollaborations?: number;
  newCollaborationsThisMonth?: number;
}

interface AdminStatCardsProps {
  data?: AdminDashboardStats | null;
}

const AdminStatCards = ({ data }: AdminStatCardsProps) => {
  const formatNumber = (num?: number) => (num ?? 0).toLocaleString();

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total Students */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Users2 className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-primary">Total Students</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatNumber(data?.totalStudents)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +{data?.newStudentsThisMonth ?? 0} this month
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Students</p>
      </div>

      {/* Card 2: Verified Alumni */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-primary">Verified Alumni</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatNumber(data?.verifiedAlumni)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +{data?.newAlumniThisMonth ?? 0} this month
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Alumni</p>
      </div>

      {/* Card 3: Active Mentorships */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-primary">Active Mentorships</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatNumber(data?.activeMentorships)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +{data?.newMentorshipsThisMonth ?? 0} this month
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Mentors</p>
      </div>

      {/* Card 4: Active Collaborations */}
      <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <Handshake className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-primary">Active Collaborations</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatNumber(data?.activeCollaborations)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +{data?.newCollaborationsThisMonth ?? 0} this month
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Collaborators</p>
      </div>
    </section>
  )
}

export default AdminStatCards