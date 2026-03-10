import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});

export const viewport: Viewport = {
  themeColor: '#2A0E30',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Christina's Cozy Chaos",
  description: "A personal little corner of the internet — apps, recipes & everyday chaos.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cozy Chaos',
    startupImage: [{ url: '/icons/icon-512.png' }],
  },
  icons: {
    icon: [
      { url: '/icons/icon-32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/icons/icon-96.png',  sizes: '96x96',  type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${josefin.variable} antialiased`}
      >
        {children}
        <ThemeToggle />
        <Analytics />
      </body>
    </html>
  );
}
