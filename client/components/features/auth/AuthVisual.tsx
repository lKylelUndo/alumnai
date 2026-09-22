"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

const BG_BY_ROUTE: { match: RegExp; src: string }[] = [
  { match: /register|signup/, src: "/images/signupbg.jpg" },
]

const DEFAULT_BG = "/images/loginbg.jpg"

/**
 * Route-aware photographic backdrop for the auth side panel.
 * Register/signup gets its own background, everything else
 * (login, forgot/reset password) falls back to the login one.
 */
export default function AuthVisual() {
  const pathname = usePathname()
  const bg = BG_BY_ROUTE.find((b) => b.match.test(pathname ?? ""))
  const src = bg?.src ?? DEFAULT_BG

  return (
    <Image
      key={src}
      src={src}
      alt=""
      aria-hidden="true"
      fill
      priority
      sizes="50vw"
      className="object-cover opacity-40"
    />
  )
}
