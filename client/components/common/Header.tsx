import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <>
      <header className="w-full bg-[#FFFFFF] p-2 text-[#1A216D] shadow-sm md:p-3">
        <div className="mx-16 flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 md:pl-6">
            <Image
              src={"/logo/alumnailogo.png"}
              width={100}
              height={100}
              alt="Logo"
            />
          
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="font-medium">
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#2D7EE2] px-4 py-1.5 text-sm text-white transition hover:bg-[#1A216D]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
