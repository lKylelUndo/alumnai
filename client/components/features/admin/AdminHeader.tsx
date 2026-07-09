"use client"
import { Brain } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"

const AdminHeader = () => {
  const { logout } = useAuthContext()
  
  return (
    <nav className="mt-2 flex justify-between">
      <div className="flex items-center gap-x-1">
        <Brain />
        <Link href="/admin/dashboard">
          <h1 className="text-xl font-bold text-primary md:text-2xl">alumnai</h1>
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="h-10 w-10 rounded-full bg-foreground"></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-8">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default AdminHeader
