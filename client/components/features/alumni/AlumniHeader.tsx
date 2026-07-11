"use client";
import { Brain } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";

const AlumniHeader = () => {
  const { logout } = useAuthContext()
  
  return (
    <nav className="mt-2 flex justify-between">
      <div className="flex items-center gap-x-10 lg:max-w-[500px] md:max-w-[300px] w-full">
        <div className="flex items-center gap-x-1">
          <Brain />
          <h1 className="text-xl font-bold text-primary md:text-2xl">alumnai</h1>
        </div>
        <div>
          <Link href={`/alumni/profile`} className="text-[14px] text-primary font-bold">Profile</Link>
        </div>
        <div>
          <Link href={`/alumni/test`} className="text-[14px] text-primary font-bold">Collaborators</Link>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="h-10 w-10 rounded-full bg-foreground"></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-8">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default AlumniHeader
