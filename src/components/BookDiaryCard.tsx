'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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

function ratingToStars(rating: string): number {
  return (rating.match(/⭐/g) || []).length;
}

export default function BookDiaryCard({ id, title, date, tags, thumbnail, description, rating }: BookCardProps) {
  const formattedDate = date?.substring(0, 7)?.replace('-', '.') || '';
  const relativeDate = getRelativeDate(date);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showQuickLook, setShowQuickLook] = useState(false);
  const starCount = rating ? ratingToStars(rating) : 0;

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
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group flex flex-col h-full cursor-pointer"
        >
          {/* Cover Image */}
          <div className="relative aspect-[3/4.3] w-full overflow-hidden rounded-2xl sm:rounded-[22px] bg-[#EEEBE3] dark:bg-[#201E1C]">
            {/* Soft ambient shadow */}
            <div className="absolute -inset-px rounded-2xl sm:rounded-[22px] shadow-[0_4px_24px_rgba(139,115,85,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_56px_rgba(139,115,85,0.16)] dark:group-hover:shadow-[0_20px_56px_rgba(0,0,0,0.6)] transition-shadow duration-700 pointer-events-none z-10"></div>
            
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                fill
                sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 300px"
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F8F4ED] to-[#EEEBE3] dark:from-[#242220] dark:to-[#1E1C1A]">
                {/* Minimal book icon */}
                <div className="relative w-10 h-13 mb-3 opacity-60">
                  <div className="absolute left-0 top-0 w-[2.5px] h-full bg-[#C4B9A8] dark:bg-[#6B6560] rounded-l-sm" />
                  <div className="absolute left-[2.5px] top-0 right-0 h-full bg-[#DED8CE] dark:bg-[#363330] rounded-r-sm" />
                  <div className="absolute left-[9px] top-[8px] right-[5px] space-y-1.5">
                    <div className="h-[1px] bg-[#A39E98]/25 dark:bg-[#7A746D]/25 w-3/4" />
                    <div className="h-[1px] bg-[#A39E98]/25 dark:bg-[#7A746D]/25 w-1/2" />
                  </div>
                </div>
                <span className="text-[10px] font-serif text-[#8B7355] dark:text-[#D4C3A3] text-center px-4 line-clamp-2 leading-snug">{title}</span>
              </div>
            )}
            
            {/* Cinematic hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]"></div>
            
            {/* Rating badge — premium star chip */}
            {starCount > 0 && (
              <div className="absolute top-2.5 right-2.5 z-[2]">
                <div className="flex items-center gap-[2px] bg-white/90 dark:bg-[#1A1817]/90 backdrop-blur-xl rounded-full px-2 py-[5px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-[7px] sm:text-[8px] leading-none ${i < starCount ? 'text-amber-500' : 'text-[#DED8CE] dark:text-[#363330]'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hover: Read indicator */}
            <div className="absolute bottom-3 left-3 right-3 z-[2] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
              <span className="text-[8px] sm:text-[9px] font-sans text-white/80 tracking-wide">기록 펼쳐보기</span>
            </div>

          </div>

          {/* Meta — Refined typography */}
          <div className="pt-3 sm:pt-3.5 px-0.5">
            <h3 className="text-[12px] sm:text-[13px] font-serif text-[#3A3530] dark:text-[#EFEFE9] leading-snug mb-1.5 group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3] transition-colors duration-300 line-clamp-2 tracking-tight">
              {title}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-sans text-[#BAAFA0] dark:text-[#7A746D] tabular-nums">
                {formattedDate}
              </span>
              {relativeDate && (
                <>
                  <span className="text-[#DED8CE] dark:text-[#363330] text-[6px]">●</span>
                  <span className="text-[9px] sm:text-[10px] font-sans text-[#C4B9A8] dark:text-[#6B6560] italic">
                    {relativeDate}
                  </span>
                </>
              )}
            </div>
            {tags[0] && (
              <span className="inline-block mt-1.5 text-[8px] sm:text-[9px] font-sans text-[#A39E98] dark:text-[#7A746D] bg-[#F5F0E8]/80 dark:bg-[#201E1C]/80 px-2 py-0.5 rounded-full">
                {tags[0]}
              </span>
            )}
          </div>
        </motion.div>
      </Link>

      {/* Quick Look Modal (Long Press) — Premium */}
      <AnimatePresence>
        {showQuickLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center"
            onClick={() => setShowQuickLook(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-[#FDFBF7] dark:bg-[#1E1C1A] rounded-t-[28px] sm:rounded-[28px] w-full sm:max-w-sm overflow-hidden shadow-2xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full bg-[#DED8CE] dark:bg-[#363330]"></div>
              </div>
              
              <div className="p-5 sm:p-6 overflow-y-auto max-h-[85vh]">
                {thumbnail && (
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <Image src={thumbnail} alt={title} fill sizes="(max-width: 640px) 250px, 400px" className="object-cover" />
                  </div>
                )}
                
                <h3 className="font-serif text-lg text-[#3A3530] dark:text-[#EFEFE9] mb-2 tracking-tight">{title}</h3>
                
                {starCount > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < starCount ? 'text-amber-500' : 'text-[#DED8CE] dark:text-[#363330]'}`}>★</span>
                    ))}
                  </div>
                )}
                
                {description && (
                  <p className="text-xs font-sans text-[#8B8580] dark:text-[#A39E98] leading-relaxed line-clamp-4 mb-5">{description}</p>
                )}
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tags.map(tag => (
                      <span key={tag} className="text-[9px] px-2.5 py-1 rounded-full bg-[#F5F0E8] dark:bg-[#201E1C] text-[#8B7355] dark:text-[#D4C3A3] font-sans">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2.5">
                  <Link
                    href={`/book/${id}`}
                    className="flex-1 text-center text-xs sm:text-sm font-sans py-3 bg-[#3A3530] dark:bg-[#D4C3A3] text-white dark:text-[#1A1817] rounded-2xl active:scale-[0.97] transition-transform font-medium"
                  >
                    자세히 보기
                  </Link>
                  <button
                    onClick={() => setShowQuickLook(false)}
                    className="px-5 py-3 text-xs sm:text-sm font-sans text-[#A39E98] rounded-2xl border border-[#E8E3D8] dark:border-[#2C2826] active:scale-[0.97] transition-transform"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
