"use client";
import { Brain } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/AuthContext"
import Link from "next/link";
import Image from "next/image";

const AlumniHeader = () => {
  const { user, logout } = useAuthContext()
  
  return (
    <nav className="mt-2 flex justify-between">
      <div className="flex items-center gap-x-10 lg:max-w-[500px] md:max-w-[300px] w-full">
        <div className="flex items-center gap-x-1">
          <Image src={"/logo/logoalumnai.png"} alt="Logo" width={100} height={100}/>
        </div>
        <div>
          <Link href={`/alumni/profile`} className="text-[14px] text-primary font-bold">Profile</Link>
        </div>
        <div>
          <Link href={`/alumni/find-collaborators`} className="text-[14px] text-primary font-bold">Collaborators</Link>
        </div>
      </div>

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
    </nav>
  )
}

export default AlumniHeader
