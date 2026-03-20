'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book } from './ReadingDashboard';

export default function BookShelf({ books }: { books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <motion.div 
      className="w-full mt-2"
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-5">
        {books.map((book, i) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link 
              href={`/book/${book.id}`} 
              className="relative group block overflow-hidden bg-white dark:bg-[#1E1C1A] rounded-lg aspect-[2.7/4] shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.6)] transition-all duration-400"
            >
               {book.thumbnail ? (
                 <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-[#FDFBF7] to-[#EEEBE3] dark:from-[#1E1C1A] dark:to-[#201E1C] text-[9px] sm:text-[10px] font-serif text-center border-l-[3px] border-[#8B7355] text-[#3A3530] dark:text-[#EFEFE9]">
                   {book.title}
                 </div>
               )}
               {/* Realistic book spine */}
               <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-black/25 via-black/8 to-transparent pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-px bg-white/15 pointer-events-none" />
               <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
               {/* Hover title overlay */}
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <p className="text-white text-[8px] sm:text-[9px] font-sans line-clamp-2 leading-tight">{book.title}</p>
               </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
