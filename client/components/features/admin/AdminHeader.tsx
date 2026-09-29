"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import { LayoutDashboard, LogOut, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import InstitutionWordmark from "@/components/common/layout/InstitutionWordmark"
import { cn } from "@/lib/utils"

const navLinks = [{ label: "Dashboard", href: "/admin/dashboard" }]

const AdminHeader = () => {
  const { user, logout } = useAuthContext()
  const pathname = usePathname()

  return (
    <nav aria-label="Admin" className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-x-8">
        <Link href="/admin/dashboard" className="min-w-0">
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
                pathname === link.href
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Menu takes over the hidden inline nav on small screens */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label="Open admin menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-primary/90 transition-colors outline-none hover:bg-primary/10 focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-44 rounded-xl shadow-md data-open:animate-none data-closed:animate-none"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold text-foreground">
                Menu
              </DropdownMenuLabel>
              {navLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  asChild
                  className="min-h-11 cursor-pointer text-sm font-medium"
                >
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    <LayoutDashboard className="mr-1 h-3.5 w-3.5 text-primary" />{" "}
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label="Open account menu"
            className="flex h-11 w-11 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:h-9 sm:w-9"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-white shadow-xs transition-colors hover:border-primary">
              {user?.profile?.profilePicture ? (
                <Image
                  src={user.profile.profilePicture}
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="/images/admindashboardicon.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              )}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 rounded-xl shadow-md data-open:animate-none data-closed:animate-none"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold text-foreground">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={logout}
                className="min-h-11 cursor-pointer text-sm font-medium text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default AdminHeader
