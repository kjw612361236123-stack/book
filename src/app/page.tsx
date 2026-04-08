import { getDatabase } from '@/lib/notion';
import { Suspense } from 'react';
import BookArchive from '@/components/BookArchive';
import PageEntrance, { StaggeredReveal } from '@/components/PageEntrance';
import VisitorCounter from '@/components/VisitorCounter';
import ThemeToggle from '@/components/ThemeToggle';
import RandomQuote from '@/components/RandomQuote';
import ParallaxHero from '@/components/ParallaxHero';
import Image from 'next/image';

export const revalidate = 3600;

export default async function Home() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const books = await getDatabase(databaseId);
  const readingGoal = parseInt(process.env.READING_GOAL || '24', 10);

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817] selection:bg-[#E8E3D8] dark:selection:bg-[#3A3530]">
      <PageEntrance>
        {/* Paper noise texture */}
        <div className="fixed -inset-[200%] opacity-[0.012] dark:opacity-[0.03] pointer-events-none mix-blend-multiply animate-noise" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        {/* Ambient warm glow — top */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#D4C3A3]/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none dark:from-[#8B7355]/5"></div>

        <div className="w-full max-w-[520px] sm:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          
          {/* ===== Header ===== */}
          <section className="w-full pt-5 sm:pt-10">
            <StaggeredReveal delay={0.05}>
              <header className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  {/* Animated dot indicator */}
                  <div className="w-2 h-2 rounded-full bg-[#8B7355] dark:bg-[#D4C3A3] animate-pulse-soft"></div>
                  <div>
                    <h2 className="text-xs sm:text-[13px] font-sans font-semibold text-[#3A3530] dark:text-[#EFEFE9] leading-none tracking-wide">
                      김재원의 서재
                    </h2>
                    <p className="text-[9px] sm:text-[10px] font-sans text-[#A39E98] dark:text-[#7A746D] mt-1 flex items-center gap-1.5">
                      <span>{books.length}권의 기록</span>
                      <span className="text-[#DED8CE] dark:text-[#363330]">|</span>
                      <span>방문 <VisitorCounter /></span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <ThemeToggle />
                </div>
              </header>
            </StaggeredReveal>
            
            {/* ===== Hero — Cinematic Banner ===== */}
            <StaggeredReveal delay={0.12}>
              <ParallaxHero>
                <div className="w-full aspect-[3/4] sm:aspect-[2.2/1] rounded-[20px] sm:rounded-[28px] overflow-hidden relative shadow-[0_12px_48px_rgba(139,115,85,0.12)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
                  <Image 
                    src="/book.gif" 
                    alt="Reading Archive" 
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  {/* Cinematic gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817]/80 via-[#1A1817]/20 to-[#1A1817]/5"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1A1817]/30 via-transparent to-transparent"></div>
                  
                  {/* Hero content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-10 md:p-12">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-px bg-[#D4C3A3]/60"></div>
                      <span className="text-[8px] sm:text-[9px] font-sans text-white/45 tracking-[0.35em] uppercase">
                        Reading Archive
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-tight leading-[1.1] mb-2">
                      Read:<span className="italic text-[#D4C3A3]">log</span>
                    </h1>
                    <p className="text-[10px] sm:text-xs font-serif italic text-white/35 max-w-[280px] sm:max-w-none leading-relaxed">
                      &ldquo;읽은 책들의 온기가 남아있는 곳&rdquo;
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 border-t border-r border-white/10 rounded-tr-lg"></div>
                </div>
              </ParallaxHero>
            </StaggeredReveal>

            {/* Decorative Spacer */}
            <div className="flex items-center gap-4 mt-6 sm:mt-8 mb-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DED8CE]/50 dark:via-[#363330]/50 to-transparent"></div>
              <div className="w-1 h-1 rounded-full bg-[#DED8CE] dark:bg-[#363330]"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DED8CE]/50 dark:via-[#363330]/50 to-transparent"></div>
            </div>
          </section>

          {/* ===== Book Archive ===== */}
          <section className="w-full pt-4 sm:pt-6 pb-16 sm:pb-24"> 
            <Suspense fallback={<div className="h-96 w-full flex items-center justify-center text-[#A39E98] font-serif italic text-sm">Loading Archive...</div>}>
              <BookArchive books={books} readingGoal={readingGoal} />
            </Suspense>
          </section>

          {/* ===== Footer ===== */}
          <footer className="pb-12 sm:pb-16 pt-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DED8CE]/30 dark:via-[#363330]/30 to-transparent mb-6"></div>
            <div className="flex flex-col items-center gap-3">
              {/* 9-2: Random reading quote */}
              <p className="text-[10px] sm:text-[11px] font-serif italic text-[#BAAFA0] dark:text-[#6B6560] text-center max-w-[280px] sm:max-w-none leading-relaxed">
                &ldquo;<RandomQuote />&rdquo;
              </p>
              <div className="group flex flex-col items-center mt-1">
                <p className="text-[8px] font-sans text-[#C4BCB3]/50 dark:text-[#524B43]/50 tracking-[0.2em] mb-3">
                  Shelf.
                </p>
                <p className="text-[10px] sm:text-[11px] font-sans text-[#A39E98] dark:text-[#7A746D] tracking-wide opacity-80 group-hover:opacity-100 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-all duration-500 cursor-default">
                  Designed & Crafted by <span className="font-medium">Jaewon Kim.</span>
                </p>
              </div>
            </div>
          </footer>
          
        </div>
      </PageEntrance>
    </main>
  );
}
