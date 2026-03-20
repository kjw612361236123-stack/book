'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book } from './ReadingDashboard';

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative border-l border-[#E8E3D8] dark:border-[#2C2826] ml-4 md:ml-8 mt-6 pb-12"
    >
       {Object.entries(grouped).map(([month, monthBooks], index) => (
         <motion.div 
           key={month} 
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-80px" }}
           transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
           className="relative pl-7 md:pl-12 mb-12 last:mb-0"
         >
            {/* Timeline dot */}
            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#8B7355] dark:bg-[#D4C3A3] shadow-[0_0_0_4px_#FDFBF7] dark:shadow-[0_0_0_4px_#1A1817]" />
            
            <h2 className="text-lg md:text-xl font-serif text-[#3A3530] dark:text-[#EFEFE9] mb-5 flex items-center gap-3">
              {month}
              <span className="text-[10px] sm:text-xs font-sans text-[#A39E98] dark:text-[#7A746D] bg-[#EEEBE3]/70 dark:bg-[#201E1C] px-2 py-0.5 rounded-full tabular-nums">
                {monthBooks.length}권
              </span>
            </h2>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              {monthBooks.map((book, i) => (
                <Link 
                  href={`/book/${book.id}`} 
                  key={book.id} 
                  className="flex gap-4 group bg-white dark:bg-[#1E1C1A] p-3.5 sm:p-4 rounded-2xl border border-[#E8E3D8]/60 dark:border-[#2C2826] shadow-[0_1px_8px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(139,115,85,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-16 sm:w-20 shrink-0 aspect-[3/4] bg-[#EEEBE3] dark:bg-[#201E1C] rounded-xl overflow-hidden relative">
                    {book.thumbnail ? (
                      <img src={book.thumbnail} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={book.title} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[9px] text-[#8B7355] font-serif text-center p-2">{book.title}</div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 py-0.5 min-w-0">
                    <h3 className="font-serif text-[#3A3530] dark:text-[#EFEFE9] text-sm sm:text-base font-medium mb-1 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-[#A39E98] dark:text-[#7A746D] line-clamp-2 font-sans leading-relaxed mb-2">{book.description}</p>
                    
                    <div className="mt-auto flex flex-wrap gap-1.5 items-center">
                       {book.tags.slice(0, 2).map((t: string) => (
                         <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F0E8] dark:bg-[#201E1C] text-[#8E8B85] dark:text-[#A39E98] font-sans">
                           {t}
                         </span>
                       ))}
                       {book.rating && (
                         <span className="text-[9px] text-[#C4B79D] dark:text-[#D4C3A3] tracking-wider ml-auto">
                           {book.rating}
                         </span>
                       )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
         </motion.div>
       ))}
    </motion.div>
  );
}
