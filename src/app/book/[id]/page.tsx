import { getPage, getPageProperties } from '@/lib/notion';
import { NotionPage } from '@/components/NotionPage';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 3600;

export default async function BookPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recordMap = await getPage(id);
  const { comment, thumbnail } = await getPageProperties(id);

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817] selection:bg-[#E8E3D8] dark:selection:bg-[#3A3530]">
      {/* Ambient noise texture */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-[520px] sm:max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-8 md:py-16 relative z-10">
        <nav className="mb-8 sm:mb-12 md:mb-16">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2.5 text-[11px] sm:text-sm font-serif italic rounded-full text-[#8B7355] dark:text-[#AFA79D] hover:bg-[#EEEBE3]/60 dark:hover:bg-[#2C2A29] transition-all group border border-transparent hover:border-[#E8E3D8] dark:hover:border-[#2C2826]"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1 transition-transform group-hover:-translate-x-1 opacity-70" />
            Shelf.로 돌아가기
          </Link>
        </nav>

        {thumbnail && (
          <div className="w-full flex justify-center mb-10 sm:mb-14">
            <div className="w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-lg shadow-[0_12px_40px_rgba(139,115,85,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-[#E8E3D8]/50 dark:border-[#363330]/50 relative">
              <img src={thumbnail} alt="Book Cover" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <article className="w-full notion-paper-override">
          <NotionPage recordMap={recordMap} comment={comment} />
        </article>
      </div>
    </main>
  );
}
