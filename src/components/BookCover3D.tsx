'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface BookCover3DProps {
  src: string;
  alt: string;
}

export default function BookCover3D({ src, alt }: BookCover3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setRotateX((y - 0.5) * -12);
    setRotateY((x - 0.5) * 12);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width;
    const y = (e.touches[0].clientY - rect.top) / rect.height;
    
    setRotateX((y - 0.5) * -8);
    setRotateY((x - 0.5) * 8);
  };

  const handleLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className="relative"
      style={{ perspective: '800px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleLeave}
        onTouchEnd={handleLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-[140px] sm:w-[160px] md:w-[180px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Book shadow on surface */}
        <div 
          className="absolute -inset-4 -bottom-6 bg-black/10 dark:bg-black/25 rounded-3xl blur-2xl transition-all duration-500"
          style={{ 
            transform: `translateZ(-40px) rotateX(${rotateX * 0.3}deg) rotateY(${rotateY * 0.3}deg)`,
            opacity: isHovering ? 0.7 : 0.4,
          }}
        />
        
        {/* Book cover */}
        <div 
          className="aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden relative border border-white/20 dark:border-white/5"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: isHovering 
              ? '0 25px 50px -12px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)' 
              : '0 10px 30px -8px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          <img 
            src={src} 
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Glossy light reflection */}
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={{ 
              background: `linear-gradient(${105 + rotateY * 3}deg, rgba(255,255,255,${isHovering ? 0.12 : 0}) 0%, transparent 60%)`,
              opacity: isHovering ? 1 : 0,
            }}
          />

          {/* Book spine edge */}
          <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
          
          {/* Top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        </div>
      </motion.div>
    </div>
  );
}
