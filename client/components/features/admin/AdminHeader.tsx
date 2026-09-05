"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import { LogOut } from "lucide-react"
import Image from "next/image"

const AdminHeader = () => {
  const { logout } = useAuthContext()

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-x-8">
        <Image src="/logo/logoalumnai.png" alt="Alumnai Logo" width={110} height={40} priority fetchPriority="high" sizes="110px" className="h-8 w-auto object-contain" />
        <span className="text-sm font-semibold text-primary/90 hidden sm:inline-block cursor-pointer hover:text-primary transition-colors">
          Dashboard
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs hover:border-primary transition-all">
            <Image src="/images/admindashboardicon.png" alt="Admin Profile" width={36} height={36} className="h-full w-full object-cover" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-4 w-48 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-semibold text-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={logout} className="text-xs font-medium text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer">
              <LogOut
               className="h-3.5 w-3.5 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default AdminHeader
