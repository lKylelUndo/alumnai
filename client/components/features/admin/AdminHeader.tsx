"use client"

import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AccountMenu from "@/components/common/layout/AccountMenu"
import { useAuthContext } from "@/context/AuthContext"
import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import InstitutionWordmark from "@/components/common/layout/InstitutionWordmark"

const AdminHeader = () => {
  const { user, logout } = useAuthContext()

  return (
    <nav className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-x-8">
        <Link href="/admin/dashboard" className="min-w-0">
          <InstitutionWordmark />
        </Link>
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs hover:border-primary transition-all">
            <Image src="/images/admindashboardicon.png" alt="Admin Profile" width={36} height={36} className="h-full w-full object-cover" />
          </div>
        </DropdownMenuTrigger>
        <AccountMenu
          avatar={
            <Image src="/images/admindashboardicon.png" alt="Admin Profile" width={36} height={36} className="h-full w-full object-cover" />
          }
          name="Administrator"
          email={user?.email}
          roleLabel="Admin"
        >
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-sm font-medium text-rose-600 hover:bg-rose-50 focus:bg-rose-50 dark:hover:bg-rose-950/30 dark:focus:bg-rose-950/30">
            <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
          </DropdownMenuItem>
        </AccountMenu>
      </DropdownMenu>
    </nav>
  )
}

export default AdminHeader
