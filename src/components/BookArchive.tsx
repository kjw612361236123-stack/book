'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, LayoutGrid, AlignLeft, Library, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Book } from '@/types/book';
import BookDiaryCard from './BookDiaryCard';
import ReadingDashboard from './ReadingDashboard';
import BookShelf from './BookShelf';
import BookTimeline from './BookTimeline';
import { StaggeredReveal } from './PageEntrance';
import { useBookFilter } from '@/hooks/useBookFilter';

export default function BookArchive({ books, readingGoal = 24 }: { books: Book[]; readingGoal?: number }) {
  const {
    selectedTag, setSelectedTag,
    sortOption, setSortOption,
    searchQuery, setSearchQuery,
    allTags, filteredBooks
  } = useBookFilter(books);

  const [viewMode, setViewMode] = useState<'gallery' | 'bookshelf' | 'timeline'>('gallery');
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Responsive pagination: 4 items on mobile, 8 on PC
  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 640 ? 4 : 8);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to first page when filters/view change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, viewMode, sortOption, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = viewMode === 'timeline' 
    ? filteredBooks 
    : filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      
      {/* Sticky Tab Bar & Controls — Refined, app-like */}
      <StaggeredReveal delay={0.2} className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#1A1817]/90 backdrop-blur-2xl -mx-5 px-5 sm:mx-0 sm:px-0 py-4 sm:py-5">
        <div className="flex flex-col gap-3">
          
          {/* Top Row: Total & Views & Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="text-xs font-serif italic text-[#A39E98] dark:text-[#7A746D]">Total</div>
               <div className="text-xl font-serif text-[#3A3530] dark:text-[#D4C3A3] leading-none tabular-nums">
                 {filteredBooks.length}
               </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(''); }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  showSearch 
                    ? 'bg-[#3A3530] text-white dark:bg-[#D4C3A3] dark:text-[#1A1817]' 
                    : 'bg-[#EEEBE3] dark:bg-[#201E1C] text-[#A39E98] hover:text-[#6B6560]'
                }`}
              >
                {showSearch ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
              </button>

              {/* View Toggles — Pill segmented control */}
              <div className="flex items-center gap-0.5 bg-[#EEEBE3] dark:bg-[#201E1C] p-[3px] rounded-full shadow-inner border border-[#E8E3D8]/50 dark:border-[#2C2826]/50 shrink-0">
                 {[
                   { mode: 'gallery', icon: LayoutGrid, label: '갤러리' },
                   { mode: 'bookshelf', icon: Library, label: '서재' },
                   { mode: 'timeline', icon: AlignLeft, label: '연대기' }
                 ].map(({ mode, icon: Icon, label }) => (
                   <button 
                     key={mode}
                     onClick={() => setViewMode(mode as any)} 
                     className={`flex items-center justify-center w-9 h-8 sm:w-14 sm:h-8 rounded-full transition-all duration-300 ${
                       viewMode === mode 
                         ? 'bg-white dark:bg-[#2C2826] shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-[#3A3530] dark:text-[#EFEFE9]' 
                         : 'text-[#A39E98] dark:text-[#7A746D] hover:text-[#6B6560] dark:hover:text-[#D4C3A3]'
                     }`}
                     title={label}
                   >
                     <Icon className={`w-3.5 h-3.5 ${viewMode === mode ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                   </button>
                 ))}
              </div>
            </div>
          </div>

          {/* Search Bar — Animated reveal */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#BAAFA0] dark:text-[#7A746D]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="제목, 태그, 내용 검색..."
                    className="w-full bg-[#EEEBE3]/50 dark:bg-[#201E1C]/50 border border-[#E8E3D8] dark:border-[#2C2826] rounded-2xl py-2.5 pl-10 pr-4 text-sm font-sans placeholder:text-[#BAAFA0] dark:placeholder:text-[#7A746D] text-[#3A3530] dark:text-[#EFEFE9] focus:outline-none focus:ring-2 focus:ring-[#E8E3D8] dark:focus:ring-[#3A3530] transition-all"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E8E3D8] dark:via-[#2C2826] to-transparent"></div>

          {/* Bottom Row: Tags & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
             {/* Tags — Horizontal scroll with hidden scrollbar */}
             <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -ml-5 px-5 sm:ml-0 sm:px-0 sm:pb-0 scrollbar-hide shrink-0 mask-fade-edges dark:mask-fade-edges-dark">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans transition-all duration-300 ${
                      selectedTag === tag
                        ? 'bg-[#3A3530] text-white dark:bg-[#EFEFE9] dark:text-[#1A1817]'
                        : 'bg-transparent text-[#A39E98] dark:text-[#7A746D] hover:bg-[#EEEBE3]/50 dark:hover:bg-[#201E1C]/50 border border-transparent hover:border-[#E8E3D8] dark:hover:border-[#2C2826]'
                    }`}
                  >
                    {tag === 'All' ? '전체' : tag}
                  </button>
                ))}
             </div>

             {/* Sort Select */}
             <div className="relative shrink-0 flex justify-end">
                <select 
                  value={sortOption}
                  onChange={(e: any) => setSortOption(e.target.value)}
                  className="appearance-none bg-transparent text-[10px] sm:text-[11px] font-sans text-[#8B7355] dark:text-[#D4C3A3] py-1.5 pl-3 pr-6 focus:outline-none cursor-pointer"
                >
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="title">가나다순</option>
                  <option value="rating">별점순</option>
                </select>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B7355] dark:text-[#D4C3A3]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
             </div>
          </div>
        </div>
      </StaggeredReveal>

      {/* Main Content Area */}
      <StaggeredReveal delay={0.3} className="min-h-[400px]">
        {filteredBooks.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center opacity-60">
             <div className="w-12 h-12 mb-4 text-[#C4B9A8] dark:text-[#6B6560]">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             </div>
             <p className="text-sm font-serif text-[#A39E98] dark:text-[#7A746D]">표시할 기록이 없습니다.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'gallery' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {currentBooks.map((book) => (
                    <BookDiaryCard key={book.id} {...book} />
                  ))}
                </div>
              )}

              {viewMode === 'bookshelf' && (
                <BookShelf books={currentBooks} />
              )}

              {viewMode === 'timeline' && (
                <BookTimeline books={filteredBooks} />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Dynamic Pagination Control (Editorial dot style) */}
        {viewMode !== 'timeline' && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 mt-16 sm:mt-24 mb-8"
          >
             <button 
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="p-2 text-[#C4B9A8] dark:text-[#6B6560] hover:text-[#8B7355] dark:hover:text-[#D4C3A3] disabled:opacity-30 disabled:hover:text-[#C4B9A8] transition-colors"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             
             <div className="flex items-center gap-2 sm:gap-2.5">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <button
                   key={i}
                   onClick={() => handlePageChange(i + 1)}
                   className={`transition-all duration-300 ${
                     currentPage === i + 1 
                       ? 'w-6 sm:w-8 h-[3px] bg-[#3A3530] dark:bg-[#EFEFE9] rounded-full' 
                       : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#DED8CE] dark:bg-[#363330] rounded-full hover:bg-[#A39E98] dark:hover:bg-[#7A746D]'
                   }`}
                   aria-label={`Page ${i + 1}`}
                 />
               ))}
             </div>

             <button 
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="p-2 text-[#C4B9A8] dark:text-[#6B6560] hover:text-[#8B7355] dark:hover:text-[#D4C3A3] disabled:opacity-30 disabled:hover:text-[#C4B9A8] transition-colors"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
          </motion.div>
        )}
      </StaggeredReveal>
      
      {/* Bottom Dashboard / Analytics */}
      <StaggeredReveal delay={0.4} className="mt-10 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DED8CE]/60 dark:via-[#363330]/60 to-transparent"></div>
          <h2 className="text-sm sm:text-base font-serif text-[#3A3530] dark:text-[#EFEFE9] whitespace-nowrap">나의 독서 기록</h2>
          <div className="w-full h-px bg-gradient-to-r from-[#DED8CE]/60 dark:from-[#363330]/60 via-transparent to-transparent"></div>
        </div>
        <ReadingDashboard books={books} goal={readingGoal} />
      </StaggeredReveal>

    </div>
  );
}
