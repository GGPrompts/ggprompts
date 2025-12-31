import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { BackgroundProvider } from "@/components/BackgroundProvider"
import { MasterBackground } from "@/components/MasterBackground"
import { Navigation } from "@/components/navigation/Navigation"
import { Toaster, TooltipProvider } from "@ggprompts/ui"
import { TabzChromeProvider } from "@ggprompts/tabz"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "GGPrompts - AI Prompt Engineering Platform",
  description: "Discover, create, and share high-quality AI prompts. Join a community of prompt engineers.",
  keywords: ["AI prompts", "prompt engineering", "ChatGPT", "Claude", "LLM"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <BackgroundProvider>
          <ThemeProvider defaultTheme="amber">
            <TabzChromeProvider>
              <TooltipProvider>
                <MasterBackground />
                <div className="relative z-10 min-h-screen flex flex-col">
                  <Navigation />
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
                <Toaster />
              </TooltipProvider>
            </TabzChromeProvider>
          </ThemeProvider>
        </BackgroundProvider>
      </body>
    </html>
  )
}
