import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { BackgroundProvider } from "@/components/background/BackgroundProvider";
import { BackgroundLayer } from "@/components/background/BackgroundLayer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@ggprompts/ui";
import { UselessToasts } from "@/components/satirical/UselessToasts";
import { KonamiCode } from "@/components/satirical/KonamiCode";
import { FakeLiveChat } from "@/components/satirical/FakeLiveChat";
import { CookieBanner } from "@/components/satirical/CookieBanner";
import { PurchaseCelebrationProvider } from "@/components/satirical/PurchaseCelebration";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useless-io.vercel.app"),
  title: "Useless.io - Products You Definitely Don't Need",
  description: "The world's premier e-commerce destination for absurd, non-functional, and completely unnecessary products. Shop with confidence knowing you'll receive absolutely nothing of value.",
  keywords: ["useless", "ecommerce", "funny", "absurd", "products", "parody"],
  openGraph: {
    title: "Useless.io - Products You Definitely Don't Need",
    description: "Shop the finest collection of useless products from JudgyAppliances, GhostWear, MindControl Inc, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <BackgroundProvider>
          <CartProvider>
            <WalletProvider>
              <WishlistProvider>
              <PurchaseCelebrationProvider>
              <BackgroundLayer />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
              >
                Skip to main content
              </a>
              <div className="min-h-screen bg-background transition-colors duration-300 relative z-10">
                <Header />
                <main id="main-content">{children}</main>
              </div>
              <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))',
                  },
                }}
              />
              <UselessToasts />
              <KonamiCode />
              <FakeLiveChat />
              <CookieBanner />
              </PurchaseCelebrationProvider>
            </WishlistProvider>
            </WalletProvider>
          </CartProvider>
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
