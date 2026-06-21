import { Brain } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const AlumniHeader = () => {
  return (
    <nav className="mt-2 flex justify-between">
      <div className="flex items-center gap-x-1">
        <Brain />
        <h1 className="text-xl font-bold text-primary md:text-2xl">alumnai</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="h-10 w-10 rounded-full bg-foreground"></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-8">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default AlumniHeader
