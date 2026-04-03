import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google";
import YouTubeAudioPlayer from "@/components/YouTubeAudioPlayer";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1817' },
  ],
};

export const metadata: Metadata = {
  title: "Shelf. — 재원의 서재",
  description: "책과 함께한 시간들, 조용히 기록합니다.",
  openGraph: {
    title: "Shelf. — 재원의 서재",
    description: "책과 함께한 시간들, 조용히 기록합니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelf. — 재원의 서재",
    description: "책과 함께한 시간들, 조용히 기록합니다.",
  },
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){
            try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}
            if (typeof console !== 'undefined') {
              var origError = console.error;
              console.error = function() {
                if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes("Can't perform a React state update on a component that hasn't mounted yet.")) { return; }
                if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes("warnAboutUpdateOnNotYetMountedFiberInDEV")) { return; }
                origError.apply(console, arguments);
              };
            }
          })();`
        }} />
      </head>
      <body className="min-h-full flex flex-col overscroll-none">
        <ThemeProvider>
          <ScrollProgressBar />
          {children}
        </ThemeProvider>
        {/* 잔잔한 재즈 플레이리스트 (변경 가능) */}
        <YouTubeAudioPlayer videoId="neV3EPgvZ3g" />
      </body>
    </html>
  );
}
