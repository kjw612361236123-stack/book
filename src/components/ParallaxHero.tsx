'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.9, 0.7]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[20px] sm:rounded-[28px]">
      <motion.div style={{ y, scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
