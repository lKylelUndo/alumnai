import { Roboto } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/context/AuthContext"
import type { Metadata } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
    title: "AlumnAI - AI-Powered Alumni-Student Matching And Skill Gap Analysis System",
    description: "This app is partial fulfillment for Capstone 2"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", roboto.className)} >
      <body>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
