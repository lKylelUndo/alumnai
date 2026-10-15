"use client";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AccountMenu from "@/components/common/layout/AccountMenu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, User, LogOut, GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import InstitutionWordmark from "@/components/common/layout/InstitutionWordmark";
import { cn } from "@/lib/utils";
import RequestAlumniUpgradeDialog from "@/components/common/dialogs/RequestAlumniUpgradeDialog";

const navLinks = [
  { label: "Home", href: "/student/dashboard" },
  { label: "Profile", href: "/student/profile" },
  { label: "Find Mentors", href: "/student/find-mentors" },
];

const StudentHeader = () => {
  const { user, logout } = useAuthContext()
  const pathname = usePathname()
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

  const isStudent = user?.role === "STUDENT"

  return (
    <>
      <nav className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-x-8">
          <Link href="/student/dashboard" className="min-w-0">
            <InstitutionWordmark />
          </Link>
          <div className="hidden items-center gap-x-10 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isStudent && (
            <button
              onClick={() => setUpgradeDialogOpen(true)}
              className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:opacity-90 hover:shadow-md active:translate-y-px sm:inline-flex"
            >
              <GraduationCap className="h-4 w-4" />
              Request Alumni Status
            </button>
          )}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs hover:border-primary transition-all">
                {user?.profile?.profilePicture ? (
                  <Image src={user.profile.profilePicture} alt="Profile" width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  <span>{user?.profile?.fullName?.[0] || user?.email?.[0] || "A"}</span>
                )}
              </div>
            </DropdownMenuTrigger>
            <AccountMenu
              avatar={
                user?.profile?.profilePicture ? (
                  <Image src={user.profile.profilePicture} alt="Profile" width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-white">
                    {user?.profile?.fullName?.[0] || user?.email?.[0] || "S"}
                  </span>
                )
              }
              name={user?.profile?.fullName || user?.email?.split("@")[0] || "Student"}
              email={user?.email}
              roleLabel="Student"
            >
              <div className="sm:hidden">
                <DropdownMenuItem asChild className="cursor-pointer text-sm hover:bg-muted">
                  <Link href="/student/dashboard" className={cn("flex items-center gap-2", pathname === "/student/dashboard" && "text-primary")}>
                    <Home className="h-3.5 w-3.5 text-primary" /> Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-sm hover:bg-muted">
                  <Link href="/student/find-mentors" className={cn("flex items-center gap-2", pathname === "/student/find-mentors" && "text-primary")}>
                    <Users className="h-3.5 w-3.5 text-primary" /> Find Mentors
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="sm:hidden" />
              <DropdownMenuItem asChild className="cursor-pointer text-sm hover:bg-muted">
                <Link href="/student/profile" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-primary" /> Profile
                </Link>
              </DropdownMenuItem>
              {isStudent && (
                <DropdownMenuItem onClick={() => setUpgradeDialogOpen(true)} className="cursor-pointer text-sm hover:bg-muted">
                  <GraduationCap className="mr-0.5 h-3.5 w-3.5 text-emerald-600" /> Request Alumni Status
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-sm font-medium text-rose-600 hover:bg-rose-50 focus:bg-rose-50 dark:hover:bg-rose-950/30 dark:focus:bg-rose-950/30">
                <LogOut className="mr-0.5 h-3.5 w-3.5" /> Logout
              </DropdownMenuItem>
            </AccountMenu>
          </DropdownMenu>
        </div>
      </nav>

      <RequestAlumniUpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
      />
    </>
  )
}

export default StudentHeader;


