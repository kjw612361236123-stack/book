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

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 640 ? 4 : 8);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, viewMode, sortOption, searchQuery]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = viewMode === 'timeline' 
    ? filteredBooks 
    : filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col gap-5 md:gap-7">
      
      {/* ===== Control Bar ===== */}
      <StaggeredReveal delay={0.2}>
        <div className="px-0 py-2 sm:py-3">
          <div className="flex flex-col gap-3">
            
            {/* Row 1: Views + Search + Sort */}
            <div className="flex items-center justify-between">
              
              {/* Left: Total Count (User mockup) */}
              <div className="flex items-center gap-3">
                <div className="text-[11px] sm:text-xs font-serif italic text-[#A39E98] dark:text-[#7A746D]">Total</div>
                <div className="text-lg sm:text-xl font-serif text-[#3A3530] dark:text-[#D4C3A3] leading-none tabular-nums">
                  {filteredBooks.length}
                </div>
              </div>

              {/* Right: Search, Sort, Views */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                
                {/* Search Input (Pill style matching user's aesthetic) */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5 pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-[#A39E98] dark:text-[#7A746D]" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색"
                    className="h-8 sm:h-9 w-8 sm:w-9 focus:w-[130px] sm:focus:w-[150px] bg-[#EEEBE3] dark:bg-[#201E1C] hover:bg-[#E8E3D8] dark:hover:bg-[#2C2826] text-[10px] sm:text-[11px] font-sans rounded-full pl-8 sm:pl-9 pr-3 text-[#3A3530] dark:text-[#EFEFE9] placeholder:text-transparent focus:placeholder:text-[#BAAFA0] dark:focus:placeholder:text-[#7A746D] transition-all duration-300 outline-none focus:outline-none focus:ring-0 shadow-inner cursor-pointer focus:cursor-text border-transparent"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative h-8 sm:h-9 bg-[#EEEBE3] dark:bg-[#201E1C] hover:bg-[#E8E3D8] dark:hover:bg-[#2C2826] rounded-full transition-colors flex items-center shadow-inner">
                  <select 
                    value={sortOption}
                    onChange={(e: any) => setSortOption(e.target.value)}
                    className="appearance-none bg-transparent h-full text-[10px] sm:text-[11px] font-sans text-[#A39E98] dark:text-[#7A746D] py-0 pl-3 sm:pl-4 pr-6 rounded-full outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border-transparent cursor-pointer"
                  >
                    <option value="rating">별점순</option>
                    <option value="newest">최신순</option>
                    <option value="oldest">오래된순</option>
                    <option value="title">가나다순</option>
                  </select>
                  <div className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#A39E98] dark:text-[#7A746D]">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* View Toggles (User mockup exact match) */}
                <div className="flex items-center gap-0.5 bg-[#EEEBE3] dark:bg-[#201E1C] p-[3px] rounded-full shadow-inner border border-[#E8E3D8]/50 dark:border-[#2C2826]/50 shrink-0">
                  {[
                    { mode: 'gallery', icon: LayoutGrid, title: '갤러리' },
                    { mode: 'bookshelf', icon: Library, title: '서재' },
                    { mode: 'timeline', icon: AlignLeft, title: '연대기' }
                  ].map(({ mode, icon: Icon, title }) => {
                    const isActive = viewMode === mode;
                    return (
                      <button 
                        key={mode}
                        onClick={() => setViewMode(mode as any)}
                        title={title}
                        className={`flex items-center justify-center w-8 h-7 sm:w-12 sm:h-7 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#FDFBF7] dark:bg-[#3A3530] shadow-[0_1px_4px_rgba(139,115,85,0.08)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] text-[#8B7355] dark:text-[#D4C3A3]' 
                            : 'text-[#A39E98] dark:text-[#7A746D] hover:text-[#6B6560] dark:hover:text-[#EFEFE9]'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>


            {/* Tags — Horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide mask-fade-edges">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-sans transition-colors shrink-0 ${
                    selectedTag === tag
                      ? 'bg-[#3A3530] text-white dark:bg-[#EFEFE9] dark:text-[#1A1817]'
                      : 'text-[#A39E98] dark:text-[#7A746D] hover:text-[#6B6560]'
                  }`}
                >
                  {tag === 'All' ? '전체' : tag}
                </button>
              ))}
              
              {/* Count label removed as it is now in the top left */}
            </div>
          </div>
        </div>
      </StaggeredReveal>

      {/* ===== Content Area ===== */}
      <StaggeredReveal delay={0.3} className="min-h-[400px]">
        {filteredBooks.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center">
             <div className="w-16 h-16 mb-5 text-[#DED8CE] dark:text-[#363330] opacity-40">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             </div>
             <p className="text-sm font-serif text-[#A39E98] dark:text-[#7A746D] mb-1">표시할 기록이 없습니다</p>
             <p className="text-[10px] font-sans text-[#C4BCB3] dark:text-[#524B43]">다른 태그나 검색어를 시도해보세요</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${currentPage}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
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

        {/* Pagination — Premium dots */}
        {viewMode !== 'timeline' && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 mt-14 sm:mt-20 mb-6"
          >
             <button 
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F5F0E8] dark:bg-[#242220] text-[#A39E98] dark:text-[#7A746D] hover:text-[#3A3530] dark:hover:text-[#EFEFE9] disabled:opacity-20 transition-all"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             
             <div className="flex items-center gap-1.5">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <button
                   key={i}
                   onClick={() => handlePageChange(i + 1)}
                   className={`rounded-full transition-all duration-400 ${
                     currentPage === i + 1 
                       ? 'w-7 h-2 bg-[#8B7355] dark:bg-[#D4C3A3]' 
                       : 'w-2 h-2 bg-[#DED8CE] dark:bg-[#363330] hover:bg-[#C4B9A8] dark:hover:bg-[#524B43]'
                   }`}
                   aria-label={`Page ${i + 1}`}
                 />
               ))}
             </div>

             <button 
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F5F0E8] dark:bg-[#242220] text-[#A39E98] dark:text-[#7A746D] hover:text-[#3A3530] dark:hover:text-[#EFEFE9] disabled:opacity-20 transition-all"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
          </motion.div>
        )}
      </StaggeredReveal>
      
      {/* ===== Dashboard ===== */}
      <StaggeredReveal delay={0.4} className="mt-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DED8CE]/50 dark:via-[#363330]/50 to-transparent"></div>
          <h2 className="text-[13px] sm:text-sm font-serif text-[#3A3530] dark:text-[#EFEFE9] whitespace-nowrap tracking-tight">나의 독서 기록</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#DED8CE]/50 dark:via-[#363330]/50 to-transparent"></div>
        </div>
        <ReadingDashboard books={books} goal={readingGoal} />
      </StaggeredReveal>

    </div>
  );
}
