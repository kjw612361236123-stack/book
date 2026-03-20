'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookDiaryCard from './BookDiaryCard';
import { StaggeredReveal } from './PageEntrance';
import { LayoutGrid, Library, AlignLeft, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ReadingDashboard from './ReadingDashboard';
import BookShelf from './BookShelf';
import BookTimeline from './BookTimeline';

export interface Book {
  id: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  rating?: string;
}

export default function BookArchive({ books }: { books: Book[] }) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'gallery' | 'bookshelf' | 'timeline'>('gallery');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title' | 'rating'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Responsive pagination: 4 items on mobile, 8 on PC
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 4 : 8); // Tailwind 'sm' breakpoint
    };
    handleResize(); // Initial check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to first page when filters/view change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, viewMode, sortOption, searchQuery]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    books.forEach(b => b.tags.forEach(t => tagSet.add(t)));
    return ['All', ...Array.from(tagSet)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = books;
    if (selectedTag !== 'All') {
      result = result.filter(b => b.tags.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    return [...result].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (sortOption === 'newest') return timeB - timeA;
      if (sortOption === 'oldest') return timeA - timeB;
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      if (sortOption === 'rating') {
        const ratingA = a.rating || '';
        const ratingB = b.rating || '';
        return ratingB.localeCompare(ratingA);
      }
      return 0;
    });
  }, [books, selectedTag, sortOption, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      
      {/* Sticky Tab Bar & Controls — Refined, app-like */}
      <StaggeredReveal delay={0.2} className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#1A1817]/90 backdrop-blur-2xl -mx-5 px-5 sm:mx-0 sm:px-0 py-4 sm:py-5">
        <div className="flex flex-col gap-3">
          
          {/* Top Row: Total & Views & Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="text-xs font-serif italic text-[#A39E98] dark:text-[#7A746D]">
                 Total
               </div>
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
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#BAAFA0]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="책 제목, 태그로 검색..."
                    className="w-full pl-9 pr-4 py-2.5 text-[12px] sm:text-sm font-sans bg-[#EEEBE3]/50 dark:bg-[#201E1C] border border-[#E8E3D8] dark:border-[#2C2826] rounded-xl text-[#3A3530] dark:text-[#EFEFE9] placeholder:text-[#C4BCB3] dark:placeholder:text-[#524B43] outline-none focus:border-[#8B7355] dark:focus:border-[#D4C3A3] transition-colors"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Row: Horizontal Scroll Filter & Sort */}
          <div className="flex items-center gap-2.5 overflow-x-auto snap-x pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative flex items-center bg-white dark:bg-[#1E1C1A] border border-[#E8E3D8] dark:border-[#2C2826] rounded-full px-3.5 py-1.5 shrink-0 snap-start shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
               <span className="text-[9px] text-[#BAAFA0] uppercase font-sans mr-1.5 tracking-wider">Sort</span>
               <select 
                 value={sortOption} 
                 onChange={(e) => setSortOption(e.target.value as any)}
                 className="bg-transparent text-[10px] sm:text-[11px] font-sans font-medium text-[#4A453F] dark:text-[#EFEFE9] outline-none appearance-none cursor-pointer pr-4"
               >
                 <option value="newest" className="bg-white dark:bg-[#1A1817]">최신순</option>
                 <option value="oldest" className="bg-white dark:bg-[#1A1817]">오래된순</option>
                 <option value="title" className="bg-white dark:bg-[#1A1817]">가나다순</option>
                 <option value="rating" className="bg-white dark:bg-[#1A1817]">평점순</option>
               </select>
               <svg className="w-2.5 h-2.5 absolute right-2.5 pointer-events-none text-[#BAAFA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <div className="w-px h-3.5 bg-[#E8E3D8] dark:bg-[#2C2826] shrink-0"></div>

            {/* Tags — Pill chips */}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`shrink-0 snap-start px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-all duration-300 ${
                  selectedTag === tag 
                    ? 'bg-[#3A3530] text-white dark:bg-[#D4C3A3] dark:text-[#1A1817] shadow-[0_2px_8px_rgba(58,53,48,0.15)]' 
                    : 'bg-white dark:bg-[#1E1C1A] border border-[#E8E3D8] dark:border-[#2C2826] text-[#8E8B85] hover:border-[#C4BCB3] dark:hover:border-[#4A453F] hover:text-[#6B6560]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-[#FDFBF7] dark:to-[#1A1817] pointer-events-none translate-y-full"></div>
      </StaggeredReveal>

      {/* Diary Entries View Mapping */}
      <StaggeredReveal delay={0.3} className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          {filteredBooks.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full py-24 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#EEEBE3] dark:bg-[#201E1C] flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-[#BAAFA0]" />
              </div>
              <p className="font-serif text-[#A39E98] italic text-sm">해당하는 기록이 아직 없어요</p>
              <p className="font-sans text-[#C4BCB3] text-[10px] mt-1">다른 카테고리를 선택해보세요</p>
            </motion.div>
          ) : viewMode === 'gallery' ? (
            <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {/* Pinterest-style masonry grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <BookDiaryCard {...book} />
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {Math.ceil(filteredBooks.length / itemsPerPage) > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10 md:mt-12">
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll back to grid top gently
                    }}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E3D8] dark:border-[#2C2826] text-[#A39E98] disabled:opacity-30 hover:bg-[#EEEBE3] dark:hover:bg-[#201E1C] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.ceil(filteredBooks.length / itemsPerPage) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentPage === i + 1 
                            ? 'bg-[#8B7355] dark:bg-[#D4C3A3] scale-125' 
                            : 'bg-[#DED8CE] dark:bg-[#363330] hover:bg-[#C4BCB3] dark:hover:bg-[#4A453F]'
                        }`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.min(Math.ceil(filteredBooks.length / itemsPerPage), p + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E3D8] dark:border-[#2C2826] text-[#A39E98] disabled:opacity-30 hover:bg-[#EEEBE3] dark:hover:bg-[#201E1C] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : viewMode === 'bookshelf' ? (
            <motion.div key="bookshelf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <BookShelf books={filteredBooks} />
            </motion.div>
          ) : (
            <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <BookTimeline books={filteredBooks} />
            </motion.div>
          )}
        </AnimatePresence>
      </StaggeredReveal>
      
      {/* Bottom Dashboard / Analytics */}
      <StaggeredReveal delay={0.4} className="mt-10 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DED8CE]/60 dark:via-[#363330]/60 to-transparent"></div>
          <h2 className="text-sm sm:text-base font-serif text-[#3A3530] dark:text-[#EFEFE9] whitespace-nowrap">나의 독서 기록</h2>
          <div className="w-full h-px bg-gradient-to-r from-[#DED8CE]/60 dark:from-[#363330]/60 via-transparent to-transparent"></div>
        </div>
        <ReadingDashboard books={books} goal={24} />
      </StaggeredReveal>

    </div>
  );
}
