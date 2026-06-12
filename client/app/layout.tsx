import { Roboto, Roboto_Slab } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", roboto.className)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
