'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BookCardProps {
  id: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  rating?: string;
}

export default function BookDiaryCard({ id, title, date, tags, thumbnail, description, rating }: BookCardProps) {
  const formattedDate = date?.substring(0, 7)?.replace('-', '.') || '';

  return (
    <Link href={`/book/${id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="group flex flex-col h-full cursor-pointer"
      >
        {/* Cover Image — Pinterest ratio with subtle overlay */}
        <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-2xl sm:rounded-[20px] bg-[#EEEBE3] dark:bg-[#201E1C] shadow-[0_2px_20px_rgba(139,115,85,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.25)] group-hover:shadow-[0_12px_40px_rgba(139,115,85,0.12)] dark:group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-shadow duration-500">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#EEEBE3] to-[#DED8CE] dark:from-[#201E1C] dark:to-[#2A2826]">
              <div className="text-center px-4">
                <div className="text-[#8B7355] dark:text-[#D4C3A3] font-serif text-sm leading-tight">{title}</div>
              </div>
            </div>
          )}
          
          {/* Hover overlay — subtle gradient reveal */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Rating badge */}
          {rating && (
            <div className="absolute top-3 right-3 bg-white/85 dark:bg-[#1A1817]/85 backdrop-blur-md rounded-full px-2.5 py-1 text-[8px] sm:text-[9px] tracking-wider text-[#8B7355] dark:text-[#D4C3A3] shadow-sm">
              {rating}
            </div>
          )}

          {/* Save/Bookmark indicator — Pinterest style */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-[#2A2826]/90 backdrop-blur-sm flex items-center justify-center shadow-md">
              <svg className="w-3.5 h-3.5 text-[#3A3530] dark:text-[#EFEFE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Meta — editorial minimal */}
        <div className="pt-3 sm:pt-3.5 px-0.5">
          <h3 className="text-[13px] sm:text-sm font-serif text-[#3A3530] dark:text-[#EFEFE9] leading-snug mb-1 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] sm:text-[10px] font-sans text-[#BAAFA0] dark:text-[#7A746D]">
              {formattedDate}
            </span>
            {tags[0] && (
              <>
                <span className="text-[#DED8CE] dark:text-[#363330] text-[8px]">·</span>
                <span className="text-[9px] sm:text-[10px] font-sans text-[#BAAFA0] dark:text-[#7A746D]">{tags[0]}</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
