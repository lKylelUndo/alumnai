"use client";
import { Brain } from "lucide-react"
import { roboto_slab } from "@/lib/fonts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";
import Image from "next/image";

const AlumniHeader = () => {
  const { user, logout } = useAuthContext()
  
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
          <Image src={user?.profile?.profilePicture || ""} alt="Profile" width={40} height={40} className="rounded-full" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-8">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/alumni/profile`}>Profile</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </nav>
  )
}

export default AlumniHeader;

