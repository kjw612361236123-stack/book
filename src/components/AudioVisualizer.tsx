'use client';

import { useEffect, useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { audioStore } from '@/lib/audioStore';

export default function AudioVisualizer() {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initial state
    const state = audioStore.getState();
    setIsReady(state.isReady);
    setIsPlaying(state.isPlaying);

    const unsubscribe = audioStore.subscribe((newState) => {
      setIsReady(newState.isReady);
      setIsPlaying(newState.isPlaying);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isReady) return null;

  return (
    <button
      onClick={() => audioStore.togglePlay()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#EEEBE3]/60 dark:bg-[#201E1C]/60 hover:bg-[#E8E3D8] dark:hover:bg-[#2C2826] text-[#A39E98] dark:text-[#7A746D] hover:text-[#3A3530] dark:hover:text-[#EFEFE9] transition-all"
      title={isPlaying ? "음악 일시정지" : "음악 재생"}
    >
      {isPlaying ? (
        isHovered ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <div className="flex gap-0.5 items-end justify-center h-3 w-3">
            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '200ms', height: '80%' }} />
            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '400ms', height: '60%' }} />
            <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '100ms', height: '100%' }} />
          </div>
        )
      ) : (
        isHovered ? (
          <Play className="w-3.5 h-3.5 ml-0.5" />
        ) : (
          <Music className="w-3.5 h-3.5" />
        )
      )}
    </button>
  );
}
