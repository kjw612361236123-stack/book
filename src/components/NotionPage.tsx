'use client';

import { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { NotionRenderer } from 'react-notion-x';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import essential styles
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

// Dynamic imports for optional components — all with ssr: false
const Code = dynamic(
  () => import('react-notion-x/build/third-party/code').then((m) => m.Code),
  { ssr: false }
);
const Collection = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
  { ssr: false }
);
const Equation = dynamic(
  () => import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
  { ssr: false }
);
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
);

export const NotionPage = ({ recordMap, comment }: { recordMap: any, comment?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && comment) {
      // Small timeout to wait for NotionRenderer to finish DOM painting
      const targetTimer = setTimeout(() => {
        // Find the properties table or the content block to insert before
        let targetNode = document.querySelector('.notion-page-content');
        if (!targetNode) targetNode = document.querySelector('.notion-page'); // fallback
        
        if (targetNode && targetNode.parentNode) {
          const existingWrapper = document.querySelector('.custom-comment-wrapper');
          if (!existingWrapper) {
            const wrapper = document.createElement('div');
            // Give it some padding so it rests comfortably below the table
            wrapper.className = 'custom-comment-wrapper w-full pt-8 pb-4 border-b border-[#DED8CE]/40 dark:border-[#363330]/60';
            targetNode.parentNode.insertBefore(wrapper, targetNode);
            setPortalTarget(wrapper);
          } else {
            setPortalTarget(existingWrapper);
          }
        }
      }, 100);
      return () => clearTimeout(targetTimer);
    }
  }, [mounted, comment]);

  if (!mounted) {
    return (
      <div className="w-full py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-[#DED8CE] border-t-[#8B7355] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="notion-container relative" suppressHydrationWarning>
      <Suspense fallback={<div className="w-full py-8 text-center text-[#A39E98] font-serif italic text-sm">Loading content...</div>}>
        <NotionRenderer
          recordMap={recordMap}
          fullPage={true}
          darkMode={false}
          showTableOfContents={false}
          components={{
            nextLink: Link,
            Code,
            Collection,
            Equation,
            Modal
          }}
        />
        {portalTarget && comment && createPortal(
          <div className="px-1">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase mb-3">재원의 코멘트</h3>
            <p className="font-sans text-[#4A453F] dark:text-[#EFEFE9] text-[13px] sm:text-[14px] leading-[1.8] whitespace-pre-wrap">
              {comment}
            </p>
          </div>,
          portalTarget
        )}
      </Suspense>
    </div>
  );
};

