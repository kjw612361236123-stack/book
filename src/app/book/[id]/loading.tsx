export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817]">
      {/* Subtle noise texture (matches page.tsx) */}
      <div className="fixed -inset-[200%] opacity-[0.012] dark:opacity-[0.03] pointer-events-none mix-blend-multiply animate-noise" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-[520px] sm:max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Back nav Skeleton */}
        <nav className="pt-5 sm:pt-8 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 opacity-60">
            <svg className="w-4 h-4 text-[#C4B9A8] dark:text-[#524B43]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            <div className="w-12 h-4 sm:h-4.5 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse"></div>
          </div>
        </nav>

        {/* Book Cover + Meta Skeleton */}
        <section className="pb-10 sm:pb-12">
          <div className="flex flex-col items-center">
            
            {/* Cover Skeleton */}
            <div className="relative mb-7 sm:mb-8">
              <div className="w-[130px] sm:w-[150px] md:w-[170px] aspect-[2/3] rounded-xl sm:rounded-2xl bg-[#EEEBE3] dark:bg-[#2C2826] animate-pulse"></div>
            </div>

            {/* Stars Skeleton */}
            <div className="flex items-center gap-[3px] mb-3.5">
              <div className="w-[70px] h-3 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse"></div>
            </div>

            {/* Title Skeleton */}
            <div className="w-2/3 sm:w-1/2 h-7 sm:h-9 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-md animate-pulse mb-3 sm:mb-4"></div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-5">
              <div className="w-12 h-5 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-full animate-pulse"></div>
              <div className="w-16 h-5 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-full animate-pulse"></div>
            </div>
            
            {/* Date Skeleton */}
            <div className="w-24 h-3 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse mb-8 sm:mb-12"></div>

            {/* Divider */}
            <div className="w-6 h-[1.5px] bg-[#DED8CE] dark:bg-[#363330] rounded-full opacity-50 mb-8 sm:mb-12"></div>

            {/* Short review / Quote Skeleton */}
            <div className="w-full max-w-lg mb-10 sm:mb-14">
              <div className="w-full h-16 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-xl sm:rounded-2xl animate-pulse"></div>
            </div>

          </div>
        </section>

        {/* Thick elegant divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DED8CE]/60 dark:via-[#363330]/60 to-transparent mb-10 sm:mb-14"></div>

        {/* Notion Content Skeleton */}
        <article className="w-full flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="w-full h-4 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse"></div>
          <div className="w-11/12 h-4 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse"></div>
          <div className="w-4/5 h-4 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse"></div>
          <div className="w-full h-4 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse mt-4"></div>
          <div className="w-5/6 h-4 bg-[#EEEBE3] dark:bg-[#2C2826] rounded-sm animate-pulse"></div>
        </article>

      </div>
    </main>
  );
}
