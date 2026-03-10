// ─────────────────────────────────────────────
// Add this to your app/layout.tsx metadata export
// ─────────────────────────────────────────────

import type { Metadata, Viewport } from 'next';

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
    title: "Cozy Chaos",
    // Apple uses these for the home screen icon
    startupImage: [
      {
        url: '/icons/icon-512.png',
      },
    ],
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

// ─────────────────────────────────────────────
// Also add this to the <head> inside your layout:
// ─────────────────────────────────────────────

// <link rel="apple-touch-icon" href="/icons/icon-192.png" />
// <meta name="apple-mobile-web-app-capable" content="yes" />
// <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
