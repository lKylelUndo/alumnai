// "use client"
// import { Handshake, Mail, Users, Target, Briefcase, SquareUserRound } from "lucide-react"
// import Link from "next/link";

// const StudentStatCards = () => {
//   return (
//     <section className="mt-6 grid grid-cols-1 gap-6 px-4 md:p-0 md:px-0 lg:grid-cols-4">
//       {/* Stats Cards Section */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
//         {/* Active Collaborators */}
//         <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-md transition-all hover:shadow-sm">
//           <div className="space-y-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
//               <Handshake className="h-5 w-5" />
//             </div>
//             <div className="space-y-1">
//               <h2 className="text-xl font-semibold text-primary">
//                 Active Collaborators
//               </h2>
//               <div className="flex items-baseline gap-x-2">
//                 <span className="text-3xl font-bold text-foreground">7</span>
//                 <span className="text-sm text-muted-foreground">Users</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Pending Requests */}
//         <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-sm">
//           <div className="space-y-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
//               <Mail className="h-5 w-5" />
//             </div>
//             <div className="space-y-1">
//               <h2 className="text-xl font-semibold text-primary">
//                 Pending Collaboration Invites
//               </h2>
//               <div className="flex items-baseline gap-x-2">
//                 <span className="text-3xl font-bold text-foreground">2</span>
//                 <span className="text-sm text-muted-foreground">Invites</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Active Mentorships */}
//         <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-sm">
//           <div className="space-y-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
//               <Users className="h-5 w-5" />
//             </div>
//             <div className="space-y-1">
//               <h2 className="text-xl font-semibold text-primary">
//                 Your Active Mentors
//               </h2>
//               <div className="flex items-baseline gap-x-2">
//                 <span className="text-3xl font-bold text-foreground">12</span>
//                 <span className="text-sm text-muted-foreground">Mentees</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Quick Actions Panel */}
//       <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs lg:col-span-1">
//         <div className="space-y-4">
//           <div className="flex items-center gap-x-2 font-semibold text-foreground">
//             <Target className="h-5 w-5 text-primary" />
//             <h2 className="text-base font-bold">Quick Actions</h2>
//           </div>
//           <div className="space-y-2">

//               <Link href="/student/profile"
//               className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground/35 hover:bg-muted">
//               <SquareUserRound className="h-4 w-4 text-icon" />
//               <span>View My Profile</span>
//             </Link>

    
//               <Link href="/student/profile"
//               className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground/35 hover:bg-muted">
//               <Briefcase className="h-4 w-4 text-icon" />
//               <span>Edit Profile</span>
//               </Link>

//             <Link href="/student/find-mentors"
//             className="flex w-full cursor-pointer items-center gap-x-3 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-muted-foreground/35 hover:bg-muted">
//               <Users className="h-4 w-4 text-icon" />
//               <span>Find Collaborators</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
// export default StudentStatCards


import DashboardQuickAction from "@/components/common/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"

const StudentStatCards = () => {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
        {/* Active Collaborators */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Handshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Active Collaborators
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">7</span>
                <span className="text-xs text-muted-foreground">Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Pending Invites
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">2</span>
                <span className="text-xs text-muted-foreground">Invites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Mentorships */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Active Mentorships
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">12</span>
                <span className="text-xs text-muted-foreground">Mentees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <DashboardQuickAction
        profileRoute="/student/profile"
        updateProfileRoute="/alumni/profile/update"
        featureRoute="/student/find-mentors"
        featureLabel="Find Mentors"
      />
    </section>
  )
}

export default StudentStatCards
