import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Book } from '@/types/book';

export function useBookFilter(initialBooks: Book[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') || 'All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title' | 'rating'>(
    (searchParams.get('sort') as any) || 'rating'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Synchronize state with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedTag === 'All') params.delete('tag');
    else params.set('tag', selectedTag);
    
    if (sortOption === 'rating') params.delete('sort');
    else params.set('sort', sortOption);
    
    if (!searchQuery) params.delete('q');
    else params.set('q', searchQuery);
    
    const newParamsStr = params.toString();
    const currentParamsStr = searchParams.toString();
    
    if (newParamsStr !== currentParamsStr) {
      router.replace(`${pathname}${newParamsStr ? `?${newParamsStr}` : ''}`, { scroll: false });
    }
  }, [selectedTag, sortOption, searchQuery, pathname, router, searchParams]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialBooks.forEach(book => book.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [initialBooks]);

  // Filter and sort the books
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...initialBooks];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b => b.title.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Tag filter
    if (selectedTag !== 'All') {
      result = result.filter(b => b.tags.includes(selectedTag));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'oldest':
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        case 'title':
          return a.title.localeCompare(b.title, 'ko-KR');
        case 'rating': {
          const ratingToNum = (r: string) => (r.match(/⭐/g) || []).length;
          return ratingToNum(b.rating || '') - ratingToNum(a.rating || '');
        }
        default:
          return 0;
      }
    });

    return result;
  }, [initialBooks, selectedTag, sortOption, searchQuery]);

  return {
    selectedTag,
    setSelectedTag,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    allTags,
    filteredBooks: filteredAndSortedBooks,
  };
}
