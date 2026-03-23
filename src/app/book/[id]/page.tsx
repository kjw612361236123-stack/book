import { getDatabase, getPage, getPageProperties } from '@/lib/notion';
import { NotionPage } from '@/components/NotionPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 3600;

// Dynamic OG metadata for each book page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { comment, thumbnail } = await getPageProperties(id);
  
  // Get the book title from the database
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
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Shelf.`,
      description: comment || `"${title}" 독서 기록`,
      images: thumbnail ? [thumbnail] : [],
    },
  };
}

export default async function BookPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recordMap = await getPage(id);
  const { comment, thumbnail } = await getPageProperties(id);

  // Get related books (same tags)
  const databaseId = process.env.NOTION_DATABASE_ID;
  const allBooks = await getDatabase(databaseId);
  const currentBook = allBooks.find((b: any) => b.id === id);
  const relatedBooks = currentBook
    ? allBooks
        .filter((b: any) => b.id !== id && b.tags.some((t: string) => currentBook.tags.includes(t)))
        .slice(0, 3)
    : [];

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817] selection:bg-[#E8E3D8] dark:selection:bg-[#3A3530]">
      {/* Ambient noise texture with analog flicker */}
      <div className="fixed -inset-[200%] opacity-[0.015] dark:opacity-[0.035] pointer-events-none mix-blend-multiply animate-noise" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-[520px] sm:max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-8 md:py-16 relative z-10">
        <nav className="mb-8 sm:mb-12 md:mb-16">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2.5 text-[11px] sm:text-sm font-serif italic rounded-full text-[#8B7355] dark:text-[#AFA79D] hover:bg-[#EEEBE3]/60 dark:hover:bg-[#2C2A29] transition-all group border border-transparent hover:border-[#E8E3D8] dark:hover:border-[#2C2826] active:scale-[0.97]"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1 transition-transform group-hover:-translate-x-1 opacity-70" />
            Shelf.로 돌아가기
          </Link>
        </nav>

        {thumbnail && (
          <div className="w-full flex justify-center mb-10 sm:mb-14">
            <div className="w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg shadow-[0_12px_40px_rgba(139,115,85,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-[#E8E3D8]/50 dark:border-[#363330]/50 relative">
              <Image src={thumbnail} alt="Book Cover" fill className="object-cover" unoptimized />
            </div>
          </div>
        )}

        <article className="w-full notion-paper-override">
          <ErrorBoundary>
            <NotionPage recordMap={recordMap} comment={comment} />
          </ErrorBoundary>
        </article>

        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <section className="mt-16 pt-8 border-t border-[#E8E3D8]/40 dark:border-[#363330]/40">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase mb-5">이 책도 읽어보세요</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {relatedBooks.map((book: any) => (
                <Link key={book.id} href={`/book/${book.id}`} className="group">
                  <div className="aspect-[2.7/4] rounded-xl overflow-hidden bg-[#EEEBE3] dark:bg-[#201E1C] relative shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                    {book.thumbnail ? (
                      <Image src={book.thumbnail} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-3 bg-gradient-to-br from-[#FDFBF7] to-[#EEEBE3] dark:from-[#1E1C1A] dark:to-[#201E1C]">
                        <span className="text-[9px] font-serif text-[#8B7355] dark:text-[#D4C3A3] text-center line-clamp-3">{book.title}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] sm:text-xs font-serif text-[#3A3530] dark:text-[#EFEFE9] line-clamp-1 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors">{book.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
