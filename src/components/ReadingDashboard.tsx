'use client';

import { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface Book {
  id: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  rating?: string;
}

export default function ReadingDashboard({ books, goal = 24 }: { books: Book[], goal?: number }) {
  // Determine which years actually have data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    books.forEach(book => {
      const d = new Date(book.date || new Date().toISOString());
      years.add(d.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a); // newest first
  }, [books]);

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] || new Date().getFullYear()
  );

  const stats = useMemo(() => {
    let yearBooks = 0;
    const monthlyCounts = new Array(12).fill(0);
    const monthlyTitles: string[][] = Array.from({ length: 12 }, () => []);
    const tagCounts: Record<string, number> = {};

    books.forEach(book => {
      const dateStr = book.date || new Date().toISOString();
      const date = new Date(dateStr);
      if (date.getFullYear() === selectedYear) {
        yearBooks++;
        monthlyCounts[date.getMonth()]++;
        monthlyTitles[date.getMonth()].push(book.title);
      }
      book.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const topTags = sortedTags.slice(0, 5).map(entry => ({ tag: entry[0], count: entry[1] }));
    const totalTagsCount = sortedTags.reduce((acc, curr) => acc + curr[1], 0);

    return { yearBooks, monthlyCounts, monthlyTitles, topTags, totalTagsCount, total: books.length };
  }, [books, selectedYear]);

  const progressPercentage = Math.min((stats.yearBooks / goal) * 100, 100);

  const tagColors = [
    { bar: 'bg-[#8B7355] dark:bg-[#D4C3A3]', dot: 'bg-[#8B7355] dark:bg-[#D4C3A3]' },
    { bar: 'bg-[#A39080] dark:bg-[#B8A890]', dot: 'bg-[#A39080] dark:bg-[#B8A890]' },
    { bar: 'bg-[#C4BCB3] dark:bg-[#7A746D]', dot: 'bg-[#C4BCB3] dark:bg-[#7A746D]' },
    { bar: 'bg-[#DED8CE] dark:bg-[#524B43]', dot: 'bg-[#DED8CE] dark:bg-[#524B43]' },
    { bar: 'bg-[#EEEBE3] dark:bg-[#363330]', dot: 'bg-[#EEEBE3] dark:bg-[#363330]' },
  ];

  const monthLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full relative mt-4">
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 -mx-4 sm:px-0 sm:mx-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Card 1: Summary / Quick Facts (Moved from Card 4) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[82vw] sm:min-w-[260px] max-w-[320px] flex-1 snap-center bg-gradient-to-br from-[#3A3530] to-[#2A2826] dark:from-[#2A2826] dark:to-[#1E1C1A] border border-[#4A453F]/30 dark:border-[#363330] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_30px_rgba(139,115,85,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] shrink-0"
        >
          <div>
            <h3 className="text-[#A39E98] text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase mb-4">Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-[9px] font-sans tracking-wider uppercase mb-1">Total Books</p>
                <p className="text-white text-2xl sm:text-3xl font-serif tabular-nums">{stats.total}</p>
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div>
                <p className="text-white/40 text-[9px] font-sans tracking-wider uppercase mb-1">This Year</p>
                <p className="text-white text-2xl sm:text-3xl font-serif tabular-nums">{stats.yearBooks}</p>
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div>
                <p className="text-white/40 text-[9px] font-sans tracking-wider uppercase mb-1">Favorite Genre</p>
                <p className="text-[#D4C3A3] text-base sm:text-lg font-serif">{stats.topTags[0]?.tag || '—'}</p>
              </div>
            </div>
          </div>
          <p className="text-white/20 text-[9px] font-sans mt-6 italic">Keep reading, keep growing.</p>
        </motion.div>

        {/* Card 2: Yearly Goal — Emotional, minimal (Previously Card 1) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[82vw] sm:min-w-[300px] max-w-[380px] flex-1 snap-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] dark:from-[#1E1C1A] dark:to-[#1A1817] border border-[#E8E3D8]/80 dark:border-[#2C2826] rounded-[24px] p-6 sm:p-7 flex flex-col shadow-[0_4px_30px_rgba(139,115,85,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] shrink-0"
        >
          {/* Year selector */}
          <div className="flex items-center gap-2 mb-5">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`text-[10px] sm:text-[11px] font-sans px-2.5 py-1 rounded-full transition-all duration-300 ${
                  selectedYear === year
                    ? 'bg-[#3A3530] text-[#FDFBF7] dark:bg-[#D4C3A3] dark:text-[#1A1817] shadow-sm'
                    : 'text-[#A39E98] hover:text-[#6B6560] dark:hover:text-[#D4C3A3]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase mb-2">Reading Goal</h3>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-serif text-[#3A3530] dark:text-[#EFEFE9] tabular-nums">{stats.yearBooks}</span>
                <span className="text-[#BAAFA0] dark:text-[#7A746D] text-sm font-sans">/ {goal}권</span>
              </div>
            </div>
            {/* Animated Progress Ring */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" className="stroke-[#EEEBE3] dark:stroke-[#201E1C]" strokeWidth="4" fill="none" />
                <motion.circle
                  cx="28" cy="28" r="23"
                  className="stroke-[#8B7355] dark:stroke-[#D4C3A3]"
                  strokeWidth="4" fill="none"
                  strokeDasharray={2 * Math.PI * 23}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 23 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 23 * (1 - progressPercentage / 100) }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-sans font-medium text-[#4A453F] dark:text-[#EFEFE9] text-[10px]">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
          <p className="text-[#A39E98] dark:text-[#7A746D] text-[10px] sm:text-xs font-sans mt-6 italic">
            {goal - stats.yearBooks > 0 ? `목표까지 ${goal - stats.yearBooks}권 남았어요` : '🎉 목표 달성!'}
          </p>
        </motion.div>

        {/* Card 2: Monthly Activity Chart — Instagram story-like */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[82vw] sm:min-w-[340px] max-w-[420px] flex-1 snap-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] dark:from-[#1E1C1A] dark:to-[#1A1817] border border-[#E8E3D8]/80 dark:border-[#2C2826] rounded-[24px] p-6 sm:p-7 flex flex-col shadow-[0_4px_30px_rgba(139,115,85,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] shrink-0"
        >
          <div className="mb-5">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase mb-1">Monthly Activity</h3>
            <p className="text-[#3A3530] dark:text-[#EFEFE9] font-serif text-base sm:text-lg">{selectedYear}년 독서 흐름</p>
          </div>
          <div className="flex h-28 sm:h-32 gap-[6px] sm:gap-2 w-full justify-between mt-auto">
            {stats.monthlyCounts.map((count, i) => {
              const maxCount = Math.max(...stats.monthlyCounts, 1);
              const heightPct = count > 0 ? Math.max((count / maxCount) * 100, 12) : 0;
              const isCurrent = new Date().getFullYear() === selectedYear && new Date().getMonth() === i;
              const hasBooks = count > 0;
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-1.5 group relative cursor-default h-full">
                  {/* Tooltip */}
                  {hasBooks && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#3A3530] dark:bg-[#EFEFE9] text-white dark:text-[#1A1817] text-[8px] sm:text-[9px] font-sans px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      {count}권
                    </div>
                  )}
                  {/* Bar Container - Takes remaining height */}
                  <div className="w-full flex-1 relative rounded-sm overflow-hidden">
                    <div
                      className={`absolute bottom-0 left-0 w-full rounded-[4px] transition-all duration-700 ease-out ${isCurrent ? 'bg-[#8B7355] dark:bg-[#D4C3A3]' : hasBooks ? 'bg-[#D4CCB8] dark:bg-[#4A453F]' : 'bg-transparent'}`}
                      style={{ height: heightPct === 0 ? '0%' : `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[8px] sm:text-[9px] font-sans tracking-tighter shrink-0 ${isCurrent ? 'text-[#8B7355] dark:text-[#D4C3A3] font-bold' : 'text-[#C4BCB3] dark:text-[#524B43]'}`}>
                    {monthLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Month book titles — subtle hint */}
          <div className="mt-4 pt-3 border-t border-[#EEEBE3]/60 dark:border-[#2C2826]/60">
            <p className="text-[9px] sm:text-[10px] font-sans text-[#A39E98] dark:text-[#7A746D] line-clamp-1">
              {stats.monthlyTitles.flat().length > 0
                ? `최근: ${stats.monthlyTitles.flat().slice(-3).join(' · ')}`
                : '아직 기록이 없어요'}
            </p>
          </div>
        </motion.div>

        {/* Card 3: Category Distribution — Refined taste profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[82vw] sm:min-w-[300px] max-w-[380px] flex-1 snap-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] dark:from-[#1E1C1A] dark:to-[#1A1817] border border-[#E8E3D8]/80 dark:border-[#2C2826] rounded-[24px] p-6 sm:p-7 flex flex-col shadow-[0_4px_30px_rgba(139,115,85,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] shrink-0"
        >
          <div className="mb-5">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase mb-1">Taste Profile</h3>
            <p className="text-[#3A3530] dark:text-[#EFEFE9] font-serif text-base sm:text-lg">독서 취향 분석</p>
          </div>
          <div className="w-full mt-auto">
            {/* Rounded stacked bar */}
            <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-5 bg-[#EEEBE3] dark:bg-[#201E1C]">
              {stats.topTags.map((item, idx) => {
                const width = Math.max((item.count / stats.totalTagsCount) * 100, 3);
                return (
                  <motion.div
                    key={item.tag}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${tagColors[idx % tagColors.length].bar} border-r border-[#FDFBF7] dark:border-[#1A1817] last:border-0`}
                  />
                );
              })}
            </div>
            {/* Legend */}
            <div className="space-y-2.5">
              {stats.topTags.map((item, idx) => (
                <div key={item.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${tagColors[idx % tagColors.length].dot}`} />
                    <span className="text-[10px] sm:text-xs font-sans text-[#6B6560] dark:text-[#A39E98]">{item.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-sans text-[#3A3530] dark:text-[#EFEFE9] font-medium tabular-nums">{item.count}권</span>
                    <span className="text-[9px] font-sans text-[#BAAFA0] dark:text-[#7A746D] tabular-nums w-7 text-right">{Math.round((item.count / stats.totalTagsCount) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Empty string to remove the original Card 4 location */}

      </div>
    </div>
  );
}
