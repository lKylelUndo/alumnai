"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";
import Image from "next/image";
import { User, LogOut } from "lucide-react";

const StudentHeader = () => {
  const { user, logout } = useAuthContext()

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-x-8">
        <Image src="/logo/logoalumnai.png" alt="Logo" width={110} height={40} priority className="h-8 w-auto object-contain" />
        <div className="hidden sm:flex items-center gap-x-10">
          <Link href="/student/dashboard" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Home
          </Link>
          <Link href="/student/profile" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Profile
          </Link>
          <Link href="/student/find-mentors" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Find Mentors
          </Link>
        </div>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs hover:border-primary transition-all">
              {user?.profile?.profilePicture ? (
                <Image src={user.profile.profilePicture} alt="Profile" width={36} height={36} className="h-full w-full object-cover" />
              ) : (
                <span>{user?.profile?.fullName?.[0] || user?.email?.[0] || "A"}</span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="me-4 w-44 rounded-xl shadow-md">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-sm font-semibold text-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild className="text-sm cursor-pointer">
                <Link href="/alumni/profile" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-primary" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-sm font-medium text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer">
                <LogOut className="h-3.5 w-3.5 mr-0.5" /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default StudentHeader;

