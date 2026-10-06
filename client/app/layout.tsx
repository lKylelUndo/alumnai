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
  description: "AlumnAI connects CPC computing students and alumni through AI-powered, evidence-based skill profiles. Find mentors, close skill gaps, and grow with real data.",
  keywords: ["alumnai", "cpc", "computing","skill", "gap", "github api", "platform", "student", "alumni", "mentorship", "collaboration"],
  icons: {
    icon: "/icons/faviconalumnai.png",
    apple: "/apple-touch-icon.png",
  },
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
