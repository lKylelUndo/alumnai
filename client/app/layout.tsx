import { Roboto } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/context/AuthContext"
import type { Metadata, Viewport } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SocketProvider } from "@/context/SocketContext"
import { Toaster } from "sonner"
import { RegisterSW } from "@/components/pwa/register-sw"

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
  appleWebApp: {
    capable: true,
    title: "AlumnAI",
    statusBarStyle: "default",
  },
}

export const viewport: Viewport = {
  themeColor: "#1A216D",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", roboto.className)} >
      <body>
        <AuthProvider>
          <SocketProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <RegisterSW />
            </TooltipProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
