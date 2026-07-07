import { Brain } from "lucide-react"
import { roboto_slab } from "@/lib/fonts";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const StudentHeader = () => {
    return (
        <>
            <header className="w-full bg-[#FFFFFF] text-primary shadow-sm p-2">
                <div className="max-w-7xl mx-10 md:mx-30 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:pl-6">
                        <Brain size={28} color="#2D7EE2" />
                            <Link href="/student/dashboard" className={`${roboto_slab.className} text-md md:text-2xl font-bold`}>
                            alumnAI
                            </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="h-10 w-10 rounded-full bg-foreground"></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="me-8">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
        </>
    )
}

export default StudentHeader;
