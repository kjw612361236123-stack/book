'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export default function YouTubeAudioPlayer({ videoId }: { videoId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  
  // We use postMessage to control the YouTube API without needing the full iframe API script
  const sendCommand = (command: string, args?: any[]) => {
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: args || []
        }),
        '*'
      );
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      sendCommand('pauseVideo');
    } else {
      sendCommand('playVideo');
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) {
      sendCommand('unMute');
    } else {
      sendCommand('mute');
    }
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden iframe for audio API */}
      <div className="hidden">
        <iframe
          ref={playerRef}
          width="10"
          height="10"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&playsinline=1&autohide=1&showinfo=0&autoplay=0&loop=1&playlist=${videoId}`}
          allow="autoplay"
          title="Background Music"
        />
      </div>

      <div className={`
        flex items-center gap-2 bg-white/90 dark:bg-[#1A1817]/90 backdrop-blur-md 
        border border-[#E8E3D8] dark:border-[#2C2826] 
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        rounded-full transition-all duration-300 overflow-hidden
        ${isHovered || isPlaying ? 'p-1.5' : 'p-2'}
      `}>
        {/* Main Play/Audio Button */}
        <button 
          onClick={togglePlay}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
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
            <Music className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Expanded Controls (Only on Hover or Playing) */}
        <div className={`
          flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isHovered || isPlaying ? 'w-[72px] opacity-100 pr-1' : 'w-0 opacity-0'}
        `}>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center text-[#A39E98] hover:text-[#3A3530] dark:text-[#7A746D] dark:hover:text-[#EFEFE9] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          
          <button 
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center text-[#A39E98] hover:text-[#3A3530] dark:text-[#7A746D] dark:hover:text-[#EFEFE9] transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
