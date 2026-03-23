'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface BookCardProps {
  id: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  rating?: string;
}

function getRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

export default function BookDiaryCard({ id, title, date, tags, thumbnail, description, rating }: BookCardProps) {
  const formattedDate = date?.substring(0, 7)?.replace('-', '.') || '';
  const relativeDate = getRelativeDate(date);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showQuickLook, setShowQuickLook] = useState(false);

  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setShowQuickLook(true);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, []);

  return (
    <>
      <Link 
        href={`/book/${id}`} 
        className="block h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onClick={(e) => { if (showQuickLook) e.preventDefault(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group flex flex-col h-full cursor-pointer"
        >
          {/* Cover Image */}
          <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-2xl sm:rounded-[20px] bg-[#EEEBE3] dark:bg-[#201E1C] shadow-[0_2px_20px_rgba(139,115,85,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.25)] group-hover:shadow-[0_12px_40px_rgba(139,115,85,0.12)] dark:group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-shadow duration-500">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              /* Empty thumbnail — CSS book illustration */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F0E8] to-[#EEEBE3] dark:from-[#201E1C] dark:to-[#2A2826]">
                <div className="relative w-12 h-14 mb-3">
                  {/* Book spine */}
                  <div className="absolute left-0 top-0 w-[3px] h-full bg-[#C4B9A8] dark:bg-[#6B6560] rounded-l-sm" />
                  {/* Book cover */}
                  <div className="absolute left-[3px] top-0 right-0 h-full bg-[#DED8CE] dark:bg-[#363330] rounded-r-sm border border-[#C4B9A8]/30 dark:border-[#524B43]/30" />
                  {/* Book lines */}
                  <div className="absolute left-[10px] top-[10px] right-[6px] space-y-1.5">
                    <div className="h-[1.5px] bg-[#A39E98]/30 dark:bg-[#7A746D]/30 w-3/4" />
                    <div className="h-[1.5px] bg-[#A39E98]/30 dark:bg-[#7A746D]/30 w-1/2" />
                  </div>
                </div>
                <span className="text-[10px] font-serif text-[#8B7355] dark:text-[#D4C3A3] text-center px-4 line-clamp-2 leading-tight">{title}</span>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Rating badge */}
            {rating && (
              <div className="absolute top-3 right-3 bg-white/85 dark:bg-[#1A1817]/85 backdrop-blur-md rounded-full px-2.5 py-1 text-[8px] sm:text-[9px] tracking-wider text-[#8B7355] dark:text-[#D4C3A3] shadow-sm">
                {rating}
              </div>
            )}

            {/* Bookmark indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-[#2A2826]/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                <svg className="w-3.5 h-3.5 text-[#3A3530] dark:text-[#EFEFE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="pt-3 sm:pt-3.5 px-0.5">
            <h3 className="text-[13px] sm:text-sm font-serif text-[#3A3530] dark:text-[#EFEFE9] leading-snug mb-1 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-sans text-[#BAAFA0] dark:text-[#7A746D]">
                {formattedDate}
              </span>
              {relativeDate && (
                <>
                  <span className="text-[#DED8CE] dark:text-[#363330] text-[8px]">·</span>
                  <span className="text-[9px] sm:text-[10px] font-sans text-[#C4B9A8] dark:text-[#6B6560] italic">
                    {relativeDate}
                  </span>
                </>
              )}
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

      {/* Quick Look Modal (Long Press) */}
      <AnimatePresence>
        {showQuickLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setShowQuickLook(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1E1C1A] rounded-3xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {thumbnail && (
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 shadow-lg">
                  <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="font-serif text-lg text-[#3A3530] dark:text-[#EFEFE9] mb-2">{title}</h3>
              {rating && (
                <p className="text-sm text-[#8B7355] dark:text-[#D4C3A3] mb-2">{rating}</p>
              )}
              {description && (
                <p className="text-xs font-sans text-[#A39E98] dark:text-[#7A746D] leading-relaxed line-clamp-3">{description}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/book/${id}`}
                  className="flex-1 text-center text-xs sm:text-sm font-sans py-2.5 bg-[#3A3530] dark:bg-[#D4C3A3] text-white dark:text-[#1A1817] rounded-full active:scale-[0.97] transition-transform"
                >
                  자세히 보기
                </Link>
                <button
                  onClick={() => setShowQuickLook(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-sans text-[#A39E98] rounded-full border border-[#E8E3D8] dark:border-[#2C2826] active:scale-[0.97] transition-transform"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
