'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubeAudioPlayer({ videoId }: { videoId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube IFrame API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '40',
          width: '40',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            rel: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: () => setIsReady(true),
            onStateChange: (event: any) => {
              if (event.data === 1) setIsPlaying(true);
              else if (event.data === 2 || event.data === 0) setIsPlaying(false);
            }
          }
        });
      }
    };

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    if (isMuted) { playerRef.current.unMute(); setIsMuted(false); }
    else { playerRef.current.mute(); setIsMuted(true); }
  };

  return (
    <div 
      className="fixed bottom-[calc(24px+env(safe-area-inset-bottom))] md:bottom-8 left-4 md:left-8 z-40 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden YouTube player container */}
      <div className="absolute opacity-[0.01] pointer-events-none w-10 h-10 overflow-hidden -z-10 top-0 left-0">
        <div ref={containerRef}></div>
      </div>

      <div className={`
        flex items-center gap-2 bg-white/90 dark:bg-[#1A1817]/90 backdrop-blur-md 
        border border-[#E8E3D8] dark:border-[#2C2826] 
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        rounded-full transition-all duration-300 overflow-hidden
        ${isHovered || isPlaying ? 'p-1.5' : 'p-2'}
        ${!isReady ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
      `}>
        {/* Main Play/Audio Button */}
        <button 
          onClick={togglePlay}
          disabled={!isReady}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-[0.93]
            ${isPlaying 
              ? 'bg-[#8B7355] text-white dark:bg-[#D4C3A3] dark:text-[#1A1817]' 
              : 'bg-[#EEEBE3] text-[#A39E98] hover:text-[#3A3530] dark:bg-[#201E1C] dark:hover:text-[#EFEFE9]'
            }
          `}
        >
          {isPlaying ? (
            <div className="flex gap-0.5 items-end justify-center h-4 w-4">
              <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '200ms', height: '80%' }} />
              <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '400ms', height: '60%' }} />
              <span className="w-0.5 bg-current animate-[bounce_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '100ms', height: '100%' }} />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full relative">
              <Music className="w-4 h-4 ml-0.5 absolute" />
              {!isReady && (
                 <svg className="animate-spin w-4 h-4 absolute text-[#A39E98]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              )}
            </div>
          )}
        </button>

        {/* Expanded Controls */}
        <div className={`
          flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${(isHovered || isPlaying) && isReady ? 'w-[72px] opacity-100 pr-1' : 'w-0 opacity-0'}
        `}>
          <button 
            onClick={togglePlay}
            disabled={!isReady}
            className="w-8 h-8 flex items-center justify-center text-[#A39E98] hover:text-[#3A3530] dark:text-[#7A746D] dark:hover:text-[#EFEFE9] transition-colors active:scale-[0.93]"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          
          <button 
            onClick={toggleMute}
            disabled={!isReady}
            className="w-8 h-8 flex items-center justify-center text-[#A39E98] hover:text-[#3A3530] dark:text-[#7A746D] dark:hover:text-[#EFEFE9] transition-colors active:scale-[0.93]"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
