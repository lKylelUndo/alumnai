import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1A216D]/8 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/logoalumnai.png"
            width={140}
            height={76}
            alt="alumnAI"
            priority
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="hidden text-[#1A216D] sm:inline-flex"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-[#2D7EE2] hover:bg-[#1A216D]">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
