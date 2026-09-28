"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";
import InstitutionWordmark from "@/components/common/layout/InstitutionWordmark";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/alumni/dashboard" },
  { label: "Profile", href: "/alumni/profile" },
  { label: "Collaborators", href: "/alumni/find-collaborators" },
];

const AlumniHeader = () => {
  const { user, logout } = useAuthContext()
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-x-8">
        <Link href="/alumni/dashboard" className="min-w-0">
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

      <div>
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
        <DropdownMenuContent align="end" sideOffset={8} className="w-44 rounded-xl shadow-md data-open:animate-none data-closed:animate-none">
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

export default AlumniHeader;

