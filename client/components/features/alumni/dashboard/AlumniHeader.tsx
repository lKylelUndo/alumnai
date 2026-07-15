"use client";
import { Brain } from "lucide-react"
import { roboto_slab } from "@/lib/fonts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";

const AlumniHeader = () => {
  const { logout } = useAuthContext()
  
  return (
    <nav className="flex justify-between shadow-sm p-1.5 w-full text-primary">
      <div className="flex items-center gap-x-12 max-w-7xl mx-10 md:mx-24">
        <div className="flex items-center gap-2 md:pl-6">
          <Brain size={28} color="#2D7EE2" />
            <Link href="/alumni/dashboard" className={`${roboto_slab.className} text-md md:text-2xl font-bold`}>
             alumnAI
            </Link>
        </div>
        <div>
          <Link href={`/alumni/profile`} className="text-[14px] text-primary font-medium">Profile</Link>
        </div>
        <div>
          <Link href={`/alumni/find-collaborators`} className="text-[14px] text-primary font-medium">Collaborators</Link>
        </div>
      </div>

      <div className="md:mr-44">
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
      </div>
    </nav>
  )
}

export default AlumniHeader;

