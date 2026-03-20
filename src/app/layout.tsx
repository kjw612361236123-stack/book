import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import YouTubeAudioPlayer from "@/components/YouTubeAudioPlayer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1817' },
  ],
};

export const metadata: Metadata = {
  title: "Shelf. — 재원의 서재",
  description: "책과 함께한 시간들, 조용히 기록합니다.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shelf.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col overscroll-none">
        {children}
        {/* 잔잔한 재즈 플레이리스트 (변경 가능) */}
        <YouTubeAudioPlayer videoId="neV3EPgvZ3g" />
      </body>
    </html>
  );
}
