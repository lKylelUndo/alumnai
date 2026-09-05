import { Roboto } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/context/AuthContext"
import type { Metadata, Viewport } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SocketProvider } from "@/context/SocketContext"
import { Toaster } from "sonner"
import { RegisterSW } from "@/components/pwa/register-sw"
import { SITE_URL } from "@/lib/site"
import { WebVitals } from "@/components/common/WebVitals"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlumnAI - AI-Powered Alumni-Student Matching And Skill Gap Analysis System",
    template: "%s | AlumnAI",
  },
  description: "Bridge the gap between education and career. AlumnAI connects students with alumni for mentorship, career guidance, and skill analysis.",
  keywords: ["alumnai", "cpc", "skill", "gap", "github api", "platform", "student", "alumni", "mentorship", "collaboration"],
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
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <SocketProvider>
            <TooltipProvider>
              <WebVitals />
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
