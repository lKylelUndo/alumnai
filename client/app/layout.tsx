import { Roboto } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/context/AuthContext"
import type { Metadata } from "next"
import { AuthGuard } from "@/components/features/auth/AuthGuard"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
    title: "Alumnai CPC",
    description: "This app is partial fulfillment for capstone 2"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", roboto.className)} >
      <body>
        <AuthProvider>
          <AuthGuard mode="GUEST">{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
