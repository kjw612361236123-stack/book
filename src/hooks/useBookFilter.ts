import { useState, useMemo } from 'react';
import type { Book } from '@/types/book';

export function useBookFilter(initialBooks: Book[]) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title' | 'rating'>('rating');
  const [searchQuery, setSearchQuery] = useState('');

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
