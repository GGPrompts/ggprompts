import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { inter, jetbrainsMono, spaceGrotesk, playfairDisplay } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'design2prompt - Visual Component Builder',
  description: 'Generate perfect AI prompts from visual component designs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.className}`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
