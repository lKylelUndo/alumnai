import { Roboto } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/context/AuthContext"
import type { Metadata } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SocketProvider } from "@/context/SocketContext"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "AlumnAI - AI-Powered Alumni-Student Matching And Skill Gap Analysis System",
    template: "%s | AlumnAI",
  },
  description: "Bridge the gap between education and career. AlumnAI connects students with alumni for mentorship, career guidance, and skill analysis.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", roboto.className)} >
      <body>
        <AuthProvider>
          <SocketProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
