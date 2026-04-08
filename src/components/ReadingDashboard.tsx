'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Book } from '@/types/book';

export default function ReadingDashboard({ books, goal = 24 }: { books: Book[], goal?: number }) {
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    books.forEach(book => {
      const d = new Date(book.date || new Date().toISOString());
      years.add(d.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [books]);

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] || new Date().getFullYear()
  );

  // 6-2: Active bar for mobile tap
  const [activeBar, setActiveBar] = useState<number | null>(null);

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

  // 6-1: Active dot tracking based on scroll position
  const [activeCard, setActiveCard] = useState(0);
  const totalCards = 4;

  const updateActiveCard = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const newActive = Math.min(Math.round(scrollRatio * (totalCards - 1)), totalCards - 1);
    setActiveCard(newActive);
  }, [totalCards]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateActiveCard, { passive: true });
    return () => el.removeEventListener('scroll', updateActiveCard);
  }, [updateActiveCard]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollContainerRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
  };

  return (
    <div className="w-full relative mt-2">
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-4 scrollbar-hide px-1 -mx-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Card 1: Summary — Minimalist Flat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[78vw] sm:min-w-[240px] max-w-[300px] flex-1 snap-center bg-[#FDFBF7]/80 dark:bg-[#1A1817]/80 backdrop-blur-sm border border-[#E8E3D8]/80 dark:border-[#2C2826]/80 rounded-[20px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] shrink-0"
        >
          <div>
            <h3 className="text-[#A39E98] text-[9px] font-sans tracking-[0.2em] uppercase mb-4">Summary</h3>
            <div className="space-y-3.5">
              <div>
                <p className="text-[#C4B9A8] dark:text-[#524B43] text-[8px] font-sans tracking-wider uppercase mb-0.5">Total Books</p>
                <p className="text-[#3A3530] dark:text-[#EFEFE9] text-3xl font-serif tabular-nums tracking-tight">{stats.total}</p>
              </div>
              <div className="w-full h-px bg-[#E8E3D8]/50 dark:bg-[#2C2826]/50"></div>
              <div>
                <p className="text-[#C4B9A8] dark:text-[#524B43] text-[8px] font-sans tracking-wider uppercase mb-0.5">This Year</p>
                <p className="text-[#3A3530] dark:text-[#EFEFE9] text-3xl font-serif tabular-nums tracking-tight">{stats.yearBooks}</p>
              </div>
              <div className="w-full h-px bg-[#E8E3D8]/50 dark:bg-[#2C2826]/50"></div>
              <div>
                <p className="text-[#C4B9A8] dark:text-[#524B43] text-[8px] font-sans tracking-wider uppercase mb-0.5">Favorite</p>
                <p className="text-[#8B7355] dark:text-[#D4C3A3] text-sm sm:text-base font-serif">{stats.topTags[0]?.tag || '—'}</p>
              </div>
            </div>
          </div>
          <p className="text-[#C4BCB3] dark:text-[#524B43] text-[8px] font-sans mt-5 italic tracking-widest text-center">SILENCE IS GOLDEN.</p>
        </motion.div>

        {/* Card 2: Yearly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[78vw] sm:min-w-[280px] max-w-[360px] flex-1 snap-center bg-white/50 dark:bg-[#1E1C1A]/50 backdrop-blur-sm border border-[#E8E3D8]/60 dark:border-[#2C2826]/60 rounded-[20px] p-5 sm:p-6 flex flex-col shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] shrink-0"
        >
          {/* 6-3: Year selector — larger touch targets */}
          <div className="flex items-center gap-1 mb-4">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`text-[11px] font-sans px-3 py-1.5 rounded-lg transition-all duration-300 min-h-[32px] min-w-[48px] ${
                  selectedYear === year
                    ? 'bg-[#3A3530] text-[#FDFBF7] dark:bg-[#D4C3A3] dark:text-[#1A1817] shadow-sm'
                    : 'text-[#A39E98] hover:text-[#6B6560] active:bg-[#F5F0E8] dark:active:bg-[#2C2826]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[9px] font-sans tracking-[0.2em] uppercase mb-1.5">Goal</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-serif text-[#3A3530] dark:text-[#EFEFE9] tabular-nums tracking-tight">{stats.yearBooks}</span>
                <span className="text-[#BAAFA0] dark:text-[#7A746D] text-xs font-sans">/ {goal}권</span>
              </div>
            </div>
            {/* Progress Ring */}
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" className="stroke-[#F5F0E8] dark:stroke-[#242220]" strokeWidth="3.5" fill="none" />
                <motion.circle
                  cx="28" cy="28" r="23"
                  className="stroke-[#8B7355] dark:stroke-[#D4C3A3]"
                  strokeWidth="3.5" fill="none"
                  strokeDasharray={2 * Math.PI * 23}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 23 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 23 * (1 - progressPercentage / 100) }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-sans font-medium text-[#3A3530] dark:text-[#EFEFE9] text-[10px] tabular-nums">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
          <p className="text-[#A39E98] dark:text-[#7A746D] text-[10px] font-sans mt-5 italic">
            {goal - stats.yearBooks > 0 ? `목표까지 ${goal - stats.yearBooks}권 남았어요` : '🎉 목표 달성!'}
          </p>
        </motion.div>

        {/* Card 3: Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[78vw] sm:min-w-[320px] max-w-[400px] flex-1 snap-center bg-white/50 dark:bg-[#1E1C1A]/50 backdrop-blur-sm border border-[#E8E3D8]/60 dark:border-[#2C2826]/60 rounded-[20px] p-5 sm:p-6 flex flex-col shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] shrink-0"
        >
          <div className="mb-4">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[9px] font-sans tracking-[0.2em] uppercase mb-1">Activity</h3>
            <p className="text-[#3A3530] dark:text-[#EFEFE9] font-serif text-sm sm:text-base tracking-tight">{selectedYear}년 독서 흐름</p>
          </div>
          <div className="flex h-24 sm:h-28 gap-[5px] sm:gap-[7px] w-full justify-between mt-auto">
            {stats.monthlyCounts.map((count, i) => {
              const maxCount = Math.max(...stats.monthlyCounts, 1);
              const heightPct = count > 0 ? Math.max((count / maxCount) * 100, 10) : 0;
              const isCurrent = new Date().getFullYear() === selectedYear && new Date().getMonth() === i;
              const hasBooks = count > 0;
              const isBarActive = activeBar === i;
              return (
                <div 
                  key={i} 
                  className="flex flex-col items-center flex-1 gap-1.5 group relative cursor-default h-full"
                  onClick={() => setActiveBar(isBarActive ? null : (hasBooks ? i : null))}
                  onMouseEnter={() => hasBooks && setActiveBar(i)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  {/* 6-2: Tooltip — shown on tap (mobile) and hover (desktop) */}
                  {hasBooks && isBarActive && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#3A3530] dark:bg-[#EFEFE9] text-white dark:text-[#1A1817] text-[9px] font-sans px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg pointer-events-none animate-fade-in">
                      {count}권
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-[#3A3530] dark:border-t-[#EFEFE9]"></div>
                    </div>
                  )}
                  {/* Bar with count label on top when has books */}
                  <div className="w-full flex-1 relative rounded-sm overflow-hidden">
                    {hasBooks && !isBarActive && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[7px] font-sans text-[#A39E98] dark:text-[#7A746D] tabular-nums sm:hidden">
                        {count}
                      </div>
                    )}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: heightPct === 0 ? '0%' : `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute bottom-0 left-0 w-full rounded-[3px] transition-all duration-200 ${
                        isCurrent 
                          ? 'bg-[#8B7355] dark:bg-[#D4C3A3]' 
                          : isBarActive 
                            ? 'bg-[#A39080] dark:bg-[#8B7355]'
                            : hasBooks 
                              ? 'bg-[#D4CCB8] dark:bg-[#4A453F]' 
                              : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <span className={`text-[8px] sm:text-[8px] font-sans tracking-tighter shrink-0 ${isCurrent ? 'text-[#8B7355] dark:text-[#D4C3A3] font-bold' : 'text-[#C4BCB3] dark:text-[#524B43]'}`}>
                    {monthLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F5F0E8]/80 dark:border-[#2C2826]/60">
            <p className="text-[9px] font-sans text-[#A39E98] dark:text-[#7A746D] line-clamp-1">
              {activeBar !== null && stats.monthlyTitles[activeBar].length > 0
                ? `${activeBar + 1}월: ${stats.monthlyTitles[activeBar].join(' · ')}`
                : stats.monthlyTitles.flat().length > 0
                  ? `최근: ${stats.monthlyTitles.flat().slice(-3).join(' · ')}`
                  : '아직 기록이 없어요'}
            </p>
          </div>
        </motion.div>

        {/* Card 4: Taste Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-[78vw] sm:min-w-[280px] max-w-[350px] flex-1 snap-center bg-white/50 dark:bg-[#1E1C1A]/50 backdrop-blur-sm border border-[#E8E3D8]/60 dark:border-[#2C2826]/60 rounded-[20px] p-5 sm:p-6 flex flex-col shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] shrink-0"
        >
          <div className="mb-4">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[9px] font-sans tracking-[0.2em] uppercase mb-1">Taste</h3>
            <p className="text-[#3A3530] dark:text-[#EFEFE9] font-serif text-sm sm:text-base tracking-tight">독서 취향 분석</p>
          </div>
          <div className="w-full mt-auto">
            {/* Stacked bar */}
            <div className="flex w-full h-2 rounded-full overflow-hidden mb-4 bg-[#F5F0E8] dark:bg-[#242220]">
              {stats.topTags.map((item, idx) => {
                const width = Math.max((item.count / stats.totalTagsCount) * 100, 3);
                return (
                  <motion.div
                    key={item.tag}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${tagColors[idx % tagColors.length].bar} border-r border-[#FDFBF7] dark:border-[#1A1817] last:border-0`}
                  />
                );
              })}
            </div>
            {/* Chart legend — Single tone */}
            <div className="space-y-2">
              {stats.topTags.map((item, idx) => (
                <div key={item.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${tagColors[idx % tagColors.length].dot}`} />
                    <span className="text-[10px] sm:text-[11px] font-sans text-[#6B6560] dark:text-[#A39E98]">{item.tag}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-[11px] font-sans text-[#3A3530] dark:text-[#EFEFE9] font-medium tabular-nums">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* 6-1: Swipe indicator — synced with scroll position */}
      <div className="flex items-center justify-center gap-1.5 mt-2 sm:hidden">
        {Array.from({ length: totalCards }).map((_, i) => (
          <span 
            key={i} 
            className={`rounded-full transition-all duration-300 ${
              activeCard === i 
                ? 'w-4 h-1.5 bg-[#8B7355] dark:bg-[#D4C3A3]' 
                : 'w-1.5 h-1.5 bg-[#DED8CE] dark:bg-[#363330]'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
