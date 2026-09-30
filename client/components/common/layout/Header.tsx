import Link from "next/link"
import Logo from "@/components/common/layout/Logo"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo priority />
        </Link>

        <nav className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="hidden text-[#1A216D] hover:bg-[#1A216D]/5 sm:inline-flex"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-[#1A216D] hover:bg-[#131b2e] text-white">
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
