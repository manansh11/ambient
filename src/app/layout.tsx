import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ambient-dz4h85mto-manansh11s-projects.vercel.app'),
  title: "Ambient - Zero-friction intention broadcasting",
  description: "Share intentions, skip negotiations.",
  keywords: ["social coordination", "meetup", "spontaneous", "intention broadcasting"],
  authors: [{ name: "Ambient" }],
  creator: "Ambient",
  openGraph: {
    title: "Ambient - Zero-friction intention broadcasting",
    description: "Share intentions, skip negotiations.",
    type: "website",
    locale: "en_US",
    siteName: "Ambient",
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Ambient - Zero-friction intention broadcasting',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambient - Zero-friction intention broadcasting",
    description: "Share intentions, skip negotiations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
