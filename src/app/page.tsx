import { getDatabase } from '@/lib/notion';
import BookArchive from '@/components/BookArchive';
import PageEntrance, { StaggeredReveal } from '@/components/PageEntrance';
import VisitorCounter from '@/components/VisitorCounter';

export const revalidate = 3600;

export default async function Home() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const books = await getDatabase(databaseId);

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817] selection:bg-[#E8E3D8] dark:selection:bg-[#3A3530]">
      <PageEntrance>
        {/* Subtle paper texture */}
        <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        <div className="w-full max-w-[520px] sm:max-w-5xl mx-auto px-5 sm:px-6 md:px-8 relative z-10">
          
          {/* Hero — Emotional, editorial cover */}
          <section className="w-full pt-6 sm:pt-10">

            {/* Top bar — personal branding */}
            <StaggeredReveal delay={0.05}>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-[11px] sm:text-xs font-sans font-medium text-[#3A3530] dark:text-[#EFEFE9] leading-none">김재원의 서재</h2>
                    <p className="text-[9px] sm:text-[10px] font-sans text-[#A39E98] dark:text-[#7A746D] mt-1 flex items-center gap-1.5">
                      <span>{books.length}권의 기록</span>
                      <span className="text-[#DED8CE] dark:text-[#363330] text-[8px]">·</span>
                      <span>오늘 방문 <VisitorCounter />명</span>
                    </p>
                  </div>
                </div>
                <p className="text-[9px] sm:text-[10px] font-serif italic text-[#C4B9A8] dark:text-[#6B6560] hidden sm:block">
                  "읽은 책들의 온기가 남아있는 곳"
                </p>
              </div>
            </StaggeredReveal>
            
            {/* Main Visual — Cinematic banner */}
            <StaggeredReveal delay={0.12}>
              <div className="w-full aspect-[4/5] sm:aspect-[2.2/1] rounded-[20px] sm:rounded-[28px] overflow-hidden relative shadow-[0_8px_40px_rgba(139,115,85,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                <img 
                  src="/book.gif" 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
                {/* Multi-layer gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817]/70 via-[#1A1817]/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1817]/20 to-transparent"></div>
                
                {/* Overlay title */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-10 sm:left-12 sm:right-12">
                  <span className="text-[8px] sm:text-[9px] font-sans text-white/50 tracking-[0.3em] uppercase block mb-2 sm:mb-3">
                    Reading Archive
                  </span>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-tight leading-[1.15]">
                    Read:<span className="italic text-[#D4C3A3]">log</span>
                  </h1>
                </div>
              </div>
            </StaggeredReveal>

            {/* Spacer below banner since identity bar moved to top */}
            <div className="h-6 sm:h-8 w-full border-b border-transparent via-[#DED8CE]/60 dark:via-[#363330]/60 bg-gradient-to-r from-transparent to-transparent mt-1"></div>
          </section>

          {/* Book Archive */}
          <section className="w-full pt-6 sm:pt-8 pb-24"> 
            <BookArchive books={books} />
          </section>

          {/* Footer */}
          <footer className="pb-12 pt-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DED8CE]/40 dark:via-[#363330]/40 to-transparent mb-6"></div>
            <div className="flex items-center justify-between">
              <p className="text-[9px] sm:text-[10px] font-sans text-[#C4BCB3] dark:text-[#524B43] tracking-wider">
                © Shelf. by Jaewon
              </p>
              <p className="text-[9px] sm:text-[10px] font-serif italic text-[#C4BCB3] dark:text-[#524B43]">
                with quiet love for books
              </p>
            </div>
          </footer>
          
        </div>
      </PageEntrance>
    </main>
  );
}
