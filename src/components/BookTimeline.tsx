'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Book } from '@/types/book';

function ratingToStars(rating: string): number {
  return (rating.match(/⭐/g) || []).length;
}

export default function BookTimeline({ books }: { books: Book[] }) {
  if (books.length === 0) return null;

  // Group by "YYYY년 M월"
  const grouped: Record<string, Book[]> = {};
  books.forEach(b => {
    const d = new Date(b.date || '2026-01-01');
    const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  });

  const sortedMonthEntries = Object.entries(grouped).sort((a, b) => {
    const [yearA, monthA] = a[0].replace('월', '').split('년 ').map(Number);
    const [yearB, monthB] = b[0].replace('월', '').split('년 ').map(Number);
    if (yearB !== yearA) return yearB - yearA;
    return monthB - monthA;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative ml-4 sm:ml-8 mt-4 pb-12"
    >
      {/* 5-1: Timeline line — better spacing */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#E8E3D8] via-[#E8E3D8] to-transparent dark:from-[#2C2826] dark:via-[#2C2826] dark:to-transparent"></div>

       {sortedMonthEntries.map(([month, monthBooks], index) => (
         <motion.div 
           key={month} 
           initial={{ opacity: 0, x: -16 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-60px" }}
           transition={{ delay: (index % 5) * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
           className="relative pl-7 sm:pl-10 mb-10 last:mb-0"
         >
            {/* Timeline dot  */}
            <div className="absolute -left-[5px] top-2.5 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B7355] dark:bg-[#D4C3A3] relative z-10" />
              <span className="absolute w-5 h-5 rounded-full bg-[#8B7355]/10 dark:bg-[#D4C3A3]/10 animate-pulse-soft" />
            </div>
            
            {/* 5-2: Larger month heading for mobile */}
            <h2 className="text-[15px] sm:text-lg font-serif text-[#3A3530] dark:text-[#EFEFE9] mb-4 flex items-center gap-2.5">
              {month}
              <span className="text-[10px] sm:text-[10px] font-sans text-[#8B7355] dark:text-[#D4C3A3] bg-[#F5F0E8] dark:bg-[#242220] px-2.5 py-0.5 rounded-lg tabular-nums">
                {monthBooks.length}권
              </span>
            </h2>
            
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {monthBooks.map((book) => {
                const starCount = book.rating ? ratingToStars(book.rating) : 0;
                return (
                  <Link 
                    href={`/book/${book.id}`} 
                    key={book.id} 
                    className="flex gap-3 sm:gap-3.5 group bg-white/60 dark:bg-[#1E1C1A]/60 backdrop-blur-sm p-3 sm:p-3.5 rounded-2xl border border-[#E8E3D8]/40 dark:border-[#2C2826]/40 hover:border-[#D4C3A3]/30 dark:hover:border-[#8B7355]/20 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(139,115,85,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-400 active:scale-[0.98]"
                  >
                    <div className="w-12 sm:w-16 shrink-0 aspect-[2.5/4] bg-[#EEEBE3] dark:bg-[#201E1C] rounded-xl overflow-hidden relative shadow-sm">
                      {book.thumbnail ? (
                        <Image src={book.thumbnail} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={book.title} sizes="(max-width: 640px) 48px, 100px" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-[#8B7355] font-serif text-center p-1.5">{book.title}</div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 py-0.5 min-w-0 justify-center">
                      {/* 5-2: Larger mobile font sizes */}
                      <h3 className="font-serif text-[#3A3530] dark:text-[#EFEFE9] text-[13px] sm:text-sm mb-1 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors line-clamp-1 tracking-tight">{book.title}</h3>
                      
                      {book.description && (
                        <p className="text-[10px] sm:text-[11px] text-[#A39E98] dark:text-[#7A746D] line-clamp-1 font-sans leading-relaxed mb-1.5">{book.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {book.tags.slice(0, 2).map((t: string) => (
                          <span key={t} className="text-[9px] sm:text-[9px] px-2 py-0.5 rounded-md bg-[#F5F0E8]/80 dark:bg-[#242220]/80 text-[#8B7355] dark:text-[#D4C3A3] font-sans">
                            {t}
                          </span>
                        ))}
                        {starCount > 0 && (
                          <div className="flex gap-[1px] ml-auto">
                            {Array.from({ length: starCount }).map((_, j) => (
                              <span key={j} className="text-[8px] text-amber-500">★</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
         </motion.div>
       ))}
    </motion.div>
  );
}
