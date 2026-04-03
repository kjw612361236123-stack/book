'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Book } from '@/types/book';

import { useRef, useEffect, useState } from 'react';

function ratingToStars(rating: string): number {
  return (rating.match(/⭐/g) || []).length;
}

export default function BookShelf({ books }: { books: Book[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Mouse wheel horizontal scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse drag-to-scroll
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    setHasDragged(true);
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollContainerRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
  };

  if (books.length === 0) return null;

  return (
    <motion.div className="w-full mt-2 relative">
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-4 sm:gap-5 pb-8 pt-2 snap-x snap-mandatory scrollbar-hide px-2 -mx-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
        style={{ maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)', WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 4%, black 96%, transparent)' }}
      >
        {books.map((book, i) => {
          const starCount = book.rating ? ratingToStars(book.rating) : 0;
          return (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: (i % 6) * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col shrink-0 w-[130px] sm:w-[150px] md:w-[170px] snap-start"
            >
              <Link 
                href={`/book/${book.id}`} 
                onClick={(e) => { if (hasDragged) e.preventDefault(); }}
                onDragStart={(e) => e.preventDefault()}
                className="relative group block overflow-hidden rounded-xl aspect-[2.5/4] shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] transition-all duration-500"
              >
                 {book.thumbnail ? (
                   <Image src={book.thumbnail} alt={book.title} fill sizes="(max-width: 640px) 150px, 200px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-[#FDFBF7] to-[#EEEBE3] dark:from-[#1E1C1A] dark:to-[#201E1C] text-[9px] font-serif text-center border-l-[3px] border-[#8B7355]/40 text-[#3A3530] dark:text-[#EFEFE9]">
                     {book.title}
                   </div>
                 )}
                 {/* Spine shadow */}
                 <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
                 {/* Hover overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                   <div className="w-full">
                     <p className="text-white text-[8px] sm:text-[9px] font-sans line-clamp-2 leading-tight mb-1">{book.title}</p>
                     {starCount > 0 && (
                       <div className="flex gap-[1px]">
                         {Array.from({ length: starCount }).map((_, j) => (
                           <span key={j} className="text-[7px] text-amber-400">★</span>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Shelf line */}
      <div className="mt-2 h-[2px] bg-gradient-to-r from-[#DED8CE]/40 via-[#C4B9A8]/40 to-[#DED8CE]/40 dark:from-[#363330]/40 dark:via-[#524B43]/40 dark:to-[#363330]/40 rounded-full"></div>
    </motion.div>
  );
}
