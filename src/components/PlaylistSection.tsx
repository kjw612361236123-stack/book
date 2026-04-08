'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ExternalLink, Music2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/types/book';

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|\/v\/|\/e\/|watch\?v=|&v=|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function PlaylistSection({ books }: { books: Book[] }) {
  const playlistBooks = books.filter(b => b.playlist && b.playlist.trim() !== '');
  const [activeId, setActiveId] = useState<string | null>(null);

  if (playlistBooks.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="w-14 h-14 mb-4 text-[#DED8CE] dark:text-[#363330] opacity-40">
          <Music2 className="w-full h-full" strokeWidth={0.8} />
        </div>
        <p className="text-sm font-serif text-[#A39E98] dark:text-[#7A746D] mb-1">
          아직 플레이리스트가 없습니다
        </p>
        <p className="text-[10px] font-sans text-[#C4BCB3] dark:text-[#524B43]">
          노션에서 책에 YouTube 링크를 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 2-2: Emotional minimalist header */}
      <div className="flex flex-col gap-1.5 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#E8E3D8]/50 dark:bg-[#2C2826]/50 flex items-center justify-center">
            <Music2 className="w-3 h-3 text-[#A39E98] dark:text-[#7A746D]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[12px] sm:text-[13px] font-serif text-[#6B6560] dark:text-[#A39E98] tracking-tight">
              읽으며 들었던 음악
            </h3>
          </div>
        </div>
      </div>

      {/* Playlist Cards */}
      <div className="flex flex-col gap-2.5">
        {playlistBooks.map((book, index) => {
          const ytId = extractYouTubeId(book.playlist!);
          const listId = extractPlaylistId(book.playlist!);
          const isActive = activeId === book.id;

          let embedUrl = '';
          const validListId = listId && !listId.startsWith('RD') ? listId : null;

          if (ytId && validListId) {
            embedUrl = `https://www.youtube.com/embed/${ytId}?list=${validListId}&rel=0&modestbranding=1`;
          } else if (ytId) {
            embedUrl = `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
          } else if (validListId) {
            embedUrl = `https://www.youtube.com/embed/videoseries?list=${validListId}&rel=0&modestbranding=1`;
          } else if (book.playlist && book.playlist.includes('youtube.com/') && !book.playlist.includes('watch') && !book.playlist.includes('list=')) {
            embedUrl = '';
          }

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Minimalist active card styling */}
              <div className={`
                rounded-xl overflow-hidden transition-all duration-500 relative
                ${isActive 
                  ? 'bg-[#FDFBF7] dark:bg-[#1A1817] shadow-[0_2px_16px_rgba(139,115,85,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] border border-[#E8E3D8] dark:border-[#363330]' 
                  : 'bg-transparent border border-transparent hover:bg-[#F5F0E8]/50 dark:hover:bg-[#201E1C]/50'
                }
              `}>
                {/* Card Header */}
                <button
                  onClick={() => setActiveId(isActive ? null : book.id)}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 text-left group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-[#EEEBE3] dark:bg-[#2C2826]">
                    {book.thumbnail ? (
                      <Image
                        src={book.thumbnail}
                        alt={book.title}
                        fill
                        sizes="48px"
                        className={`object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#EEEBE3] dark:bg-[#201E1C]">
                        <Music2 className="w-4 h-4 text-[#C4B9A8] dark:text-[#524B43]" />
                      </div>
                    )}
                    {/* Minimalist "Now Playing" breathing dot overlay */}
                    {isActive && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="w-2.5 h-2.5 bg-white/90 rounded-full animate-pulse-soft shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className={`text-[12px] sm:text-[13px] font-serif leading-snug truncate transition-colors duration-300 ${
                      isActive 
                        ? 'text-[#6B5B3D] dark:text-[#D4C3A3]' 
                        : 'text-[#6B6560] dark:text-[#A39E98] group-hover:text-[#3A3530] dark:group-hover:text-[#EFEFE9]'
                    }`}>
                      {book.title}
                    </h3>
                  </div>

                  {/* Play/Collapse Button */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                    ${isActive
                      ? 'text-[#8B7355] dark:text-[#D4C3A3]'
                      : 'text-[#C4B9A8] dark:text-[#524B43] group-hover:text-[#8B7355] dark:group-hover:text-[#D4C3A3]'
                    }
                  `}>
                    {isActive ? (
                      <Pause className="w-3.5 h-3.5" strokeWidth={2} />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" strokeWidth={2} />
                    )}
                  </div>
                </button>

                {/* 2-1: YouTube Player or Fallback */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 sm:px-4 pb-3 sm:pb-4">
                        {embedUrl ? (
                          <div className="rounded-xl sm:rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 aspect-video">
                            <iframe
                              src={embedUrl}
                              title={`${book.title} playlist`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                              style={{ border: 'none' }}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 rounded-xl bg-[#EEEBE3]/40 dark:bg-[#2C2826]/40 border border-[#E8E3D8]/50 dark:border-[#363330]/50">
                            <Music2 className="w-8 h-8 text-[#A39E98] dark:text-[#7A746D] mb-3 opacity-40" />
                            <p className="text-[11px] font-sans text-[#8B7355] dark:text-[#D4C3A3] mb-1 font-medium">유효하지 않은 YouTube 링크</p>
                            <p className="text-[10px] font-sans text-[#A39E98] dark:text-[#7A746D]">아래 버튼을 눌러 새 탭에서 열어보세요</p>
                          </div>
                        )}
                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 px-0.5">
                          <Link
                            href={`/book/${book.id}`}
                            className="text-[10px] sm:text-[11px] font-sans text-[#8B7355] dark:text-[#D4C3A3] hover:underline underline-offset-2 font-medium"
                          >
                            독서 기록 보기 →
                          </Link>
                          <a
                            href={book.playlist!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-sans text-[#A39E98] dark:text-[#7A746D] hover:text-[#8B7355] dark:hover:text-[#D4C3A3] transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>YouTube에서 열기</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
