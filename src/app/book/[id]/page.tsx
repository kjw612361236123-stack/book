import { getDatabase, getPage, getPageProperties } from '@/lib/notion';
import { NotionPage } from '@/components/NotionPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const revalidate = 3600;

function ratingToNum(r: string): number {
  return (r.match(/⭐/g) || []).length;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { comment, thumbnail } = await getPageProperties(id);
  const databaseId = process.env.NOTION_DATABASE_ID;
  const books = await getDatabase(databaseId);
  const book = books.find((b: any) => b.id === id);
  const title = book?.title || '독서 기록';

  return {
    title: `${title} — Shelf.`,
    description: comment || `"${title}" 독서 기록`,
    openGraph: {
      title: `${title} — Shelf.`,
      description: comment || `"${title}" 독서 기록`,
      images: thumbnail ? [{ url: thumbnail, width: 600, height: 900 }] : [],
      type: 'article',
      locale: 'ko_KR',
    },
  };
}

export default async function BookPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recordMap = await getPage(id);
  const { comment, thumbnail, author, keywords, status } = await getPageProperties(id);

  const databaseId = process.env.NOTION_DATABASE_ID;
  const allBooks = await getDatabase(databaseId);
  const currentBook = allBooks.find((b: any) => b.id === id);

  // Recommendation logic
  let recommendedBooks: any[] = [];
  if (currentBook) {
    const sameGenreBooks = allBooks
      .filter((b: any) => b.id !== id && b.tags.some((t: string) => currentBook.tags.includes(t)))
      .sort((a: any, b: any) => ratingToNum(b.rating || '') - ratingToNum(a.rating || ''));

    if (sameGenreBooks.length >= 3) {
      const topHalf = sameGenreBooks.slice(0, Math.max(6, Math.ceil(sameGenreBooks.length / 2)));
      recommendedBooks = topHalf.sort(() => Math.random() - 0.5).slice(0, 3);
    } else if (sameGenreBooks.length > 0) {
      recommendedBooks = [...sameGenreBooks];
      const remaining = 3 - recommendedBooks.length;
      const otherBooks = allBooks
        .filter((b: any) => b.id !== id && !recommendedBooks.some((r: any) => r.id === b.id))
        .sort((a: any, b: any) => ratingToNum(b.rating || '') - ratingToNum(a.rating || ''));
      recommendedBooks.push(...otherBooks.slice(0, remaining));
    } else {
      recommendedBooks = allBooks
        .filter((b: any) => b.id !== id)
        .sort((a: any, b: any) => ratingToNum(b.rating || '') - ratingToNum(a.rating || ''))
        .slice(0, 3);
    }
  }

  const starCount = currentBook?.rating ? ratingToNum(currentBook.rating) : 0;
  const formattedDate = currentBook?.date
    ? new Date(currentBook.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  // Check if Notion page has actual content apart from properties
  const recordMapAny = recordMap as any;
  const pageBlockId = recordMapAny?.block ? Object.keys(recordMapAny.block)[0] : null;
  const pageBlock = pageBlockId ? recordMapAny.block[pageBlockId]?.value : null;
  const hasContent = pageBlock?.content && pageBlock.content.length > 0;

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817] selection:bg-[#E8E3D8] dark:selection:bg-[#3A3530]">
      {/* Subtle noise texture */}
      <div className="fixed -inset-[200%] opacity-[0.012] dark:opacity-[0.03] pointer-events-none mix-blend-multiply animate-noise" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-[520px] sm:max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Back nav */}
        <nav className="pt-5 sm:pt-8 mb-8 sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-serif text-[#8B7355] dark:text-[#D4C3A3] hover:text-[#6B5B3D] dark:hover:text-[#EFEFE9] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            <span className="font-medium tracking-wide">서재로</span>
          </Link>
        </nav>

        {/* Book Cover + Meta */}
        <section className="pb-10 sm:pb-12">
          <div className="flex flex-col items-center">
            {/* Cover */}
            {thumbnail && (
              <div className="relative mb-7 sm:mb-8">
                <div className="absolute inset-0 translate-y-2 bg-[#8B7355]/8 dark:bg-black/20 rounded-2xl blur-xl scale-[0.92]"></div>
                <div className="w-[130px] sm:w-[150px] md:w-[170px] aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden relative shadow-[0_8px_32px_rgba(139,115,85,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/15 dark:border-white/5">
                  <Image src={thumbnail} alt={currentBook?.title || ''} fill className="object-cover" unoptimized />
                  {/* Spine edge */}
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-r from-black/15 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Stars */}
            {starCount > 0 && (
              <div className="flex items-center gap-[3px] mb-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-[13px] ${i < starCount ? 'text-amber-500' : 'text-[#E8E3D8] dark:text-[#363330]'}`}>★</span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-[22px] sm:text-2xl md:text-[28px] font-serif text-[#3A3530] dark:text-[#EFEFE9] tracking-tight text-center mb-1.5 leading-tight">
              {currentBook?.title || ''}
            </h1>

            {/* Author */}
            {author && (
              <p className="text-[11px] sm:text-xs font-sans text-[#A39E98] dark:text-[#7A746D] mb-4">{author}</p>
            )}

            {/* Tags + Keywords + Status */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {currentBook?.tags?.map((tag: string) => (
                <span key={tag} className="text-[9px] sm:text-[10px] px-2.5 py-[3px] rounded-md bg-[#F5F0E8] dark:bg-[#242220] text-[#8B7355] dark:text-[#D4C3A3] font-sans">{tag}</span>
              ))}
              {keywords?.map((kw: string) => (
                <span key={kw} className="text-[9px] sm:text-[10px] px-2.5 py-[3px] rounded-md bg-[#EDF5ED]/70 dark:bg-[#1A2E1A]/40 text-[#5B8C5B] dark:text-[#8BC34A] font-sans">{kw}</span>
              ))}
              {status && (
                <span className="text-[9px] sm:text-[10px] px-2.5 py-[3px] rounded-md bg-[#EDF2F8]/70 dark:bg-[#1A2030]/40 text-[#5B8BB5] dark:text-[#64B5F6] font-sans flex items-center gap-1">
                  <span className="w-[5px] h-[5px] rounded-full bg-current opacity-60"></span>
                  {status}
                </span>
              )}
            </div>

            {/* Date */}
            {formattedDate && (
              <p className="text-[9px] sm:text-[10px] font-sans text-[#C4B9A8] dark:text-[#6B6560]">{formattedDate}</p>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="w-10 sm:w-12 h-px bg-[#DED8CE] dark:bg-[#363330] mx-auto mb-8 sm:mb-10"></div>

        {/* Comment */}
        {comment && (
          <section className="mb-10 sm:mb-12">
            <div className="border-l-[2px] border-[#D4C3A3]/50 dark:border-[#8B7355]/30 pl-4 sm:pl-5 py-0.5">
              <p className="font-serif text-[13px] sm:text-[14px] md:text-[15px] text-[#4A453F] dark:text-[#D4D0C8] leading-[1.85] sm:leading-[1.9] whitespace-pre-wrap italic">
                {comment}
              </p>
            </div>
          </section>
        )}

        {/* Notion Content */}
        {hasContent && (
          <article className="w-full notion-paper-override notion-hide-properties mb-6 sm:mb-8">
            <ErrorBoundary>
              <NotionPage recordMap={recordMap} comment="" />
            </ErrorBoundary>
          </article>
        )}

        {/* Recommended Books */}
        {recommendedBooks.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-5 h-px bg-[#DED8CE] dark:bg-[#363330]"></div>
              <p className="text-[10px] sm:text-[11px] font-sans text-[#A39E98] dark:text-[#7A746D] tracking-wide">이런 책은 어때요</p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {recommendedBooks.map((book: any) => {
                const bookStars = book.rating ? ratingToNum(book.rating) : 0;
                return (
                  <Link key={book.id} href={`/book/${book.id}`} className="group">
                    <div className="aspect-[2.5/4] rounded-xl sm:rounded-2xl overflow-hidden bg-[#EEEBE3] dark:bg-[#201E1C] relative shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_8px_24px_rgba(139,115,85,0.1)] dark:group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] group-hover:-translate-y-1 transition-all duration-500">
                      {book.thumbnail ? (
                        <Image src={book.thumbnail} alt={book.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" unoptimized />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-3">
                          <span className="text-[9px] font-serif text-[#8B7355] dark:text-[#D4C3A3] text-center line-clamp-3">{book.title}</span>
                        </div>
                      )}
                      {bookStars > 0 && (
                        <div className="absolute top-2 right-2 bg-white/80 dark:bg-[#1A1817]/80 backdrop-blur-md rounded-full px-1.5 py-0.5 flex gap-[1px]">
                          {Array.from({ length: bookStars }).map((_, j) => (
                            <span key={j} className="text-[6px] text-amber-500">★</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-2.5 px-0.5">
                      <p className="text-[10px] sm:text-[11px] font-serif text-[#3A3530] dark:text-[#EFEFE9] line-clamp-1 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors tracking-tight">{book.title}</p>
                      {book.tags?.[0] && (
                        <p className="text-[8px] sm:text-[9px] font-sans text-[#C4B9A8] dark:text-[#6B6560] mt-0.5">{book.tags[0]}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 sm:mt-20 pb-12 pt-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DED8CE]/30 dark:via-[#363330]/30 to-transparent mb-6"></div>
          <p className="text-center text-[8px] sm:text-[9px] font-sans text-[#C4BCB3]/50 dark:text-[#524B43]/50 tracking-[0.15em]">
            Shelf.
          </p>
        </footer>
      </div>
    </main>
  );
}
