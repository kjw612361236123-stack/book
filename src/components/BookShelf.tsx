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
        className={`flex overflow-x-auto gap-3 sm:gap-5 pb-8 pt-2 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 sm:px-2 sm:-mx-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
        style={{ maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)', WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 3%, black 97%, transparent)' }}
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
              className="flex flex-col shrink-0 w-[120px] sm:w-[150px] md:w-[170px] snap-center"
            >
              <Link 
                href={`/book/${book.id}`} 
                onClick={(e) => { if (hasDragged) e.preventDefault(); }}
                onDragStart={(e) => e.preventDefault()}
                className="relative group block overflow-hidden rounded-xl aspect-[2.5/4] shadow-[0_1px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] border border-transparent dark:border-[#2C2826]/30 transition-all duration-500"
              >
                 {book.thumbnail ? (
                   <Image src={book.thumbnail} alt={book.title} fill sizes="(max-width: 640px) 120px, 200px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-[#FDFBF7] to-[#EEEBE3] dark:from-[#1E1C1A] dark:to-[#201E1C] text-[9px] font-serif text-center border-l-[3px] border-[#8B7355]/40 text-[#3A3530] dark:text-[#EFEFE9]">
                     {book.title}
                   </div>
                 )}
                 {/* Spine shadow */}
                 <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
                 
                 {/* Rating badge — always visible on mobile */}
                 {starCount > 0 && (
                   <div className="absolute top-2 right-2 bg-white/80 dark:bg-[#1A1817]/80 backdrop-blur-md rounded-full px-1.5 py-[3px] flex gap-[1px] z-[2]">
                     {Array.from({ length: starCount }).map((_, j) => (
                       <span key={j} className="text-[6px] text-amber-400">★</span>
                     ))}
                   </div>
                 )}
                 
                 {/* Hover overlay — desktop only */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end p-2.5">
                   <p className="text-white text-[9px] font-sans line-clamp-2 leading-tight">{book.title}</p>
                 </div>
              </Link>

              {/* 4-1: Title always visible below card on mobile */}
              <div className="mt-2 px-0.5">
                <p className="text-[10px] sm:text-[11px] font-serif text-[#3A3530] dark:text-[#EFEFE9] line-clamp-2 leading-snug tracking-tight">
                  {book.title}
                </p>
                {book.tags[0] && (
                  <p className="text-[8px] sm:text-[9px] font-sans text-[#A39E98] dark:text-[#7A746D] mt-0.5 truncate">
                    {book.tags[0]}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Shelf line */}
      <div className="mt-2 h-[2px] bg-gradient-to-r from-[#DED8CE]/40 via-[#C4B9A8]/40 to-[#DED8CE]/40 dark:from-[#363330]/40 dark:via-[#524B43]/40 dark:to-[#363330]/40 rounded-full"></div>
    </motion.div>
  );
}
